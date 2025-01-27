const Animal = require('../models/Animal'); 
// Uvoz modela `Animal` za rad sa podacima o životinjama u bazi podataka.
const axios = require('axios'); 
// Uvoz biblioteke `Axios` za HTTP zahteve.
require('dotenv').config(); 
// Uvoz dotenv biblioteke za pristup varijablama iz `.env` fajla.

// Wit.ai token preuzet iz .env fajla.
const WIT_AI_TOKEN = process.env.WIT_AI_TOKEN;
// Unsplash API ključ za pristup slikama, takođe iz .env fajla.
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Funkcija za preuzimanje svih podataka o životinjama iz baze.
const fetchAnimalDataFromDB = async () => {
  try {
    const animals = await Animal.find(); 
    // Preuzimamo sve životinje iz MongoDB kolekcije.
    return animals;
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka iz baze:', error); 
    // Logovanje greške u slučaju neuspeha.
    return []; 
    // Vraćamo prazan niz u slučaju greške.
  }
};

// Funkcija za pronalaženje životinja po tipu staništa.
const animals_that_live_there = async (habitatType) => {
  try {
    const animals = await fetchAnimalDataFromDB();
    const matchingAnimals = animals.filter(animal =>
      animal.habitatType.toLowerCase() === habitatType.toLowerCase()
    );

    if (matchingAnimals.length > 0) {
      // Formatiramo string sa podacima o vrstama i rasama životinja.
      return `Animals that live in a ${habitatType} habitat: ${matchingAnimals.map(animal => `${animal.breed} (${animal.species})`).join(', ')}`;
    } else {
      return `No animals found that live in a ${habitatType} habitat.`;
    }
  } catch (error) {
    console.error("Greška pri pronalaženju životinja za stanište:", error);
    return "Izvinjavamo se, došlo je do greške prilikom obrade vašeg zahteva.";
  }
};

// Funkcija za dohvaćanje slike životinje sa Unsplash API-ja.
const fetchAnimalImageFromUnsplash = async (animalBreed) => {
  try {
    const searchQuery = `${animalBreed} animal`; 
    // Modifikujemo upit tako da uključuje rasu.

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: searchQuery,
        client_id: UNSPLASH_ACCESS_KEY,
        per_page: 1 
        // Limitiramo rezultat na jednu sliku.
      }
    });

    const imageUrl = response.data.results[0]?.urls?.regular; 
    // Dohvatamo URL slike.
    return imageUrl ? imageUrl : null; 
    // Vraćamo URL slike ili null ako nije pronađena.
  } catch (error) {
    console.error("Greška pri dohvaćanju slike sa Unsplash-a:", error);
    return null;
  }
};

// Funkcija za pronalaženje prosečnog životnog veka životinje po rasi.
const animal_average_life_span = async (breed) => {
  try {
    const animals = await fetchAnimalDataFromDB();
    const foundAnimal = animals.find(animal => animal.breed.toLowerCase() === breed.toLowerCase());

    if (foundAnimal) {
      return `The average lifespan of a ${foundAnimal.breed} is ${foundAnimal.averageLifespan} years.`;
    } else {
      return `Sorry, I couldn't find any information about the lifespan of a ${breed}.`;
    }
  } catch (error) {
    console.error("Greška pri dohvaćanju prosečnog životnog veka:", error);
    return "Izvinjavamo se, došlo je do greške prilikom obrade vašeg zahteva.";
  }
};

// Funkcija za obradu korisničkog unosa i generisanje odgovora pomoću Wit.ai.
const get_response = async (message) => {
  const url = `https://api.wit.ai/message?v=20240909&q=${encodeURIComponent(message)}`;
  try {
    const witResponse = await axios.get(url, {
      headers: { Authorization: `Bearer ${WIT_AI_TOKEN}` }
    });

    console.log("Wit.ai Full Response:", JSON.stringify(witResponse.data, null, 2));

    const witData = witResponse.data; 
    const intent = witData.intents?.[0]?.name; 
    let animalSpecies = witData.entities?.["species:species"]?.[0]?.value || null;
    let animalBreed = witData.entities?.["breed:breed"]?.[0]?.value || null;
    let habitatType = witData.entities?.["habitat_type:habitat_type"]?.[0]?.value || null;

    if (intent === 'animal_image' && animalBreed) {
      const imageUrl = await fetchAnimalImageFromUnsplash(animalBreed);
      if (imageUrl) {
        return `<img src="${imageUrl}" alt="${animalBreed} animal" style="max-width:100%; height:auto;">`;
      } else {
        return `Sorry, I couldn't find an image for the ${animalBreed}.`;
      }
    }

    const animals = await fetchAnimalDataFromDB();

    if (animalSpecies && animalBreed) {
      const foundAnimal = animals.find(animal =>
        animal.species.toLowerCase() === animalSpecies.toLowerCase() &&
        animal.breed.toLowerCase() === animalBreed.toLowerCase()
      );

      if (foundAnimal) {
        if (intent === 'animal_info') {
          return `The ${foundAnimal.breed} is a ${foundAnimal.species} known for its ${foundAnimal.habitatType} habitat. It typically lives ${foundAnimal.averageLifespan} years and has a ${foundAnimal.dietType} diet. ${foundAnimal.description}`;
        }
      }
      return `Sorry, I don't have information about the ${animalBreed} ${animalSpecies}.`;
    }

    if (intent === 'animals_that_live_there' && habitatType) {
      return await animals_that_live_there(habitatType);
    }

    if (intent === 'animal_average_life_span' && animalBreed) {
      return await animal_average_life_span(animalBreed);
    }

    return "I'm not sure I understood that. Could you clarify?";
  } catch (error) {
    console.error("Greška u Wit.ai API pozivu:", error);
    return "Izvinjavamo se, došlo je do greške prilikom obrade vašeg zahteva.";
  }
};

// Izvoz funkcije `get_response`.
module.exports = { get_response };
