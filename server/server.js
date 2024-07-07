const { remote } = require('webdriverio');
const { Client } = require('pg');

// Function to pause execution for given seconds
const sleep = (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

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
        // Test 1: Simple with no pay
        await browser.url('https://www.linkedin.com/jobs/view/3916794582/');
        // Test 2: Pay range $61K - $71K
        // await browser.url('https://www.linkedin.com/jobs/view/junior-react-developer-at-team-remotely-inc-3968559814?refId=%2BWZyDvjU1qa%2FLs5Wo%2FUL4g%3D%3D&trackingId=2vbRipoJj47m23q0mp9L6w%3D%3D&trk=public_jobs_similar-jobs');
        // Test 3: Compensation range $125K - $167K
        // await browser.url('https://www.linkedin.com/jobs/view/software-engineer-at-fieldguide-3961092714?refId=LkKXoZr8AxIsfdGfGZg%2B4w%3D%3D&trackingId=5OLHkwmluMFMxxGGkRZ%2Fog%3D%3D&trk=public_jobs_similar-jobs');
        // Test 4: No pay range with 401k mention
        // await browser.url('https://www.linkedin.com/jobs/view/junior-software-engineer-at-first-advantage-3938304027?refId=rwfEnkBIgaBrOaNfMK4Ghw%3D%3D&trackingId=Mku2H0vsgk8oX4Sj9R9g8Q%3D%3D&trk=public_jobs_similar-jobs');

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

        // Fetch the page content
        const pageContent = await browser.getPageSource();

        // Extract salary information
        const salaryInfo = extractSalary(pageContent);
        console.log("Salary Info: ", salaryInfo);

        // Get the current URL
        const currentUrl = await browser.getUrl();
        console.log(currentUrl);

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

        // Prepare query statement
        const query = 'INSERT INTO jobs (job_title, company_name, location, pay_range, url) VALUES ($1, $2, $3, $4, $5)';
        // Bind the values for query
        const values = [jobTitleValue, companyText, locationText, salaryInfo, currentUrl];

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
