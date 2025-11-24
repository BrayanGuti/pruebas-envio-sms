// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber, // Necesitas importar esta función
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCalgDNSW7moAPUafOzGf92O9vhPCp1mCE",
  authDomain: "m1-firebase-fe987.firebaseapp.com",
  projectId: "m1-firebase-fe987",
  storageBucket: "m1-firebase-fe987.firebasestorage.app",
  messagingSenderId: "158735761390",
  appId: "1:158735761390:web:1217abdb9b6a9e7b1e18ff",
  measurementId: "G-NRTF7JRL16",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Firebase initialized.");

// 1. Configuración del Idioma
// Opción elegida: usar el idioma del dispositivo (la mejor práctica)
auth.useDeviceLanguage();

// 2. Definición del reCAPTCHA Invisible
// El ID 'sign-in-button' del HTML será el elemento que dispare el reCAPTCHA.
window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
  size: "invisible",
  callback: (response) => {
    // Cuando el reCAPTCHA se resuelve automáticamente,
    // la función onSignInSubmit() se llama.
    onSignInSubmit();
  },
  // Opcional: Manejar si el tiempo de respuesta expira
  "expired-callback": () => {
    console.warn("reCAPTCHA expiró. Inténtalo de nuevo.");
    // Aquí podrías resetear el reCAPTCHA si fuera necesario.
  },
});

// 3. Función de Inicio de Sesión (Se llama tras resolver el reCAPTCHA)
function onSignInSubmit() {
  // ESTE ES EL PASO CLAVE DONDE INICIAS LA AUTENTICACIÓN

  // NOTA: Debes pedirle al usuario el número de teléfono antes de llamar a esta función.
  // Usaremos un número de prueba por ahora.
  const phoneNumber = "+573001234567"; // **REEMPLAZA** con un número de prueba autorizado
  const appVerifier = window.recaptchaVerifier;

  // Aquí iría el código para enviar el SMS:
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      // Guarda el objeto 'confirmationResult' globalmente para verificar el código después.
      window.confirmationResult = confirmationResult;
      console.log(
        "SMS enviado. Ahora pide el código de verificación al usuario."
      );

      // Ocultar botón de envío y mostrar input para código
      // (Esta parte es lógica del DOM, la omito por simplicidad)
    })
    .catch((error) => {
      console.error("Error al enviar SMS y/o resolver reCAPTCHA:", error);
      // Si hay un error, el reCAPTCHA se debe resetear para que el usuario pueda intentarlo de nuevo.
      recaptchaVerifier.render().then((widgetId) => grecaptcha.reset(widgetId));
    });
}

// 4. Renderizar el reCAPTCHA por adelantado (buena práctica)
window.onload = function () {
  recaptchaVerifier.render().then((widgetId) => {
    console.log("reCAPTCHA invisible renderizado y listo.");
    // Opcional: Puedes guardar el ID del widget si lo necesitas.
    // window.recaptchaWidgetId = widgetId;
  });
};

// 5. Agregar el evento click al botón del HTML
// Para que se dispare la función onSignInSubmit al hacer clic en el botón.
document.getElementById("sign-in-button").addEventListener("click", () => {
  // Cuando el usuario hace clic, Firebase evalúa el reCAPTCHA invisible.
  // Si lo pasa, llama automáticamente a la función 'callback' (onSignInSubmit).
  console.log("Botón presionado. Esperando resolución de reCAPTCHA...");
});
