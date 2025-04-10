import os
import re
import requests
import numpy as np
from glob import glob
from sklearn.metrics.pairwise import cosine_similarity

class SongRecommender:
    def __init__(self, data, song_names, model):
        self.data = data
        self.song_names = song_names
        self.model = model
        self.labels = model.labels
        self.image_counter = 1  # Image numbering
        self.assets_folder = "../frontend/src/assets"

    def _normalize_name(self, name):
        name = name.lower().strip()
        name = re.sub(r'\(.*?\)', '', name).strip()
        return name

    def clear_old_images(self):
        """
        Deletes old image files (image*.jpg) from the assets folder.
        """
        if os.path.exists(self.assets_folder):
            old_images = glob(os.path.join(self.assets_folder, "image*.jpg"))
            for img_path in old_images:
                os.remove(img_path)
            print(f"🧹 Cleared {len(old_images)} old images from {self.assets_folder}")
        else:
            os.makedirs(self.assets_folder)
            print(f"📁 Created assets folder: {self.assets_folder}")

    def download_image(self, image_url):
        """
        Downloads an image and saves it as image1.jpg, image2.jpg, etc.
        """
        image_name = f"image{self.image_counter}.jpg"
        response = requests.get(image_url)

        if response.status_code == 200:
            image_path = os.path.join(self.assets_folder, image_name)
            with open(image_path, 'wb') as f:
                f.write(response.content)

            self.image_counter += 1
            return os.path.join("assets", image_name)  # Relative path for frontend
        else:
            print(f"❌ Failed to download image from {image_url}")
            return None

    def recommend(self, input_song_vector, input_song_name=None, n=7, language=None, indices_by_language=None, original_indices=None, original_data=None):
        """
        Generate song recommendations based on input song features.
        """
        # ✅ Clear images before new recommendation
        self.clear_old_images()

        # Reset counter for naming
        self.image_counter = 1

        # Find the cluster of the input song
        input_cluster = np.argmin([
            np.linalg.norm(input_song_vector - c)
            for c in self.model.centroids
        ])
        print(f"🎯 Input song belongs to cluster: {input_cluster}")

        cluster_indices = np.where(self.labels == input_cluster)[0]
        cluster_songs = self.data[cluster_indices]

        similarities = cosine_similarity([input_song_vector], cluster_songs)[0]
        sorted_indices = np.argsort(similarities)[::-1]

        top_n_indices = []
        input_name_norm = self._normalize_name(input_song_name) if input_song_name else ""

        for i in sorted_indices:
            idx = cluster_indices[i]
            selected_song_name = self.song_names[idx]
            selected_song_name_norm = self._normalize_name(selected_song_name)

            if selected_song_name_norm == input_name_norm:
                continue

            top_n_indices.append(idx)
            if len(top_n_indices) == n:
                break

        print(f"\n🎵 Top {n} recommendations:")
        recommendations = []

        if original_indices is None or original_data is None:
            raise ValueError("Missing original_indices or original_data")

        for idx in top_n_indices:
            original_idx = original_indices[idx]
            name = self.song_names[idx]
            artist = original_data.loc[original_idx, 'artist_name']
            track_url = original_data.loc[original_idx, 'track_url']
            artwork_url = original_data.loc[original_idx, 'artwork_url']
            language = original_data.loc[original_idx, 'language']

            local_image_path = self.download_image(artwork_url)

            if local_image_path:
                sim_score = cosine_similarity([input_song_vector], [self.data[idx]])[0][0]

                print(f"- {name} by {artist} (Similarity: {sim_score:.4f})")
                print(f"  🎧 Track URL: {track_url}")
                print(f"  🎨 Image Path: {local_image_path}")
                print(f"  🌐 Language: {language}\n")

                recommendations.append({
                    "name": name,
                    "artist": artist,
                    "similarity": sim_score,
                    "track_url": track_url,
                    "artwork_url": local_image_path,
                })

        return jsonify(recommendations)
