import React from 'react';
import { format } from 'date-fns';

const FlightResults = ({ flights }) => {
  const formatTime = (timeString) => {
    try {
      return format(new Date(timeString), 'hh:mm a');
    } catch {
      return 'N/A';
    }
  };

  const formatDuration = (departure, arrival) => {
    try {
      const dep = new Date(departure);
      const arr = new Date(arrival);
      const diff = (arr - dep) / (1000 * 60); // minutes
      
      const hours = Math.floor(diff / 60);
      const minutes = Math.floor(diff % 60);
      return `${hours}h ${minutes}m`;
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="flight-results">
      {flights.length === 0 ? (
        <div className="no-flights">No flights found for your search criteria.</div>
      ) : (
        <ul className="flight-list">
          {flights.map((flight, index) => (
            <li key={index} className="flight-card">
              <div className="flight-header">
                <div className="airline">
                  <img 
                    src={`https://logo.clearbit.com/${flight.airline?.name?.toLowerCase().replace(/\s/g, '')}.com`} 
                    alt={flight.airline?.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/50?text=Airline';
                    }}
                  />
                  <span>{flight.airline?.name || 'Unknown Airline'}</span>
                </div>
                <div className="flight-number">
                  {flight.flight?.iata || 'N/A'}
                </div>
              </div>
              
              <div className="flight-details">
                <div className="time-details">
                  <div className="departure">
                    <span className="time">{formatTime(flight.departure?.scheduled)}</span>
                    <span className="airport">{flight.departure?.iata}</span>
                  </div>
                  
                  <div className="duration">
                    {formatDuration(flight.departure?.scheduled, flight.arrival?.scheduled)}
                  </div>
                  
                  <div className="arrival">
                    <span className="time">{formatTime(flight.arrival?.scheduled)}</span>
                    <span className="airport">{flight.arrival?.iata}</span>
                  </div>
                </div>
                
                <div className="status">
                  <span className={`status-badge ${flight.flight_status?.toLowerCase()}`}>
                    {flight.flight_status}
                  </span>
                </div>
              </div>
              
              <div className="flight-footer">
                <a 
                  href={`https://www.makemytrip.com/flights/search?tripType=O&itinerary=${flight.departure.iata}-${flight.arrival.iata}-${flight.flight_date}&paxType=A-1_C-0_I-0`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-button"
                >
                  Book Now
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FlightResults;