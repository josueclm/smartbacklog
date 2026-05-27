import { login } from "../services/loginService.js";


// =========================
// ELEMENTS
// =========================

const loginForm =
   document.getElementById(
      "login-form"
   );

const emailInput =
   document.getElementById(
      "email"
   );

const passwordInput =
   document.getElementById(
      "password"
   );

const submitBtn =
   document.getElementById(
      "submit-btn"
   );

const errorAlert =
   document.getElementById(
      "error-alert"
   );


// =========================
// INIT
// =========================

document.addEventListener(
   "DOMContentLoaded",
   () => {

      errorAlert.style.display =
         "none";

      bindEvents();

   }
);


// =========================
// EVENTS
// =========================

function bindEvents() {

   loginForm.addEventListener(
      "submit",
      handleLogin
   );

}


// =========================
// LOGIN
// =========================

async function handleLogin(e) {

   e.preventDefault();

   try {

      setLoading(true);

      hideError();

      const payload = {

         email:
            emailInput.value.trim(),

         password:
            passwordInput.value.trim()

      };

      const response =
         await login(payload);

      // =========================
      // SAVE USER
      // =========================

      localStorage.setItem(

         "auth_user",

         JSON.stringify(
            response.user
         )

      );

      // =========================
      // REDIRECT
      // =========================

      window.location.href =
         "../dashboard";

   } catch (error) {

      console.error(error);

      showError(
         error.message ||
         "Credenciais inválidas"
      );

   } finally {

      setLoading(false);

   }

}


// =========================
// UI
// =========================

function setLoading(state) {

   if (state) {

      submitBtn.classList.add(
         "loading"
      );

      submitBtn.disabled = true;

   } else {

      submitBtn.classList.remove(
         "loading"
      );

      submitBtn.disabled = false;

   }

}


function showError(message) {

   errorAlert.style.display =
      "flex";

   errorAlert.querySelector("p")
      .textContent = message;

}


function hideError() {

   errorAlert.style.display =
      "none";

}