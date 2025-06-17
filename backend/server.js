require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// HTTPS Agent for AviationStack
const httpsAgent = new https.Agent({
  rejectUnauthorized: true,
  keepAlive: true
});

// Configuration
const config = {
  aviationstack: {
    baseURL: 'https://api.aviationstack.com/v1',
    timeout: 8000,
    retries: 2
  },
  cache: {
    stdTTL: 3600, // 1 hour cache
    checkperiod: 600
  },
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
  }
};

// Validate API Key
if (!process.env.AVIATIONSTACK_KEY?.trim()) {
  console.error('FATAL ERROR: Missing AviationStack API key in .env');
  process.exit(1);
}

// Initialize services
const flightCache = new NodeCache(config.cache);
const apiLimiter = rateLimit(config.rateLimiting);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

// Enhanced AviationStack Client
const aviationClient = axios.create({
  baseURL: config.aviationstack.baseURL,
  httpsAgent: httpsAgent,
  timeout: config.aviationstack.timeout,
  params: {
    access_key: process.env.AVIATIONSTACK_KEY.trim(),
    test: process.env.NODE_ENV === 'development' ? 1 : 0
  },
  headers: {
    'Accept-Encoding': 'gzip',
    'User-Agent': 'TravelSite/1.0'
  }
});

// Request interceptor for logging
aviationClient.interceptors.request.use(config => {
  console.log('Making request to:', config.url);
  return config;
});

// API Endpoints

/**
 * Flight Search Endpoint
 * GET /api/flights?departure=DEL&arrival=BOM&date=2025-06-18
 */
app.get('/api/flights', async (req, res) => {
  try {
    // Validate parameters
    const { departure, arrival, date } = req.query;
    
    if (!departure || !arrival || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    // Normalize inputs
    const params = {
      dep_iata: departure.toString().toUpperCase().trim(),
      arr_iata: arrival.toString().toUpperCase().trim(),
      flight_date: new Date(date).toISOString().split('T')[0],
      limit: 10
    };

    // Check cache
    const cacheKey = `flights-${params.dep_iata}-${params.arr_iata}-${params.flight_date}`;
    const cached = flightCache.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true
      });
    }

    // Make API request
    const { data } = await aviationClient.get('/flights', { params });
    
    // Validate response
    if (!data?.pagination) {
      throw new Error('Invalid API response structure');
    }

    // Handle empty results
    if (!data.data || data.data.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No scheduled flights'
      });
    }

    // Cache and return
    flightCache.set(cacheKey, data.data);
    res.json({
      success: true,
      data: data.data
    });

  } catch (error) {
    console.error('Flight Search Error:', {
      error: error.message,
      request: req.query,
      response: error.response?.data
    });

    // Return mock data
    res.json({
      success: true,
      data: generateMockFlights(
        req.query.departure || 'DEL',
        req.query.arrival || 'BOM',
        req.query.date || new Date().toISOString().split('T')[0]
      ),
      isMock: true,
      message: 'Using simulated data'
    });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    cacheStats: flightCache.getStats()
  });
});

// Mock Data Generator
function generateMockFlights(departure, arrival, date) {
  return [
    {
      flight: {
        number: 'AI101',
        iata: 'AI101',
        icao: 'AIC101'
      },
      airline: {
        name: 'Air India',
        iata: 'AI',
        icao: 'AIC'
      },
      departure: {
        airport: departure === 'DEL' 
          ? 'Indira Gandhi International' 
          : 'Unknown Airport',
        iata: departure,
        scheduled: `${date}T08:00:00`,
        terminal: '3',
        gate: '12A'
      },
      arrival: {
        airport: arrival === 'BOM' 
          ? 'Chhatrapati Shivaji Maharaj International' 
          : 'Unknown Airport',
        iata: arrival,
        scheduled: `${date}T10:00:00`,
        terminal: '2',
        gate: '15B'
      },
      flight_status: 'scheduled'
    }
  ];
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`AviationStack key: ${process.env.AVIATIONSTACK_KEY ? 'Configured' : 'Missing'}`);
});

// Error Handling
process.on('unhandledRejection', error => {
  console.error('Unhandled Rejection:', error);
});