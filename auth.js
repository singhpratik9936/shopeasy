
import { auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Registration
const registerForm = document.querySelector("#registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    const message = document.querySelector("#message");

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await updateProfile(userCredential.user, {
        displayName: name
      });

      message.textContent = "Registration successful!";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);

    } catch (error) {
      message.textContent = error.message;
    }
  });
}

// Login
const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value;

    const message = document.querySelector("#loginMessage");

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      message.textContent = "Login successful!";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);

    } catch (error) {
      message.textContent = "Login failed. Check your details.";
      console.error(error);
    }
  });
}