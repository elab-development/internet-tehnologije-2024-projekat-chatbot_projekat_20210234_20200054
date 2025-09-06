// Učitaj Express paket
const express = require("express");
// Kreiraj novi Express router koji se koristi za definisanje ruta
const router = express.Router();
// Učitaj kontroler za chat koji sadrži logiku za obradu zahteva vezanih za chat
const chatController = require("../controllers/chatController");
// Učitaj middleware za autentifikaciju koji se koristi za zaštitu ruta
const auth = require("../middleware/auth");

// Definiši rutu za chat
// Ruta koristi GET zahtev za pristupanje chat funkcionalnosti
// Middleware 'auth' se koristi za autentifikaciju pre nego što se pozove funkcija chat_index iz chatController-a
router.get("/", auth, chatController.chat_index);

// Izvezi router kako bi bio dostupan u drugim delovima aplikacije
module.exports = router;
