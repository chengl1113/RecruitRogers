const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./api');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use('/api', apiRoutes);

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
