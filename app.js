const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Server running!');
});

console.log(process.env.JWT_SECRET)
// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
// MongoDB connection
mongoose
    .connect(process.env.MONGOO_URI)
    .then(() => console.log('DB connection successful'));

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
