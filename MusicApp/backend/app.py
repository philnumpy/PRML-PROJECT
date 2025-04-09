from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import pickle
from kmeans_custom import KMeansFromScratch

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
CORS(app, resources={r"/*": {"origins": "*"}})

MODEL_DIR = "models"  # Folder where your .pkl files are stored

# Utility to load model by language
def load_model(language):
    filename = f"{language.lower()}_kmeans_model.pkl"
    filepath = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No model found for {language} at {filepath}")
    with open(filepath, "rb") as f:
        model = pickle.load(f)
    return model

@app.route('/submit', methods=['POST'])
def receive_input():
    data = request.get_json()
    language = data.get('language')
    song = data.get('song')
    print(f"🎵 Received from frontend → Language: {language}, Song: {song}")

    try:
        model = load_model(language)
        print(f"✅ Loaded {language} model:", model)
        # You can run your recommend function here instead of print, like:
        # results = recommend(language, song)
        # return jsonify(results)

        return jsonify({"message": f"{language} model loaded successfully!"})
    except Exception as e:
        print(f"❌ Error loading model: {e}")
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
