// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users'); // <-- ADD THIS
const applicationRoutes = require('./routes/applications'); // <-- ADD THIS
const supportRoutes = require('./routes/support'); // <-- ADD THIS

const app = express();
const PORT = process.env.PORT || 4000;

// ... (Middleware remains the same)
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes); // <-- ADD THIS
app.use('/api/applications', applicationRoutes); // <-- ADD THIS
app.use('/api/support', supportRoutes); // <-- ADD THIS

// ... (Start server remains the same)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});