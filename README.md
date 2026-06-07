# 2023004136 Evaluation Workspace

This workspace is organized for Stages 1 to 7.

## Folder Structure

- `logging_middleware/` - Stage 1 logging package
- `notification_system_design.md` - Stages 1 to 5 design answers
- `stage6/priorityInbox.js` - Stage 6 priority algorithm
- `notification_app_fe/` - Stage 7 frontend

## One-by-One Execution Plan

1. Verify logger package
   - `cd logging_middleware`
   - `node -e "const { Log } = require('./src/logger'); console.log(typeof Log)"`
2. Run frontend
   - `cd ../notification_app_fe`
   - `npm start`
3. Review design answers
   - Open `notification_system_design.md`
4. Test stage 6 algorithm quickly
   - `cd ..`
   - `ACCESS_TOKEN="your_token" node stage6/priorityInbox.js --top=10`
   - Optional: `ACCESS_TOKEN="your_token" node stage6/priorityInbox.js --top=20 --type=Placement`

## Environment Variables

For Stage 6 script:

- `ACCESS_TOKEN`
- `API_BASE_URL` (optional, defaults to `http://4.224.186.213/evaluation-service`)

For Stage 7 frontend (`notification_app_fe/.env`):

- `REACT_APP_ACCESS_TOKEN`
- `REACT_APP_API_BASE_URL=http://4.224.186.213/evaluation-service`

Example Stage 6 run:

```bash
ACCESS_TOKEN="your_token" node stage6/priorityInbox.js
```

## Security Note

Do not commit live `access_token`, `clientSecret`, or `accessCode` values to git.
