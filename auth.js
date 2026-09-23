import { auth } from "./firebase-config.js";
import { toast } from "./app.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ---------- Password show/hide ---------- */
document.querySelectorAll(".toggle-pw").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(`#${btn.dataset.target}`);
    if (!target) return;
    const isHidden = target.type === "password";
    target.type = isHidden ? "text" : "password";
    btn.textContent = isHidden ? "Hide" : "Show";
  });
});

/* ---------- Password strength meter (register page) ---------- */
const passwordInput = document.querySelector("#password");
const strengthFill = document.querySelector("#strengthFill");
const strengthLabel = document.querySelector("#strengthLabel");

if (passwordInput && strengthFill && strengthLabel) {
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
      { width: "0%", color: "var(--border)", label: "Password strength" },
      { width: "20%", color: "var(--danger)", label: "Very weak" },
      { width: "40%", color: "var(--danger)", label: "Weak" },
      { width: "60%", color: "#f59e0b", label: "Okay" },
      { width: "80%", color: "#eab308", label: "Good" },
      { width: "100%", color: "var(--success)", label: "Strong" }
    ];

    const level = levels[Math.min(score, 5)];
    strengthFill.style.width = level.width;
    strengthFill.style.background = level.color;
    strengthLabel.textContent = val ? level.label : "Password strength";
  });
}

/* ---------- Button loading helper ---------- */
function setLoading(button, loading, label) {
  if (!button) return;
  button.disabled = loading;
  button.innerHTML = loading
    ? `<span class="spinner"></span>${label}…`
    : label;
}

/* ---------- Registration ---------- */
const registerForm = document.querySelector("#registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    const message = document.querySelector("#message");
    const submitBtn = document.querySelector("#registerSubmit");

    setLoading(submitBtn, true, "Creating account");
    message.textContent = "";

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName: name });

      toast("Registration successful! Redirecting…", "success");
      message.textContent = "Registration successful!";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);

    } catch (error) {
      setLoading(submitBtn, false, "Register");
      message.textContent = friendlyError(error);
      toast(friendlyError(error), "error");
    }
  });
}

/* ---------- Login ---------- */
const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value;

    const message = document.querySelector("#loginMessage");
    const submitBtn = document.querySelector("#loginSubmit");

    setLoading(submitBtn, true, "Logging in");
    message.textContent = "";

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast("Login successful! Redirecting…", "success");
      message.textContent = "Login successful!";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);

    } catch (error) {
      setLoading(submitBtn, false, "Login");
      message.textContent = "Login failed. Check your details.";
      toast("Login failed. Check your details.", "error");
      console.error(error);
    }
  });
}

/* ---------- Friendly Firebase error messages ---------- */
function friendlyError(error) {
  const code = error.code || "";
  if (code.includes("email-already-in-use")) return "That email is already registered.";
  if (code.includes("invalid-email")) return "Enter a valid email address.";
  if (code.includes("weak-password")) return "Password is too weak (6+ characters).";
  return error.message || "Something went wrong.";
}
