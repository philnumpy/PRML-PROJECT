from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import joblib
import numpy as np
import pandas as pd
import requests
from kmeans_custom import KMeansFromScratch
from song_recommender import SongRecommender  # Import your SongRecommender class

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
CORS(app, resources={r"/*": {"origins": "*"}})

MODEL_DIR = "models"  # Directory where your .pkl model files are stored

# Function to load the CSV data
def load_original_data():
    filepath = "./spotify_tracks (1).csv"  # Adjust this to the correct path of your CSV file
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No original data found at {filepath}")
    return pd.read_csv(filepath)

# Utility to load preprocessed data
def load_songs_scaled(language):
    filename = f"{language.lower()}_songs_scaled.pkl"
    filepath = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No scaled data found for {language} at {filepath}")
    with open(filepath, "rb") as f:
        scaled_data = joblib.load(f)
    return scaled_data

def load_song_names_user_language(language):
    filename = f"{language.lower()}_song_names.pkl"
    filepath = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No song names found for {language} at {filepath}")
    with open(filepath, "rb") as f:
        song_names = joblib.load(f)
    return song_names

def load_user_language_indices(language):
    filename = f"{language.lower()}_language_indices.pkl"
    filepath = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No language indices found for {language} at {filepath}")
    with open(filepath, "rb") as f:
        indices = joblib.load(f)
    return indices

# Utility to load model by language
def load_model(language):
    filename = f"{language.lower()}_kmeans_model.pkl"
    filepath = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No model found for {language} at {filepath}")
    with open(filepath, "rb") as f:
        model = joblib.load(f)
    return model

def prepare_input_data(song, song_names_user_language, songs_scaled):
    try:
        # Normalize input song and song names to lowercase and strip any extra spaces
        song = song.strip().lower()
        song_names_user_language = [name.strip().lower() for name in song_names_user_language]

        # Find the index of the input song
        input_index = song_names_user_language.index(song)

        # Use the input index to retrieve the corresponding song's features from the scaled data
        input_song_vector = songs_scaled[input_index]

        # Return the feature vector of the song
        return input_song_vector

    except ValueError:
        raise ValueError(f"Song '{song}' not found in the list of {len(song_names_user_language)} songs.")

def update_songs_js(recommendations, language):
    songs_js_path = "../frontend/dist/assets/songs.js"
    
    # Prepare the song data in the required format
    songs_data = []
    for idx, rec in enumerate(recommendations):
        song_data = {
            "id": idx + 1,
            "name": rec["name"],
            "song": rec["track_url"],
            "image": rec["artwork_url"],
            "category": f"{language}, Pop",  # You can adjust the category as per your needs
            "liked": False,
            "singer": rec["artist"]
        }
        
        # Download the image and get its relative path
        image_url = rec["artwork_url"]
        image_name = f"song_{idx + 1}.jpg"  # You can customize the image name
        image_path = download_image(image_url, image_name)
        
        if image_path:
            song_data["image"] = image_path

        songs_data.append(song_data)

    # Write to the songs.js file dynamically
    with open(songs_js_path, 'w') as f:
        f.write("export const songsData = ")
        f.write(json.dumps(songs_data, indent=2))  # Write the formatted song data

@app.route('/submit', methods=['POST'])
def receive_input():
    data = request.get_json()
    language = data.get('language')
    song = data.get('song')
    print(f"🎵 Received from frontend → Language: {language}, Song: {song}")

    try:
        # Load the necessary data and model for the selected language
        model = load_model(language)
        songs_scaled = load_songs_scaled(language)  # Load the preprocessed scaled data
        song_names_user_language = load_song_names_user_language(language)
        user_language_indices = load_user_language_indices(language)
        original_data = load_original_data()  # Load original data from the CSV

        print(f"✅ Loaded {language} model and preprocessed data successfully.")

        # Prepare the input song data (pass songs_scaled)
        input_song_vector = prepare_input_data(song, song_names_user_language, songs_scaled)

        # Initialize the recommender with the necessary data
        recommender = SongRecommender(songs_scaled, song_names_user_language, model)

        # Find the index of the input song in the dataset
        input_index = song_names_user_language.index(song)  # Ensure this matches your data structure

        # Generate recommendations
        recommendations = recommender.recommend(input_song_vector, song_names_user_language[input_index], n=7, original_indices=user_language_indices, original_data=original_data)

        # Update songs.js dynamically
        update_songs_js(recommendations, language)

        # Return recommendations to the frontend
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        print(f"❌ Error during recommendation: {e}")
        return jsonify({"error": str(e)}), 500

# Serve React static files
@app.route('/')
@app.route('/<path:path>')
def serve_react(path=""):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
    app.run(debug=True)
