const fetch = require('node-fetch');

let cachedData = null; // Variable to store cached data
let cacheExpiry = 0;   // Timestamp for when the cache expires

exports.handler = async () => {
    const currentTime = Date.now();

    // Check if cached data is available and still valid
    if (cachedData && currentTime < cacheExpiry) {
        return {
            statusCode: 200,
            body: JSON.stringify(cachedData),
        };
    }

    // If no valid cache, fetch fresh data
    try {
        const response = await fetch('https://script.googleusercontent.com/macros/...'); // Original API URL
        const data = await response.json();

        // Update the cache
        cachedData = data;
        cacheExpiry = currentTime + 10 * 60 * 1000; // Cache valid for 10 minutes

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error fetching standings:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch standings' }),
        };
    }
};
