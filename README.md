# 2023004136 Evaluation Workspace

This workspace is organized for Stages 1 to 7.

## Folder Structure

- `logging_middleware/` - Stage 1 logging package
- `notification_system_design.md` - Stages 1 to 6 design/algorithm answers
- `stage6/priorityInbox.js` - Stage 6 priority algorithm
- `notification_app_be/` - Custom Express backend running with MongoDB
- `notification_app_fe/` - Stage 7 React frontend

## One-by-One Execution Plan

1. **Verify Logger Package**
   - `cd logging_middleware`
   - `npm install`
   - `node -e "const { Log } = require('./src/logger'); console.log(typeof Log)"`
2. **Start Backend & Database**
   - Ensure local MongoDB is running (`brew services start mongodb-community`)
   - `cd ../notification_app_be`
   - `npm install`
   - `npm run seed` (creates student 2023004136 and seeds notifications)
   - `npm start` (starts the backend server on port 5000)
3. **Run Frontend**
   - `cd ../notification_app_fe`
   - `npm install`
   - `npm start` (runs the React dev server on port 3000)
4. **Review Design Answers**
   - Open `notification_system_design.md`
5. **Test Stage 6 Algorithm**
   - `cd ..`
   - `ACCESS_TOKEN="mock_token" API_BASE_URL="http://localhost:5000/evaluation-service" node stage6/priorityInbox.js --top=10`

## Environment Variables

For Stage 6 script:
- `ACCESS_TOKEN`
- `API_BASE_URL` (Set to `http://localhost:5000/evaluation-service` for local database verification)

For Stage 7 frontend (`notification_app_fe/.env`):
- `REACT_APP_ACCESS_TOKEN`
- `REACT_APP_API_BASE_URL=http://localhost:5000/evaluation-service`

## Security Note

Do not commit live `access_token`, `clientSecret`, or `accessCode` values to git.

