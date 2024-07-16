const express = require('express');
const { Client } = require('pg');
const { scrapeLinkedInJob } = require('./scraper'); // Import scrape function from scraper.js

const router = express.Router();

// PostgreSQL Client Setup
const client = new Client({
    user: 'postgres',
    host: 'my-postgres-db.cja62uuuq2nh.us-east-1.rds.amazonaws.com',
    database: 'job_data',
    password: 'Mikessmurf123',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

// CRUD Operations

// Scrape and Create Job
router.post('/scrape', async (req, res) => {
    const { url } = req.body;
    try {
        const jobData = await scrapeLinkedInJob(url);
        res.status(201).json(jobData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create Job
router.post('/jobs', async (req, res) => {
    const { job_title, company_name, location, pay_range, url, userId } = req.body;
    try {
        const query = 'INSERT INTO jobs (job_title, company_name, location, pay_range, url, user) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [job_title, company_name, location, pay_range, url, userId];
        const result = await client.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Read All
router.get('/jobs', async (req, res) => {
    try {
        const result = await client.query('SELECT jobs.*, account.username FROM jobs JOIN account ON jobs.user = account.id');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Read One
router.get('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM jobs WHERE id = $1';
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Job Not Found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update
router.put('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    const { job_title, company_name, location, pay_range, url, userId } = req.body;
    try {
        const query = 'UPDATE jobs SET job_title = $1, company_name = $2, location = $3, pay_range = $4, url = $5, user = $6 WHERE id = $7 RETURNING *';
        const values = [job_title, company_name, location, pay_range, url, userId, id];
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Job Not Found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete
router.delete('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM jobs WHERE id = $1 RETURNING *';
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Job Not Found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create Account
router.post('/accounts', async (req, res) => {
    const { username, password } = req.body;
    try {
        const query = 'INSERT INTO account (username, password) VALUES ($1, $2) RETURNING *';
        const values = [username, password];
        const result = await client.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Read All Accounts
router.get('/accounts', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM account');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Read One Account
router.get('/accounts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM account WHERE id = $1';
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Account Not Found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Account
router.put('/accounts/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        const query = 'UPDATE account SET username = $1, password = $2 WHERE id = $3 RETURNING *';
        const values = [username, password, id];
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Account Not Found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete Account
router.delete('/accounts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM account WHERE id = $1 RETURNING *';
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Account Not Found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
