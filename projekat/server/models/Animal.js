const mongoose = require('mongoose'); 
// Uvoz Mongoose biblioteke za rad sa MongoDB bazom podataka.

const animalSchema = new mongoose.Schema({
  species: { type: String, required: true },
  // Polje `species` predstavlja vrstu životinje, tipa String i obavezno je.

  breed: { type: String, required: true },
  // Polje `breed` predstavlja rasu životinje, tipa String i obavezno je.

  averageLifespan: { type: Number, required: true },
  // Polje `averageLifespan` sadrži prosečan životni vek životinje, tipa Number i obavezno je.

  habitatType: { type: String, required: true },
  // Polje `habitatType` označava tip staništa u kojem životinja živi, tipa String i obavezno je.

  dietType: { type: String, required: true },
  // Polje `dietType` označava ishranu životinje (npr. mesojed, biljojed), tipa String i obavezno je.

  description: { type: String, required: true }
  // Polje `description` sadrži detaljan opis životinje, tipa String i obavezno je.
});

const Animal = mongoose.model('Animal', animalSchema);
// Kreiranje Mongoose modela pod nazivom `Animal` na osnovu definisane šeme `animalSchema`.

module.exports = Animal;
// Izvoz modela `Animal` kako bi mogao da se koristi u drugim delovima aplikacije.
