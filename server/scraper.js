// scraper.js
const { remote } = require('webdriverio');
const { Client } = require('pg');

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

// Function to extract salary information from text
const extractSalary = (text) => {
    // Regex for various salary formats
    const salaryPatterns = [
        /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*[KkMm]?(?:\s*-\s*\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*[KkMm]?)/, // Matches "$60,000 - $70,000", "$60k - $70k"
        /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*[KkMm]?/, // Matches "$60,000", "$60k", "$60K", "$60m", "$60M"
        /\$\d+(?:[KkMm])/g, // Matches "$60k", "$60K", "$60m", "$60M"
        /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*-\s*\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*[KkMm]?/, // Matches "$60,000 - $70,000", "$60k - $70k"
    ];

    // Locate a match of any salary pattern
    for (let pattern of salaryPatterns) {
        const match = text.match(pattern);
        if (match) {
            return match[0];
        }
    }
    // Handles case with no pay range in web page
    return 'N/A';
};

const scrapeLinkedInJob = async (url) => {
    // Set up WebDriver options
    const options = {
        logLevel: 'info',
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: [
                    '--headless',
                    '--disable-gpu',
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--remote-debugging-port=9222'
                ],
                binary: '/usr/bin/google-chrome'
            }
        }
    };

    // Create WebDriver session
    const browser = await remote(options);

    try {
        // Open the website
        await browser.url(url);

        // Locate and find job title
        const jobTitle = await browser.$('#job-search-bar-keywords');
        const jobTitleValue = await jobTitle.getValue() || 'N/A';
        console.log("Job Title: ", jobTitleValue);

        // Locate and find company name
        const company = await browser.$('.topcard__flavor');
        const companyText = await company.getText() || 'N/A';
        console.log("Company Name: ", companyText);

        // Locate and find job location
        const location = await browser.$('.topcard__flavor--bullet');
        const locationText = await location.getText() || 'N/A';
        console.log("Job Location: ", locationText);

        // Fetch the page content
        const pageContent = await browser.getPageSource();

        // Extract salary information
        const salaryInfo = extractSalary(pageContent);
        console.log("Salary Info: ", salaryInfo);

        // Get the current URL
        const currentUrl = await browser.getUrl();
        console.log("Current URL: ", currentUrl);

        // Test user_id
        const user_id = -1;

        // Prepare query statement
        const query = 'INSERT INTO jobs (job_title, company_name, location, url, pay_range, user) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        // Bind the values for query
        const values = [jobTitleValue, companyText, locationText, currentUrl, salaryInfo, user_id];

        // Insert the data
        const result = await client.query(query, values);

        console.log('Data inserted successfully');

        return result.rows[0];

    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await browser.deleteSession();
    }
};

// Export scrapeLinkedInJob for use in other files
module.exports = { scrapeLinkedInJob };




// TESTING ENDPOINTS

// Scrape url and create row
// curl -X POST http://localhost:3000/api/scrape -H "Content-Type: application/json" -d "{\"url\": \"https://www.linkedin.com/jobs/view/sr-engineering-manager-embedded-software-at-rivian-3837566567\"}"
// curl -X POST http://54.221.28.111:3000/api/scrape -H "Content-Type: application/json" -d "{\"url\": \"https://www.linkedin.com/jobs/view/sr-engineering-manager-embedded-software-at-rivian-3837566567\"}"

// Read row at id: 3
// curl -X GET http://localhost:3000/api/jobs/3

// Update row at id: 3
// curl -X PUT http://localhost:3000/api/jobs/14 -H "Content-Type: application/json" -d "{\"job_title\": \"Cashier\", \"company_name\": \"Tech Company\", \"location\": \"New York, NY\", \"pay_range\": \"$120k\", \"url\": \"http://example.com\"}"

// Create row
// curl -X POST http://localhost:3000/api/jobs -H "Content-Type: application/json" -d "{\"job_title\": \"Software Engineer\", \"company_name\": \"Tech Company\", \"location\": \"New York, NY\", \"pay_range\": \"$100k\", \"url\": \"http://example.com\"}"


