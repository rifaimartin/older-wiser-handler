const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./src/config/config');
const connectDB = require('./src/config/database');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server running in ${config.environment} mode on port ${config.port}`);
});