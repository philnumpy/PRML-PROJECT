import os #For creating folders (like assets/).
import re #For regex (used to extract Spotify track ID).
import requests #To call the Spotify API and download images.
import nbformat 
from nbconvert.preprocessors import ExecutePreprocessor #To run your .ipynb notebook from Python.

#Set up Spotify API token 
from spotify_utils import get_spotify_token
SPOTIFY_TOKEN = get_spotify_token()


HEADERS = {
    "Authorization": f"Bearer {SPOTIFY_TOKEN}" #HTTP headers passed to each Spotify API request.
}
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        song_name = request.form['song_name']
        # Pass this song name to notebook runner
        run_notebook(notebook_path, song_name)
        return redirect(url_for('success'))  # or render_template
    return render_template('index.html')

def run_notebook(notebook_path):
    with open(notebook_path) as f: #opens the notebook file as f
        nb = nbformat.read(f, as_version=4) #reads the file

    ep = ExecutePreprocessor(timeout=600, kernel_name='python3') #executes the file
    os.environ["PATH"] = "/opt/anaconda3/bin:" + os.environ["PATH"]

    return nb #Returns the executed notebook so we can look at outputs.

def extract_dataframe_from_notebook(nb):
    for cell in nb.cells: #Loops through each cell's output.
        if cell.cell_type == 'code':
            for output in cell.get('outputs', []):
                if output.output_type == 'execute_result' and 'text/plain' in output.data:
                    text = output.data['text/plain']
                    if 'track_name' in text and 'artist_name' in text and 'track_url' in text: #Looks for a DataFrame preview with the columns track_name, artist_name, and track_url
                        lines = text.strip().split('\n')[1:]
                        data = []
                        for line in lines:
                            parts = [p.strip() for p in line.split('  ') if p.strip()]
                            if len(parts) >= 3:
                                data.append(parts)
                        return data
    return []

def get_spotify_image_url(spotify_url):
    match = re.search(r'track/([a-zA-Z0-9]+)', spotify_url) #Extracts the track ID from the Spotify URL 
    if not match:
        return None
    track_id = match.group(1)

    # Call Spotify API
    response = requests.get(f"https://api.spotify.com/v1/tracks/{track_id}", headers=HEADERS) #Sends a GET request to the Spotify API to get metadata for the track.
    if response.status_code == 200:
        data = response.json() 
        return data['album']['images'][0]['url']  # Get highest-res image
    else:
        print(f"❌ Error fetching image for track {track_id}: {response.status_code}")
        return None

def download_image(url, path): #Downloads the image from Spotify.
#Saves it locally into assets/{id}.jpg.
    response = requests.get(url)
    if response.status_code == 200:
        with open(path, 'wb') as f:
            f.write(response.content)
    else:
        print(f"⚠️ Failed to download image from {url}")

def create_songs_js(data):
    songs = []
    for i, row in enumerate(data, 1):
        track_name = row["name"]
        artist_name = row["singer"]
        image_path = row["url"]  # might later change this to "image" after add Spotify images

        song_dict = {
            "id": i,
            "name": track_name,
            "singer": artist_name,
            "url": image_path,
            "liked": False
        }
        songs.append(song_dict)

    # Write to songs.js
    with open("songs.js", "w") as f:
        f.write("export const songsData = ")
        json.dump(songs, f, indent=4)

    print("✅ songs.js with images generated successfully!")
    
@app.route('/songs.js')
def serve_songs_js():
    return send_from_directory('.', 'songs.js')

if __name__ == "__main__": #Main Execution Block
    notebook_path = "ProjectCode.ipynb"
    print("🚀 Running notebook...")
    nb = run_notebook(notebook_path)

    print("🔍 Extracting data...")
    data = extract_dataframe_from_notebook(nb)

    print("🎨 Fetching images & generating songs.js...")
    create_songs_js(data)
