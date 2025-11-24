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
let confirmationResult = null; // Guardará el resultado de signInWithPhoneNumber

console.log("Firebase initialized.");

// 1. Configuración del Idioma
auth.useDeviceLanguage();

// 2. Definición del reCAPTCHA Invisible (vinculado al botón 'sign-in-button')
window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
  size: "invisible",
  callback: (response) => {
    // reCAPTCHA resuelto automáticamente
    onSignInSubmit();
  },
  "expired-callback": () => {
    console.warn("reCAPTCHA expiró.");
  },
});

// 3. Función de Inicio de Sesión (Se llama tras resolver el reCAPTCHA)
function onSignInSubmit() {
  // Obtenemos el número del input HTML
  const phoneNumberInput = document.getElementById("phone-number-input");
  const phoneNumber = phoneNumberInput.value.trim();
  const appVerifier = window.recaptchaVerifier;

  // Validación básica del número de prueba
  if (phoneNumber !== "+573014856811") {
    alert("Por favor usa el número de prueba: +573014856811");
    return;
  }

  // Código para enviar el SMS:
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((result) => {
      // Guarda el resultado globalmente para usarlo en la función 'confirm'.
      confirmationResult = result;
      console.log("SMS enviado. Ahora pide el código de verificación.");

      // **Lógica del DOM para cambiar la UI**
      document.getElementById("phone-form").style.display = "none";
      document.getElementById("verification-form").style.display = "block";
    })
    .catch((error) => {
      console.error("Error al enviar SMS:", error);
      alert("Error al enviar código: " + error.message);
      recaptchaVerifier.render().then((widgetId) => grecaptcha.reset(widgetId));
    });
}

// 4. Función de Verificación del Código (Implementación del Paso 4)
function verifyCodeSubmit() {
  const codeInput = document.getElementById("verification-code-input");
  const code = codeInput.value.trim();

  if (!confirmationResult || !code) {
    alert("Falta el código de confirmación o el resultado de la confirmación.");
    return;
  }

  // Llamada a confirm para validar el código
  confirmationResult
    .confirm(code)
    .then((result) => {
      // Usuario conectado exitosamente.
      const user = result.user;
      console.log("¡Usuario conectado! UID:", user.uid);
      alert(`¡Acceso exitoso! Bienvenido ${user.phoneNumber}`);

      // Opcional: Redirigir o limpiar formularios
      document.getElementById(
        "verification-form"
      ).innerHTML = `<h2>¡Bienvenido, ${user.phoneNumber}!</h2>`;
    })
    .catch((error) => {
      // Código incorrecto, expirado, etc.
      console.error("Error al verificar código:", error);
      alert(
        "Código de verificación incorrecto. El código de prueba es 123456."
      );
    });
}

// 5. Agregar Event Listeners a los botones
window.onload = function () {
  // Inicializa el reCAPTCHA invisible
  recaptchaVerifier.render().then((widgetId) => {
    console.log("reCAPTCHA invisible renderizado y listo.");
  });

  // Evento para enviar el código (dispara reCAPTCHA)
  document.getElementById("sign-in-button").addEventListener("click", () => {
    console.log("Botón presionado. Esperando resolución de reCAPTCHA...");
  });

  // Evento para verificar el código
  document
    .getElementById("verify-code-button")
    .addEventListener("click", verifyCodeSubmit);
};
