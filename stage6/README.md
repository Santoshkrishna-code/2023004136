# Stage 6 - Priority Inbox

This script fetches notifications from the protected API and prints top priority unread notifications.

## Priority Rules

- Placement > Result > Event
- If two notifications have same priority, newer notification wins.

## Efficient Top-N Strategy

The script maintains a fixed-size min-heap of size `N`.

- Time: `O(M log N)` for `M` fetched notifications
- Space: `O(N)`

This is better than sorting all notifications when `M` is large.

## Environment

- `ACCESS_TOKEN` (required)
- `API_BASE_URL` (optional, default: `http://4.224.186.213/evaluation-service`)

## Usage

Top 10 unread notifications:

```bash
ACCESS_TOKEN="your_token" node stage6/priorityInbox.js
```

Top 20 unread notifications:

```bash
ACCESS_TOKEN="your_token" node stage6/priorityInbox.js --top=20
```

Only Placement notifications, top 15:

```bash
ACCESS_TOKEN="your_token" node stage6/priorityInbox.js --top=15 --type=Placement
```

Include read notifications too:

```bash
ACCESS_TOKEN="your_token" node stage6/priorityInbox.js --include-read
```
