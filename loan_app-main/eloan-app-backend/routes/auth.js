// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { encrypt } = require('../config/cryptoUtils');

const router = express.Router();

// === REGISTER ROUTE (Updated) ===
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      aadhar,
      pan,
      occupation,
      organization,
      password,
    } = req.body;

    // 1. Check if user already exists
    const [existingUser] = await db.execute(
      'SELECT email FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: 'Email or phone number already in use.' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Encrypt sensitive data
    const aadhar_encrypted = encrypt(aadhar);
    const pan_encrypted = encrypt(pan);

    // 4. Save user to database
    // **CHANGED:** We no longer insert 'role' here, as the DB now has a DEFAULT of 'user'
    await db.execute(
      `INSERT INTO users (name, phone, email, aadhar_encrypted, pan_encrypted, occupation, organization, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        phone,
        email,
        aadhar_encrypted,
        pan_encrypted,
        occupation,
        organization,
        password_hash,
      ]
    );

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// === USER LOGIN ROUTE (Unchanged) ===
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // 1. Find user by email or phone
    const [users] = await db.execute(
      'SELECT * FROM users WHERE (email = ? OR phone = ?) AND role = "user"', // Ensure we only log in 'user' roles
      [emailOrPhone, emailOrPhone]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = users[0];

    // 2. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 3. Passwords match! Create a JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // Add role to payload
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// === NEW: ADMIN LOGIN ROUTE ===
router.post('/admin/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // 1. Find user by email/phone AND check if they are an 'admin'
    const [users] = await db.execute(
      'SELECT * FROM users WHERE (email = ? OR phone = ?) AND role = "admin"',
      [emailOrPhone, emailOrPhone]
    );

    // If no user found, or if they aren't an admin
    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: 'Invalid credentials or not an admin.' });
    }

    const adminUser = users[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, adminUser.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Invalid credentials or not an admin.' });
    }

    // 3. Create admin JWT token
    const payload = {
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role, // Will be 'admin'
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Admin login successful!',
      token: token,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login.' });
  }
});

module.exports = router;