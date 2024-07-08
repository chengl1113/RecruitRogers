const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./api');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use('/api', apiRoutes); // Changed './api' to '/api'

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
