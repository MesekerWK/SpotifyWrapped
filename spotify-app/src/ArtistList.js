import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

const ArtistList = ({ artists, token }) => {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [userTopTracks, setUserTopTracks] = useState([]);
  const [artistTopTracks, setArtistTopTracks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchUserTopTracks = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            limit: 100,
            time_range: 'medium_term'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        setUserTopTracks(data.items);
      } catch (error) {
        console.error('Error fetching top tracks:', error);
        setUserTopTracks([]);
      }
    };

    fetchUserTopTracks();
  }, [token]);

  const handleCardClick = async (artist) => {
    setSelectedArtist(artist);

    try {
      const response = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tracks = data.tracks.slice(0, 5);
      setArtistTopTracks(tracks);

    } catch (error) {
      console.error('Error:', error);
      setArtistTopTracks([]);
    }
  };

  const handleClose = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setSelectedArtist(null);
    setArtistTopTracks([]);
  };

  return (
    <div className="container py-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {artists.map((artist, index) => (
          <div key={artist.id} className="col">
            <div 
              className="card h-100 shadow-sm hover-effect" 
              onClick={() => handleCardClick(artist)}
              style={{ cursor: 'pointer', backgroundColor: 'black', color: 'white' }}
            >
              <img 
                src={artist.images[0]?.url} 
                className="card-img-top"
                alt={artist.name}
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title" style={{ color: 'white' }}>#{index + 1} {artist.name}</h5>
                <p className="card-text" style={{ color: 'white' }}>
                  {artist.genres.slice(0, 3).join(', ')}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-success">
                    Popularity: {artist.popularity}%
                  </span>
                  <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(artist.external_urls.spotify, '_blank');
                    }}
                  >
                    View on Spotify
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        show={selectedArtist !== null} 
        onHide={handleClose}
        size="lg"
        centered
        className="artist-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title> Top Tracks by {selectedArtist?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-5">
              <img 
                src={selectedArtist?.images[0]?.url}
                alt={selectedArtist?.name}
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-md-7">
              <div className="list-group">
                {artistTopTracks.map((track, index) => (
                  <div 
                    key={track.id} 
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center hover-effect"
                    style={{ backgroundColor: 'black', color: 'white' }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="badge bg-dark me-2">{index + 1}</span>
                      <button 
                        className="btn btn-link text-decoration-none text-light p-0"
                        onClick={() => window.open(track.external_urls.spotify, '_blank')}
                        style={{ border: 'none', background: 'none' }}
                      >
                        {track.name}
                      </button>
                    </div>
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => window.open(track.external_urls.spotify, '_blank')}
                    >
                      <i className="bi bi-spotify"></i> Play on Spotify
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ArtistList;
