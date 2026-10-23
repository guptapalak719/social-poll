
const express = require("express");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;

app.use(express.json());

// Temporary in-memory data: no database connection required.
// Temporary user storage for the demo.
const users = [];

// Demo only: use a private environment variable before deployment.
const JWT_SECRET =
  process.env.JWT_SECRET || "social-poll-demo-only-secret";
const polls = [
  {
    id: "1",
    question: "Which technology should we explore next?",
    options: [
      { text: "Artificial Intelligence", votes: 0 },
      { text: "Web Development", votes: 0 },
      { text: "Cybersecurity", votes: 0 },
    ],
    voterChoices: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    question: "Which feature matters most in a polling app?",
    options: [
      { text: "Easy voting", votes: 0 },
      { text: "Live results", votes: 0 },
      { text: "Comments", votes: 0 },
    ],
    voterChoices: {},
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

// Serve the demo UI.
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Social Poll | Demo</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,sans-serif;background:#f5f5fb;color:#25243a}
header{background:#5546a5;color:white;padding:22px 7%;display:flex;justify-content:space-between;align-items:center}
header h1{margin:0;font-size:25px}
header span{font-size:13px;opacity:.85}
main{max-width:850px;margin:30px auto;padding:0 18px}
.intro{margin-bottom:24px}
.intro h2{margin-bottom:8px;font-size:28px}
.intro p{color:#696980}
.panel,.poll{background:white;padding:22px;border-radius:16px;margin-bottom:20px;box-shadow:0 5px 20px #28204a0b}
.panel h3,.poll h3{margin-top:0}
input,textarea{width:100%;padding:12px;border:1px solid #dddbea;border-radius:9px;margin:7px 0 12px;font:inherit}
button{border:0;border-radius:9px;padding:11px 16px;background:#5546a5;color:white;cursor:pointer;font-weight:600}
button:hover{opacity:.88}
.secondary{background:#eeebff;color:#51419e}
.option{display:block;width:100%;text-align:left;margin:10px 0;background:#f1effa;color:#302b4d;border:1px solid #e2def5}
.option.selected{border:2px solid #6553ba;background:#e9e4ff}
.bar{height:8px;background:#eeeaf8;border-radius:8px;overflow:hidden;margin-top:8px}
.fill{height:100%;background:#7866cb}
.meta{color:#85839a;font-size:12px;margin-top:16px}
.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
#status{margin:12px 0;color:#5546a5;font-size:14px}
footer{text-align:center;color:#85839a;padding:20px;font-size:12px}
</style>
</head>
<body>
<header><h1>Social Poll</h1><span>COMMUNITY • VOTE • DISCOVER</span></header>
<main>
<section class="intro">
<h2>What's your opinion?</h2>
<p>Create a poll, share your perspective, and see what the community thinks.</p>
</section>

<section class="panel" id="authPanel">
  <h3>Join the community</h3>
  <p class="meta">Create an account or log in to continue.</p>

  <form id="authForm">
    <input id="authName" placeholder="Your name (for registration)" maxlength="50">
    <input id="authEmail" type="email" placeholder="Email address" required>
    <input id="authPassword" type="password" placeholder="Password (minimum 8 characters)" minlength="8" required>

    <div class="actions">
      <button type="button" id="registerBtn">Create account</button>
      <button type="button" class="secondary" id="loginBtn">Log in</button>
      <button type="button" class="secondary" id="logoutBtn" hidden>Log out</button>
    </div>
  </form>

  <p id="authStatus" role="status"></p>
  <p id="authUser" class="meta"></p>
</section>

<section class="panel">
<h3>Create a poll</h3>
<form id="createForm">
<input id="question" placeholder="Ask the community a question..." required maxlength="180">
<input class="pollOption" placeholder="Option 1" required maxlength="80">
<input class="pollOption" placeholder="Option 2" required maxlength="80">
<div id="extraOptions"></div>
<div class="actions">
<button type="button" class="secondary" id="addOption">+ Add option</button>
<button type="submit">Create poll</button>
</div>
</form>
<div id="status" role="status"></div>
</section>
<div id="pollList">Loading polls...</div>
</main>
<footer>Social Poll Demo · Data is temporary and resets when the server restarts.</footer>
<script>
var voterId = localStorage.getItem("socialPollVoter");
if (!voterId) {
  voterId = "voter-" + Math.random().toString(36).slice(2) + Date.now();
  localStorage.setItem("socialPollVoter", voterId);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function(c) {
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}


function updateAuthUI(user) {
  document.getElementById("authUser").textContent = user
    ? "Logged in as " + user.name + " (" + user.email + ")"
    : "You are browsing as a guest.";

  document.getElementById("authName").hidden = !!user;
  document.getElementById("registerBtn").hidden = !!user;
  document.getElementById("loginBtn").hidden = !!user;
  document.getElementById("logoutBtn").hidden = !user;
const authorInputs = document.querySelectorAll("[id^='comment-author-']");
authorInputs.forEach(function(input) {
  if (user && !input.value) {
    input.value = user.name;
  }
});
  }

async function authenticate(mode) {
  const name = document.getElementById("authName").value.trim();
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  const status = document.getElementById("authStatus");

  if (mode === "register" && !name) {
    status.textContent = "Please enter your name.";
    return;
  }

  if (password.length < 8) {
    status.textContent = "Password must be at least 8 characters.";
    return;
  }

  try {
    const response = await fetch("/api/auth/" + mode, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    status.textContent = data.message;

    if (response.ok) {
      localStorage.setItem("socialPollToken", data.token);
      localStorage.setItem("socialPollUser", JSON.stringify(data.user));
      updateAuthUI(data.user);
      document.getElementById("authPassword").value = "";
    }
  } catch (error) {
    status.textContent = "Could not connect to the server.";
  }
}

document.getElementById("registerBtn").addEventListener("click", function() {
  authenticate("register");
});

document.getElementById("loginBtn").addEventListener("click", function() {
  authenticate("login");
});

document.getElementById("logoutBtn").addEventListener("click", function() {
  localStorage.removeItem("socialPollToken");
  localStorage.removeItem("socialPollUser");
  updateAuthUI(null);
  document.getElementById("authStatus").textContent = "You have logged out.";
});

try {
  updateAuthUI(JSON.parse(localStorage.getItem("socialPollUser") || "null"));
} catch {
  updateAuthUI(null);
}

async function loadComments(pollId) {
  const response = await fetch(
    "/api/polls/" + encodeURIComponent(pollId) + "/comments"
  );
  const data = await response.json();

  const container = document.getElementById("comments-" + pollId);
  if (!container) return;

  if (!data.success || data.comments.length === 0) {
    container.innerHTML = "<p class='meta'>No comments yet. Start the discussion!</p>";
    return;
  }

  container.innerHTML = data.comments.map(function(comment) {
    return "<div class='comment'><strong>" +
      escapeHtml(comment.author) +
      "</strong><p>" + escapeHtml(comment.text) +
      "</p><span class='meta'>" +
      new Date(comment.createdAt).toLocaleString() +
      "</span></div>";
  }).join("");
}

async function addComment(pollId) {
  const input = document.getElementById("comment-input-" + pollId);
  const authorInput = document.getElementById("comment-author-" + pollId);
  const status = document.getElementById("comment-status-" + pollId);

  const text = input.value.trim();
  const author = authorInput.value.trim() || "Guest";

  if (!text) {
    status.textContent = "Please write a comment first.";
    return;
  }

  const response = await fetch(
    "/api/polls/" + encodeURIComponent(pollId) + "/comments",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, author: author })
    }
  );

  const data = await response.json();
  status.textContent = data.message;

  if (response.ok) {
    input.value = "";
    await loadComments(pollId);
  }
}

async function loadPolls() {
  var response = await fetch("/api/polls");
  var data = await response.json();
  var list = document.getElementById("pollList");

  if (!data.polls.length) {
    list.innerHTML = "<div class='panel'>No polls yet. Create the first one!</div>";
    return;
  }

  list.innerHTML = data.polls.map(function(poll) {
    var total = poll.options.reduce(function(sum, option) {
      return sum + option.votes;
    }, 0);
    var chosen = poll.myVote;
    var options = poll.options.map(function(option, index) {
      var percent = total ? Math.round(option.votes * 100 / total) : 0;
      return "<div><button class='option " +
        (chosen === index ? "selected" : "") +
        "' onclick='vote(" + JSON.stringify(poll.id) + "," + index + ")'>" +
        escapeHtml(option.text) + "</button>" +
        "<div>" + option.votes + " vote(s) · " + percent + "%</div>" +
        "<div class='bar'><div class='fill' style='width:" + percent + "%'></div></div></div>";
    }).join("");

    return "<article class='poll'><h3>" + escapeHtml(poll.question) +
      "</h3><div class='meta'>" + total + " total vote(s)</div>" +
      options + "<div class='actions'><button class='secondary' onclick='loadPolls()'>Refresh results</button></div>" +
      "<div class='meta'>Created " + new Date(poll.createdAt).toLocaleString() +
      (chosen !== undefined ? " · Your vote is recorded" : " · Select an option to vote") +
      "</div></article>";
  }).join("");

  data.polls.forEach(function(poll) {
    const article = Array.from(
      document.querySelectorAll(".poll")
    ).find(function(card) {
      return card.querySelector("h3") &&
        card.querySelector("h3").textContent === poll.question;
    });

    if (!article || document.getElementById("comments-" + poll.id)) return;

    const section = document.createElement("section");
    section.innerHTML =
      "<hr><h4>Discussion</h4>" +
      "<input id='comment-author-" + poll.id + "' placeholder='Your name (optional)' maxlength='50'>" +
      "<textarea id='comment-input-" + poll.id + "' placeholder='Write a comment...' maxlength='500'></textarea>" +
      "<button type='button' onclick='addComment(" + JSON.stringify(poll.id) + ")'>Post comment</button>" +
      "<div id='comment-status-" + poll.id + "' class='meta'></div>" +
      "<div id='comments-" + poll.id + "'></div>";

    article.appendChild(section);
    const savedUser = JSON.parse(
  localStorage.getItem("socialPollUser") || "null"
);

if (savedUser) {
  document.getElementById("comment-author-" + poll.id).value =
    savedUser.name;
}
    loadComments(poll.id);
  });

}

async function vote(pollId, optionIndex) {
  var response = await fetch("/api/polls/" + encodeURIComponent(pollId) + "/vote", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({voterId:voterId, optionIndex:optionIndex})
  });
  var result = await response.json();
  document.getElementById("status").textContent = result.message;
  if (response.ok) await loadPolls();
}

document.getElementById("addOption").addEventListener("click", function() {
  var current = document.querySelectorAll(".pollOption").length;
  if (current >= 6) {
    document.getElementById("status").textContent = "Maximum 6 options allowed.";
    return;
  }
  var input = document.createElement("input");
  input.className = "pollOption";
  input.placeholder = "Option " + (current + 1);
  input.maxLength = 80;
  input.required = true;
  document.getElementById("extraOptions").appendChild(input);
});

document.getElementById("createForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  var question = document.getElementById("question").value.trim();
  var options = Array.from(document.querySelectorAll(".pollOption"))
    .map(function(input) { return input.value.trim(); })
    .filter(Boolean);

  if (options.length < 2 || options.length > 6) {
    document.getElementById("status").textContent = "Please provide 2–6 options.";
    return;
  }

  var response = await fetch("/api/polls", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({question:question, options:options})
  });
  var result = await response.json();
  document.getElementById("status").textContent = result.message;
  if (response.ok) {
    this.reset();
    document.getElementById("extraOptions").innerHTML = "";
    await loadPolls();
  }
});

loadPolls().catch(function() {
  document.getElementById("pollList").textContent = "Unable to load polls. Please refresh.";
});
</script>
</body>
</html>`);
});

// API: list polls and their results.
app.get("/api/polls", (req, res) => {
  const voterId = req.query.voterId;
  res.json({
    success: true,
    polls: polls.map((poll) => ({
      id: poll.id,
      question: poll.question,
      options: poll.options,
      createdAt: poll.createdAt,
      myVote: voterId ? poll.voterChoices[voterId] : undefined,
    })),
  });
});

// API: create a poll.
app.post("/api/polls", (req, res) => {
  const question = typeof req.body.question === "string"
    ? req.body.question.trim()
    : "";
  const options = Array.isArray(req.body.options)
    ? req.body.options
        .filter((option) => typeof option === "string")
        .map((option) => option.trim())
        .filter(Boolean)
    : [];

  if (!question || options.length < 2 || options.length > 6) {
    return res.status(400).json({
      success: false,
      message: "A question and 2–6 options are required.",
    });
  }

  const poll = {
    id: String(nextId++),
    question,
    options: options.map((text) => ({ text, votes: 0 })),
    voterChoices: {},
    comments: [],
    createdAt: new Date().toISOString(),
  };

  polls.unshift(poll);
  res.status(201).json({
    success: true,
    message: "Poll created successfully!",
    poll,
  });
});

// API: vote or change an existing vote.
app.post("/api/polls/:id/vote", (req, res) => {
  const poll = polls.find((item) => item.id === req.params.id);
  const voterId = typeof req.body.voterId === "string"
    ? req.body.voterId.trim()
    : "";
  const optionIndex = req.body.optionIndex;

  if (!poll) {
    return res.status(404).json({ success: false, message: "Poll not found." });
  }

  if (!voterId || voterId.length > 120) {
    return res.status(400).json({ success: false, message: "A valid voter ID is required." });
  }

  if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length) {
    return res.status(400).json({ success: false, message: "Select a valid option." });
  }

  const previousChoice = poll.voterChoices[voterId];

  if (previousChoice !== undefined) {
    poll.options[previousChoice].votes--;
  }

  poll.options[optionIndex].votes++;
  poll.voterChoices[voterId] = optionIndex;

  res.json({ success: true, message: "Your vote has been recorded!" });
});


/* API: Get comments for a poll */
app.get("/api/polls/:id/comments", (req, res) => {
  const poll = polls.find((item) => item.id === req.params.id);

  if (!poll) {
    return res.status(404).json({
      success: false,
      message: "Poll not found.",
    });
  }

  res.json({
    success: true,
    comments: poll.comments || [],
  });
});

/* API: Add a comment to a poll */
app.post("/api/polls/:id/comments", (req, res) => {
  const poll = polls.find((item) => item.id === req.params.id);
  const text =
    typeof req.body.text === "string" ? req.body.text.trim() : "";
  const author =
    typeof req.body.author === "string"
      ? req.body.author.trim()
      : "Guest";

  if (!poll) {
    return res.status(404).json({
      success: false,
      message: "Poll not found.",
    });
  }

  if (!text || text.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Comment must contain 1–500 characters.",
    });
  }

  if (!poll.comments) {
    poll.comments = [];
  }

  const comment = {
    id: Date.now().toString(),
    author: author.slice(0, 50) || "Guest",
    text,
    createdAt: new Date().toISOString(),
  };

  poll.comments.push(comment);

  res.status(201).json({
    success: true,
    message: "Comment added successfully!",
    comment,
  });
});


function createToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// Register a new user.
app.post("/api/auth/register", async (req, res) => {
  try {
    const name =
      typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!name || !email || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password (at least 8 characters) are required.",
      });
    }

    if (users.some((user) => user.email === email)) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: String(Date.now()),
      name,
      email,
      password: hashedPassword,
    };

    users.push(user);

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token: createToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to register right now.",
    });
  }
});

// Log in an existing user.
app.post("/api/auth/login", async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    const user = users.find((item) => item.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    res.json({
      success: true,
      message: "Login successful!",
      token: createToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to log in right now.",
    });
  }
});


app.listen(PORT, () => {
  console.log("Social Poll demo running at http://localhost:" + PORT);
  console.log("Using temporary in-memory data. MongoDB is not required.");
});
