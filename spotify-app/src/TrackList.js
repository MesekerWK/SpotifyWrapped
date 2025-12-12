import React from 'react';
import PlaylistCreator from './PlayListCreator';

const TrackList = ({ tracks, token }) => {
    return (
      <div className="container py-4">
        <PlaylistCreator tracks={tracks} token={token} />
        <div className="list-group">
          {tracks.map((track, index) => (
            <div 
              key={track.id}
              className="list-group-item list-group-item-action d-flex align-items-center gap-3"
            >
              <span className="h4 mb-0">#{index + 1}</span>
              <img 
                src={track.album.images[2]?.url} 
                alt={track.name}
                style={{ width: '64px', height: '64px' }}
                className="rounded"
              />
              <div className="flex-grow-1">
                <h5 className="mb-0">{track.name}</h5>
                <p className="text-muted mb-0">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
              <span className="badge bg-success">
                Popularity: {track.popularity}%
              </span>
              <button 
                className="btn btn-outline-dark btn-sm"
                onClick={() => window.open(track.external_urls.spotify, '_blank')}
              >
                View on Spotify
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default TrackList;