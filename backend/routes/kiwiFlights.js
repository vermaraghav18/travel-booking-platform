const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search-flights-kiwi', async (req, res) => {
  const { from, to, date } = req.query;

  const kiwiURL = 'https://kiwi-com-cheap-flights.p.rapidapi.com/one-way';
  const options = {
    method: 'GET',
    url: kiwiURL,
    params: {
      source: from,
      destination: to,
      date: date,
      adults: '1',
      currency: 'inr',
      sort: 'price',
    },
    headers: {
      'X-RapidAPI-Key': process.env.KIWI_API_KEY,
      'X-RapidAPI-Host': 'kiwi-com-cheap-flights.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    console.log('✈️ Raw Kiwi Data:', response.data);

    res.json({ success: true, data: response.data.data || [] });
  } catch (error) {
    console.error('❌ Kiwi API error:', error.message);
    res.status(500).json({ success: false, message: 'Kiwi API error', error: error.message });
  }
});

module.exports = router;
