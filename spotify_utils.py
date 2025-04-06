import requests
import base64
import os

def get_spotify_token():
    client_id = os.getenv("76eaf7b7b231485e824ec8e0d17f256f")
    client_secret = os.getenv("79b2e5b0bc7f4e9ba6685b5c40a24b69")

    if not client_id or not client_secret: 
      print("CLIENT_ID:", os.getenv("SPOTIFY_CLIENT_ID"))
      print("CLIENT_SECRET:", os.getenv("SPOTIFY_CLIENT_SECRET"))

      raise ValueError("⚠️ Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET as environment variables.")

    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = base64.b64encode(auth_bytes).decode("utf-8")

    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {
        "grant_type": "client_credentials"
    }

    response = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch token: {response.text}")

    access_token = response.json().get("access_token")
    return access_token
