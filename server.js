const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");
let nodemailer = null;
try {
  nodemailer = require("nodemailer");
} catch (error) {
  nodemailer = null;
}

const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || "";
const SMTP_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS || 15000);
const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const BREVO_API_TIMEOUT_MS = Number(process.env.BREVO_API_TIMEOUT_MS || 15000);
const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 10 * 60 * 1000);
const OTP_COOLDOWN_MS = Number(process.env.OTP_COOLDOWN_MS || 45 * 1000);
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
    const attempt = findAttemptByEmail(store, payload.verifiedEmail || payload.email || "") || null;
    sendJson(res, 200, {
      sessionId: store.sessionId,
      leaderboard,
      attempt
    });
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/auth/request-otp") {
    const body = await readBody(req);
    const payload = JSON.parse(body || "{}");
    const email = normalizeEmail(payload.email);
    if (!isValidIitgnEmail(email)) {
      sendJson(res, 400, { error: "Use an IITGN email ending with @iitgn.ac.in." });
      return;
    }
    if (!String(payload.playerName || "").trim()) {
      sendJson(res, 400, { error: "Player name is required before requesting OTP." });
      return;
    }

    const store = readStore();

    const currentChallenge = store.otpChallenges[email];
    const nowMs = Date.now();
    if (currentChallenge && nowMs - new Date(currentChallenge.requestedAt).getTime() < OTP_COOLDOWN_MS) {
      sendJson(res, 429, { error: "Please wait a few seconds before requesting a new OTP." });
      return;
    }

    const otp = generateOtp();
    try {
      await sendOtpEmail(email, otp, String(payload.playerName).trim());
    } catch (error) {
      console.error("OTP send failed:", error);
      sendJson(res, 503, {
        error: error && error.message
          ? error.message
          : "OTP email could not be sent right now."
      });
      return;
    }
    store.otpChallenges[email] = {
      email,
      otpHash: hashOtp(email, otp),
      requestedAt: new Date(nowMs).toISOString(),
      expiresAt: new Date(nowMs + OTP_TTL_MS).toISOString(),
      attempts: 0,
      playerName: String(payload.playerName).trim().slice(0, 30)
    };
    writeStore(store);

    sendJson(res, 200, {
      ok: true,
      email,
      expiresInMs: OTP_TTL_MS
    });
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/auth/verify-otp") {
    const body = await readBody(req);
    const payload = JSON.parse(body || "{}");
    const email = normalizeEmail(payload.email);
    const otp = String(payload.otp || "").trim();
    const playerName = String(payload.playerName || "").trim().slice(0, 30);

    if (!playerName) {
      sendJson(res, 400, { error: "Player name is required." });
      return;
    }
    if (!isValidIitgnEmail(email)) {
      sendJson(res, 400, { error: "Use an IITGN email ending with @iitgn.ac.in." });
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      sendJson(res, 400, { error: "Enter the 6-digit OTP sent to your IITGN email." });
      return;
    }

    const store = readStore();
    const now = new Date().toISOString();
    const challenge = store.otpChallenges[email];
    if (!challenge) {
      sendJson(res, 400, { error: "Request a fresh OTP for this IITGN email first." });
      return;
    }
    if (new Date(challenge.expiresAt).getTime() < Date.now()) {
      delete store.otpChallenges[email];
      writeStore(store);
      sendJson(res, 410, { error: "That OTP has expired. Request a new one." });
      return;
    }
    if (challenge.attempts >= 5) {
      delete store.otpChallenges[email];
      writeStore(store);
      sendJson(res, 429, { error: "Too many incorrect OTP attempts. Request a new code." });
      return;
    }
    if (hashOtp(email, otp) !== challenge.otpHash) {
      challenge.attempts += 1;
      writeStore(store);
      sendJson(res, 401, { error: "Incorrect OTP. Please try again." });
      return;
    }

    const existingEmailRecord = findAttemptByEmail(store, email);
    if (existingEmailRecord) {
      delete store.otpChallenges[email];
      existingEmailRecord.playerName = playerName || existingEmailRecord.playerName;
      existingEmailRecord.updatedAt = now;
      writeStore(store);
      sendJson(res, 200, {
        ok: true,
        sessionId: store.sessionId,
        attempt: existingEmailRecord,
        leaderboard: buildLeaderboard(store)
      });
      return;
    }

    const attemptId = String(payload.attemptId || createAttemptId());
    const record = {
      sessionId: store.sessionId,
      deviceId: attemptId,
      playerName,
      verifiedEmail: email,
      emailVerifiedAt: now,
      quizStarted: false,
      totalScore: 0,
      sectionScores: {},
      completedSections: [],
      completedAll: false,
      inProgressSectionIndex: null,
      inProgressQuestionIndex: null,
      startedAt: now,
      updatedAt: now
    };

    store.attempts[attemptId] = record;
    delete store.otpChallenges[email];
    writeStore(store);

    sendJson(res, 200, {
      ok: true,
      sessionId: store.sessionId,
      attempt: record,
      leaderboard: buildLeaderboard(store)
    });
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/progress") {
    const body = await readBody(req);
    const payload = JSON.parse(body || "{}");

    if (!payload.playerName || !payload.verifiedEmail) {
      sendJson(res, 400, { error: "playerName and verifiedEmail are required." });
      return;
    }

    const store = readStore();
    const now = new Date().toISOString();
    const verifiedEmail = normalizeEmail(payload.verifiedEmail);
    if (!isValidIitgnEmail(verifiedEmail)) {
      sendJson(res, 400, { error: "Use a verified IITGN email ending with @iitgn.ac.in." });
      return;
    }
    const matchedRecord = findAttemptByEmail(store, verifiedEmail);
    if (!matchedRecord) {
      sendJson(res, 403, { error: "Verify your IITGN email with OTP before starting the quiz." });
      return;
    }
    const attemptId = matchedRecord.deviceId;
    const record = {
      sessionId: store.sessionId,
      deviceId: attemptId,
      playerName: String(payload.playerName).trim().slice(0, 30),
      verifiedEmail,
      emailVerifiedAt: matchedRecord.emailVerifiedAt || now,
      quizStarted: Boolean(payload.quizStarted || matchedRecord.quizStarted || Number(payload.totalScore || 0) || (Array.isArray(payload.completedSections) && payload.completedSections.length)),
      totalScore: Number(payload.totalScore || 0),
      sectionScores: payload.sectionScores && typeof payload.sectionScores === "object" ? payload.sectionScores : {},
      completedSections: Array.isArray(payload.completedSections) ? payload.completedSections : [],
      completedAll: Boolean(payload.completedAll),
      inProgressSectionIndex: Number.isInteger(payload.inProgressSectionIndex) ? payload.inProgressSectionIndex : null,
      inProgressQuestionIndex: Number.isInteger(payload.inProgressQuestionIndex) ? payload.inProgressQuestionIndex : null,
      startedAt: matchedRecord.startedAt || payload.startedAt || now,
      updatedAt: now
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
      attempts: {},
      otpChallenges: {}
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
      attempts: {},
      otpChallenges: {}
    });
  }
}

function readStore() {
  ensureStore();
  const parsed = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
  return {
    sessionId: parsed.sessionId || createSessionId(),
    attempts: parsed.attempts && typeof parsed.attempts === "object" ? parsed.attempts : {},
    otpChallenges: parsed.otpChallenges && typeof parsed.otpChallenges === "object" ? parsed.otpChallenges : {}
  };
}

function writeStore(store) {
  const tempFile = `${STORE_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(store, null, 2));
  fs.renameSync(tempFile, STORE_FILE);
}

function buildLeaderboard(store) {
  return Object.values(store.attempts)
    .filter((record) => Boolean(record.quizStarted || Number(record.totalScore || 0) || (Array.isArray(record.completedSections) && record.completedSections.length)))
    .sort((a, b) => {
      if (Number(b.totalScore || 0) !== Number(a.totalScore || 0)) {
        return Number(b.totalScore || 0) - Number(a.totalScore || 0);
      }
      return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
    })
    .slice(0, 100);
}

function findAttemptByEmail(store, email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  return Object.values(store.attempts || {}).find((record) => normalizeEmail(record.verifiedEmail) === normalized) || null;
}

function createSessionId() {
  return crypto.randomBytes(12).toString("hex");
}

function createAttemptId() {
  return `attempt-${crypto.randomBytes(8).toString("hex")}`;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidIitgnEmail(value) {
  return /^[a-z0-9._%+-]+@iitgn\.ac\.in$/i.test(normalizeEmail(value));
}

function generateOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

function hashOtp(email, otp) {
  return crypto.createHash("sha256").update(`${normalizeEmail(email)}:${String(otp).trim()}`).digest("hex");
}

async function sendOtpEmail(email, otp, playerName) {
  if (BREVO_API_KEY) {
    await sendOtpViaBrevoApi(email, otp, playerName);
    return;
  }
  if (!nodemailer) {
    throw new Error("OTP email service is not installed on the server. Install dependencies first.");
  }
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error("SMTP is not configured on the server yet.");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: "Redline IQ OTP Verification",
    text: [
      `Hello ${playerName || "Driver"},`,
      "",
      `Your Redline IQ OTP is: ${otp}`,
      "",
      "This code is valid for 10 minutes.",
      "If you did not request this, please ignore this email."
    ].join("\n"),
    html: `
      <div style="font-family:Segoe UI,Tahoma,Verdana,sans-serif;line-height:1.5;color:#0f172a">
        <p>Hello ${escapeHtml(playerName || "Driver")},</p>
        <p>Your <strong>Redline IQ</strong> OTP is:</p>
        <p style="font-size:28px;font-weight:800;letter-spacing:0.18em;margin:16px 0;color:#e11d48">${escapeHtml(otp)}</p>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `
  });
}

async function sendOtpViaBrevoApi(email, otp, playerName) {
  if (typeof fetch !== "function") {
    throw new Error("Server fetch API is unavailable for Brevo delivery.");
  }

  const sender = parseSender(SMTP_FROM || SMTP_USER);
  if (!sender.email) {
    throw new Error("SMTP_FROM must contain a valid sender email for Brevo delivery.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BREVO_API_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify({
        sender,
        to: [{ email }],
        subject: "Redline IQ OTP Verification",
        textContent: [
          `Hello ${playerName || "Driver"},`,
          "",
          `Your Redline IQ OTP is: ${otp}`,
          "",
          "This code is valid for 10 minutes.",
          "If you did not request this, please ignore this email."
        ].join("\n"),
        htmlContent: `
          <div style="font-family:Segoe UI,Tahoma,Verdana,sans-serif;line-height:1.5;color:#0f172a">
            <p>Hello ${escapeHtml(playerName || "Driver")},</p>
            <p>Your <strong>Redline IQ</strong> OTP is:</p>
            <p style="font-size:28px;font-weight:800;letter-spacing:0.18em;margin:16px 0;color:#e11d48">${escapeHtml(otp)}</p>
            <p>This code is valid for 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      let details = "";
      try {
        details = await response.text();
      } catch (error) {
        details = "";
      }
      throw new Error(details || `Brevo API request failed with status ${response.status}.`);
    }
  } catch (error) {
    if (error && error.name === "AbortError") {
      throw new Error("Brevo API connection timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseSender(value) {
  const raw = String(value || "").trim();
  const match = raw.match(/^(.*)<([^>]+)>$/);
  if (match) {
    return {
      name: match[1].trim().replace(/^"|"$/g, "") || "Redline IQ",
      email: match[2].trim()
    };
  }
  return {
    name: "Redline IQ",
    email: raw
  };
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
