// Učitaj Mongoose paket za rad sa MongoDB bazom podataka
const mongoose = require("mongoose");
// Učitaj Schema iz Mongoose-a
const Schema = mongoose.Schema;

// Definiši shemu za profil
const ProfileSchema = new Schema({
  // Referenca na korisnika (tip ObjectId, referencira model 'User', obavezan podatak)
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Biografija korisnika (tip String, podrazumevana vrednost je prazan string)
  bio: {
    type: String,
    default: ""
  },

  // URL avatara korisnika (tip String, podrazumevana vrednost je prazan string)
  avatar: {
    type: String,
    default: ""
  }
});

// Kreiraj model za profil koristeći definisanu shemu
module.exports = mongoose.model("Profile", ProfileSchema);
