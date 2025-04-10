# 🎵 Multilingual Content-Based Music Recommendation System

A project for PRML at IIT Jodhpur that delivers personalized song recommendations based on audio features using unsupervised learning techniques like Kernel PCA and KMeans.

## 🧠 Project Overview

This system recommends songs in **five different languages**—Hindi, Tamil, Korean, English, and a miscellaneous category—based on the user's input of a song and preferred language.

By analyzing the input song's audio features, we find the most similar songs within the same language group using:
- **Dimensionality Reduction (Kernel PCA)**
- **Clustering (K-Means with Elbow Method and KMeans++ initialization)**
- **Cosine Similarity for Recommendations**

---

## 📁 Dataset

- Source: [Spotify Tracks Dataset on Kaggle](https://www.kaggle.com/datasets/gauthamvijayaraj/spotify-tracks-dataset-updated-every-week)
- Size: 61,711 tracks
- Languages: Hindi, Tamil, Korean, English, Misc
- Key Features: `tempo`, `valence`, `energy`, `acousticness`, `danceability`, `year`, `popularity`, `loudness`, etc.

---

## ⚙️ Data Preprocessing

- Removed non-audio columns (e.g., artwork, album name)
- Dropped missing/duplicate rows
- One-hot encoded categorical features (`key`, `time_signature`)
- Standardized numerical features
- Grouped and saved songs by language

---

## 🔍 Dimensionality Reduction

- Applied **Kernel PCA (RBF kernel)** for capturing **non-linear patterns**
- Compared with PCA — Kernel PCA yielded better visual separability

---

## 🧩 Clustering

### ✅ K-Means Clustering
- Custom implementation from scratch
- **KMeans++** for better centroid initialization
- **Elbow Method** to find optimal `k` per language
- **Dunn Index** used for validation
- Final models saved for each language group

### ❌ DBSCAN
- Tried with multiple `epsilon` values
- Poor cluster formation, most points marked as outliers
- **K-Means chosen over DBSCAN** for better performance

---

## 🎧 Recommendation Engine

- For a given input song, identify its cluster
- Use **cosine similarity** to recommend top-`n` most similar songs within the same cluster
- Metadata (track name, artist, URL, artwork) retrieved for each recommendation

---

## 🧪 Results

- Provided consistent and meaningful recommendations across different language groups
- Evaluated qualitatively with positive alignment to user preferences in mood, rhythm, and genre

---

## 🚀 Future Work

- Use **lyrics-based features**
- Integrate **deep learning models** for better embeddings
- Add **user feedback loop** for more personalization

---

## 👥 Contributors

- Vaibhav Garg 
- Saher Dev  
- Swayam  
- Arnav Kataria  
- Tanisha Sonkar

---

## 🔗 References

- [Scikit-learn](https://scikit-learn.org/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [KMeans From Scratch - Medium](https://medium.com/@gallettilance/kmeans-from-scratch-24be6bee8021)
- [IBM: K-Means Explained](https://www.ibm.com/think/topics/k-means-clustering)

---

## 📌 Repository

📂 [GitHub Repo](https://github.com/philnumpy/PRML-PROJECT)
