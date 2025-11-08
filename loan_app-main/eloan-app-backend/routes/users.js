// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { auth } = require('../middleware/authMiddleware');
const { decrypt } = require('../config/cryptoUtils');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get logged-in user's full profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, name, phone, email, aadhar_encrypted, pan_encrypted, occupation, organization FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const user = users[0];

    const profileData = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      aadhar: decrypt(user.aadhar_encrypted),
      pan: decrypt(user.pan_encrypted),
      occupation: user.occupation,
      organization: user.organization,
    };
    res.json(profileData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/profile
// @desc    Update user's profile information
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { name, email, phone, occupation, organization } = req.body;
  const userId = req.user.id;

  try {
    // Check if new email or phone already exists FOR ANOTHER USER
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE (email = ? OR phone = ?) AND id != ?',
      [email, phone, userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email or phone number already in use by another account.' });
    }

    // Update user
    await db.execute(
      'UPDATE users SET name = ?, email = ?, phone = ?, occupation = ?, organization = ? WHERE id = ?',
      [name, email, phone, occupation, organization, userId]
    );

    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/users/change-password
// @desc    Change user's password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // 1. Get user's current password hash
    const [users] = await db.execute('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const user = users[0];

    // 2. Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password.' });
    }

    // 3. Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // 4. Update password in DB
    await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, userId]);

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;