// backend/routes/tripadvisor.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search-flights-tripadvisor', async (req, res) => {
  const { from, to, date } = req.query;

  try {
    const response = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights', {
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
        region: 'IN'
      },
      headers: {
        'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com',
        'x-rapidapi-key': process.env.TRIPADVISOR_API_KEY
      }
    });

    const results = response.data?.flights || [];

    const simplifiedResults = results.map(flight => ({
      origin: from,
      destination: to,
      price: flight?.purchaseLinks?.[0]?.totalPrice?.formatted || 'N/A',
      airline: flight?.segments?.[0]?.carrier?.displayName || 'Unknown',
      depart_date: date,
      duration: flight?.segments?.[0]?.durationFormatted || '',
      link: flight?.purchaseLinks?.[0]?.url || ''
    }));

    res.json({ success: true, data: simplifiedResults });

  } catch (error) {
    console.error('Tripadvisor API error:', error.message);
    res.status(500).json({ success: false, message: 'Tripadvisor API error', error: error.message });
  }
});

module.exports = router;
