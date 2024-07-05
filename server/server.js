const { remote } = require('webdriverio');
const { Client } = require('pg');

// Function to pause execution for given seconds
const sleep = (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

const scrapeLinkedInJob = async () => {
    // Set up WebDriver options
    const options = {
        logLevel: 'info',
        path: '/',
        capabilities: {
            browserName: 'chrome',
        },
        services: ['chromedriver'],
    };

    // Create WebDriver session
    const browser = await remote(options);

    try {
        // Open the website
        await browser.url('https://www.linkedin.com/jobs/view/3916794582/');

        // Get the current URL
        const currentUrl = await browser.getUrl();
        console.log(currentUrl);

        // Locate and find job title
        const jobTitle = await browser.$('#job-search-bar-keywords');
        const jobTitleValue = await jobTitle.getValue();
        console.log(jobTitleValue);

        // Locate and find company name
        const company = await browser.$('.topcard__flavor');
        const companyText = await company.getText();
        console.log(companyText);

        // Locate and find job location
        const location = await browser.$('.topcard__flavor--bullet');
        const locationText = await location.getText();
        console.log(locationText);

        // Connect to PostgreSQL and insert data
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

        await client.connect();

        const query = 'INSERT INTO jobs (job_title, company_name, location, pay_range, url) VALUES ($1, $2, $3, $4, $5)';
        const values = [jobTitleValue, companyText, locationText, "Test pay", currentUrl];

        await client.query(query, values);
        await client.end();

        console.log('Data inserted successfully');

        // Pause the page
        await sleep(300);

    } catch (err) {
        console.error(err);
    } finally {
        await browser.deleteSession();
    }
};

scrapeLinkedInJob();
