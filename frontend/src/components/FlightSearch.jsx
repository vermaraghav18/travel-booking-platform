import React, { useState } from 'react';
import axios from 'axios';
import FlightResults from './FlightResults';

function FlightSearch() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!from || !to || !date) return alert('Please enter all fields');

    setLoading(true);
    setResults([]);

    try {
      const response = await axios.get(`http://localhost:10000/api/search-flights-kiwi`, {
        params: { from, to, date }
      });

      setResults(response.data.data || []);
    } catch (err) {
      console.error('Frontend error:', err.message);
      alert('Error fetching flights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>✈️ Travel Booking Platform</h1>
      <p>Search and compare flights, hotels & more.</p>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="From (e.g. DEL)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <input
          type="text"
          placeholder="To (e.g. BOM)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </div>

      <FlightResults results={results} />
    </div>
  );
}

export default FlightSearch;
