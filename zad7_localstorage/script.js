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

// --- ZADANIE 7: OBSŁUGA LOCAL STORAGE ---

const noteInput = document.getElementById("note-input");
const addNoteBtn = document.getElementById("btn-add-note");
const notesList = document.getElementById("notes-list");

// 1. Odczyt danych: Pobieramy notatki z localStorage przy starcie strony
// Jeśli nic nie ma, tworzymy pustą tablicę
let notes = JSON.parse(localStorage.getItem("userNotes")) || [];

// 2. Funkcja wyświetlająca (renderująca) notatki na stronie
function renderNotes() {
  notesList.innerHTML = ""; // Czyścimy listę przed odświeżeniem

  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.className = "note-item";
    
    li.innerHTML = `
      <span>${note}</span>
      <button class="btn-delete" data-index="${index}">Usuń</button>
    `;
    
    notesList.appendChild(li);
  });
}

// 3. Dodawanie nowej notatki
addNoteBtn.addEventListener("click", function() {
  const text = noteInput.value.trim();
  
  if (text !== "") {
    notes.push(text); // Dodajemy do tablicy
    localStorage.setItem("userNotes", JSON.stringify(notes)); // Zapisujemy w localStorage
    noteInput.value = ""; // Czyścimy pole wpisywania
    renderNotes(); // Odświeżamy widok
  } else {
    alert("Wpisz treść notatki przed dodaniem!");
  }
});

// 4. Usuwanie notatki (używamy delegacji zdarzeń)
notesList.addEventListener("click", function(event) {
  if (event.target.classList.contains("btn-delete")) {
    const index = event.target.getAttribute("data-index");
    
    notes.splice(index, 1); // Usuwamy element z tablicy
    localStorage.setItem("userNotes", JSON.stringify(notes)); // Aktualizujemy localStorage
    renderNotes(); // Odświeżamy widok
  }
});

// Wywołujemy renderowanie na starcie, aby pokazać zapisane dane
renderNotes();

// --- OBSŁUGA PLANU NAUKI (DODATKOWY LOCAL STORAGE) ---

const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("btn-add-todo");
const todoList = document.getElementById("todo-list");
const clearAllBtn = document.getElementById("btn-clear-all");

// 1. Inicjalizacja danych (pobieramy lub tworzymy pustą listę)
let todos = JSON.parse(localStorage.getItem("learningPlan")) || [];

function renderTodos() {
  todoList.innerHTML = "";
  
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
      <span>${todo.text}</span>
      <button class="btn-delete" data-index="${index}" style="padding: 2px 8px;">×</button>
    `;
    
    todoList.appendChild(li);
  });
  // Zapisujemy aktualny stan po każdej zmianie
  localStorage.setItem("learningPlan", JSON.stringify(todos));
}

// 2. Dodawanie
addTodoBtn.addEventListener("click", () => {
  const val = todoInput.value.trim();
  if (val) {
    todos.push({ text: val, completed: false });
    todoInput.value = "";
    renderTodos();
  }
});

// 3. Obsługa kliknięć (Zaznaczanie i Usuwanie)
todoList.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  
  if (e.target.classList.contains("todo-checkbox")) {
    todos[index].completed = e.target.checked;
    renderTodos();
  } 
  else if (e.target.classList.contains("btn-delete")) {
    todos.splice(index, 1);
    renderTodos();
  }
});

// 4. Wyczyść wszystko
clearAllBtn.addEventListener("click", () => {
  if (confirm("Czy na pewno chcesz usunąć cały plan?")) {
    todos = [];
    renderTodos();
  }
});

// Start
renderTodos();
