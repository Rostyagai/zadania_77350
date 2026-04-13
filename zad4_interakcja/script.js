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
