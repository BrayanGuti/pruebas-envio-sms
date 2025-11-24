// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCalgDNSW7moAPUafOzGf92O9vhPCp1mCE",
  authDomain: "m1-firebase-fe987.firebaseapp.com",
  projectId: "m1-firebase-fe987",
  storageBucket: "m1-firebase-fe987.firebasestorage.app",
  messagingSenderId: "158735761390",
  appId: "1:158735761390:web:1217abdb9b6a9e7b1e18ff",
  measurementId: "G-NRTF7JRL16",
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Variables globales para el flujo
let confirmationResult = null;
let recaptchaVerifier;

console.log("Firebase initialized.");

// Configuración del Idioma del reCAPTCHA
auth.useDeviceLanguage();

// Función de Inicio de Sesión
function onSignInSubmit() {
  const phoneNumberInput = document.getElementById("phone-number-input");
  const phoneNumber = phoneNumberInput.value.trim();

  const appVerifier = recaptchaVerifier;

  // Código para enviar el SMS
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((result) => {
      confirmationResult = result;
      console.log("SMS enviado. Ahora pide el código de verificación.");

      // Cambiar la UI
      document.getElementById("phone-form").style.display = "none";
      document.getElementById("verification-form").style.display = "block";
    })
    .catch((error) => {
      console.error("Error al enviar SMS:", error);
      alert("Error al enviar código: " + error.message);
      // Resetear el reCAPTCHA si hay error
      recaptchaVerifier.clear();
      setupRecaptcha();
    });
}

// Función de Verificación del Código
function verifyCodeSubmit() {
  const codeInput = document.getElementById("verification-code-input");
  const code = codeInput.value.trim();

  if (!confirmationResult || !code) {
    alert("Falta el código de confirmación.");
    return;
  }

  // Validar el código
  confirmationResult
    .confirm(code)
    .then((result) => {
      const user = result.user;
      console.log("¡Usuario conectado! UID:", user.uid);
      alert(`¡Acceso exitoso! Bienvenido ${user.phoneNumber}`);

      // Cambiar la UI a mensaje de éxito
      document.getElementById(
        "verification-form"
      ).innerHTML = `<h2>✅ ¡Acceso exitoso! Bienvenido, ${user.phoneNumber}</h2>`;
    })
    .catch((error) => {
      console.error("Error al verificar código:", error);
      alert(
        "Código de verificación incorrecto. El código de prueba es 123456."
      );
    });
}

// Función para configurar el reCAPTCHA
function setupRecaptcha() {
  recaptchaVerifier = new RecaptchaVerifier(
    "sign-in-button", // ID del elemento (string)
    {
      size: "invisible",
      callback: (response) => {
        // Se ejecuta cuando reCAPTCHA se resuelve exitosamente
        onSignInSubmit();
      },
      "expired-callback": () => {
        console.warn("reCAPTCHA expiró.");
      },
    },
    auth // Auth como TERCER parámetro
  );
}

// INICIALIZACIÓN
window.onload = function () {
  console.log("DOM cargado, inicializando reCAPTCHA...");

  // Configurar reCAPTCHA
  setupRecaptcha();

  // Renderizar el reCAPTCHA
  recaptchaVerifier
    .render()
    .then((widgetId) => {
      console.log("reCAPTCHA invisible renderizado. Widget ID:", widgetId);
    })
    .catch((error) => {
      console.error("Error al renderizar reCAPTCHA:", error);
    });

  // Event Listener para verificar el código
  document
    .getElementById("verify-code-button")
    .addEventListener("click", verifyCodeSubmit);
};
