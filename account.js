// Accounts are stored in this browser only (localStorage) — there is no server.
const USERS_STORAGE_KEY = 'gge-eletronicnet-users';
const SESSION_STORAGE_KEY = 'gge-eletronicnet-session';

function readUsers() {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function currentUser() {
  try {
    const email = localStorage.getItem(SESSION_STORAGE_KEY);
    return readUsers().find((user) => user.email === email) || null;
  } catch (error) {
    return null;
  }
}

function setSession(email) {
  if (email) {
    localStorage.setItem(SESSION_STORAGE_KEY, email);
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

// Passwords are saved as a SHA-256 hash, never as plain text.
async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function updateAccountLink() {
  const user = currentUser();
  document.querySelectorAll('.header-icons a[href="account.html"]').forEach((accountLink) => {
    accountLink.textContent = user ? `Hi, ${user.name.split(' ')[0]}` : 'Account';
  });
}

function showMessage(form, text, isSuccess) {
  const message = form.querySelector('.form-message');
  message.textContent = text;
  message.classList.toggle('success', Boolean(isSuccess));
}

function renderAccountPage() {
  const welcome = document.querySelector('.account-welcome');
  if (!welcome) return;

  const user = currentUser();
  welcome.hidden = !user;
  document.querySelector('.account-forms').hidden = Boolean(user);

  if (user) {
    welcome.querySelector('.account-name').textContent = user.name;
    welcome.querySelector('.account-email').textContent = user.email;
  }
  updateAccountLink();
}

function bindAccountForms() {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  if (!signupForm || !loginForm) return;

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = signupForm.elements.name.value.trim();
    const email = signupForm.elements.email.value.trim().toLowerCase();
    const password = signupForm.elements.password.value;
    const users = readUsers();

    if (!name || !email || !password) return showMessage(signupForm, 'Please fill in all fields.');
    if (!signupForm.elements.email.checkValidity()) return showMessage(signupForm, 'Please enter a valid email address.');
    if (password.length < 6) return showMessage(signupForm, 'Password must have at least 6 characters.');
    if (password !== signupForm.elements.confirm.value) return showMessage(signupForm, 'Passwords do not match.');
    if (users.some((user) => user.email === email)) return showMessage(signupForm, 'An account with this email already exists.');

    users.push({ name, email, passwordHash: await hashPassword(password) });
    writeUsers(users);
    setSession(email);
    signupForm.reset();
    renderAccountPage();
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = loginForm.elements.email.value.trim().toLowerCase();
    const user = readUsers().find((storedUser) => storedUser.email === email);

    if (!user || user.passwordHash !== await hashPassword(loginForm.elements.password.value)) {
      return showMessage(loginForm, 'Incorrect email or password.');
    }

    setSession(email);
    loginForm.reset();
    renderAccountPage();
  });

  document.querySelector('.logout-btn').addEventListener('click', () => {
    setSession(null);
    showMessage(loginForm, 'You have been logged out.', true);
    renderAccountPage();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateAccountLink();
  bindAccountForms();
  renderAccountPage();
});
