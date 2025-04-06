import os
import re
import requests
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor

# ---- Set up Spotify API token (you need to get this from https://developer.spotify.com) ----
SPOTIFY_TOKEN = 'YOUR_SPOTIFY_TOKEN_HERE'

HEADERS = {
    "Authorization": f"Bearer {SPOTIFY_TOKEN}"
}

def run_notebook(notebook_path):
    with open(notebook_path) as f:
        nb = nbformat.read(f, as_version=4)

    ep = ExecutePreprocessor(timeout=600, kernel_name='python3')
    ep.preprocess(nb, {'metadata': {'path': './'}})
    return nb

def extract_dataframe_from_notebook(nb):
    for cell in nb.cells:
        if cell.cell_type == 'code':
            for output in cell.get('outputs', []):
                if output.output_type == 'execute_result' and 'text/plain' in output.data:
                    text = output.data['text/plain']
                    if 'track_name' in text and 'artist_name' in text and 'track_url' in text:
                        lines = text.strip().split('\n')[1:]
                        data = []
                        for line in lines:
                            parts = [p.strip() for p in line.split('  ') if p.strip()]
                            if len(parts) >= 3:
                                data.append(parts)
                        return data
    return []

def get_spotify_image_url(spotify_url):
    # Extract the Spotify track ID
    match = re.search(r'track/([a-zA-Z0-9]+)', spotify_url)
    if not match:
        return None
    track_id = match.group(1)

    # Call Spotify API
    response = requests.get(f"https://api.spotify.com/v1/tracks/{track_id}", headers=HEADERS)
    if response.status_code == 200:
        data = response.json()
        return data['album']['images'][0]['url']  # Get highest-res image
    else:
        print(f"❌ Error fetching image for track {track_id}: {response.status_code}")
        return None

def download_image(url, path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(path, 'wb') as f:
            f.write(response.content)
    else:
        print(f"⚠️ Failed to download image from {url}")

def create_songs_js(data):
    os.makedirs("assets", exist_ok=True)

    songs_list = []
    for i, row in enumerate(data):
        track_name, artist_name, track_url = row
        image_url = get_spotify_image_url(track_url)
        local_image_path = f"assets/{i+1}.jpg"

        if image_url:
            download_image(image_url, local_image_path)
            image_path = local_image_path.replace("\\", "/")
        else:
            image_path = "assets/placeholder.jpg"  # Optional fallback

        song = {
            "id": i + 1,
            "name": track_name,
            "singer": artist_name,
            "image": image_path,
            "liked": False
        }
        songs_list.append(song)

    js_content = "export const songsData = " + str(songs_list).replace("True", "true").replace("False", "false") + ";"

    with open("songs.js", "w") as f:
        f.write(js_content)

    print("✅ songs.js with images generated successfully!")

if __name__ == "__main__":
    notebook_path = "ProjectCode.ipynb"
    print("🚀 Running notebook...")
    nb = run_notebook(notebook_path)

    print("🔍 Extracting data...")
    data = extract_dataframe_from_notebook(nb)

    print("🎨 Fetching images & generating songs.js...")
    create_songs_js(data)
