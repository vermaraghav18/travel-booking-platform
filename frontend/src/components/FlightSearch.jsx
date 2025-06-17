import React, { useState, useEffect } from 'react'; // Added useEffect here
import axios from 'axios';

const FlightSearch = ({ initialValues, onSearch, loading }) => {
  const [formData, setFormData] = useState(initialValues);
  const [airports, setAirports] = useState({
    departure: { name: 'Indira Gandhi International' },
    arrival: { name: 'Chhatrapati Shivaji Maharaj International' }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  const fetchAirportName = async (iata, type) => {
    try {
      const response = await axios.get('http://localhost:5000/api/airports', {
        params: { search: iata }
      });
      
      if (response.data.data && response.data.data.length > 0) {
        const airport = response.data.data.find(a => a.iata_code === iata);
        if (airport) {
          setAirports(prev => ({
            ...prev,
            [type]: { name: airport.airport_name }
          }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch airport:', err);
    }
  };

  useEffect(() => {
    fetchAirportName(formData.departure, 'departure');
    fetchAirportName(formData.arrival, 'arrival');
  }, [formData.departure, formData.arrival]);

  return (
    <form onSubmit={handleSubmit} className="flight-search-form">
      <div className="form-group">
        <label>From</label>
        <div className="airport-input">
          <input
            type="text"
            name="departure"
            value={formData.departure}
            onChange={handleChange}
            maxLength="3"
            placeholder="DEL"
          />
          <span className="airport-name">{airports.departure.name}</span>
        </div>
      </div>
      
      <div className="form-group">
        <label>To</label>
        <div className="airport-input">
          <input
            type="text"
            name="arrival"
            value={formData.arrival}
            onChange={handleChange}
            maxLength="3"
            placeholder="BOM"
          />
          <span className="airport-name">{airports.arrival.name}</span>
        </div>
      </div>
      
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search Flights'}
      </button>
    </form>
  );
};

export default FlightSearch;