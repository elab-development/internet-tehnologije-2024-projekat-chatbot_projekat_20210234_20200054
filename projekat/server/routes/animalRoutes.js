const express = require('express'); 
// Uvoz Express biblioteke za kreiranje web servera i API ruta.

const { getAllAnimals } = require('../controllers/animalController'); 
// Uvoz funkcije `getAllAnimals` iz `animalController`.
// Ova funkcija obrađuje zahteve koji se odnose na podatke o životinjama.

const router = express.Router(); 
// Kreiranje Express router objekta za definisanje API ruta.

// Ruta za preuzimanje svih podataka o životinjama.
router.get('/', getAllAnimals); 
// Kada klijent pošalje GET zahtev na ovu rutu ('/'), 
// poziva se funkcija `getAllAnimals` iz kontrolera.
// Ova funkcija vraća listu svih životinja iz baze podataka.

module.exports = router; 
// Izvoz router-a kako bi mogao da se koristi u drugim delovima aplikacije.
