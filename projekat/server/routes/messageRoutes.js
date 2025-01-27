// Učitaj Express paket
const express = require("express");
// Kreiraj novi Express router koji se koristi za definisanje ruta
const router = express.Router();
// Učitaj kontroler za poruke koji sadrži logiku za obradu zahteva vezanih za poruke
const messageController = require("../controllers/messageController");

// Ruta za dobijanje poruke na osnovu ID-a
router.get("/:id", messageController.get_message);

// Izvezi router kako bi bio dostupan u drugim delovima aplikacije
module.exports = router;
