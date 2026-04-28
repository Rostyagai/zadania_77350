import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// --- KONFIGURACJA FIREBASE ---
const appSettings = {
  databaseURL:
    "https://cv-firmy-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, "JobRequests");

// --- POBIERANIE ELEMENTÓW DOM ---
const contactForm = document.getElementById("contact-form");
const successMsg = document.getElementById("form-success");
const jobRequestsContainer = document.getElementById("job-requests-container");

const themeBtn = document.getElementById("btn-theme");
const toggleProjectsBtn = document.getElementById("btn-toggle-projects");
const themeStyleLink = document.getElementById("theme-style");
const projectsSection = document.getElementById("projects-section");

// --- 1. OBSŁUGA FIREBASE: POBIERANIE DANYCH W CZASIE RZECZYWISTYM ---
onValue(itemsInDB, function (snapshot) {
  // Czyścimy sekcję i dodajemy tylko tytuł na początku
  jobRequestsContainer.innerHTML =
    '<h2 class="section__title">Firmy zainteresowane mną w tej chwili:</h2>';

  if (snapshot.exists()) {
    const data = snapshot.val();
    // Zamieniamy obiekt na tablicę i odwracamy kolejność (najnowsze na górze)
    const entries = Object.values(data).reverse();

    entries.forEach((item) => {
      const htmlContent = `
        <div class="job-request-item" style="margin-bottom: 2rem; border-left: 4px solid #ce1212; padding-left: 15px;">
          <h3 class="edukacja__title">${item.company}</h3>
          <p class="section__text"><strong>Data wysłania:</strong> ${item.date}</p>
          <p class="section__text"><strong>Nadawca:</strong> ${item.sender} (${item.email})</p>
          <p class="section__text"><strong>Wiadomość od pracodawcy:</strong><br>${item.message}</p>
        </div>
      `;
      jobRequestsContainer.insertAdjacentHTML("beforeend", htmlContent);
    });
  } else {
    // Komunikat, gdy baza danych jest pusta
    jobRequestsContainer.innerHTML +=
      '<p class="section__text">Obecnie nie ma żadnych zapytań w sekcji.</p>';
  }
});

// --- 2. WALIDACJA I WYSYŁANIE FORMULARZA DO FIREBASE ---
contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Blokujemy przeładowanie strony

  // Pobieranie wartości pól
  const companyField = document.getElementById("first-name");
  const personField = document.getElementById("last-name");
  const emailField = document.getElementById("user-email");
  const messageField = document.getElementById("user-message");

  let isValid = true;

  // Funkcja pomocnicza do wyświetlania błędów
  const setError = (element, text) => {
    const errorSpan = document.getElementById(`${element.id}-error`);
    if (errorSpan) errorSpan.textContent = text;
    element.classList.add("invalid");
    isValid = false;
  };

  // Resetowanie stanów błędów przed nową walidacją
  [companyField, personField, emailField, messageField].forEach((el) => {
    el.classList.remove("invalid");
    const err = document.getElementById(`${el.id}-error`);
    if (err) err.textContent = "";
  });
  successMsg.style.display = "none";

  // Podstawowa walidacja pól
  if (!companyField.value.trim())
    setError(companyField, "Nazwa firmy jest wymagana.");
  if (!personField.value.trim())
    setError(personField, "Imię i nazwisko są wymagane.");
  if (!emailField.value.trim()) setError(emailField, "E-mail jest wymagany.");
  if (!messageField.value.trim())
    setError(messageField, "Wiadomość nie może być pusta.");

  // Jeśli walidacja przeszła pomyślnie, wysyłamy dane
  if (isValid) {
    const formData = {
      company: companyField.value,
      sender: personField.value,
      email: emailField.value,
      message: messageField.value,
      date: new Date().toLocaleString("pl-PL"), // Generowanie daty w polskim formacie
    };

    // Zapisywanie danych w Firebase pod kluczem "JobRequests"
    push(itemsInDB, formData)
      .then(() => {
        successMsg.style.display = "block"; // Pokazanie komunikatu o sukcesie
        contactForm.reset(); // Wyczyszczenie pól formularza
        console.log("Dane zostały pomyślnie wysłane do Firebase!");
      })
      .catch((err) => {
        console.error("Błąd podczas zapisu do bazy:", err);
        alert("Wystąpił błąd podczas wysyłania wiadomości.");
      });
  }
});

// --- 3. DODATKOWE FUNKCJE (MOTYW, PROJEKTY, NOTATKI) ---

// Obsługa zmiany motywu (red / green)
if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    const current = themeStyleLink.getAttribute("href");
    themeStyleLink.setAttribute(
      "href",
      current === "red.css" ? "green.css" : "red.css"
    );
  });
}

// Ukrywanie i pokazywanie sekcji projektów
if (toggleProjectsBtn) {
  toggleProjectsBtn.addEventListener("click", function () {
    const isHidden = projectsSection.style.display === "none";
    projectsSection.style.display = isHidden ? "block" : "none";
    toggleProjectsBtn.textContent = isHidden
      ? "Ukryj Projekty"
      : "Pokaż Projekty";
  });
}

// --- LOCAL STORAGE (OBSŁUGA NOTATEK) ---
const noteInput = document.getElementById("note-input");
const addNoteBtn = document.getElementById("btn-add-note");
const notesList = document.getElementById("notes-list");

let notes = JSON.parse(localStorage.getItem("userNotes")) || [];

// Funkcja wyświetlająca notatki z LocalStorage
function renderNotes() {
  if (!notesList) return;
  notesList.innerHTML = "";
  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.className = "note-item";
    li.innerHTML = `<span>${note}</span><button class="btn-delete" data-index="${index}">Usuń</button>`;
    notesList.appendChild(li);
  });
}

// Dodawanie nowej notatki
if (addNoteBtn) {
  addNoteBtn.addEventListener("click", () => {
    const text = noteInput.value.trim();
    if (text) {
      notes.push(text);
      localStorage.setItem("userNotes", JSON.stringify(notes));
      noteInput.value = "";
      renderNotes();
    }
  });
}

// Usuwanie notatki (delegacja zdarzeń)
if (notesList) {
  notesList.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      notes.splice(e.target.dataset.index, 1);
      localStorage.setItem("userNotes", JSON.stringify(notes));
      renderNotes();
    }
  });
}

// Inicjalizacja notatek przy starcie
renderNotes();
console.log("Skrypt JavaScript załadowany poprawnie z komentarzami PL.");
