import { useState, useEffect } from 'react';
// Uvoz React hook-ova `useState` i `useEffect` za rad sa stanjem i efektima.

import api from '../api/posts';
// Uvoz API instance za slanje zahteva ka serveru.

// Funkcija za generisanje unikatnih nijansi na osnovu HSL-a.
const generateShades = (baseColor, numberOfShades) => {
  const shades = []; 
  // Niz koji će sadržati generisane nijanse.
  const lightnessStep = 80 / (numberOfShades + 1); 
  // Korak za promenu svetline u HSL.

  for (let i = 1; i <= numberOfShades; i++) {
    // Petlja za generisanje nijansi.
    const hslShade = `hsl(96, 47%, ${20 + i * lightnessStep}%)`; 
    // Generisanje HSL nijanse sa baznom bojom i promenljivom svetlinom.
    shades.push(hslShade); 
    // Dodavanje generisane nijanse u niz.
  }

  return shades; 
  // Vraćamo niz nijansi.
};

const useCharts = () => {
  // Definišemo prilagođeni React hook za dohvaćanje podataka za grafikone.

  const [chartData, setChartData] = useState({});
  // State za čuvanje podataka za grafikone.
  const [loading, setLoading] = useState(true);
  // State za praćenje stanja učitavanja podataka.
  const [error, setError] = useState(null);
  // State za čuvanje grešaka prilikom dohvatanja podataka.

  useEffect(() => {
    // Efekat koji se pokreće jednom pri montaži komponente.

    const fetchData = async () => {
      // Asinhrona funkcija za dohvaćanje podataka.
      setLoading(true); 
      // Postavljamo stanje učitavanja na `true`.
      setError(null); 
      // Resetujemo stanje greške.

      try {
        const userResponse = await api.get(`/users`);
        // Dohvatanje liste korisnika sa servera.
        const users = userResponse.data;

        const genderCounts = users.reduce((acc, user) => {
          // Grupisanje korisnika po polu.
          acc[user.gender] = (acc[user.gender] || 0) + 1;
          return acc;
        }, {});

        const genderShades = generateShades('#91d370', Object.keys(genderCounts).length);
        // Generisanje nijansi za grafik polova.

        const pieData = {
          labels: Object.keys(genderCounts),
          // Oznake za grafik na osnovu polova.
          datasets: [{
            label: 'Gender Distribution',
            data: Object.values(genderCounts),
            // Broj korisnika po polovima.
            backgroundColor: genderShades,
            // Koristimo generisane nijanse za pozadinu grafikona.
            hoverBackgroundColor: genderShades.map(shade => shade.replace(/(\d+)%\)$/, (_, lightness) =>
              `${Math.min(100, parseInt(lightness) + 10)}%)`))
            // Svetlije nijanse za hover efekat.
          }]
        };

        const barData = {
          labels: users.map(user => user.name),
          // Imena korisnika kao oznake.
          datasets: [{
            label: 'Number of Messages',
            data: users.map(user => user.messages.length),
            // Broj poruka po korisnicima.
            backgroundColor: genderShades[0],
            // Koristimo prvu nijansu za pozadinu.
            borderColor: 'rgba(186, 177, 177, 0.3)',
            borderWidth: 1
          }]
        };

        const animalResponse = await api.get(`/animals`);
        // Dohvatanje podataka o životinjama.
        const animals = animalResponse.data;

        const breedCountPerSpecies = animals.reduce((acc, animal) => {
          // Grupisanje broja rasa po vrstama.
          acc[animal.species] = (acc[animal.species] || 0) + 1;
          return acc;
        }, {});

        const speciesShades = generateShades('#91d370', Object.keys(breedCountPerSpecies).length);
        // Generisanje nijansi za grafik rasa.

        const animalBreedsBarData = {
          labels: Object.keys(breedCountPerSpecies),
          datasets: [{
            label: 'Number of Breeds per Species',
            data: Object.values(breedCountPerSpecies),
            backgroundColor: speciesShades,
            borderColor: 'rgba(186, 177, 177, 0.3)',
            borderWidth: 1
          }]
        };

        const habitatCounts = animals.reduce((acc, animal) => {
          // Grupisanje životinja po tipu staništa.
          acc[animal.habitatType] = (acc[animal.habitatType] || 0) + 1;
          return acc;
        }, {});

        const habitatShades = generateShades('#91d370', Object.keys(habitatCounts).length);
        // Generisanje nijansi za grafik staništa.

        const habitatPieData = {
          labels: Object.keys(habitatCounts),
          datasets: [{
            label: 'Habitat Distribution',
            data: Object.values(habitatCounts),
            backgroundColor: habitatShades,
            hoverBackgroundColor: habitatShades.map(shade => shade.replace(/(\d+)%\)$/, (_, lightness) =>
              `${Math.min(100, parseInt(lightness) + 10)}%)`))
          }]
        };

        setChartData({ pieData, barData, animalBreedsBarData, habitatPieData });
        // Postavljanje prikupljenih podataka u state.
        setLoading(false);
        // Postavljamo stanje učitavanja na `false`.
      } catch (error) {
        console.error("Error fetching data:", error);
        // Logujemo grešku u konzoli.
        setError("Failed to load data");
        // Postavljamo grešku u state.
        setLoading(false);
      }
    };

    fetchData();
    // Poziv funkcije za dohvaćanje podataka.
  }, []);

  return { chartData, loading, error };
  // Vraćamo prikupljene podatke, stanje učitavanja i grešku za korišćenje u drugim komponentama.
};

export default useCharts;
// Eksportujemo hook za korišćenje u aplikaciji.
