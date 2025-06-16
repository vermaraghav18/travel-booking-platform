const express = require('express');
const axios = require('axios');
const router = express.Router();

const KIWI_API_KEY = process.env.KIWI_API_KEY;

router.get('/search-flights-kiwi', async (req, res) => {
  const { from, to, date } = req.query;

  const options = {
    method: 'GET',
    url: 'https://kiwi-com-cheap-flights.p.rapidapi.com/v2/search',
    params: {
      fly_from: from,
      fly_to: to,
      date_from: date,
      date_to: date,
      curr: 'INR'
    },
    headers: {
      'x-rapidapi-host': 'kiwi-com-cheap-flights.p.rapidapi.com',
      'x-rapidapi-key': KIWI_API_KEY
    }
  };

  try {
    const response = await axios.request(options);
    res.json({ success: true, data: response.data.data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kiwi API error', error: error.message });
  }
});

module.exports = router;
