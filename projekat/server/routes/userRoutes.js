// Učitaj Express paket
const express = require("express");
// Kreiraj novi Express router koji se koristi za definisanje ruta
const router = express.Router();
// Učitaj kontroler za korisnike koji sadrži logiku za obradu korisničkih zahteva
const userController = require("../controllers/userController");

// Definiši rute za korisnike

// Ruta za registraciju korisnika - koristi POST zahtev i poziva funkciju user_register iz userController-a
router.post("/register", userController.user_register);

// Ruta za prijavu korisnika - koristi POST zahtev i poziva funkciju user_login iz userController-a
router.post("/login", userController.user_login);

// Ruta za dobijanje svih korisnika - koristi GET zahtev i poziva funkciju user_get_all iz userController-a
router.get("/", userController.user_get_all); 

// Ruta za brisanje korisnika - koristi DELETE zahtev i poziva funkciju user_delete iz userController-a
// ID korisnika se uzima iz parametra URL-a
router.delete("/:id", userController.user_delete);

// Ruta za ažuriranje korisnika - koristi PUT zahtev i poziva funkciju user_update iz userController-a
// ID korisnika se uzima iz parametra URL-a
router.put("/:id", userController.user_update);

// Izvezi router kako bi bio dostupan u drugim delovima aplikacije
module.exports = router;
