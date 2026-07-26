const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Proxy route to fetch movies securely
app.get('/api/movies', async (req, res) => {
  const query = req.query.s || 'Avengers';
  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=trilogy`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});