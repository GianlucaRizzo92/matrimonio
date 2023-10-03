require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://default:E1g7HuMAkcRn@ep-billowing-boat-04198773.eu-central-1.postgres.vercel-storage.com:5432/verceldb',
  ssl: {
    rejectUnauthorized: false, // For testing purposes only. In production, set to true.
  },
});

// const pool = new Pool({
//   user: process.env.DB_USER || 'admin',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'test',
//   password: process.env.DB_PASSWORD || 'admin',
//   port: process.env.DB_PORT || 5432,
// });

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
    res.status(200).json({ status: 'success', message: 'Form submission saved' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ status: 'error', message: 'Error saving form submission' });
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
app.get('/api/form', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM your_table');
    const data = result.rows;
    res.status(200).json({ status: 'success', data });
    console.log(data)
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ status: 'error', message: 'Error retrieving data' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
