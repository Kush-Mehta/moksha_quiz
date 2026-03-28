const quizData = [
  {
    id: "section-1",
    title: "F1 History & Track Knowledge",
    subtitle: "Historic records, iconic tracks, and moments that shaped Formula 1.",
    questions: [
      {
        prompt: "Why do teams run low downforce setups at Monza?",
        options: [
          "To increase cooling efficiency of the power unit",
          "To improve tyre degradation over long stints",
          "To maintain aerodynamic balance in chicanes",
          "To reduce induced drag from wings at high speeds"
        ],
        correctIndex: 3,
        explanation: "Lower wing angles reduce induced drag, allowing higher top speeds on Monza's long straights.",
        funFact: "Reducing drag increases speed - something we also think about while designing our vehicle geometry."
      },
      {
        prompt: "Which driver was known for giving extremely precise technical feedback that helped teams optimize car setup and performance?",
        options: ["Michael Schumacher", "Jacques Villeneuve", "Kimi Räikkönen", "Max Verstappen"],
        correctIndex: 0,
        explanation: "Schumacher was famous for his detailed feedback to engineers, enabling continuous refinement of car setup and performance.",
        funFact: "Driver feedback plays a crucial role in tuning vehicle behavior - something equally important when optimizing real-world vehicle systems."
      },
      {
        prompt: "Why is Monaco uniquely difficult despite low speeds?",
        options: [
          "Surface irregularities reduce aerodynamic effectiveness",
          "Low tyre temperatures reduce grip significantly",
          "High downforce reduces braking efficiency",
          "Narrow track removes alternate racing lines and margin for error"
        ],
        correctIndex: 3,
        explanation: "The extremely narrow layout leaves no room for correction, making precision critical.",
        funFact: "Tight tracks highlight steering precision - something critical when designing turning geometry."
      },
      {
        prompt: "Which of these best explains Suzuka's importance from a tyre loading perspective?",
        options: [
          "It distributes lateral loads evenly across both sides of the car",
          "It minimizes tyre wear due to fewer corners",
          "It reduces vertical load transfer during braking",
          "It maximizes straight-line tyre cooling"
        ],
        correctIndex: 0,
        explanation: "The figure-8 layout balances left and right loading, leading to more uniform tyre stress.",
        funFact: "Balanced loading is important for durability in vehicle design."
      },
      {
        prompt: "Which driver is most associated with exceptional performance in low-grip (wet) conditions due to precise throttle and steering control?",
        options: ["Charles Leclerc", "Nico Rosberg", "Ayrton Senna", "Fernando Alonso"],
        correctIndex: 2,
        explanation: "Ayrton Senna was known for extraordinary car control in wet conditions, often outperforming competitors significantly.",
        funFact: "Low-grip control highlights the importance of vehicle balance and driver feedback systems."
      }
    ]
  },
  {
    id: "section-2",
    title: "F1 Engineering Concepts",
    subtitle: "Downforce, drag, tyres, and the engineering tricks behind lap time.",
    questions: [
      {
        prompt: "Why does DRS increase top speed on straights?",
        options: [
          "It decreases tyre rolling resistance",
          "It reduces pressure drag by altering rear wing flow separation",
          "It shifts aerodynamic centre of pressure forward",
          "It increases engine output temporarily"
        ],
        correctIndex: 1,
        explanation: "DRS reduces drag by modifying airflow over the rear wing, allowing higher speeds.",
        funFact: "Reducing drag improves straight-line speed - something also considered while designing vehicle geometry."
      },
      {
        prompt: "Why does increasing downforce inherently increase drag?",
        options: [
          "Increased tyre deformation",
          "Higher engine load requirement",
          "Greater airflow deflection and energy loss in the wake",
          "Increased frontal area of the car"
        ],
        correctIndex: 2,
        explanation: "Generating downforce disturbs airflow, increasing energy loss and drag.",
        funFact: "Every design involves trade-offs - same applies in vehicle design."
      },
      {
        prompt: "What is the main advantage of ground effect aerodynamics in modern F1 cars?",
        options: [
          "Reduced tyre degradation",
          "Efficient downforce generation with lower drag penalty",
          "Improved engine cooling",
          "Increased airflow velocity over body surfaces"
        ],
        correctIndex: 1,
        explanation: "Ground effect generates downforce more efficiently than wings by using pressure differences under the car.",
        funFact: "Efficient force generation is key to performance optimization."
      },
      {
        prompt: "Why is brake bias dynamically adjusted during a race?",
        options: [
          "To balance fuel consumption",
          "To compensate for engine power fluctuations",
          "To account for changing load transfer and tyre grip conditions",
          "To reduce aerodynamic drag"
        ],
        correctIndex: 2,
        explanation: "Brake bias is adjusted to maintain stability as tyre grip and load distribution change during the race.",
        funFact: "Adapting systems dynamically is critical for maintaining control in varying conditions."
      },
      {
        prompt: "Why do F1 teams carefully manage tyre temperature windows?",
        options: [
          "To reduce aerodynamic drag",
          "To improve fuel efficiency",
          "To prevent engine overheating",
          "Because grip is highly sensitive to temperature range"
        ],
        correctIndex: 3,
        explanation: "Tyres provide optimal grip only within a narrow temperature window.",
        funFact: "Maintaining optimal operating conditions is key for consistent performance."
      }
    ]
  },
  {
    id: "section-3",
    title: "General Automotive Engineering",
    subtitle: "Suspension, traction, braking, and vehicle behavior on rough terrain.",
    questions: [
      {
        prompt: "Which change is most effective in reducing oversteer during corner exit?",
        options: [
          "Increasing front tyre pressure",
          "Increasing rear tyre grip relative to front",
          "Reducing front camber",
          "Increasing front roll stiffness"
        ],
        correctIndex: 1,
        explanation: "Oversteer occurs when rear grip is insufficient; increasing rear grip stabilizes the vehicle during acceleration out of corners.",
        funFact: "Managing grip distribution is critical for maintaining stability on uneven terrain."
      },
      {
        prompt: "Why does AWD provide a traction advantage specifically on loose surfaces?",
        options: [
          "It distributes torque, reducing slip at individual contact patches",
          "It increases tyre contact area",
          "It reduces load transfer during acceleration",
          "It increases total available engine torque"
        ],
        correctIndex: 0,
        explanation: "AWD spreads torque across multiple wheels, lowering the chance of any single wheel exceeding grip limits.",
        funFact: "Distributing force effectively across wheels is key for maintaining motion on unstable terrain."
      },
      {
        prompt: "Which suspension characteristic most improves tyre contact on rough terrain?",
        options: [
          "Short travel suspension with low damping",
          "High spring rate with stiff damping",
          "Long travel independent suspension with tuned damping",
          "Solid axle with soft springs"
        ],
        correctIndex: 2,
        explanation: "Long-travel independent suspension allows each wheel to move independently, keeping tyres in contact with uneven surfaces.",
        funFact: "Suspension tuning is critical for maintaining grip and vehicle control on all-terrain tracks."
      },
      {
        prompt: "What is the primary effect of excessive rear brake bias under heavy braking?",
        options: [
          "Rear wheel lock leading to instability or spin",
          "Increased tyre wear at the front",
          "Increased braking efficiency",
          "Reduced stopping distance"
        ],
        correctIndex: 0,
        explanation: "Too much braking force at the rear causes rear wheels to lock first, destabilizing the vehicle.",
        funFact: "Proper brake force distribution is crucial for maintaining control on rough terrain."
      },
      {
        prompt: "Which factor most directly improves acceleration for a given engine output?",
        options: [
          "Reducing total vehicle mass",
          "Increasing tyre width significantly",
          "Increasing aerodynamic downforce at low speeds",
          "Increasing wheelbase"
        ],
        correctIndex: 0,
        explanation: "From F = ma, reducing mass increases acceleration for the same applied force.",
        funFact: "Weight optimization plays a major role in improving responsiveness and performance."
      }
    ]
  }
];

const QUESTION_TIME = 15;
const BASE_POINTS = 50;
const TIME_BONUS = 4;
const POLL_INTERVAL_MS = 5000;
const STORAGE_VERSION = "2026-03-28-sync-1";
const STORAGE_PREFIX = `mokshaQuiz:${STORAGE_VERSION}`;
const DEVICE_KEY = `${STORAGE_PREFIX}:device`;
const ATTEMPT_ID_KEY = `${STORAGE_PREFIX}:attemptId`;
const NAME_KEY = `${STORAGE_PREFIX}:name`;
const EMAIL_KEY = `${STORAGE_PREFIX}:email`;
const EMAIL_VERIFIED_KEY = `${STORAGE_PREFIX}:emailVerified`;
const ATTEMPT_CACHE_KEY = `${STORAGE_PREFIX}:attemptCache`;
const SESSION_CACHE_KEY = `${STORAGE_PREFIX}:session`;
const RESET_MARKER_KEY = `${STORAGE_PREFIX}:cleanupDone`;

function runOneTimeResetSweep() {
  if (localStorage.getItem(RESET_MARKER_KEY)) return;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("mokshaQuiz") && !key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
  });
  localStorage.setItem(RESET_MARKER_KEY, "1");
}

runOneTimeResetSweep();

const state = {
  playerName: "",
  currentSectionIndex: null,
  currentQuestionIndex: 0,
  totalScore: 0,
  sectionScores: {},
  completedSections: [],
  timerId: null,
  timeLeft: QUESTION_TIME,
  awaitingNext: false,
  locked: false,
  completedAll: false,
  leaderboardMode: "overall",
  leaderboardSectionIndex: 0,
  sessionUnlocked: false,
  deviceId: getDeviceId(),
  attemptId: localStorage.getItem(ATTEMPT_ID_KEY) || "",
  email: localStorage.getItem(EMAIL_KEY) || "",
  emailVerified: localStorage.getItem(EMAIL_VERIFIED_KEY) === "1",
  quizStarted: false,
  leaderboard: [],
  sessionId: localStorage.getItem(SESSION_CACHE_KEY) || "",
  serverAvailable: false,
  pollId: null,
  startedAt: null
};

const el = {
  playerName: document.getElementById("playerName"),
  saveNameBtn: document.getElementById("saveNameBtn"),
  iitgnEmail: document.getElementById("iitgnEmail"),
  requestOtpBtn: document.getElementById("requestOtpBtn"),
  otpCode: document.getElementById("otpCode"),
  verifyOtpBtn: document.getElementById("verifyOtpBtn"),
  authStatus: document.getElementById("authStatus"),
  nameHint: document.getElementById("nameHint"),
  attemptNotice: document.getElementById("attemptNotice"),
  playerTag: document.getElementById("playerTag"),
  progressPill: document.getElementById("progressPill"),
  sectionList: document.getElementById("sectionList"),
  leaderboardList: document.getElementById("leaderboardList"),
  overallLeaderboardBtn: document.getElementById("overallLeaderboardBtn"),
  sectionLeaderboardBtn: document.getElementById("sectionLeaderboardBtn"),
  sectionToggleRow: document.getElementById("sectionToggleRow"),
  summaryPanel: document.getElementById("summaryPanel"),
  summaryTitle: document.getElementById("summaryTitle"),
  summaryPill: document.getElementById("summaryPill"),
  summaryText: document.getElementById("summaryText"),
  summarySection: document.getElementById("summarySection"),
  summarySectionScore: document.getElementById("summarySectionScore"),
  summaryTotalScore: document.getElementById("summaryTotalScore"),
  summaryButton: document.getElementById("summaryButton"),
  quizLayer: document.getElementById("quizLayer"),
  quizPlayer: document.getElementById("quizPlayer"),
  quizScore: document.getElementById("quizScore"),
  quizTime: document.getElementById("quizTime"),
  timerFill: document.getElementById("timerFill"),
  quizBadge: document.getElementById("quizBadge"),
  quizQuestion: document.getElementById("quizQuestion"),
  options: document.getElementById("options"),
  feedback: document.getElementById("feedback"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  feedbackAnswer: document.getElementById("feedbackAnswer"),
  feedbackExplanation: document.getElementById("feedbackExplanation"),
  feedbackFact: document.getElementById("feedbackFact"),
  nextBtn: document.getElementById("nextBtn"),
  closeBtn: document.getElementById("closeBtn"),
  serverStatus: document.getElementById("serverStatus")
};
async function init() {
  bindEvents();
  restoreNameCache();
  restoreEmailCache();
  updateHeaderBits();
  updateAuthUI();
  syncLeaderboardControls();
  renderSections();
  renderLeaderboard();
  await bootstrapFromServer();
  startPolling();
}

function bindEvents() {
  el.saveNameBtn.addEventListener("click", saveName);
  el.playerName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveName();
  });
  el.requestOtpBtn.addEventListener("click", requestOtp);
  el.verifyOtpBtn.addEventListener("click", verifyOtp);
  el.iitgnEmail.addEventListener("keydown", (event) => {
    if (event.key === "Enter") requestOtp();
  });
  el.otpCode.addEventListener("keydown", (event) => {
    if (event.key === "Enter") verifyOtp();
  });
  el.overallLeaderboardBtn.addEventListener("click", () => {
    state.leaderboardMode = "overall";
    syncLeaderboardControls();
    renderLeaderboard();
  });
  el.sectionLeaderboardBtn.addEventListener("click", () => {
    state.leaderboardMode = "section";
    syncLeaderboardControls();
    renderLeaderboard();
  });
  el.sectionToggleRow.addEventListener("click", (event) => {
    const target = event.target.closest("[data-section-index]");
    if (!target) return;
    state.leaderboardSectionIndex = Number(target.dataset.sectionIndex);
    syncLeaderboardControls();
    renderLeaderboard();
  });
  el.nextBtn.addEventListener("click", nextQuestion);
  el.closeBtn.addEventListener("click", closeQuizView);
  el.summaryButton.addEventListener("click", () => {
    el.summaryPanel.classList.remove("visible");
    renderSections();
    renderLeaderboard();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) void bootstrapFromServer();
  });
}

function restoreNameCache() {
  const cachedName = localStorage.getItem(NAME_KEY);
  if (!cachedName) return;
  state.playerName = cachedName;
  el.playerName.value = cachedName;
}

function restoreEmailCache() {
  if (!state.email) return;
  el.iitgnEmail.value = state.email;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidIitgnEmail(value) {
  return /^[a-z0-9._%+-]+@iitgn\.ac\.in$/i.test(normalizeEmail(value));
}

function setAuthStatus(message, good = false) {
  el.authStatus.textContent = message;
  el.authStatus.classList.toggle("visible", Boolean(message));
  el.authStatus.innerHTML = message ? (good ? `<strong>${escapeHtml(message)}</strong>` : escapeHtml(message)) : "";
}

function updateAuthUI() {
  const verified = state.emailVerified && Boolean(state.email);
  if (state.email) el.iitgnEmail.value = state.email;
  el.iitgnEmail.disabled = verified || state.locked;
  el.requestOtpBtn.disabled = verified || state.locked || !state.serverAvailable || window.location.protocol === "file:";
  el.otpCode.disabled = verified || !state.serverAvailable || window.location.protocol === "file:";
  el.verifyOtpBtn.disabled = verified || !state.serverAvailable || window.location.protocol === "file:";
  if (verified) {
    setAuthStatus(`Verified: ${state.email}`, true);
    el.otpCode.value = "";
  } else if (!el.authStatus.textContent) {
    setAuthStatus("");
  }
}

async function bootstrapFromServer() {
  if (window.location.protocol === "file:") {
    state.serverAvailable = false;
    const cachedAttempt = readCachedAttempt();
    if (cachedAttempt && state.currentSectionIndex === null) applyAttemptRecord(cachedAttempt);
    setServerStatus("Open this page through the server URL to sync scores live.", false);
    setAuthStatus("Open this page through the live server URL to verify your IITGN email.");
    updateHeaderBits();
    updateAuthUI();
    renderSections();
    renderLeaderboard();
    return;
  }

  try {
    const payload = await fetchJSON("/api/bootstrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verifiedEmail: state.emailVerified ? state.email : ""
      })
    });
    const previousSession = localStorage.getItem(SESSION_CACHE_KEY);
    const sessionChanged = Boolean(previousSession && previousSession !== payload.sessionId);

    state.serverAvailable = true;
    state.sessionId = payload.sessionId || "";
    localStorage.setItem(SESSION_CACHE_KEY, state.sessionId);
    state.leaderboard = Array.isArray(payload.leaderboard) ? payload.leaderboard : [];

    if (sessionChanged) {
      clearAttemptCache();
      clearTimer();
      state.currentSectionIndex = null;
      state.currentQuestionIndex = 0;
      state.awaitingNext = false;
      el.quizLayer.classList.remove("visible");
      applyAttemptRecord(null);
      el.attemptNotice.style.display = "block";
      el.attemptNotice.textContent = "Server reset detected. Sign in again to start fresh.";
    } else if (state.currentSectionIndex === null) {
      if (payload.attempt) {
        localStorage.setItem(ATTEMPT_CACHE_KEY, JSON.stringify(payload.attempt));
        applyAttemptRecord(payload.attempt);
      } else {
        clearAttemptCache();
        applyAttemptRecord(null);
      }
    }

    setServerStatus("Live server sync is on.", true);
    if (!payload.attempt && !state.emailVerified) {
      setAuthStatus("Use your IITGN email to get an OTP and unlock the quiz.");
    }
  } catch (error) {
    state.serverAvailable = false;
    const cachedAttempt = readCachedAttempt();
    if (cachedAttempt && state.currentSectionIndex === null) applyAttemptRecord(cachedAttempt);
    setServerStatus("Live server not reachable. Shared sync is paused until it reconnects.", false);
    if (!state.emailVerified) setAuthStatus("Live server unavailable. Email OTP verification is paused.");
  }

  updateHeaderBits();
  updateAuthUI();
  renderSections();
  renderLeaderboard();
}

function applyAttemptRecord(record) {
  clearTimer();
  state.currentSectionIndex = null;
  state.currentQuestionIndex = 0;
  state.awaitingNext = false;
  el.summaryPanel.classList.remove("visible");

  if (!record) {
    state.locked = false;
    state.sessionUnlocked = false;
    state.attemptId = "";
    localStorage.removeItem(ATTEMPT_ID_KEY);
    state.emailVerified = false;
    localStorage.removeItem(EMAIL_VERIFIED_KEY);
    state.quizStarted = false;
    state.totalScore = 0;
    state.sectionScores = {};
    state.completedSections = [];
    state.completedAll = false;
    state.startedAt = null;
    state.email = normalizeEmail(el.iitgnEmail.value || state.email);
    if (state.email) localStorage.setItem(EMAIL_KEY, state.email);
    if (!state.playerName) el.playerName.value = "";
    el.playerName.disabled = false;
    el.saveNameBtn.disabled = false;
    if (state.playerName) el.playerName.value = state.playerName;
    el.attemptNotice.style.display = "none";
    updateAuthUI();
    return;
  }

  state.locked = true;
  state.sessionUnlocked = true;
  state.attemptId = record.deviceId || state.attemptId || state.deviceId;
  localStorage.setItem(ATTEMPT_ID_KEY, state.attemptId);
  state.email = normalizeEmail(record.verifiedEmail || state.email);
  state.emailVerified = Boolean(record.verifiedEmail);
  if (state.emailVerified) localStorage.setItem(EMAIL_VERIFIED_KEY, "1");
  state.quizStarted = Boolean(record.quizStarted || (Array.isArray(record.completedSections) && record.completedSections.length) || Number(record.totalScore || 0));
  state.playerName = record.playerName || state.playerName;
  state.totalScore = Number(record.totalScore) || 0;
  state.sectionScores = record.sectionScores || {};
  state.completedSections = Array.isArray(record.completedSections)
    ? record.completedSections
    : Object.keys(state.sectionScores);
  state.completedAll = typeof record.completedAll === "boolean" ? record.completedAll : state.completedSections.length === quizData.length;
  state.currentSectionIndex = Number.isInteger(record.inProgressSectionIndex) ? record.inProgressSectionIndex : null;
  state.currentQuestionIndex = Number.isInteger(record.inProgressQuestionIndex) ? record.inProgressQuestionIndex : 0;
  state.startedAt = record.startedAt || new Date().toISOString();

  if (state.currentSectionIndex !== null && isSectionCompleted(quizData[state.currentSectionIndex]?.id)) {
    state.currentSectionIndex = null;
    state.currentQuestionIndex = 0;
  }

  if (state.playerName) {
    localStorage.setItem(NAME_KEY, state.playerName);
    el.playerName.value = state.playerName;
  }
  if (state.email) {
    localStorage.setItem(EMAIL_KEY, state.email);
    el.iitgnEmail.value = state.email;
  }

  el.playerName.disabled = true;
  el.saveNameBtn.disabled = true;
  el.attemptNotice.style.display = "block";
  el.attemptNotice.textContent = state.completedAll
    ? "This IITGN account has already completed all sections for the current live leaderboard session."
    : state.currentSectionIndex !== null
      ? `Saved progress restored. Resume ${quizData[state.currentSectionIndex].title} from Q${state.currentQuestionIndex + 1}.`
      : state.quizStarted
        ? "Saved progress restored. Continue with the remaining sections."
        : "Email verified. Choose any section to begin.";
  updateAuthUI();
}

function readCachedAttempt() {
  const raw = localStorage.getItem(ATTEMPT_CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Unable to read cached attempt", error);
    return null;
  }
}

function clearAttemptCache() {
  localStorage.removeItem(ATTEMPT_CACHE_KEY);
  localStorage.removeItem(ATTEMPT_ID_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(EMAIL_VERIFIED_KEY);
}

function saveName() {
  if (state.locked) return;
  const value = el.playerName.value.trim().replace(/\s+/g, " ");
  if (!value) {
    el.nameHint.textContent = "Enter a player name first.";
    return;
  }
  state.playerName = value;
  localStorage.setItem(NAME_KEY, value);
  updateHeaderBits();
  el.nameHint.textContent = `${value} is ready for the grid.`;
  renderSections();
  renderLeaderboard();
}

async function requestOtp() {
  if (window.location.protocol === "file:" || !state.serverAvailable) {
    setAuthStatus("OTP can be requested only through the live server URL.");
    updateAuthUI();
    return;
  }
  if (state.emailVerified) {
    setAuthStatus(`Verified: ${state.email}`, true);
    return;
  }

  const playerName = el.playerName.value.trim().replace(/\s+/g, " ");
  const email = normalizeEmail(el.iitgnEmail.value);
  if (!playerName) {
    el.nameHint.textContent = "Save your driver name before requesting the OTP.";
    setAuthStatus("Enter and save your name first.");
    return;
  }
  if (!isValidIitgnEmail(email)) {
    setAuthStatus("Use a valid IITGN email ending with @iitgn.ac.in.");
    return;
  }

  state.playerName = playerName;
  state.email = email;
  localStorage.setItem(NAME_KEY, playerName);
  localStorage.setItem(EMAIL_KEY, email);
  setAuthStatus("Sending OTP...");
  el.requestOtpBtn.disabled = true;

  try {
    const response = await fetchJSON("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playerName
      })
    });
    state.email = response.email || email;
    localStorage.setItem(EMAIL_KEY, state.email);
    setAuthStatus("OTP sent. Check your IITGN inbox and enter the 6-digit code.");
  } catch (error) {
    setAuthStatus(error.message || "Unable to send OTP.");
  } finally {
    updateHeaderBits();
    updateAuthUI();
    renderSections();
  }
}

async function verifyOtp() {
  if (window.location.protocol === "file:" || !state.serverAvailable) {
    setAuthStatus("OTP verification works only through the live server URL.");
    return;
  }

  const playerName = el.playerName.value.trim().replace(/\s+/g, " ");
  const email = normalizeEmail(el.iitgnEmail.value || state.email);
  const otp = String(el.otpCode.value || "").trim();

  if (!playerName) {
    setAuthStatus("Enter and save your name before verifying the OTP.");
    return;
  }
  if (!isValidIitgnEmail(email)) {
    setAuthStatus("Use a valid IITGN email ending with @iitgn.ac.in.");
    return;
  }
  if (!/^\d{6}$/.test(otp)) {
    setAuthStatus("Enter the 6-digit OTP sent to your IITGN email.");
    return;
  }

  state.playerName = playerName;
  state.email = email;
  state.emailVerified = false;
  localStorage.setItem(NAME_KEY, playerName);
  localStorage.setItem(EMAIL_KEY, email);
  localStorage.removeItem(EMAIL_VERIFIED_KEY);
  setAuthStatus("Verifying OTP...");
  el.verifyOtpBtn.disabled = true;

  try {
    const response = await fetchJSON("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        playerName,
        attemptId: state.attemptId
      })
    });
    if (response.sessionId) {
      state.sessionId = response.sessionId;
      localStorage.setItem(SESSION_CACHE_KEY, state.sessionId);
    }
    if (response.attempt) {
      localStorage.setItem(ATTEMPT_CACHE_KEY, JSON.stringify(response.attempt));
      applyAttemptRecord(response.attempt);
    }
    state.leaderboard = Array.isArray(response.leaderboard) ? response.leaderboard : state.leaderboard;
    setAuthStatus(`Verified: ${email}`, true);
    renderLeaderboard();
  } catch (error) {
    setAuthStatus(error.message || "OTP verification failed.");
  } finally {
    updateHeaderBits();
    updateAuthUI();
    renderSections();
  }
}

function updateHeaderBits() {
  el.playerTag.textContent = state.playerName || "Guest View";
  el.progressPill.textContent = `${state.completedSections.length} / ${quizData.length} cleared`;
}

function syncLeaderboardControls() {
  el.overallLeaderboardBtn.classList.toggle("active", state.leaderboardMode === "overall");
  el.sectionLeaderboardBtn.classList.toggle("active", state.leaderboardMode === "section");
  el.sectionToggleRow.style.display = state.leaderboardMode === "section" ? "flex" : "none";
  [...el.sectionToggleRow.querySelectorAll("[data-section-index]")].forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.sectionIndex) === state.leaderboardSectionIndex);
  });
}

function renderSections() {
  el.sectionList.innerHTML = "";
  const waitingForServer = window.location.protocol !== "file:" && !state.serverAvailable;
  const hasInProgressSection = state.currentSectionIndex !== null;
  const authLocked = !state.emailVerified;

  quizData.forEach((section, index) => {
    const completed = isSectionCompleted(section.id);
    const inProgress = hasInProgressSection && state.currentSectionIndex === index && !completed;
    const partialScore = getSectionScore(state.sectionScores, index);
    const card = document.createElement("button");
    card.type = "button";
    card.className = `section-card${completed ? " completed" : ""}${inProgress ? " active" : ""}`;
    card.disabled = state.completedAll || !state.playerName || authLocked || completed || waitingForServer || (hasInProgressSection && !inProgress);
    const cta = completed
      ? `${partialScore} pts`
      : inProgress
        ? `${partialScore} pts • Resume Q${state.currentQuestionIndex + 1}`
        : authLocked
          ? "Verify IITGN email"
          : "Tap to start";
    card.innerHTML = `
      <div class="pill">Section ${index + 1}</div>
      <h3>${section.title}</h3>
      <div class="section-foot">
        <span>${section.questions.length} questions</span>
        <strong>${waitingForServer && !completed && !inProgress ? "Waiting for server" : cta}</strong>
      </div>
    `;
    card.addEventListener("click", () => startSection(index));
    el.sectionList.appendChild(card);
  });
}

function startSection(sectionIndex) {
  if (state.completedAll || !state.playerName || !state.emailVerified) return;
  if (window.location.protocol !== "file:" && !state.serverAvailable) return;
  if (isSectionCompleted(quizData[sectionIndex].id)) return;
  if (state.currentSectionIndex !== null && state.currentSectionIndex !== sectionIndex) return;

  state.quizStarted = true;

  if (!state.sessionUnlocked) {
    lockAttempt();
  }

  if (state.currentSectionIndex === null) {
    state.currentSectionIndex = sectionIndex;
    state.currentQuestionIndex = 0;
    if (state.sectionScores[quizData[sectionIndex].id] === undefined) {
      state.sectionScores[quizData[sectionIndex].id] = 0;
    }
  }
  state.awaitingNext = false;
  el.summaryPanel.classList.remove("visible");
  cacheAttemptLocally();
  updateLocalLeaderboardSnapshot();
  void syncAttemptToServer();
  renderSections();
  renderQuestion();
  openQuizView();
}

function lockAttempt() {
  state.locked = true;
  state.sessionUnlocked = true;
  if (!state.startedAt) state.startedAt = new Date().toISOString();
  el.playerName.disabled = true;
  el.saveNameBtn.disabled = true;
  updateAuthUI();
  cacheAttemptLocally();
  updateLocalLeaderboardSnapshot();
}

function openQuizView() {
  window.scrollTo({ top: 0, behavior: "auto" });
  el.quizLayer.classList.add("visible");
}

function closeQuizView() {
  clearTimer();
  if (state.currentSectionIndex !== null) {
    const section = quizData[state.currentSectionIndex];
    if (state.awaitingNext) {
      if (state.currentQuestionIndex >= section.questions.length - 1) {
        finishSection();
        return;
      }
      state.currentQuestionIndex += 1;
      state.awaitingNext = false;
    }
    cacheAttemptLocally();
    updateLocalLeaderboardSnapshot();
    void syncAttemptToServer();
  }
  el.quizLayer.classList.remove("visible");
  renderSections();
  renderLeaderboard();
}
function renderQuestion() {
  const section = quizData[state.currentSectionIndex];
  const question = section.questions[state.currentQuestionIndex];
  clearTimer();
  state.awaitingNext = false;
  state.timeLeft = QUESTION_TIME;

  el.quizPlayer.textContent = state.playerName;
  el.quizScore.textContent = `${state.totalScore} pts`;
  el.quizBadge.textContent = `${section.title} | Q${state.currentQuestionIndex + 1}/${section.questions.length}`;
  el.quizQuestion.textContent = question.prompt;
  el.feedback.classList.remove("visible");
  el.options.innerHTML = "";
  el.nextBtn.disabled = true;
  updateTimer();

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.innerHTML = `<strong>${String.fromCharCode(65 + index)})</strong> ${escapeHtml(option)}`;
    button.addEventListener("click", () => submitAnswer(index));
    el.options.appendChild(button);
  });

  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateTimer();
    if (state.timeLeft <= 0) {
      clearTimer();
      submitAnswer(null);
    }
  }, 1000);
}

function updateTimer() {
  const pct = Math.max(0, (state.timeLeft / QUESTION_TIME) * 100);
  el.quizTime.textContent = `${Math.max(0, state.timeLeft)}s`;
  el.timerFill.style.width = `${pct}%`;
  if (pct > 60) {
    el.timerFill.style.background = "linear-gradient(90deg, #22cb86, #62e6a7)";
  } else if (pct > 30) {
    el.timerFill.style.background = "linear-gradient(90deg, #ffd45b, #ff9f43)";
  } else {
    el.timerFill.style.background = "linear-gradient(90deg, #ff6b5c, #ff304f)";
  }
}

function submitAnswer(selectedIndex) {
  if (state.awaitingNext) return;
  state.awaitingNext = true;
  clearTimer();

  const question = quizData[state.currentSectionIndex].questions[state.currentQuestionIndex];
  const section = quizData[state.currentSectionIndex];
  const optionNodes = [...el.options.querySelectorAll(".option")];
  const correct = selectedIndex === question.correctIndex;
  const pointsAwarded = correct ? BASE_POINTS + Math.max(state.timeLeft, 0) * TIME_BONUS : 0;

  optionNodes.forEach((node, index) => {
    node.disabled = true;
    node.classList.add("locked");
    if (index === question.correctIndex) node.classList.add("correct");
    if (selectedIndex !== null && index === selectedIndex && index !== question.correctIndex) {
      node.classList.add("wrong");
    }
  });

  if (correct) {
    state.totalScore += pointsAwarded;
    state.sectionScores[section.id] = Number(state.sectionScores[section.id] || 0) + pointsAwarded;
  } else if (state.sectionScores[section.id] === undefined) {
    state.sectionScores[section.id] = 0;
  }
  el.quizScore.textContent = `${state.totalScore} pts`;
  el.feedback.classList.add("visible");
  el.feedbackTitle.textContent = correct ? `Correct Answer - +${pointsAwarded} pts` : selectedIndex === null ? "Time's Up" : "Incorrect Answer";
  el.feedbackTitle.className = correct ? "good" : "bad";
  el.feedbackAnswer.textContent = `Correct Answer: ${String.fromCharCode(65 + question.correctIndex)}) ${question.options[question.correctIndex]}`;
  el.feedbackExplanation.textContent = question.explanation;
  el.feedbackFact.textContent = question.funFact;
  el.nextBtn.disabled = false;

  cacheAttemptLocally();
  updateLocalLeaderboardSnapshot();
  void syncAttemptToServer();
}

function nextQuestion() {
  if (!state.awaitingNext) return;
  const section = quizData[state.currentSectionIndex];
  if (state.currentQuestionIndex < section.questions.length - 1) {
    state.currentQuestionIndex += 1;
    renderQuestion();
    return;
  }
  finishSection();
}

function finishSection() {
  const section = quizData[state.currentSectionIndex];
  const currentSectionScore = Number(state.sectionScores[section.id] || 0);

  if (!state.completedSections.includes(section.id)) state.completedSections.push(section.id);
  state.currentSectionIndex = null;
  state.currentQuestionIndex = 0;
  state.awaitingNext = false;
  state.completedAll = state.completedSections.length === quizData.length;

  cacheAttemptLocally();
  updateLocalLeaderboardSnapshot();
  void syncAttemptToServer();

  updateHeaderBits();
  renderSections();
  renderLeaderboard();

  el.summaryPanel.classList.add("visible");
  el.summaryTitle.textContent = state.completedAll ? "Finish Line Reached" : "Checkpoint Cleared";
  el.summaryPill.textContent = state.completedAll ? "All Sections Done" : "Section Complete";
  el.summaryText.textContent = `Score locked in for ${section.title}.`;
  el.summarySection.textContent = section.title;
  el.summarySectionScore.textContent = `${currentSectionScore} pts`;
  el.summaryTotalScore.textContent = `${state.totalScore} pts`;
  el.summaryButton.textContent = state.completedAll ? "View Hall Of Pace" : "Back To Sections";
  el.quizLayer.classList.remove("visible");
}

function cacheAttemptLocally() {
  localStorage.setItem(ATTEMPT_CACHE_KEY, JSON.stringify(buildAttemptPayload()));
}

function buildAttemptPayload() {
  const attemptKey = state.attemptId || state.deviceId;
  return {
    sessionId: state.sessionId || localStorage.getItem(SESSION_CACHE_KEY) || "local-session",
    deviceId: attemptKey,
    attemptId: attemptKey,
    playerName: state.playerName,
    verifiedEmail: state.email,
    quizStarted: state.quizStarted,
    totalScore: state.totalScore,
    sectionScores: state.sectionScores,
    completedSections: state.completedSections,
    completedAll: state.completedAll,
    inProgressSectionIndex: state.currentSectionIndex,
    inProgressQuestionIndex: state.currentSectionIndex !== null ? state.currentQuestionIndex : null,
    startedAt: state.startedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function updateLocalLeaderboardSnapshot() {
  if (!state.playerName || !state.emailVerified) return;
  const payload = buildAttemptPayload();
  const board = [...state.leaderboard];
  const attemptKey = payload.deviceId;
  const idx = board.findIndex((entry) => entry.deviceId === attemptKey);
  if (idx >= 0) board[idx] = { ...board[idx], ...payload };
  else board.push(payload);
  state.leaderboard = sortOverallBoard(board);
  renderLeaderboard();
}

async function syncAttemptToServer() {
  if (!state.playerName) return;
  if (window.location.protocol === "file:" || !state.serverAvailable) return;

  try {
    const response = await fetchJSON("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildAttemptPayload())
    });
    state.serverAvailable = true;
    state.sessionId = response.sessionId || state.sessionId;
    localStorage.setItem(SESSION_CACHE_KEY, state.sessionId);
    if (response.attempt?.deviceId) {
      state.attemptId = response.attempt.deviceId;
      localStorage.setItem(ATTEMPT_ID_KEY, state.attemptId);
    }
    state.leaderboard = Array.isArray(response.leaderboard) ? response.leaderboard : state.leaderboard;
    setServerStatus("Live server sync is on.", true);
    renderLeaderboard();
  } catch (error) {
    state.serverAvailable = false;
    setServerStatus("Progress is paused until the live server reconnects.", false);
    renderSections();
  }
}

function renderLeaderboard() {
  const rankedBoard = getRankedLeaderboard(state.leaderboard);
  el.leaderboardList.innerHTML = "";
  if (!rankedBoard.length) {
    el.leaderboardList.innerHTML = '<div class="empty">No scores have been recorded yet.</div>';
    return;
  }

  rankedBoard.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = `leader-row${entry.deviceId === (state.attemptId || state.deviceId) ? " current" : ""}`;
    const currentScore = state.leaderboardMode === "overall" ? Number(entry.totalScore || 0) : getSectionScore(entry.sectionScores, state.leaderboardSectionIndex);
    row.innerHTML = `
      <div class="rank">#${index + 1}</div>
      <div>
        <div class="leader-name">${escapeHtml(entry.playerName || "Anonymous Driver")}</div>
        <div class="leader-meta">${state.leaderboardMode === "overall" ? formatBreakdown(entry) : formatSectionOnly(entry, state.leaderboardSectionIndex)}</div>
      </div>
      <div class="leader-score">${currentScore} pts</div>
    `;
    el.leaderboardList.appendChild(row);
  });
}

function getRankedLeaderboard(board) {
  const sectionIndex = state.leaderboardSectionIndex;
  return [...board]
    .filter((entry) => Boolean(entry.quizStarted || Number(entry.totalScore || 0) || countCompletedSections(entry)))
    .sort((a, b) => {
    const aScore = state.leaderboardMode === "overall" ? Number(a.totalScore || 0) : getSectionScore(a.sectionScores, sectionIndex);
    const bScore = state.leaderboardMode === "overall" ? Number(b.totalScore || 0) : getSectionScore(b.sectionScores, sectionIndex);
    if (bScore !== aScore) return bScore - aScore;
    return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
  });
}

function sortOverallBoard(board) {
  return [...board].sort((a, b) => {
    if (Number(b.totalScore || 0) !== Number(a.totalScore || 0)) return Number(b.totalScore || 0) - Number(a.totalScore || 0);
    return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
  });
}

function formatBreakdown(entry) {
  const completed = countCompletedSections(entry);
  const pieces = quizData.map((section, index) => `S${index + 1}: ${getSectionScore(entry.sectionScores, index)} pts`);
  return `${completed}/${quizData.length} sections | ${pieces.join(" | ")}`;
}

function countCompletedSections(entry) {
  if (entry && Array.isArray(entry.completedSections)) return entry.completedSections.length;
  return Object.keys((entry && entry.sectionScores) || {}).length;
}

function isSectionCompleted(sectionId) {
  return state.completedSections.includes(sectionId);
}

function getSectionScore(sectionScores, sectionIndex) {
  const section = quizData[sectionIndex];
  if (!section || !sectionScores) return 0;
  return Number(sectionScores[section.id] || 0);
}

function formatSectionOnly(entry, sectionIndex) {
  return `${countCompletedSections(entry)}/${quizData.length} sections | ${quizData[sectionIndex].title}: ${getSectionScore(entry.sectionScores, sectionIndex)} pts`;
}

function setServerStatus(message, good) {
  el.serverStatus.textContent = message;
  el.serverStatus.classList.toggle("good", Boolean(good));
  el.serverStatus.classList.toggle("bad", !good);
}

async function fetchJSON(url, options) {
  const response = await fetch(url, options);
  let payload = {};
  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }
  if (!response.ok) throw new Error(payload.error || "Request failed.");
  return payload;
}

function startPolling() {
  if (state.pollId || window.location.protocol === "file:") return;
  state.pollId = window.setInterval(() => {
    if (!document.hidden) void bootstrapFromServer();
  }, POLL_INTERVAL_MS);
}

function clearTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getDeviceId() {
  let value = localStorage.getItem(DEVICE_KEY);
  if (!value) {
    value = `browser-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(DEVICE_KEY, value);
  }
  return hashString(value);
}

function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return `device-${Math.abs(hash)}`;
}

window.addEventListener("beforeunload", () => {
  clearTimer();
  if (state.pollId) clearInterval(state.pollId);
});

void init();

