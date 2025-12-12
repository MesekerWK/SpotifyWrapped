import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Login = () => {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const REDIRECT_URI = 'http://localhost:3000/';
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPES = 'user-top-read user-read-private playlist-modify-public playlist-modify-private';

    const [popAlbums, setPopAlbums] = useState([]);
    const [rapAlbums, setRapAlbums] = useState([]);
    const [rbAlbums, setRbAlbums] = useState([]);
    const [hoveredAlbum, setHoveredAlbum] = useState(null);

    useEffect(() => {
        const fetchAlbumsByGenre = async (token, genres, setter) => {
            try {
                const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
                    headers: { 
                        'Authorization': `Bearer ${token}` 
                    },
                    params: {
                        limit: 20,
                        country: 'US',
                        genre: genres.join(',')
                    }
                });
                setter(response.data.albums.items);
            } catch (error) {
                console.error(`Error fetching ${genres.join('/')} albums:`, error);
            }
        };

        const getClientCredentialsToken = async () => {
            const client_id = process.env.REACT_APP_CLIENT_ID;
            const client_secret = process.env.REACT_APP_CLIENT_SECRET;

            try {
                const authOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'grant_type=client_credentials'
                };

                const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
                const data = await response.json();
                const token = data.access_token;
                if (token) {
                    await fetchAlbumsByGenre(token, ['pop', 'dance'], setPopAlbums);
                    await fetchAlbumsByGenre(token, ['hip-hop', 'rap'], setRapAlbums);
                    await fetchAlbumsByGenre(token, ['r-and-b', 'afrobeats'], setRbAlbums);
                }
            } catch (error) {
                console.error('Error getting access token:', error);
            }
        };

        getClientCredentialsToken();
    }, []);

    // CSS for the album carousel
    const carouselStyles = `
        @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        
        .album-carousel {
            pointer-events: auto;
            position: fixed;
            width: 100%;
            height: 250px;
            z-index: 1;
        }

        .carousel-layer-1 { top: 0%; }
        .carousel-layer-2 { top: 35%; }
        .carousel-layer-3 { top: 70%; }

        .album-track {
            display: flex;
            width: calc(250px * 20);
            animation: slide 30s linear infinite;
            pointer-events: none;
            position: relative;
            z-index: 5;
        }

        .track-1 { animation-duration: 30s; }
        .track-2 { animation-duration: 25s; animation-direction: reverse; }
        .track-3 { animation-duration: 35s; }

        .album-item {
            width: 250px;
            height: 250px;
            flex-shrink: 0;
            padding: 10px;
            opacity: 5;
            transition: opacity 0.3s ease;
            position: relative;
            z-index: 10;
            pointer-events: all;
        }

        .album-item:hover {
            opacity: 5;
            animation-play-state: paused;
        }

        .album-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
            filter: brightness(0.8) contrast(1.2);
        }

        .album-modal {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 20;
            pointer-events: none;
        }
    `;

    return (
        <>
            <style>{carouselStyles}</style>

            {/* Album Carousels Background */}
            <div className="album-carousel carousel-layer-1">
                <div className="album-track track-1">
                    {[...popAlbums, ...popAlbums].map((album, index) => (
                        <div 
                            key={`pop-${index}`} 
                            className="album-item"
                            onMouseEnter={() => setHoveredAlbum(album)}
                            onMouseLeave={() => setHoveredAlbum(null)}
                        >
                            <img src={album?.images?.[0]?.url} alt={album?.name} />
                            {hoveredAlbum === album && (
                                <div className="album-modal">
                                    <p><strong>{album.name}</strong></p>
                                    <p>Artist: {album.artists?.[0]?.name}</p>
                                    <p>Genre: {album.genre || 'Unknown'}</p>
                                    <p>Release Date: {album.release_date}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="album-carousel carousel-layer-2">
                <div className="album-track track-2">
                    {[...rapAlbums, ...rapAlbums].map((album, index) => (
                        <div 
                            key={`rap-${index}`} 
                            className="album-item"
                            onMouseEnter={() => setHoveredAlbum(album)}
                            onMouseLeave={() => setHoveredAlbum(null)}
                        >
                            <img src={album?.images?.[0]?.url} alt={album?.name} />
                            {hoveredAlbum === album && (
                                <div className="album-modal">
                                    <p><strong>{album.name}</strong></p>
                                    <p>Artist: {album.artists?.[0]?.name}</p>
                                    <p>Genre: {album.genre || 'Unknown'}</p>
                                    <p>Release Date: {album.release_date}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="album-carousel carousel-layer-3">
                <div className="album-track track-3">
                    {[...rbAlbums, ...rbAlbums].map((album, index) => (
                        <div 
                            key={`rb-${index}`} 
                            className="album-item"
                            onMouseEnter={() => setHoveredAlbum(album)}
                            onMouseLeave={() => setHoveredAlbum(null)}
                        >
                            <img src={album?.images?.[0]?.url} alt={album?.name} />
                            {hoveredAlbum === album && (
                                <div className="album-modal">
                                    <p><strong>{album.name}</strong></p>
                                    <p>Artist: {album.artists?.[0]?.name}</p>
                                    <p>Genre: {album.genre || 'Unknown'}</p>
                                    <p>Release Date: {album.release_date}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Existing Login Content */}
            <div
                className="container-fluid min-vh-100 d-flex align-items-center justify-content-center position-relative"
                style={{
                    background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.9), rgba(25, 20, 20, 0.95))',
                    color: '#fff',
                    zIndex: 1,
                }}
            >
                <div
                    className="text-center p-5 rounded shadow-lg"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        maxWidth: '400px',
                        width: '100%',
                    }}
                >
                    <h1
                        className="display-5 mb-4"
                        style={{
                            background: 'linear-gradient(135deg, #1db954, #1ed760)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Spotify Wrapped Experience
                    </h1>
                    <div className="bg-light p-4 rounded mb-4">
                        <h2 className="h4 mb-3 text-black">Welcome to Your Music Journey!</h2>
                        <p className="mb-4 text-black">
                            Discover your top artists and tracks from the past year. This
                            application was developed by Meseker Worku Kebede, a third-year
                            Computer Science student at NCSU, to provide you with your personalized Spotify statistics.
                        </p>
                        <a
                            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
                            className="btn btn-lg btn-dark w-100"
                            style={{
                                backgroundColor: '#1DB954',
                                border: 'none',
                                color: '#fff',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#1ed760';
                                e.currentTarget.style.boxShadow = '0 0 15px #1db954';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#1DB954';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <i className="fab fa-spotify me-2"></i>
                            Connect with Spotify
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
