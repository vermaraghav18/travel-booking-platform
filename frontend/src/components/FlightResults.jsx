import React from 'react';

function FlightResults({ results }) {
  if (!results || results.length === 0) {
    return <p style={{ marginTop: '2rem' }}>No flights found.</p>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>🧳 Flight Results</h2>
      {results.map((flight, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px'
          }}
        >
          <p><strong>From:</strong> {flight.from}</p>
          <p><strong>To:</strong> {flight.to}</p>
          <p><strong>Departure:</strong> {new Date(flight.departure).toLocaleString()}</p>
          <p><strong>Airline:</strong> {flight.airline}</p>
          <p><strong>Price:</strong> ₹{flight.price}</p>
        </div>
      ))}
    </div>
  );
}

export default FlightResults;
