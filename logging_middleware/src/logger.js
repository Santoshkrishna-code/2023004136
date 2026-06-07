const axios = require("axios");

async function Log(stack, level, pkg, message, token) {
  const API_BASE_URL = process.env.API_BASE_URL || "http://4.224.186.213/evaluation-service";
  
  const response = await axios.post(
    `${API_BASE_URL}/logs`,
    {
      stack,
      level,
      package: pkg,
      message
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
  
  return response.data;
}

module.exports = { Log };
