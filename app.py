from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# Configuração do Spotify
spotify = spotipy.Spotify(
    client_credentials_manager=SpotifyClientCredentials(
        client_id=os.getenv('SPOTIFY_CLIENT_ID'),
        client_secret=os.getenv('SPOTIFY_CLIENT_SECRET')
    )
)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/trending/brazil', methods=['GET'])
def get_brazil_trending():
    try:
        # Buscar playlists em destaque no Brasil
        playlists = spotify.category_playlists('toplists', country='BR', limit=10)
        
        # Buscar charts brasileiros
        featured = spotify.featured_playlists(country='BR', limit=10)
        
        return jsonify({
            'playlists': playlists['playlists']['items'],
            'featured': featured['playlists']['items']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trending/global', methods=['GET'])
def get_global_trending():
    try:
        # Buscar playlists globais
        playlists = spotify.category_playlists('toplists', limit=10)
        
        # Buscar charts globais
        featured = spotify.featured_playlists(limit=10)
        
        return jsonify({
            'playlists': playlists['playlists']['items'],
            'featured': featured['playlists']['items']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories = spotify.categories(country='BR', limit=50)
        return jsonify(categories)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/category/<category_id>/playlists', methods=['GET'])
def get_category_playlists(category_id):
    try:
        playlists = spotify.category_playlists(category_id, country='BR', limit=20)
        return jsonify(playlists)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
