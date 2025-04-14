from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import joblib
import numpy as np
import pandas as pd
import requests
import json
from kmeans_custom import KMeansFromScratch
from song_recommender import SongRecommender  # Your recommender class

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
CORS(app, resources={r"/*": {
    "origins": "http://localhost:5173",
    "allow_headers": "*",
    "methods": ["GET", "POST", "OPTIONS"]
}})

MODEL_DIR = "models"  # Your model directory

def load_original_data():
    filepath = "./spotify_tracks (1).csv"
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No original data found at {filepath}")
    return pd.read_csv(filepath)

def load_songs_scaled(language):
    filepath = os.path.join(MODEL_DIR, f"{language.lower()}_songs_scaled.pkl")
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No scaled data for {language}")
    with open(filepath, "rb") as f:
        return joblib.load(f)

def load_song_names_user_language(language):
    filepath = os.path.join(MODEL_DIR, f"{language.lower()}_song_names.pkl")
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No song names for {language}")
    with open(filepath, "rb") as f:
        return joblib.load(f)

def load_user_language_indices(language):
    filepath = os.path.join(MODEL_DIR, f"{language.lower()}_language_indices.pkl")
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No language indices for {language}")
    with open(filepath, "rb") as f:
        return joblib.load(f)

def load_model(language):
    filepath = os.path.join(MODEL_DIR, f"{language.lower()}_kmeans_model.pkl")
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No model for {language}")
    with open(filepath, "rb") as f:
        return joblib.load(f)

def prepare_input_data(song, song_names_user_language, songs_scaled):
    try:
        song = song.strip().lower()
        song_names_user_language = [name.strip().lower() for name in song_names_user_language]
        input_index = song_names_user_language.index(song)
        return songs_scaled[input_index]
    except ValueError:
        raise ValueError(f"Song '{song}' not found in list.")

def download_image(image_url, image_name):
    assets_folder = "../frontend/dist/assets"
    os.makedirs(assets_folder, exist_ok=True)
    image_path = os.path.join(assets_folder, image_name)
    
    try:
        response = requests.get(image_url)
        if response.status_code == 200:
            with open(image_path, "wb") as f:
                f.write(response.content)
            return f"assets/{image_name}"  # Relative path for frontend
        else:
            print(f"❌ Failed to download image: {image_url}")
            return None
    except Exception as e:
        print(f"❌ Error downloading image: {e}")
        return None

def update_songs_js(recommendations, language):
    songs_js_path = "../frontend/dist/assets/songs.js"
    songs_data = []

    for idx, rec in enumerate(recommendations):
        image_name = f"song_{idx + 1}.jpg"
        image_path = download_image(rec["artwork_url"], image_name) or rec["artwork_url"]
        
        song_data = {
            "id": idx + 1,
            "name": rec["name"],
            "song": rec["track_url"],
            "image": image_path,
            "category": f"{language}, Pop",
            "liked": False,
            "singer": rec["artist"]
        }
        songs_data.append(song_data)

    with open(songs_js_path, 'w') as f:
        f.write("export const songsData = ")
        f.write(json.dumps(songs_data, indent=2))

@app.route('/submit', methods=['OPTIONS'])
def options():
    return '', 200

@app.route('/submit', methods=['POST'])
def receive_input():
    data = request.get_json()
    language = data.get('language')
    song = data.get('song')
    print(f"🎵 Received from frontend → Language: {language}, Song: {song}")

    try:
        model = load_model(language)
        songs_scaled = load_songs_scaled(language)
        song_names_user_language = load_song_names_user_language(language)
        user_language_indices = load_user_language_indices(language)
        original_data = load_original_data()

        print(f"✅ Loaded model and data for {language}")

        input_song_vector = prepare_input_data(song, song_names_user_language, songs_scaled)

        recommender = SongRecommender(songs_scaled, song_names_user_language, model)
        input_index = song_names_user_language.index(song)

        recommendations = recommender.recommend(
            input_song_vector,
            song_names_user_language[input_index],
            n=7,
            original_indices=user_language_indices,
            original_data=original_data
        )

        update_songs_js(recommendations, language)

        return jsonify({"recommendations": recommendations})

    except Exception as e:
        print(f"❌ Error during recommendation: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/')
@app.route('/<path:path>')
def serve_react(path=""):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
    app.run(debug=True)
 