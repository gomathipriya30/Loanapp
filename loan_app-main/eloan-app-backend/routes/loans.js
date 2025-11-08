// routes/loans.js
const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/authMiddleware'); // Import our auth middleware

const router = express.Router();

// @route   GET /api/loans
// @desc    Get all available loans
// @access  Private (User or Admin)
router.get('/', auth, async (req, res) => {
  try {
    const [loans] = await db.execute('SELECT * FROM loans ORDER BY loan_name');
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;