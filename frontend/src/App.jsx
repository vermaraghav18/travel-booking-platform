import React from 'react';
import FlightSearch from './components/FlightSearch';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>✈️ Travel Booking Platform</h1>
      <p>Search and compare flights, hotels & more.</p>

      <FlightSearch />
    </div>
  );
}

export default App;
