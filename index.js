const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const DATABASE = process.env.DATABASE

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('${DATABASE}', { useNewUrlParser: true, useUnifiedTopology: true,dbName: "quotes" })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Quote schema and model
const quoteSchema = new mongoose.Schema({
  text: String,
  author: String
});

const Quote = mongoose.model('Quote', quoteSchema);

// Sample quotes array
const quotes = [];

// Routes
app.get('/api/quotes/random', async (req, res) => {
  const count = await Quote.countDocuments();
  const random = Math.floor(Math.random() * count);
  const quote = await Quote.findOne().skip(random);
  res.json(quote);
});

app.get('/api/quotes/search', async (req, res) => {
  const author = req.query.author;
  const quotes = await Quote.find({ author: new RegExp(`^${author}$`, 'i') });
  res.json(quotes);
});

app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
