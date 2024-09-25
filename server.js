require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const errorMiddleware = require('./middleware/Error');

const connectToDb = require('./config/db');

const cloudinary = require('./config/cloudinary');

//uncaught exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Serve shutting down due to uncaught exception`);
    process.exit(1);
});

connectToDb();

// using middlewares
app.use(
    cors({
      origin: [/netlify\.app$/, /localhost:\d{4}$/],
      credentials: true,
    })
  );
  app.use(express.json({ limit: '20mb' }));
  app.use(cookieParser());
  
// basic api route
app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API service running 🚀',
    });
  });
  
// using other middlewares
app.use(errorMiddleware);

//starting server
const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Server running');
  });
  
  // unhandled promise rejection
  process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server shutting down due to unhandled promise rejection`);
    server.close(() => {
      process.exit(1);
    });
  });
  