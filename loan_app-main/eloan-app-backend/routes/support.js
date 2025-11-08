// routes/support.js
const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware: all routes here are private
router.use(auth);

// @route   POST /api/support/create
// @desc    Create a new support ticket
router.post('/create', async (req, res) => {
  const { subject, message } = req.body;
  const userId = req.user.id;

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required.' });
  }

  try {
    await db.execute(
      'INSERT INTO support_tickets (user_id, subject, message) VALUES (?, ?, ?)',
      [userId, subject, message]
    );
    res.status(201).json({ message: 'Support ticket created successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/support/my-tickets
// @desc    Get all tickets for the logged-in user
router.get('/my-tickets', async (req, res) => {
  try {
    const [tickets] = await db.execute(
      'SELECT id, subject, status, created_at FROM support_tickets WHERE user_id = ? ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/support/tickets/:id
// @desc    Get a single ticket and its replies
router.get('/tickets/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // 1. Get the ticket
    // 1. Get the ticket
    let query = 'SELECT * FROM support_tickets WHERE id = ?';
    let params = [id];
    
    // If not admin, ensure they own the ticket
    if (req.user.role !== 'admin') {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    const [tickets] = await db.execute(query, params);
    
    if (tickets.length === 0) {
      return res.status(404).json({ message: 'Ticket not found or access denied.' });
    }

    // 2. Get replies, joining with user to get the replier's name/role
    const [replies] = await db.execute(
      `SELECT r.message, r.created_at, u.name as replier_name, u.role as replier_role
       FROM ticket_replies r
       JOIN users u ON r.user_id = u.id
       WHERE r.ticket_id = ?
       ORDER BY r.created_at ASC`,
      [id]
    );

    res.json({ ticket: tickets[0], replies });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/support/tickets/:id/reply
// @desc    Reply to a ticket
router.post('/tickets/:id/reply', async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    // 1. Verify user owns this ticket OR is an admin
    let query = 'SELECT id FROM support_tickets WHERE id = ?';
    let params = [id];
    
    if (req.user.role !== 'admin') {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    const [tickets] = await db.execute(query, params);
    
    if (tickets.length === 0) {
      return res.status(404).json({ message: 'Ticket not found or access denied.' });
    }

    // 2. Insert the reply
    await db.execute(
      'INSERT INTO ticket_replies (ticket_id, user_id, message) VALUES (?, ?, ?)',
      [id, userId, message]
    );
    
    // 3. Re-open the ticket if it was closed
    await db.execute(
      "UPDATE support_tickets SET status = 'open', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id]
    );

    res.status(201).json({ message: 'Reply posted.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;