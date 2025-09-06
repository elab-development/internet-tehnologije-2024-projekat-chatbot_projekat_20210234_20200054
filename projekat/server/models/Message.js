// Učitaj Mongoose paket za rad sa MongoDB bazom podataka
const mongoose = require("mongoose");

// Definiši shemu za poruku
const messageSchema = new mongoose.Schema(
  {
    // Tekst poruke (tip String)
    text: { type: String },

    // Odgovor na poruku (tip String)
    response: { type: String },
  },
  // Dodaj automatski generisane oznake za vreme kreiranja i ažuriranja
  { timestamps: true }
);

// Kreiraj model za poruku koristeći definisanu shemu
const Message = mongoose.model("Message", messageSchema);

// Izvezi model kako bi bio dostupan u drugim delovima aplikacije
module.exports = Message;
