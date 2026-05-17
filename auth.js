const AUTH_SESSION_KEY = "simplePosAuthSession";
const AUTH_USERS_KEY = "simplePosRegisteredUsers";

const demoUsers = [
  {
    email: "admin@simplepos.local",
    password: "admin123",
    name: "Store Admin",
    role: "admin",
  },
  {
    email: "sales@simplepos.local",
    password: "sales123",
    name: "Sales User",
    role: "user",
  },
];

function getAuthSession() {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function allUsers() {
  return [...demoUsers, ...getRegisteredUsers()];
}

function setAuthSession(user) {
  sessionStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
      signedInAt: new Date().toISOString(),
    }),
  );
}

function clearAuthSession() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

function redirectToLogin() {
  const next = encodeURIComponent(`${location.pathname}${location.search}${location.hash}`);
  location.href = `./login.html?next=${next}`;
}

function requireLoginForPurchase() {
  if (getAuthSession()) {
    return true;
  }
  redirectToLogin();
  return false;
}

function userCanAccess(session, allowedRoles) {
  return Boolean(session && allowedRoles.includes(session.role));
}

function protectCurrentPage() {
  const required = document.body.dataset.authRequired;
  if (!required) {
    return;
  }
  const allowedRoles = required.split(",").map((role) => role.trim());
  const session = getAuthSession();
  if (!userCanAccess(session, allowedRoles)) {
    redirectToLogin();
  }
}

function renderAuthChrome() {
  const session = getAuthSession();
  document.querySelectorAll("[data-auth-label]").forEach((node) => {
    node.textContent = session ? `${session.name} | ${session.role}` : "";
    node.hidden = !session;
  });
  document.querySelectorAll("[data-login-link]").forEach((link) => {
    link.hidden = Boolean(session);
  });
  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.hidden = !session;
    button.addEventListener("click", () => {
      clearAuthSession();
      location.href = "./login.html";
    });
  });
}

function setupLoginForm() {
  const form = document.querySelector("#loginForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;
    const user = allUsers().find((candidate) => candidate.email === email && candidate.password === password);
    const errorNode = document.querySelector("#loginError");

    if (!user) {
      errorNode.textContent = "Invalid email or password.";
      return;
    }

    setAuthSession(user);
    const params = new URLSearchParams(location.search);
    location.href = params.get("next") || (user.role === "admin" ? "./admin.html" : "./index.html");
  });
}

function setupSignupForm() {
  const form = document.querySelector("#signupForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const businessName = form.elements.businessName.value.trim();
    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;
    const errorNode = document.querySelector("#signupError");

    if (allUsers().some((user) => user.email === email)) {
      errorNode.textContent = "An account with this email already exists.";
      return;
    }

    const user = {
      email,
      password,
      name,
      businessName,
      role: "user",
      verified: false,
      createdAt: new Date().toISOString(),
    };
    const users = getRegisteredUsers();
    users.push(user);
    saveRegisteredUsers(users);
    setAuthSession(user);

    const params = new URLSearchParams(location.search);
    location.href = params.get("next") || "./index.html";
  });
}

function setupAuthTabs() {
  const tabs = document.querySelectorAll("[data-auth-tab]");
  if (!tabs.length) {
    return;
  }
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selected = tab.dataset.authTab;
      tabs.forEach((candidate) => {
        candidate.classList.toggle("is-active", candidate.dataset.authTab === selected);
      });
      document.querySelectorAll("[data-auth-panel]").forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.authPanel === selected);
      });
    });
  });
}

protectCurrentPage();
renderAuthChrome();
setupAuthTabs();
setupLoginForm();
setupSignupForm();

window.simplePosAuth = {
  getSession: getAuthSession,
  requireLoginForPurchase,
};
