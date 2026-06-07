const API_BASE_URL = process.env.API_BASE_URL || "http://4.224.186.213/evaluation-service";

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1
};

class MinHeap {
  constructor(compare) {
    this.compare = compare;
    this.data = [];
  }

  size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(value) {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) return undefined;
    const root = this.data[0];
    const tail = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = tail;
      this.bubbleDown(0);
    }
    return root;
  }

  replaceTop(value) {
    if (this.data.length === 0) {
      this.push(value);
      return;
    }
    this.data[0] = value;
    this.bubbleDown(0);
  }

  toArray() {
    return [...this.data];
  }

  bubbleUp(index) {
    let i = index;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.data[i], this.data[parent]) >= 0) break;
      [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
      i = parent;
    }
  }

  bubbleDown(index) {
    let i = index;
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const left = i * 2 + 1;
      const right = i * 2 + 2;

      if (left < n && this.compare(this.data[left], this.data[smallest]) < 0) {
        smallest = left;
      }
      if (right < n && this.compare(this.data[right], this.data[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === i) break;
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }
}

function normalizeNotification(item) {
  return {
    id: item.id || item.ID || "",
    type: item.type || item.Type || "Event",
    message: item.message || item.Message || "",
    isRead: Boolean(item.isRead || item.IsRead),
    createdAt: item.createdAt || item.Timestamp || new Date(0).toISOString()
  };
}

function getWeight(type) {
  return TYPE_WEIGHT[type] || 0;
}

function computeRankKey(notification) {
  const weight = getWeight(notification.type);
  const timestamp = new Date(notification.createdAt).getTime() || 0;
  return { weight, timestamp };
}

function compareRankAsc(a, b) {
  if (a.rank.weight !== b.rank.weight) {
    return a.rank.weight - b.rank.weight;
  }
  return a.rank.timestamp - b.rank.timestamp;
}

function compareRankDesc(a, b) {
  if (a.rank.weight !== b.rank.weight) {
    return b.rank.weight - a.rank.weight;
  }
  return b.rank.timestamp - a.rank.timestamp;
}

function buildPriorityInbox(notifications, topN = 10) {
  if (!Array.isArray(notifications)) {
    throw new TypeError("notifications must be an array");
  }
  if (topN <= 0) return [];

  const heap = new MinHeap(compareRankAsc);

  for (const raw of notifications) {
    const item = normalizeNotification(raw);
    const scored = { ...item, rank: computeRankKey(item) };

    if (heap.size() < topN) {
      heap.push(scored);
      continue;
    }

    const weakest = heap.peek();
    if (compareRankAsc(scored, weakest) > 0) {
      heap.replaceTop(scored);
    }
  }

  return heap
    .toArray()
    .sort(compareRankDesc)
    .map(({ rank, ...rest }) => rest);
}

async function fetchNotificationsPage({ token, page = 1, limit = 100, notificationType }) {
  if (!token) {
    throw new Error("Authorization token is required.");
  }

  const url = new URL(`${API_BASE_URL}/notifications`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (notificationType) {
    url.searchParams.set("notification_type", notificationType);
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch notifications: ${response.status} ${body}`);
  }

  const data = await response.json();
  return data.notifications || [];
}

async function fetchAllNotifications({ token, pageSize = 100, notificationType, maxPages = 50 }) {
  const all = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const batch = await fetchNotificationsPage({
      token,
      page,
      limit: pageSize,
      notificationType
    });

    if (!batch.length) break;

    all.push(...batch);
    if (batch.length < pageSize) break;
  }

  return all;
}

function parseCliArgs(argv) {
  const args = {
    topN: 10,
    pageSize: 10,
    notificationType: undefined,
    includeRead: false
  };

  for (const arg of argv) {
    if (arg.startsWith("--top=")) {
      args.topN = Number(arg.slice("--top=".length));
    } else if (arg.startsWith("--page-size=")) {
      args.pageSize = Number(arg.slice("--page-size=".length));
    } else if (arg.startsWith("--type=")) {
      args.notificationType = arg.slice("--type=".length);
    } else if (arg === "--include-read") {
      args.includeRead = true;
    }
  }

  if (!Number.isFinite(args.topN) || args.topN < 1) args.topN = 10;
  if (!Number.isFinite(args.pageSize) || args.pageSize < 1) args.pageSize = 10;
  if (args.pageSize > 10) args.pageSize = 10;
  return args;
}

async function main() {
  const token = process.env.ACCESS_TOKEN;
  const { topN, pageSize, notificationType, includeRead } = parseCliArgs(process.argv.slice(2));

  const notifications = await fetchAllNotifications({
    token,
    pageSize,
    notificationType
  });

  const unreadOrAll = includeRead
    ? notifications
    : notifications.filter((n) => !normalizeNotification(n).isRead);

  const topItems = buildPriorityInbox(unreadOrAll, topN);
  console.log(JSON.stringify({ topN, count: topItems.length, notifications: topItems }, null, 2));
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = {
  fetchNotificationsPage,
  fetchAllNotifications,
  buildPriorityInbox,
  normalizeNotification,
  computeRankKey,
  parseCliArgs,
  TYPE_WEIGHT
};
