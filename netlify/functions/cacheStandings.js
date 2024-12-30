const fetch = require('node-fetch');

let cachedData = null;
let cacheExpiry = 0;

exports.handler = async () => {
    const currentTime = Date.now();

    // Check if cached data is still valid
    if (cachedData && currentTime < cacheExpiry) {
        console.log('Serving cached data...');
        return {
            statusCode: 200,
            body: JSON.stringify(cachedData),
        };
    }

    // Fetch fresh data from the original API
    try {
        console.log('Fetching fresh data from the original API...');
        const response = await fetch('https://script.google.com/macros/s/AKfycbznbDUO_G5buCPueuah3vQViqdOfjXqHhOyOdQZDFiTPgKm0MOEzOBpGe1i8yCukdxI/exec');

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Cache the fetched data
        cachedData = data;
        cacheExpiry = currentTime + 10 * 60 * 1000; // Cache valid for 10 minutes
        console.log('Data fetched and cached successfully.');

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error fetching standings:', error.message);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to fetch standings',
                details: error.message,
            }),
        };
    }
};
