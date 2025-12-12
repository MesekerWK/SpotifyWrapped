import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import ArtistList from './ArtistList';
import TrackList from './TrackList';
import TimeRangeSelector from './TimeRangeSelector';

import { Container, Row, Col } from 'react-bootstrap';

const App = () => {
  const [token, setToken] = useState('');
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [contentType, setContentType] = useState('artists');

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        if (item) {
          var parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});

    if (hash.access_token) {
      setToken(hash.access_token);
      window.location.hash = '';
    }
  }, []);

  useEffect(() => {
    if (token) {
      if (contentType === 'artists') {
        fetchTopArtists();
      } else {
        fetchTopTracks();
      }
    }
  }, [token, timeRange, contentType]);

  const fetchTopArtists = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: { 'Authorization': 'Bearer ' + token },
        params: { 
          time_range: timeRange, 
          limit: 10 
        }
      });
      setArtists(response.data.items);
    } catch (error) {
      console.error('Error fetching top artists:', error);
    }
  };

  const fetchTopTracks = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: { 'Authorization': 'Bearer ' + token },
        params: { 
          time_range: timeRange, 
          limit: 10 
        }
      });
      setTracks(response.data.items);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleContentTypeChange = (type) => {
    setContentType(type);
  };

  return (
    <div className="App"
        style={{
          background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.9), rgba(25, 20, 20, 0.95))',
          minHeight: '100vh',
          color: '#fff',
      }}>
      {!token ? (
        <Login />
      ) : (
        <Container className="min-vh-100 py-5 bg-gradient text-white">
          <Row className="mb-4">
            <Col>
              <TimeRangeSelector 
                selectedRange={timeRange}
                selectedType={contentType}
                onRangeChange={handleTimeRangeChange}
                onTypeChange={handleContentTypeChange}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {contentType === 'artists' ? (
                <ArtistList artists={artists} token={token} />
              ) : (
                <TrackList tracks={tracks} token={token} />
              )}
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default App;