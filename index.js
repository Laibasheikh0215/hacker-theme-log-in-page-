// Matrix Background
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];
for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0f0";
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

// Connection Nodes
function createNodes() {
  const nodesContainer = document.getElementById("nodesContainer");
  const nodeCount = 15;
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const node = document.createElement("div");
    node.className = "node";
    node.style.left = `${Math.random() * 100}%`;
    node.style.top = `${Math.random() * 100}%`;
    nodesContainer.appendChild(node);
    nodes.push({
      element: node,
      x: parseFloat(node.style.left),
      y: parseFloat(node.style.top),
    });
  }

  // Create connections between close nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 40) {
        const connection = document.createElement("div");
        connection.className = "connection";

        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const length = distance;

        connection.style.width = `${length}%`;
        connection.style.left = `${nodes[i].x}%`;
        connection.style.top = `${nodes[i].y}%`;
        connection.style.transform = `rotate(${angle}deg)`;

        nodesContainer.appendChild(connection);
      }
    }
  }
}

// Terminal Output Management
const terminalOutput = document.getElementById("terminalOutput");

function addOutputLine(promptText, command, type = "command") {
  const outputLine = document.createElement("div");
  outputLine.className = "output-line";

  const prompt = document.createElement("div");
  prompt.className = "prompt";
  if (promptText) prompt.textContent = promptText;

  const content = document.createElement("div");
  content.className = type;
  content.textContent = command;

  outputLine.appendChild(prompt);
  outputLine.appendChild(content);

  terminalOutput.appendChild(outputLine);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Initialize
window.addEventListener("load", function () {
  // Start matrix animation
  setInterval(drawMatrix, 50);

  // Create nodes
  createNodes();

  // Add initial system messages
  setTimeout(() => {
    addOutputLine("", "scan_network --subnet 192.168.1.0/24", "command");
    setTimeout(() => {
      addOutputLine("", "[+] 24 ACTIVE HOSTS DETECTED", "response");
      addOutputline("", "[+] 3 PORTS OPEN ON TARGET", "response");
    }, 300);
  }, 500);

  // Add blinking cursor to last line
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  const lastLine = document.querySelector(".output-line:last-child .command");
  if (lastLine) lastLine.appendChild(cursor);
});

// Window Controls
document.getElementById("closeBtn").addEventListener("click", function () {
  addOutputLine("root@darknet:~$", "shutdown --now", "command");
  setTimeout(() => {
    addOutputLine("", "[!] SYSTEM SHUTDOWN INITIATED", "response error");
    setTimeout(() => {
      document.body.style.opacity = "0";
      setTimeout(() => {
        alert("TERMINAL DISCONNECTED");
        document.body.style.opacity = "1";
      }, 500);
    }, 1000);
  }, 300);
});

document.getElementById("minimizeBtn").addEventListener("click", function () {
  document.querySelector(".terminal-window").style.transform = "scale(0.9)";
  document.querySelector(".terminal-window").style.opacity = "0.7";
  setTimeout(() => {
    document.querySelector(".terminal-window").style.transform = "";
    document.querySelector(".terminal-window").style.opacity = "";
  }, 500);
});

document.getElementById("maximizeBtn").addEventListener("click", function () {
  const terminal = document.querySelector(".terminal-window");
  if (terminal.style.width === "100vw") {
    terminal.style.width = "";
    terminal.style.height = "";
    terminal.style.maxWidth = "900px";
    terminal.style.height = "85vh";
  } else {
    terminal.style.width = "100vw";
    terminal.style.height = "100vh";
    terminal.style.maxWidth = "none";
    terminal.style.borderRadius = "0";
  }
});

// Password Toggle
document
  .getElementById("passwordToggle")
  .addEventListener("click", function () {
    const passwordField = document.getElementById("encryptionKey");
    const icon = this.querySelector("i");

    if (passwordField.type === "password") {
      passwordField.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordField.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });

// Brute Force Button
document.getElementById("bruteForceBtn").addEventListener("click", function () {
  addOutputLine(
    "root@darknet:~$",
    "bruteforce --target auth_server --wordlist darkweb.list",
    "command"
  );

  const btn = this;
  btn.innerHTML = '<i class="fas fa-cog fa-spin"></i> BRUTE FORCING...';
  btn.disabled = true;

  setTimeout(() => {
    addOutputLine("", "[!] BRUTE FORCE ATTEMPT DETECTED", "response error");
    addOutputLine("", "[!] COUNTERMEASURES ACTIVATED", "response error");
    addOutputLine("", "[!] YOUR IP HAS BEEN LOGGED", "response error");

    // Show access log
    document.getElementById("accessLog").style.display = "block";
    setTimeout(() => {
      document.getElementById("accessLog").style.display = "none";
    }, 5000);

    btn.innerHTML = '<i class="fas fa-bolt"></i> BRUTE FORCE';
    btn.disabled = false;
  }, 2000);
});

// Ghost Mode Button
document.getElementById("ghostModeBtn").addEventListener("click", function () {
  addOutputLine("root@darknet:~$", "activate_ghost_mode --stealth", "command");

  const btn = this;
  btn.innerHTML = '<i class="fas fa-user-ninja"></i> GHOST ACTIVE';
  btn.style.backgroundColor = "#003300";

  // Add ghost mode effects
  document.querySelector(".scanlines").style.opacity = "0.1";
  document.getElementById("matrix").style.opacity = "0.1";

  setTimeout(() => {
    addOutputLine("", "[+] GHOST MODE ACTIVATED", "response success");
    addOutputLine("", "[+] IP SPOOFING: ACTIVE", "response");
    addOutputLine("", "[+] TRACE ROUTE: DISABLED", "response");
    addOutputLine("", "[+] ENCRYPTION: DOUBLE LAYER", "response");
  }, 500);

  // Revert after 10 seconds
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-ghost"></i> GHOST MODE';
    btn.style.backgroundColor = "";
    document.querySelector(".scanlines").style.opacity = "";
    document.getElementById("matrix").style.opacity = "0.3";
    addOutputLine("root@darknet:~$", "deactivate_ghost_mode", "command");
    addOutputLine("", "[+] GHOST MODE DEACTIVATED", "response");
  }, 10000);
});

// Login Form Submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const accessId = document.getElementById("accessId").value;
  const encryptionKey = document.getElementById("encryptionKey").value;
  const loginBtn = document.getElementById("loginBtn");

  addOutputLine(
    "root@darknet:~$",
    `auth --user ${accessId} --key ********`,
    "command"
  );

  // Show loading state
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> DECRYPTING...';
  loginBtn.disabled = true;

  // Simulate hacking/authentication process
  setTimeout(() => {
    addOutputLine("", "[+] VERIFYING CREDENTIALS...", "response");

    setTimeout(() => {
      addOutputLine("", "[+] CHECKING ENCRYPTION KEY...", "response");

      setTimeout(() => {
        if (accessId && encryptionKey) {
          // Success
          addOutputLine("", "[+] CREDENTIALS VERIFIED", "response success");
          addOutputLine("", "[+] ACCESS GRANTED", "response success");
          addOutputLine("", "[+] WELCOME TO THE DARKNET", "response success");

          loginBtn.innerHTML = '<i class="fas fa-check"></i> ACCESS GRANTED';
          loginBtn.style.backgroundColor = "#003300";
          loginBtn.style.color = "#0f0";

          // Add success effects
          document.querySelector(".terminal-window").style.boxShadow =
            "0 0 30px rgba(0, 255, 0, 0.7), inset 0 0 20px rgba(0, 255, 0, 0.2)";

          // Show success message
          setTimeout(() => {
            alert(`ACCESS GRANTED\nWELCOME, ${accessId.toUpperCase()}`);
            loginBtn.innerHTML =
              '<i class="fas fa-unlock"></i> INITIATE ACCESS';
            loginBtn.style.backgroundColor = "";
            loginBtn.style.color = "";
            loginBtn.disabled = false;
            document.getElementById("loginForm").reset();
            document.querySelector(".terminal-window").style.boxShadow = "";
          }, 1500);
        } else {
          // Failure
          addOutputLine("", "[!] INVALID CREDENTIALS", "response error");
          addOutputLine("", "[!] ACCESS DENIED", "response error");
          addOutputLine("", "[!] LOCKDOWN INITIATED", "response error");

          loginBtn.innerHTML = '<i class="fas fa-times"></i> ACCESS DENIED';
          loginBtn.style.backgroundColor = "#330000";
          loginBtn.style.color = "#f00";

          // Add error effects
          document.querySelector(".terminal-window").style.boxShadow =
            "0 0 30px rgba(255, 0, 0, 0.7), inset 0 0 20px rgba(255, 0, 0, 0.2)";

          // Show access log
          document.getElementById("accessLog").style.display = "block";

          setTimeout(() => {
            loginBtn.innerHTML =
              '<i class="fas fa-unlock"></i> INITIATE ACCESS';
            loginBtn.style.backgroundColor = "";
            loginBtn.style.color = "";
            loginBtn.disabled = false;
            document.getElementById("accessLog").style.display = "none";
            document.querySelector(".terminal-window").style.boxShadow = "";
          }, 3000);
        }
      }, 1000);
    }, 1000);
  }, 1000);
});

// Resize canvas on window resize
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
