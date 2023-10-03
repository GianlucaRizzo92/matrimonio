const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection options
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'default',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DATABASE || 'verceldb',
  password: process.env.POSTGRES_PASSWORD || 'E1g7HuMAkcRn',
  port: process.env.POSTGRES_PORT || 5432,
  // Add other connection options as needed
  // Example: ssl: { rejectUnauthorized: false }
});

app.use(bodyParser.json());
app.use(cors());

app.post('/api/form', async (req, res) => {
  try {
    const { name, email, people, note } = req.body;
    console.log(req.body);

    const result = await pool.query(
      'INSERT INTO your_table (name, email, people, note) VALUES ($1, $2, $3, $4)',
      [name, email, people, note]
    );

    console.log('Form submission saved successfully');
    res.status(200).send('Form submission saved');
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error saving form submission');
  }
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    console.log('Database connection test successful');
    res.status(200).send('Database connection test successful');
  } catch (error) {
    console.error('Error executing database query', error);
    res.status(500).send('Error testing database connection');
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
