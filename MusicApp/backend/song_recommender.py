import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import re
import os
import requests

class SongRecommender:
    def __init__(self, data, song_names, model):
        self.data = data
        self.song_names = song_names
        self.model = model
        self.labels = model.labels

    def _normalise_name(self, name):
        name = name.lower().strip()
        name = re.sub(r'\(.*?\)', '', name).strip()
        return name

    def download_image(self, image_url, image_name, dest_folder="../frontend/dist/assets"):
        """
        Downloads an image from the provided URL and saves it to the destination folder.
        Returns the relative path of the saved image.
        """
        response = requests.get(image_url)
        if response.status_code == 200:
            if not os.path.exists(dest_folder):
                os.makedirs(dest_folder)
            with open(os.path.join(dest_folder, image_name), 'wb') as f:
                f.write(response.content)
            return os.path.join("assets", image_name)  # Return relative path for frontend
        else:
            print(f"Failed to download image from {image_url}")
        return None

    def recommend(self, input_song_vector, input_song_name=None, n=7, language=None, indices_by_language=None, original_indices=None, original_data=None):
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
        input_name_norm = self._normalise_name(input_song_name) if input_song_name else ""

        for i in sorted_indices:
            idx = cluster_indices[i]
            selected_song_name = self.song_names[idx]
            selected_song_name_norm = self._normalise_name(selected_song_name)

            if input_song_name and selected_song_name_norm == input_name_norm:
                continue

            top_n_indices.append(idx)
            if len(top_n_indices) == n:
                break

        print(f"\n🎵 Top {n} recommendations:")
        recommendations = []

        if original_indices is None:
            raise ValueError("Missing original indices for mapping back to full dataset.")

        for idx in top_n_indices:
            original_idx = original_indices[idx]  # Dynamic lookup
            name = self.song_names[idx]
            artist = original_data.loc[original_idx, 'artist_name']
            track_url = original_data.loc[original_idx, 'track_url']
            artwork_url = original_data.loc[original_idx, 'artwork_url']
            language = original_data.loc[original_idx, 'language']

            # Download the image and get the local path
            image_name = f"{name.replace(' ', '_')}.jpg"  # Use song name for image file name
            local_image_path = self.download_image(artwork_url, image_name)

            if local_image_path:
                sim_score = cosine_similarity([input_song_vector], [self.data[idx]])[0][0]

                print(f"- {name} by {artist} (Similarity: {sim_score:.4f})")
                print(f"  🎧 Track URL: {track_url}")
                print(f"  🎨 Artwork URL: {local_image_path}")  # Display the local path
                print(f"  🌐 Language: {language}\n")

                recommendations.append({
                    "name": name,
                    "artist": artist,
                    "similarity": sim_score,
                    "track_url": track_url,
                    "artwork_url": local_image_path,  # Use local path here
                })

        return recommendations
