CREATE DATABASE IF NOT EXISTS eloan_db;
USE eloan_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    -- Store encrypted Aadhar and PAN. TEXT is better than VARCHAR
    -- in case the encrypted string is long.
    aadhar_encrypted TEXT NOT NULL,
    pan_encrypted TEXT NOT NULL,
    occupation VARCHAR(255),
    organization VARCHAR(255),
    -- bcrypt hash is always 60 characters
    password_hash VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' AFTER password_hash;

USE eloan_db;

CREATE TABLE IF NOT EXISTS loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_name VARCHAR(255) NOT NULL,
    description TEXT,
    interest_rate DECIMAL(5, 2) NOT NULL, -- e.g., 12.50%
    max_amount DECIMAL(15, 2) NOT NULL, -- e.g., 1,000,000.00
    tenure_months INT NOT NULL, -- e.g., 60 months
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loan_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    loan_id INT NOT NULL,
    amount_required DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    
    -- Encrypted Bank Details
    account_holder_name VARCHAR(255) NOT NULL,
    account_number_encrypted TEXT NOT NULL,
    ifsc_code_encrypted TEXT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (loan_id) REFERENCES loans(id)
);

ALTER TABLE loan_applications
ADD COLUMN note TEXT NULL AFTER status,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

CREATE TABLE IF NOT EXISTS support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ticket_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 1. Add a 'status' column to the users table for blocking
ALTER TABLE users
ADD COLUMN status ENUM('active', 'blocked') NOT NULL DEFAULT 'active' AFTER role;

-- 2. Create a new table for application settings
CREATE TABLE IF NOT EXISTS app_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NULL
);

-- 3. Add some default settings
INSERT INTO app_settings (setting_key, setting_value) 
VALUES 
    ('appName', 'e-Loan Pro'),
    ('contactEmail', 'support@eloan.com'),
    ('maintenanceMode', 'false')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

ALTER TABLE loans
ADD COLUMN min_amount DECIMAL(15, 2) NULL AFTER max_amount,
ADD COLUMN processing_fee_percent DECIMAL(5, 2) NOT NULL DEFAULT 0.00 AFTER interest_rate,
ADD COLUMN required_docs TEXT NULL COMMENT 'Comma-separated list of required documents' AFTER tenure_months,
ADD COLUMN eligibility_info TEXT NULL COMMENT 'Text describing eligibility criteria' AFTER required_docs;

-- Optional: Add default values or constraints if needed, e.g., make min_amount required
-- ALTER TABLE loans MODIFY COLUMN min_amount DECIMAL(15, 2) NOT NULL DEFAULT 1000.00;