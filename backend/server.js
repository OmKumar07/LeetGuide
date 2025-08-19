const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const leetcodeRoutes = require('./routes/leetcode');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leetcode', leetcodeRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'LeetGuide API is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
