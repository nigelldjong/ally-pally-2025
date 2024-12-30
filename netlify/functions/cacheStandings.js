import fetch from "node-fetch";

let cachedData = null; // To store cached data in memory
let lastFetchedTime = 0; // To store the last fetch timestamp

const CACHE_DURATION = 10 * 60 * 1000; // Default: 10 minutes in milliseconds
const API_URL = "https://script.google.com/macros/s/AKfycbznbDUO_G5buCPueuah3vQViqdOfjXqHhOyOdQZDFiTPgKm0MOEzOBpGe1i8yCukdxI/exec";

export async function handler() {
  try {
    const now = Date.now();

    // If cache exists and is still valid, serve it
    if (cachedData && now - lastFetchedTime < CACHE_DURATION) {
      return {
        statusCode: 200,
        body: JSON.stringify(cachedData),
      };
    }

    // Fetch fresh data from the API
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch standings from API: ${response.statusText}`);
    }

    const newData = await response.json();

    // Check if the data has changed
    if (JSON.stringify(newData) !== JSON.stringify(cachedData)) {
      cachedData = newData; // Update the cache
      lastFetchedTime = now; // Update the last fetch timestamp
    }

    return {
      statusCode: 200,
      body: JSON.stringify(cachedData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch standings",
        details: error.message,
      }),
    };
  }
}
