const User = require("../models/User"); 
// Importujemo model User koji predstavlja kolekciju korisnika u bazi podataka.

// Kontroler za preuzimanje podataka o korisniku
const chat_index = (req, res) => {
  const id = req.user.id; 
  // Dohvatamo ID korisnika koji je autentifikovan i sačuvan od strane auth middleware-a.

  User.findById(id) 
    // Tražimo korisnika u bazi podataka po ID-u.
    .select("-password") 
    // Izbacujemo polje "password" iz rezultata pretrage kako bismo zaštitili podatke.
    .then(user => res.json(user)) 
    // Ako pronađemo korisnika, vraćamo njegove podatke kao JSON odgovor.
    .catch(err => {
      console.error(err.message); 
      // Logujemo grešku u konzolu ako dođe do problema.

      res.status(500).send("Server Error"); 
      // Vraćamo HTTP status 500 (Server Error) i poruku o grešci.
    });
};

// Eksporujemo kontroler kako bismo ga mogli koristiti u drugim delovima aplikacije
module.exports = { chat_index };
