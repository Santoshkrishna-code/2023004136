# Logging Middleware

## Install

```bash
npm install
```

## Logger API

```js
const { Log } = require("./src/logger");

await Log(
	"backend",
	"info",
	"service",
	"sample message",
	process.env.ACCESS_TOKEN
);
```

## Quick Test

```bash
ACCESS_TOKEN="your_token_here" npm run test:logger
```

