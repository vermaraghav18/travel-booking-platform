const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();

router.get('/search-flights', async (req, res) => {
  const { from, to, date } = req.query;

  try {
    const response = await axios.get('https://api.travelpayouts.com/v2/prices/latest', {
      params: {
        origin: from,
        destination: to,
        currency: 'inr',
        token: process.env.TRAVELPAYOUTS_TOKEN,
      }
    });

    const allFlightsArray = response.data.data;

    // ✅ Filter by departure date or later
    const userDate = new Date(date);
    const filtered = allFlightsArray.filter(f => {
      const flightDate = new Date(f.depart_date);
      return flightDate >= userDate;
    });

    return res.json({
      success: true,
      currency: 'inr',
      data: filtered
    });

  } catch (err) {
    console.error('[ERROR]', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch flights',
      error: err.message
    });
  }
});

module.exports = router;
