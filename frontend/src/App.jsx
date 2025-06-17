import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FlightSearch from './components/FlightSearch';
import FlightResults from './components/FlightResults';
import AirportSearch from './components/AirportSearch';

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    departure: 'DEL',
    arrival: 'BOM',
    date: new Date().toISOString().split('T')[0]
  });

  const searchFlights = async (params) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://localhost:5000/api/flights', {
        params
      });
      
      setFlights(response.data.data || []);
      if (!response.data.data || response.data.data.length === 0) {
        setError('No flights found for this route.');
      }
    } catch (err) {
      setError('Failed to fetch flights. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchFlights(searchParams);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>AviationStack Flight Finder</h1>
        <p>Real-time flight data powered by AviationStack API</p>
      </header>
      
      <main className="app-main">
        <div className="search-section">
          <FlightSearch 
            initialValues={searchParams}
            onSearch={searchFlights}
            loading={loading}
          />
          <AirportSearch />
        </div>
        
        <div className="results-section">
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div className="loading-spinner">Loading flights...</div>
          ) : (
            <FlightResults flights={flights} />
          )}
        </div>
      </main>
      
      <footer className="app-footer">
        <p>API requests this month: <span id="api-counter">0/100</span></p>
      </footer>
    </div>
  );
}

export default App;