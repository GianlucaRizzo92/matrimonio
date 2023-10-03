const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); // Import the cors package
const port = 3000;
// Create a new Express application
const app = express();

// Configure the PostgreSQL connection
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'test',
  password: 'admin',
  port: 5432 // default PostgreSQL port
});

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());
app.use(cors());

// Define a route to handle form submissions
app.post('/api/form', (req, res) => {
  const { name, email, people, note } = req.body;
  console.log(req.body);
  // Insert the form data into the PostgreSQL database
  pool.query('INSERT INTO your_table (name, email, people, note) VALUES ($1, $2, $3, $4)', [name, email, people, note], (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error saving form submission');
    } else {
      console.log('Form submission saved successfully');
      res.status(200).send('Form submission saved');
    }
  });
});

// Define a route to test the database connection
app.get('/api/test-db', (req, res) => {
  // Execute a simple query to check the database connection
  pool.query('SELECT 1', (error, result) => {
    if (error) {
      console.error('Error executing database query', error);
      res.status(500).send('Error testing database connection');
    } else {
      console.log('Database connection test successful');
      res.status(200).send('Database connection test successful');
    }
  });
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// Start the server
app.listen(process.env.PORT || port, () => {
  console.log('Server is running on port 3000');
});

// node server.js to start the server
