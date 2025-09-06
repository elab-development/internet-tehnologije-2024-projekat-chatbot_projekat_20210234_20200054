// Učitaj Mongoose paket za rad sa MongoDB bazom podataka
const mongoose = require("mongoose");

// Definiši shemu za korisnika
const userSchema = new mongoose.Schema({
  // Ime korisnika (tip String, obavezan podatak)
  name: { type: String, required: true },

  // Email korisnika (tip String, obavezan podatak)
  email: { type: String, required: true },

  // Lozinka korisnika (tip String, obavezan podatak)
  password: { type: String, required: true },

  // Lista poruka korisnika (tip niz ObjectId koji referencira model 'Message')
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],

  // Datum registracije korisnika (tip Date, podrazumevana vrednost je trenutni datum i vreme)
  registerDate: { type: Date, default: Date.now },

  // Da li je korisnik admin (tip Boolean, podrazumevana vrednost je false, obavezan podatak)
  isAdmin: { type: Boolean, default: false, required: true },

  // Pol korisnika (tip String, podrazumevana vrednost je "Other", obavezan podatak)
  gender: { type: String, default: "Other", required: true },
});

// Kreiraj model za korisnika koristeći definisanu shemu
const User = mongoose.model("User", userSchema);

// Izvezi model kako bi bio dostupan u drugim delovima aplikacije
module.exports = User;
