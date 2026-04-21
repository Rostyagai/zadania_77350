// Pobranie elementów z DOM
const themeBtn = document.getElementById("btn-theme");
const toggleProjectsBtn = document.getElementById("btn-toggle-projects");
const themeStyleLink = document.getElementById("theme-style");
const projectsSection = document.getElementById("projects-section");

// 1. Obsługa zmiany motywu
themeBtn.addEventListener("click", function () {
  // Sprawdzamy aktualny plik CSS i zamieniamy go
  if (themeStyleLink.getAttribute("href") === "red.css") {
    themeStyleLink.setAttribute("href", "green.css");
  } else {
    themeStyleLink.setAttribute("href", "red.css");
  }
});

// 2. Obsługa ukrywania/pokazywania sekcji
toggleProjectsBtn.addEventListener("click", function () {
  // Jeśli sekcja jest widoczna (lub styl nie jest ustawiony), ukrywamy ją
  if (projectsSection.style.display === "none") {
    projectsSection.style.display = "block";
    toggleProjectsBtn.textContent = "Ukryj Projekty";
  } else {
    projectsSection.style.display = "none";
    toggleProjectsBtn.textContent = "Pokaż Projekty";
  }
});

// Potwierdzenie w konsoli, że skrypt załadował się poprawnie
console.log("Skrypt JavaScript został pomyślnie załadowany.");

// --- WALIDACJA FORMULARZA ---

const contactForm = document.getElementById("contact-form");
const successMsg = document.getElementById("form-success");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Blokujemy domyślne wysyłanie (brak backendu)

  // Pobranie pól
  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const email = document.getElementById("user-email");
  const message = document.getElementById("user-message");

  let isValid = true;

  // Funkcja pomocnicza do błędów
  const setError = (element, messageText) => {
    const errorSpan = document.getElementById(`${element.id}-error`);
    errorSpan.textContent = messageText;
    element.classList.add("invalid");
    isValid = false;
  };

  // Reset błędów
  [firstName, lastName, email, message].forEach(el => {
    el.classList.remove("invalid");
    document.getElementById(`${el.id}-error`).textContent = "";
  });
  successMsg.style.display = "none";

  // 1. Walidacja wymaganych pól
  if (!firstName.value.trim()) setError(firstName, "Imię jest wymagane.");
  if (!lastName.value.trim()) setError(lastName, "Nazwisko jest wymagane.");
  if (!email.value.trim()) setError(email, "E-mail jest wymagany.");
  if (!message.value.trim()) setError(message, "Wiadomość nie może być pusta.");

  // 2. Walidacja imienia i nazwiska (brak cyfr) - wyrażenie regularne /\d/ sprawdza czy jest cyfra
  const hasDigits = /\d/;
  if (firstName.value && hasDigits.test(firstName.value)) {
    setError(firstName, "Imię nie może zawierać cyfr.");
  }
  if (lastName.value && hasDigits.test(lastName.value)) {
    setError(lastName, "Nazwisko nie może zawierać cyfr.");
  }

  // 3. Walidacja formatu e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value && !emailRegex.test(email.value)) {
    setError(email, "Podaj poprawny adres e-mail.");
  }

  // Jeśli wszystko ok
  if (isValid) {
    successMsg.style.display = "block";
    contactForm.reset(); // Czyścimy formularz
    console.log("Formularz poprawnie zwalidowany i 'wysłany'!");
  }
});
