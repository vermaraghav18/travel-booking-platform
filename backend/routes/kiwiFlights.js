const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search-kiwi', async (req, res) => {
  const { from, to, date } = req.query;

  try {
    const response = await axios.get('https://kiwi-com-cheap-flights.p.rapidapi.com/one-way', {
      params: {
        from,          // e.g., "DEL"
        to,            // e.g., "BOM"
        date,          // e.g., "2025-06-17"
        adult: 1,
        child: 0,
        infant: 0,
        currency: 'INR'
      },
      headers: {
        'X-RapidAPI-Key': process.env.KIWI_API_KEY,
        'X-RapidAPI-Host': 'kiwi-com-cheap-flights.p.rapidapi.com'
      }
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Kiwi API error:', error.message);
    res.status(500).json({ success: false, message: 'Kiwi API error', error: error.message });
  }
});

module.exports = router;
