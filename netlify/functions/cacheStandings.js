const fetch = require("node-fetch");

let cachedData = null;
let lastFetchTime = 0;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

exports.handler = async () => {
  const currentTime = Date.now();

  if (!cachedData || currentTime - lastFetchTime > CACHE_DURATION) {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbznbDUO_G5buCPueuah3vQViqdOfjXqHhOyOdQZDFiTPgKm0MOEzOBpGe1i8yCukdxI/exec"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      cachedData = await response.json();
      lastFetchTime = currentTime;
    } catch (error) {
      return {
        statusCode: 500,
        body: `Error fetching data: ${error.message}`,
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(cachedData),
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `max-age=${CACHE_DURATION / 1000}`,
    },
  };
};
