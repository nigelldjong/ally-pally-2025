import fetch from 'node-fetch';

export async function handler(event, context) {
    try {
        // Fetch the standings data
        const response = await fetch('https://script.google.com/macros/s/AKfycbznbDUO_G5buCPueuah3vQViqdOfjXqHhOyOdQZDFiTPgKm0MOEzOBpGe1i8yCukdxI/exec');
        const data = await response.json();

        // Return the data as JSON
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error fetching standings:', error);

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch standings data' }),
        };
    }
}
