const https = require("https");

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https
  .get(url, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const json = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
      } catch (e) {
        console.error("Error parsing JSON:", e);
        console.log("Raw data:", data);
      }
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });
