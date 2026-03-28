const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me";
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const STORE_FILE = path.join(DATA_DIR, "quiz-store.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

ensureStore();

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (requestUrl.pathname.startsWith("/api/")) {
      await handleApi(req, res, requestUrl);
      return;
    }

    serveStatic(requestUrl.pathname, res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Internal server error." });
  }
});

server.listen(PORT, () => {
  console.log(`Redline IQ server running on http://localhost:${PORT}`);
});

async function handleApi(req, res, requestUrl) {
  if ((req.method === "GET" || req.method === "POST") && requestUrl.pathname === "/api/bootstrap") {
    const payload = req.method === "POST"
      ? JSON.parse((await readBody(req)) || "{}")
      : { deviceId: requestUrl.searchParams.get("deviceId") || "" };
    const store = readStore();
    const leaderboard = buildLeaderboard(store);
    const attempt = findMatchingAttempt(store, payload, req);
    sendJson(res, 200, {
      sessionId: store.sessionId,
      leaderboard,
      attempt
    });
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/progress") {
    const body = await readBody(req);
    const payload = JSON.parse(body || "{}");

    if (!payload.deviceId || !payload.playerName) {
      sendJson(res, 400, { error: "deviceId and playerName are required." });
      return;
    }

    const store = readStore();
    const now = new Date().toISOString();
    const matchedRecord = findMatchingAttempt(store, payload, req);
    const attemptId = matchedRecord?.deviceId || String(payload.attemptId || payload.deviceId || createAttemptId());
    const browserId = String(payload.browserId || payload.deviceId || "");
    const matchHints = buildMatchHints(payload.deviceProfile);
    const record = {
      sessionId: store.sessionId,
      deviceId: attemptId,
      playerName: String(payload.playerName).trim().slice(0, 30),
      totalScore: Number(payload.totalScore || 0),
      sectionScores: payload.sectionScores && typeof payload.sectionScores === "object" ? payload.sectionScores : {},
      completedSections: Array.isArray(payload.completedSections) ? payload.completedSections : [],
      completedAll: Boolean(payload.completedAll),
      inProgressSectionIndex: Number.isInteger(payload.inProgressSectionIndex) ? payload.inProgressSectionIndex : null,
      inProgressQuestionIndex: Number.isInteger(payload.inProgressQuestionIndex) ? payload.inProgressQuestionIndex : null,
      startedAt: matchedRecord?.startedAt || payload.startedAt || now,
      updatedAt: now,
      browserIds: uniqueList([...(matchedRecord?.browserIds || []), browserId].filter(Boolean)),
      deviceStableKey: String(payload.deviceProfile?.stableKey || matchedRecord?.deviceStableKey || ""),
      matchHints,
      lastSeenIp: extractClientIp(req)
    };

    store.attempts[record.deviceId] = record;
    writeStore(store);

    sendJson(res, 200, {
      ok: true,
      sessionId: store.sessionId,
      attempt: record,
      leaderboard: buildLeaderboard(store)
    });
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/admin/reset") {
    const body = await readBody(req);
    const payload = JSON.parse(body || "{}");
    if (String(payload.password || "") !== ADMIN_PASSWORD) {
      sendJson(res, 403, { error: "Invalid admin password." });
      return;
    }

    const store = {
      sessionId: createSessionId(),
      attempts: {}
    };
    writeStore(store);

    sendJson(res, 200, {
      ok: true,
      sessionId: store.sessionId
    });
    return;
  }

  sendJson(res, 404, { error: "Not found." });
}

function serveStatic(requestPath, res) {
  if (requestPath === "/admin" || requestPath === "/admin/") {
    sendAdminPage(res);
    return;
  }

  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const resolvedPath = path.normalize(path.join(ROOT, safePath));

  if (!resolvedPath.startsWith(ROOT)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(resolvedPath, (error, data) => {
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }
    const ext = path.extname(resolvedPath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=300"
    });
    res.end(data);
  });
}

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_FILE)) {
    writeStore({
      sessionId: createSessionId(),
      attempts: {}
    });
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
}

function writeStore(store) {
  const tempFile = `${STORE_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(store, null, 2));
  fs.renameSync(tempFile, STORE_FILE);
}

function buildLeaderboard(store) {
  return Object.values(store.attempts).sort((a, b) => {
    if (Number(b.totalScore || 0) !== Number(a.totalScore || 0)) {
      return Number(b.totalScore || 0) - Number(a.totalScore || 0);
    }
    return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
  }).slice(0, 100);
}

function findMatchingAttempt(store, payload, req) {
  const attempts = Object.values(store.attempts || {});
  if (!attempts.length) return null;

  const explicitIds = uniqueList([
    payload?.attemptId,
    payload?.deviceId,
    payload?.browserId
  ].filter(Boolean).map(String));

  for (const id of explicitIds) {
    if (store.attempts[id]) return store.attempts[id];
  }

  const stableKey = String(payload?.deviceProfile?.stableKey || "");
  if (stableKey) {
    const exactStableMatch = attempts.find((record) => record.deviceStableKey && record.deviceStableKey === stableKey);
    if (exactStableMatch) return exactStableMatch;
  }

  const candidateHints = buildMatchHints(payload?.deviceProfile);
  const clientIp = extractClientIp(req);
  let best = null;
  let bestScore = 0;

  for (const record of attempts) {
    const { score, anchors } = scoreAttemptMatch(record, candidateHints, clientIp);
    if (score > bestScore || (score === bestScore && anchors > (best?.anchors || 0))) {
      best = { record, anchors };
      bestScore = score;
    }
  }

  if (best && bestScore >= 70 && best.anchors >= 3) {
    return best.record;
  }
  return null;
}

function buildMatchHints(profile = {}) {
  return {
    platform: String(profile.platform || ""),
    mobile: Boolean(profile.mobile),
    screen: String(profile.screen || ""),
    colorDepth: Number(profile.colorDepth || 0),
    pixelRatio: Number(profile.pixelRatio || 0),
    timezone: String(profile.timezone || ""),
    language: String(Array.isArray(profile.languages) ? profile.languages[0] || "" : profile.language || ""),
    maxTouchPoints: Number(profile.maxTouchPoints || 0),
    hardwareConcurrency: Number(profile.hardwareConcurrency || 0),
    deviceMemory: Number(profile.deviceMemory || 0),
    webglVendor: String(profile.webglVendor || ""),
    webglRenderer: String(profile.webglRenderer || ""),
    canvasHash: String(profile.canvasHash || "")
  };
}

function scoreAttemptMatch(record, candidate, clientIp) {
  const hints = record.matchHints || {};
  let score = 0;
  let anchors = 0;

  if (hints.platform && candidate.platform && hints.platform === candidate.platform) {
    score += 12;
    anchors += 1;
  }
  if (typeof hints.mobile === "boolean" && typeof candidate.mobile === "boolean" && hints.mobile === candidate.mobile) {
    score += 8;
  }
  if (hints.screen && candidate.screen && hints.screen === candidate.screen) {
    score += 18;
    anchors += 1;
  }
  if (hints.colorDepth && candidate.colorDepth && hints.colorDepth === candidate.colorDepth) score += 4;
  if (hints.pixelRatio && candidate.pixelRatio && Math.abs(hints.pixelRatio - candidate.pixelRatio) < 0.01) score += 6;
  if (hints.timezone && candidate.timezone && hints.timezone === candidate.timezone) score += 4;
  if (hints.language && candidate.language && hints.language === candidate.language) score += 4;
  if (hints.maxTouchPoints === candidate.maxTouchPoints) {
    score += 8;
    anchors += 1;
  }
  if (hints.hardwareConcurrency && candidate.hardwareConcurrency && hints.hardwareConcurrency === candidate.hardwareConcurrency) score += 6;
  if (hints.deviceMemory && candidate.deviceMemory && hints.deviceMemory === candidate.deviceMemory) score += 5;
  if (hints.webglVendor && candidate.webglVendor && hints.webglVendor === candidate.webglVendor) score += 8;
  if (hints.webglRenderer && candidate.webglRenderer && hints.webglRenderer === candidate.webglRenderer) {
    score += 18;
    anchors += 2;
  }
  if (hints.canvasHash && candidate.canvasHash && hints.canvasHash === candidate.canvasHash) {
    score += 22;
    anchors += 2;
  }
  if (record.lastSeenIp && clientIp && record.lastSeenIp === clientIp) {
    score += 10;
    anchors += 1;
  }

  return { score, anchors };
}

function createSessionId() {
  return crypto.randomBytes(12).toString("hex");
}

function createAttemptId() {
  return `attempt-${crypto.randomBytes(8).toString("hex")}`;
}

function extractClientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const raw = forwarded || req.socket?.remoteAddress || "";
  return raw.replace(/^::ffff:/, "");
}

function uniqueList(values) {
  return [...new Set(values)];
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload too large."));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(text);
}

function sendAdminPage(res) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redline IQ Admin</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: linear-gradient(180deg, #07101c 0%, #091324 60%, #050b15 100%);
      color: #f6f8fc;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      padding: 24px;
      box-sizing: border-box;
    }
    .panel {
      width: min(100%, 420px);
      background: linear-gradient(180deg, rgba(16, 32, 57, 0.98), rgba(10, 20, 35, 0.98));
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 22px;
      padding: 22px;
      box-shadow: 0 18px 36px rgba(0,0,0,0.28);
    }
    h1 { margin: 0 0 10px; font-size: 1.5rem; }
    p { margin: 0 0 14px; color: #9eafc9; line-height: 1.5; }
    input, button {
      width: 100%;
      box-sizing: border-box;
      border-radius: 14px;
      font-size: 1rem;
      padding: 14px;
      border: 1px solid rgba(255,255,255,0.12);
    }
    input {
      background: rgba(4, 10, 18, 0.85);
      color: #f6f8fc;
      margin-bottom: 12px;
    }
    button {
      border: 0;
      cursor: pointer;
      color: white;
      font-weight: 800;
      background: linear-gradient(180deg, #ff4a63, #e1193c);
    }
    .note { margin-top: 12px; font-size: 0.92rem; }
    .status { margin-top: 14px; min-height: 22px; }
  </style>
</head>
<body>
  <div class="panel">
    <h1>Admin Reset</h1>
    <p>Use this private server page to clear the shared leaderboard and unlock the current live session for everyone.</p>
    <input id="password" type="password" placeholder="Admin password">
    <button id="resetButton" type="button">Clear Shared Server Data</button>
    <p class="note">Open this page directly at <code>/admin</code>. It is no longer visible in the public quiz UI.</p>
    <div class="status" id="status"></div>
  </div>
  <script>
    const passwordEl = document.getElementById("password");
    const buttonEl = document.getElementById("resetButton");
    const statusEl = document.getElementById("status");

    async function resetServer() {
      const password = passwordEl.value.trim();
      if (!password) {
        statusEl.textContent = "Enter the admin password first.";
        return;
      }
      buttonEl.disabled = true;
      statusEl.textContent = "Clearing shared data...";
      try {
        const response = await fetch("/api/admin/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Reset failed.");
        passwordEl.value = "";
        statusEl.textContent = "Shared leaderboard and progress were cleared successfully.";
      } catch (error) {
        statusEl.textContent = error.message || "Reset failed.";
      } finally {
        buttonEl.disabled = false;
      }
    }

    buttonEl.addEventListener("click", resetServer);
    passwordEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") resetServer();
    });
  </script>
</body>
</html>`;

  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(html);
}
