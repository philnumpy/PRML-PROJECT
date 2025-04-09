from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/submit', methods=['POST'])
def receive_input():
    data = request.get_json()
    language = data.get('language')
    song = data.get('song')
    print(f"🎵 Received from frontend → Language: {language}, Song: {song}")
    return jsonify({"message": "Data received successfully!"})

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
