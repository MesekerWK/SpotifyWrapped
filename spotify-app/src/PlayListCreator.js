import React, { useState } from 'react';

const PlaylistCreator = ({ tracks, token }) => {
  const [playlistId, setPlaylistId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchWebApi = async (endpoint, method, body) => {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method,
      body: body ? JSON.stringify(body) : undefined
    });
    return await res.json();
  };

  const createPlaylist = async () => {
    setIsCreating(true);
    try {
      // Get user ID using the fetchWebApi helper
      const userData = await fetchWebApi('v1/me', 'GET');
      
      // Create playlist using the helper
      const playlist = await fetchWebApi(
        `v1/users/${userData.id}/playlists`, 
        'POST', 
        {
          name: "My Top 10 Tracks Playlist",
          description: "A collection of my most played tracks on Spotify",
          public: false
        }
      );

      // Get track URIs and add them to playlist
      const trackUris = tracks.map(track => track.uri);
      await fetchWebApi(
        `v1/playlists/${playlist.id}/tracks`,
        'POST',
        { uris: trackUris }
      );
      
      setPlaylistId(playlist.id);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
    setIsCreating(false);
  };

  return (
    <div className="container mt-4">
      {!playlistId ? (
        <button 
          className="btn btn-success mb-4"
          onClick={createPlaylist}
          disabled={isCreating}
        >
          {isCreating ? 'Creating Playlist...' : 'Create Playlist from Top Tracks'}
        </button>
      ) : (
        <div className="embed-responsive">
          <iframe
            title="Spotify Playlist Embed"
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
            width="100%"
            height="380"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default PlaylistCreator;