import React, { useState } from 'react';
import axios from 'axios';

function FlightSearch() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!from || !to || !date) return alert('Fill all fields');

    setLoading(true);
    setFlights([]);
    try {
      const response = await axios.get(`http://localhost:10000/api/search-kiwi`, {
        params: { from, to, date }
      });

      const results = response.data?.data?.results || [];

      // If no results found
      if (!Array.isArray(results) || results.length === 0) {
        setFlights([]);
        setLoading(false);
        return;
      }

      // Process each result (simplified for display)
      const parsedFlights = results.map((flight, index) => ({
        id: index,
        from: flight?.origin?.name || from,
        to: flight?.destination?.name || to,
        departure: flight?.departureTime || date,
        airline: flight?.airline?.name || 'Unknown',
        price: flight?.price || 'N/A'
      }));

      setFlights(parsedFlights);
    } catch (error) {
      console.error('Frontend error:', error.message);
      alert('Error fetching flights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🛫 Travel Booking Platform</h2>
      <p>Search and compare flights, hotels & more.</p>

      <input
        type="text"
        placeholder="From (e.g. DEL)"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{ margin: '5px', padding: '5px' }}
      />
      <input
        type="text"
        placeholder="To (e.g. BOM)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ margin: '5px', padding: '5px' }}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ margin: '5px', padding: '5px' }}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search Flights'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>✈️ Flight Results</h3>
        {flights.length === 0 ? (
          <p>No flights found.</p>
        ) : (
          flights.map((flight) => (
            <div key={flight.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p><strong>From:</strong> {flight.from}</p>
              <p><strong>To:</strong> {flight.to}</p>
              <p><strong>Date:</strong> {flight.departure}</p>
              <p><strong>Airline:</strong> {flight.airline}</p>
              <p><strong>Price:</strong> ₹{flight.price}</p>
              <button>Book Now</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FlightSearch;
