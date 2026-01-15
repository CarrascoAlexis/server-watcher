const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const config = require('./config/config');
const routes = require('./routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Routes
routes(app);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${config.nodeEnv})`);
});
