// Učitaj jsonwebtoken paket za rad sa JSON Web Token-ima (JWT)
const jwt = require("jsonwebtoken");

// Definiši middleware funkciju za autentifikaciju
const auth = (req, res, next) => {
  // Dohvati token iz zaglavlja zahteva (header)
  const token = req.header("x-auth-token");

  // Proveri da li token postoji
  if (!token) 
    return res.status(401).json({ msg: "No token found. Authorization denied" });

  // Pokušaj da verifikuješ token
  try {
    // Dekodiraj token koristeći tajni ključ (JWT_SECRET) iz environment varijable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Dodaj korisnika iz payload-a u objekat zahteva (req)
    req.user = decoded;

    // Nastavi sa izvršavanjem sledeće middleware funkcije ili rute
    next();
  } catch {
    // Ako token nije validan, vrati grešku
    res.status(400).json({ msg: "Token is not valid" });
  }
};

// Izvezi middleware funkciju kako bi bila dostupna u drugim delovima aplikacije
module.exports = auth;
