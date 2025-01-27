const Animal = require('../models/Animal'); 
// Importujemo model Animal koji predstavlja kolekciju životinja u bazi podataka.

// Funkcija za vraćanje svih životinja iz baze podataka
const getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.find(); 
    // Dohvatamo sve zapise iz kolekcije Animal pomoću metode `find()`.

    res.status(200).json(animals); 
    // Vraćamo sve životinje kao JSON odgovor sa HTTP statusom 200 (uspešno).
  } catch (error) {
    console.error('Error fetching animal data:', error); 
    // Logujemo grešku ako dođe do problema prilikom dohvaćanja podataka.

    res.status(500).json({ message: 'Error fetching animal data' }); 
    // Vraćamo JSON odgovor sa porukom o grešci i HTTP statusom 500 (interni server error).
  }
};

// Eksporujemo funkciju kako bismo je mogli koristiti u drugim delovima aplikacije
module.exports = {
  getAllAnimals, 
};
