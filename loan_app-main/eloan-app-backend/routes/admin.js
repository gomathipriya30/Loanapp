// routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { encrypt, decrypt } = require('../config/cryptoUtils');
const { auth, adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(auth, adminAuth);

// === ANALYTICS & REPORTING ROUTE ===
router.get('/stats', async (req, res) => {
  try {
    const [counts] = await db.execute(
      `SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'user') as totalUsers,
        (SELECT COUNT(*) FROM loans) as totalLoanTypes,
        (SELECT COUNT(*) FROM loan_applications) as totalApplications`
    );
    const [appStats] = await db.execute(
      `SELECT
        SUM(amount_required) as totalAmountRequested,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
        COUNT(CASE WHEN status = 'accepted-not-disbursed' THEN 1 END) as accepted,
        COUNT(CASE WHEN status = 'accepted-disbursed' THEN 1 END) as disbursed,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM loan_applications`
    );
    res.json({ ...counts[0], ...appStats[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// === User & Admin Routes ===
router.get('/users', async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT id, name, phone, email, occupation, organization, created_at, status FROM users WHERE role = 'user'";
    const params = [];
    if (search) {
      query += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const [users] = await db.execute(query, params);
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/users/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['active', 'blocked'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }
  try {
    await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `User status updated to ${status}.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM loan_applications WHERE user_id = ?', [userId]);
    const [tickets] = await connection.execute('SELECT id FROM support_tickets WHERE user_id = ?', [userId]);
    if (tickets.length > 0) {
      const ticketIds = tickets.map(t => t.id);
      await connection.execute('DELETE FROM ticket_replies WHERE ticket_id IN (?)', [ticketIds]);
      await connection.execute('DELETE FROM support_tickets WHERE user_id = ?', [userId]);
    }
    await connection.execute('DELETE FROM ticket_replies WHERE user_id = ?', [userId]);
    const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      throw new Error('User not found.');
    }
    await connection.commit();
    res.json({ message: 'User and all associated data deleted.' });
  } catch (err) {
    await connection.rollback();
    console.error(err.message);
    res.status(500).send('Server Error while deleting user.');
  } finally {
    connection.release();
  }
});

router.get('/admins', async (req, res) => {
  try {
    const [admins] = await db.execute(
      "SELECT id, name, phone, email, occupation, organization, created_at FROM users WHERE role = 'admin'"
    );
    res.json(admins);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/add-admin', async (req, res) => {
  const { name, phone, email, aadhar, pan, occupation, organization, password } = req.body;
  try {
    const [existingUser] = await db.execute('SELECT email FROM users WHERE email = ? OR phone = ?', [email, phone]);
    if (existingUser.length > 0) return res.status(409).json({ message: 'Email or phone number already in use.' });
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const aadhar_encrypted = encrypt(aadhar);
    const pan_encrypted = encrypt(pan);
    await db.execute(
      `INSERT INTO users (name, phone, email, aadhar_encrypted, pan_encrypted, occupation, organization, password_hash, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'admin')`,
      [name, phone, email, aadhar_encrypted, pan_encrypted, occupation, organization, password_hash]
    );
    res.status(201).json({ message: 'Admin user created successfully!' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// === Loan Management Routes (with Granular Fields) ===
router.get('/loans', async (req, res) => {
  try {
    const [loans] = await db.execute('SELECT * FROM loans ORDER BY created_at DESC');
    res.json(loans);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/add-loan', async (req, res) => {
  const {
    loan_name, description, interest_rate, processing_fee_percent,
    max_amount, min_amount,
    tenure_months, required_docs, eligibility_info
  } = req.body;
  if (!loan_name || !interest_rate || !max_amount || !min_amount || !tenure_months) {
    return res.status(400).json({ message: 'Please fill all required numeric/name fields.' });
  }
  try {
    await db.execute(
      `INSERT INTO loans (loan_name, description, interest_rate, processing_fee_percent, max_amount, min_amount, tenure_months, required_docs, eligibility_info)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [loan_name, description, interest_rate, processing_fee_percent || 0.00, max_amount, min_amount, tenure_months, required_docs, eligibility_info]
    );
    res.status(201).json({ message: 'Loan added successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/loans/:id', async (req, res) => {
  try {
    const [loans] = await db.execute('SELECT * FROM loans WHERE id = ?', [req.params.id]);
    if (loans.length === 0) return res.status(404).json({ message: 'Loan not found.' });
    res.json(loans[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/loans/:id', async (req, res) => {
  const {
    loan_name, description, interest_rate, processing_fee_percent,
    max_amount, min_amount,
    tenure_months, required_docs, eligibility_info
  } = req.body;
  if (!loan_name || !interest_rate || !max_amount || !min_amount || !tenure_months) {
    return res.status(400).json({ message: 'Please fill all required numeric/name fields.' });
  }
  try {
    const [result] = await db.execute(
      `UPDATE loans SET
         loan_name = ?, description = ?, interest_rate = ?, processing_fee_percent = ?,
         max_amount = ?, min_amount = ?, tenure_months = ?,
         required_docs = ?, eligibility_info = ?
       WHERE id = ?`,
      [loan_name, description, interest_rate, processing_fee_percent || 0.00, max_amount, min_amount, tenure_months, required_docs, eligibility_info, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Loan not found.' });
    res.json({ message: 'Loan updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/loans/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM loans WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Loan not found.' });
    res.json({ message: 'Loan deleted successfully.' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// === Application Management Routes (with Search/Filter) ===
router.get('/applications', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT
        la.id, la.amount_required, la.status, la.note, la.created_at,
        u.name as user_name, u.email as user_email,
        l.loan_name
      FROM loan_applications la
      JOIN users u ON la.user_id = u.id
      JOIN loans l ON la.loan_id = l.id
    `;
    const params = []; const conditions = [];
    if (status) { conditions.push("la.status = ?"); params.push(status); }
    if (search) {
      conditions.push("(u.name LIKE ? OR u.email LIKE ? OR l.loan_name LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (conditions.length > 0) { query += " WHERE " + conditions.join(" AND "); }
    query += " ORDER BY la.status = 'pending' DESC, la.created_at DESC";
    const [applications] = await db.execute(query, params);
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/applications/:id', async (req, res) => {
  try {
    const [applications] = await db.execute(
      `SELECT
         la.*, u.name, u.email, u.phone, u.aadhar_encrypted, u.pan_encrypted, l.loan_name
       FROM loan_applications la
       JOIN users u ON la.user_id = u.id
       JOIN loans l ON la.loan_id = l.id
       WHERE la.id = ?`,
      [req.params.id]
    );
    if (applications.length === 0) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    const app = applications[0];
    const fullDetails = {
      ...app,
      aadhar: decrypt(app.aadhar_encrypted), pan: decrypt(app.pan_encrypted),
      account_number: decrypt(app.account_number_encrypted), ifsc_code: decrypt(app.ifsc_code_encrypted),
    };
    delete fullDetails.aadhar_encrypted; delete fullDetails.pan_encrypted;
    delete fullDetails.account_number_encrypted; delete fullDetails.ifsc_code_encrypted;
    res.json(fullDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/applications/:id', async (req, res) => {
  const { status, note } = req.body;
  const { id } = req.params;
  if (!status) return res.status(400).json({ message: 'Status is required.' });
  const validStatuses = ['pending', 'processing', 'accepted-not-disbursed', 'accepted-disbursed', 'rejected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status.' });
  try {
    const [result] = await db.execute(
      "UPDATE loan_applications SET status = ?, note = ? WHERE id = ?",
      [status, note || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Application not found.' });
    res.json({ message: 'Application updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// === Support Ticket Routes for Admin ===
router.get('/tickets', async (req, res) => {
  try {
    const [tickets] = await db.execute(
      `SELECT t.id, t.subject, t.status, t.created_at, u.name as user_name
       FROM support_tickets t
       JOIN users u ON t.user_id = u.id
       ORDER BY t.status = 'open' DESC, t.updated_at DESC`,
    );
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/tickets/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['open', 'closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }
  try {
    await db.execute('UPDATE support_tickets SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Ticket status updated.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// === Settings Management Routes ===
router.get('/settings', async (req, res) => {
  try {
    const [settings] = await db.execute('SELECT * FROM app_settings');
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/settings', async (req, res) => {
  const settings = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const queries = Object.entries(settings).map(([key, value]) => {
      return connection.execute(
        `INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`,
        [key, value, value]
      );
    });
    await Promise.all(queries);
    await connection.commit();
    res.json({ message: 'Settings updated successfully.' });
  } catch (err) {
    await connection.rollback();
    console.error(err.message);
    res.status(500).send('Server Error');
  } finally {
    connection.release();
  }
});

module.exports = router;