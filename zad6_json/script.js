document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.thecatapi.com/v1/breeds?limit=52";
  const gallery = document.getElementById("catGallery");
  const temperamentList = document.getElementById("temperamentList");

  // Główna funkcja pobierająca dane
  async function fetchCats() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Błąd pobierania danych");

      const data = await response.json();

      // Czyścimy kontenery przed wstawieniem danych
      gallery.innerHTML = "";
      temperamentList.innerHTML = "";

      renderTemperaments(data);
      renderCatCards(data);
    } catch (error) {
      console.error(error);
      gallery.innerHTML = `<p style="color:red">Nie udało się załadować kotków: ${error.message}</p>`;
    }
  }

  // Funkcja generująca Listę 1: Tagi temperamentów
  function renderTemperaments(cats) {
    // Zbieramy wszystkie temperamenty, dzielimy je i wybieramy unikalne
    let allTemperaments = [];
    cats.forEach((cat) => {
      if (cat.temperament) {
        allTemperaments.push(...cat.temperament.split(", "));
      }
    });

    // Wybieramy tylko 15 unikalnych losowych cech
    const uniqueTraits = [...new Set(allTemperaments)].slice(0, 15);

    uniqueTraits.forEach((trait) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = trait;
      temperamentList.appendChild(span);
    });
  }

  // Funkcja generująca Listę 2: Karty z kotami
  function renderCatCards(cats) {
    cats.forEach((cat) => {
      // Tworzymy szkielet karty
      const card = document.createElement("article");
      card.className = "cat-card";

      // Ponieważ lista ras nie zawsze ma od razu zdjęcie,
      // API udostępnia reference_image_id
      const imageUrl = cat.image
        ? cat.image.url
        : `https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg`;

      card.innerHTML = `
                <img src="${imageUrl}" alt="${
        cat.name
      }" class="cat-img" onerror="this.src='https://placehold.co/600x400?text=Brak+zdjęcia'">
                <div class="cat-info">
                    <span class="origin">${cat.origin}</span>
                    <h2>${cat.name}</h2>
                    <p>${cat.description.substring(0, 120)}...</p>
                    <div class="temperament-small">
                        <strong>Cechy:</strong> ${cat.temperament}
                    </div>
                </div>
            `;

      gallery.appendChild(card);
    });
  }

  // Uruchomienie pobierania
  fetchCats();
});
