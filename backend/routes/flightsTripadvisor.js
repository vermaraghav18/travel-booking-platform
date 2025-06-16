// 📁 backend/routes/flightsTripadvisor.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const TRIPADVISOR_API_KEY = '6d056f8ad9msh77fa5c141fdc441p1041e4jsn0642fd9f307f';
const TRIPADVISOR_HOST = 'tripadvisor16.p.rapidapi.com';

router.get('/search-flights-tripadvisor', async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ success: false, message: 'Missing from/to parameters' });
  }

  const options = {
    method: 'GET',
    url: 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights',
    params: {
      sourceAirportCode: from,
      destinationAirportCode: to,
      itineraryType: 'ONE_WAY',
      sortOrder: 'ML_BEST_VALUE',
      numAdults: '1',
      numSeniors: '0',
      classOfService: 'ECONOMY',
      pageNumber: '1',
      currencyCode: 'INR',
      region: 'IN',
      nearby: 'yes',
      nonstop: 'yes'
    },
    headers: {
      'X-RapidAPI-Key': TRIPADVISOR_API_KEY,
      'X-RapidAPI-Host': TRIPADVISOR_HOST
    }
  };

  try {
    const response = await axios.request(options);
    const flights = response.data.data.flights || [];

    res.json({ success: true, data: flights });
  } catch (error) {
    console.error('Tripadvisor API error:', error.message);
    res.status(500).json({ success: false, message: 'Tripadvisor API error', error: error.message });
  }
});

module.exports = router;
