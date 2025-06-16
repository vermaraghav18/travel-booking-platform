const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const flightsRoute = require('./routes/flights');
app.use('/api', flightsRoute);

app.use('/api', require('./routes/tripadvisor.js'));

const tripadvisorRouter = require('./routes/flightsTripadvisor'); // ✅ add this
app.use('/api', tripadvisorRouter); // ✅ mount it

const trackClick = require('./routes/trackClick');
app.use('/api', trackClick);


const kiwiRouter = require('./routes/kiwiFlights');
app.use('/api', kiwiRouter);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
