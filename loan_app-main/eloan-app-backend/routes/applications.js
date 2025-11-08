// routes/applications.js
const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/authMiddleware');
const { encrypt } = require('../config/cryptoUtils'); // Import encrypt

const router = express.Router();
// const router = express.Router();

// @route   GET /api/applications/my-applications
// @desc    Get all applications for the logged-in user (New)
// @access  Private
router.get('/my-applications', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const [applications] = await db.execute(
      `SELECT 
         l.loan_name,
         la.id, la.amount_required, la.status, la.note, la.created_at, la.updated_at
       FROM loan_applications la
       JOIN loans l ON la.loan_id = l.id
       WHERE la.user_id = ?
       ORDER BY la.created_at DESC`,
      [userId]
    );
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/applications/apply
// @desc    Submit a new loan application
// @access  Private
router.post('/apply', auth, async (req, res) => {
  const {
    loan_id,
    amount_required,
    account_holder_name,
    account_number,
    ifsc_code,
  } = req.body;
  
  const user_id = req.user.id;

  // Validation
  if (!loan_id || !amount_required || !account_holder_name || !account_number || !ifsc_code) {
    return res.status(400).json({ message: 'Please fill all fields.' });
  }

  try {
    // Encrypt the bank details
    const account_number_encrypted = encrypt(account_number);
    const ifsc_code_encrypted = encrypt(ifsc_code);

    // Save to database
    await db.execute(
      `INSERT INTO loan_applications 
         (user_id, loan_id, amount_required, account_holder_name, account_number_encrypted, ifsc_code_encrypted)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        loan_id,
        amount_required,
        account_holder_name,
        account_number_encrypted,
        ifsc_code_encrypted,
      ]
    );

    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/my-applications/:id/schedule', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // 1. Fetch the application and associated loan details, ensure user owns it
    const [apps] = await db.execute(
      `SELECT la.amount_required, la.status, l.interest_rate, l.tenure_months
       FROM loan_applications la
       JOIN loans l ON la.loan_id = l.id
       WHERE la.id = ? AND la.user_id = ?`,
      [id, userId]
    );

    if (apps.length === 0) {
      return res.status(404).json({ message: 'Application not found or access denied.' });
    }
    const app = apps[0];

    // 2. Only calculate for disbursed loans
    if (app.status !== 'accepted-disbursed') {
      return res.status(400).json({ message: 'Repayment schedule is only available for disbursed loans.' });
    }

    // 3. Calculate EMI
    const principal = parseFloat(app.amount_required);
    const annualRate = parseFloat(app.interest_rate);
    const tenureMonths = parseInt(app.tenure_months);
    const monthlyRate = annualRate / (12 * 100);

    if (principal <= 0 || monthlyRate <= 0 || tenureMonths <= 0) {
       return res.status(400).json({ message: 'Invalid loan parameters for calculation.' });
    }
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;

    // 4. Generate Amortization Schedule
    let schedule = [];
    let balance = principal;

    for (let month = 1; month <= tenureMonths; month++) {
      let interestPayment = balance * monthlyRate;
      let principalPayment = emi - interestPayment;
      balance -= principalPayment;

      // Adjust final payment slightly due to rounding
      if (month === tenureMonths && balance < 0.01 && balance > -0.01) {
        principalPayment += balance;
        balance = 0;
      }

      schedule.push({
        month: month,
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        totalPayment: emi.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    res.json({
      emi: emi.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      schedule: schedule,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;