const { Log } = require("./logger");

async function main() {
  const token = process.env.ACCESS_TOKEN;

  if (!token) {
    throw new Error("ACCESS_TOKEN env var is required.");
  }

  const result = await Log(
    "backend",
    "info",
    "service",
    "logger smoke test",
    token
  );

  console.log(result);
}

main().catch((err) => {
  console.error("Logger test failed:", err.response?.data || err.message);
  process.exit(1);
});
