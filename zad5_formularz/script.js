document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Brak backendu - zatrzymujemy przeładowanie

    if (validateForm()) {
      // Jeśli wszystko jest ok:
      successMessage.classList.remove("hidden");
      form.reset();

      // Ukryj wiadomość po 5 sekundach
      setTimeout(() => {
        successMessage.classList.add("hidden");
      }, 5000);
    }
  });

  function validateForm() {
    let isFormValid = true;

    // Pobranie elementów
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    // Regexy
    const noDigitsRegex = /^[^0-9]+$/; // Nie może zawierać cyfr
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Podstawowy format email

    // Walidacja Imienia
    if (firstName.value.trim() === "" || !noDigitsRegex.test(firstName.value)) {
      setError(firstName);
      isFormValid = false;
    } else {
      setSuccess(firstName);
    }

    // Walidacja Nazwiska
    if (lastName.value.trim() === "" || !noDigitsRegex.test(lastName.value)) {
      setError(lastName);
      isFormValid = false;
    } else {
      setSuccess(lastName);
    }

    // Walidacja E-mail
    if (!emailRegex.test(email.value)) {
      setError(email);
      isFormValid = false;
    } else {
      setSuccess(email);
    }

    // Walidacja Wiadomości
    if (message.value.trim() === "") {
      setError(message);
      isFormValid = false;
    } else {
      setSuccess(message);
    }

    return isFormValid;
  }

  function setError(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control invalid";
  }

  function setSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control"; // Usuwamy klasę invalid
  }

  // Dodatek: Usuwanie błędów w czasie rzeczywistym podczas pisania
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.parentElement.classList.contains("invalid")) {
        setSuccess(input);
      }
    });
  });
});
