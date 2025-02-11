import { useState, useEffect } from 'react'; 
// Uvoz React hook-ova `useState` i `useEffect` za rad sa stanjem i efektima.

import api from '../api/posts'; 
// Uvoz instance API-ja koja omogućava slanje HTTP zahteva ka serveru.

// Funkcija za generisanje unikatnih nijansi koristeći HSL format boja.
const generateShades = (baseColor, numberOfShades) => {
  const shades = []; 
  // Niz u koji će se smeštati generisane nijanse.

  const lightnessStep = 80 / (numberOfShades + 1); 
  // Određuje korak kojim se menja svetlina boje (HSL vrednost).

  for (let i = 1; i <= numberOfShades; i++) {
    // Iteracija kroz broj nijansi koje treba generisati.
    const hslShade = `hsl(96, 47%, ${20 + i * lightnessStep}%)`; 
    // Kreira HSL nijansu sa određenom svetlinom.
    shades.push(hslShade); 
    // Dodaje generisanu nijansu u niz.
  }

  return shades; 
  // Vraća niz svih generisanih nijansi.
};

const useCharts = () => {
  // Prilagođeni React hook za dohvaćanje i obradu podataka za grafikone.

  const [chartData, setChartData] = useState({}); 
  // State promenljiva koja čuva podatke o grafikonima.

  const [loading, setLoading] = useState(true); 
  // State promenljiva koja označava da li su podaci u procesu učitavanja.

  const [error, setError] = useState(null); 
  // State promenljiva za čuvanje eventualnih grešaka prilikom učitavanja podataka.

  useEffect(() => {
    // React efekat koji se izvršava jednom prilikom prvog renderovanja komponente.

    const fetchData = async () => {
      // Asinhrona funkcija za dohvatanje podataka sa servera.
      setLoading(true); 
      // Postavlja status učitavanja na `true` kako bi se korisniku prikazao indikator učitavanja.

      setError(null); 
      // Resetuje eventualne prethodne greške.

      try {
        // Pokušaj dohvatanja podataka.

        const userResponse = await api.get(`/users`); 
        // Dohvata listu korisnika sa servera.

        const users = userResponse.data; 
        // Čuva listu korisnika iz odgovora servera.

        const barData = {
          labels: users.map(user => user.name), 
          // Postavlja oznake za grafik (imena korisnika).
          datasets: [{
            label: 'Number of Messages', 
            // Oznaka skupa podataka.
            data: users.map(user => user.messages.length), 
            // Broj poruka po korisniku.
            backgroundColor: '#91d370', 
            // Postavlja osnovnu boju kolona u grafikonu.
            borderColor: 'rgba(186, 177, 177, 0.3)', 
            // Postavlja boju ivica kolona.
            borderWidth: 1 
            // Debljina ivica kolona.
          }]
        };

        const animalResponse = await api.get(`/animals`); 
        // Dohvata listu životinja sa servera.

        const animals = animalResponse.data; 
        // Čuva podatke o životinjama iz odgovora servera.

        const breedCountPerSpecies = animals.reduce((acc, animal) => {
          // Kreira objekat u kojem se broji broj rasa po vrstama.
          acc[animal.species] = (acc[animal.species] || 0) + 1;
          return acc;
        }, {});

        const speciesShades = generateShades('#91d370', Object.keys(breedCountPerSpecies).length); 
        // Generiše nijanse za svaku vrstu životinje u grafikonu.

        const animalBreedsBarData = {
          labels: Object.keys(breedCountPerSpecies), 
          // Oznake za grafik su nazivi vrsta životinja.
          datasets: [{
            label: 'Number of Breeds per Species', 
            // Oznaka skupa podataka.
            data: Object.values(breedCountPerSpecies), 
            // Broj rasa za svaku vrstu životinja.
            backgroundColor: speciesShades, 
            // Koristi generisane nijanse za prikaz.
            borderColor: 'rgba(186, 177, 177, 0.3)', 
            // Postavlja boju ivica kolona.
            borderWidth: 1 
            // Debljina ivica kolona.
          }]
        };

        const habitatCounts = animals.reduce((acc, animal) => {
          // Kreira objekat u kojem se broji broj životinja po tipu staništa.
          acc[animal.habitatType] = (acc[animal.habitatType] || 0) + 1;
          return acc;
        }, {});

        const habitatShades = generateShades('#91d370', Object.keys(habitatCounts).length); 
        // Generiše nijanse za svaki tip staništa.

        const habitatPieData = {
          labels: Object.keys(habitatCounts), 
          // Oznake za grafik (tipovi staništa).
          datasets: [{
            label: 'Habitat Distribution', 
            // Oznaka skupa podataka.
            data: Object.values(habitatCounts), 
            // Broj životinja po tipu staništa.
            backgroundColor: habitatShades, 
            // Koristi generisane nijanse.
            hoverBackgroundColor: habitatShades.map(shade => shade.replace(/(\d+)%\)$/, (_, lightness) =>
              `${Math.min(100, parseInt(lightness) + 10)}%)`)) 
            // Poboljšava vizuelni efekat kada korisnik pređe mišem preko podataka.
          }]
        };

        setChartData({ barData, animalBreedsBarData, habitatPieData }); 
        // Postavlja sve podatke o grafikonima u state.

        setLoading(false); 
        // Nakon uspešnog učitavanja podataka, postavlja `loading` na `false` kako bi se podaci prikazali korisniku.
      } catch (error) {
        console.error("Error fetching data:", error); 
        // Loguje grešku u konzolu.

        setError("Failed to load data"); 
        // Postavlja poruku o grešci kako bi korisnik bio obavešten.

        setLoading(false); 
        // Nakon neuspelog pokušaja, postavlja `loading` na `false`.
      }
    };

    fetchData(); 
    // Poziva funkciju za dohvaćanje podataka prilikom prvog renderovanja komponente.
  }, []); 
  // Efekat se izvršava samo jednom nakon prvog renderovanja.

  return { chartData, loading, error }; 
  // Vraća podatke o grafikonima, status učitavanja i eventualnu grešku kako bi se koristili u drugim komponentama.
};

export default useCharts; 
// Eksportuje `useCharts` hook kako bi mogao da se koristi u drugim delovima aplikacije.
