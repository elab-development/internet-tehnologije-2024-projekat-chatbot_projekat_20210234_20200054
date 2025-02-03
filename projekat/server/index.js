// Učitavanje promenljivih okruženja iz .env fajla ako nije produkciono okruženje.
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Uvoz potrebnih biblioteka i modela.
const fs = require('fs'); // Rad sa fajlovima.
const csv = require('csv-parser'); // Parsiranje CSV fajlova.
const Animal = require('./models/Animal'); // Model za životinje.
const bcrypt = require("bcryptjs"); // Biblioteka za heširanje lozinki.
const express = require("express"); // Web framework za Node.js.
const mongoose = require("mongoose"); // Biblioteka za rad sa MongoDB bazom.
const morgan = require("morgan"); // Middleware za logovanje HTTP zahteva.
const bp = require("body-parser"); // Middleware za parsiranje JSON podataka.
const jwt = require("jsonwebtoken"); // JWT autentifikacija.
const cors = require("cors"); // Omogućavanje CORS zahteva.
const User = require("./models/User"); // Model korisnika.
const Message = require("./models/Message"); // Model poruka.
const { get_response } = require("./handler/responseHandler"); // Funkcija za generisanje odgovora AI bota.

// Biblioteke za dodatnu sigurnost (štite aplikaciju od napada).
const helmet = require('helmet'); // Postavlja sigurnosne HTTP zaglavlja.
const xssClean = require('xss-clean'); // Sprečava XSS napade sanitizacijom ulaznih podataka.
const mongoSanitize = require('express-mongo-sanitize'); // Sprečava NoSQL injekcije.

const app = express();

// Omogućavanje CORS-a da aplikacija može komunicirati sa frontend-om iz drugih domena.
app.use(cors());

// Poboljšavanje sigurnosti aplikacije pomoću Helmet-a.
app.use(helmet());

// Sanitizacija korisničkih unosa radi zaštite od XSS napada.
app.use(xssClean());

// Sprečavanje NoSQL injekcija sanitizacijom MongoDB upita.
app.use(mongoSanitize());

// Logovanje HTTP zahteva u konzolu tokom razvoja.
app.use(morgan("dev"));

// Parsiranje JSON podataka i URL-enkodovanih podataka iz HTTP zahteva.
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

// ------------------------
// OPCIONO: TEST RUTE
// ------------------------

// Ruta za testiranje zaštite od XSS napada.
app.post('/test/xss', (req, res) => {
  // xssClean middleware je već sanitizovao req.body.input.
  res.json({ sanitized: req.body.input });
});

// Ruta za testiranje zaštite od NoSQL injekcija.
app.post('/test/nosql', (req, res) => {
  // express-mongo-sanitize će ukloniti ključne reči koje mogu uzrokovati napad ($, .)
  res.json({ sanitized: req.body });
});

// ------------------------
// GLAVNI DEO APLIKACIJE
// ------------------------

// Funkcija za kreiranje admin korisnika ako ne postoji u bazi.
async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const existingAdmin = await User.findOne({ email: adminEmail });

    // Provera da li admin korisnik već postoji.
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10); // Generisanje soli za heširanje lozinke.
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt); // Heširanje lozinke.
      
      // Kreiranje novog admin korisnika.
      const adminUser = new User({
        name: "Animal Bot Admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });

      await adminUser.save();
      console.log("Admin korisnik kreiran:", adminUser);
    } else {
      console.log("Admin korisnik već postoji.");
    }
  } catch (error) {
    console.error("Greška prilikom kreiranja admin korisnika:", error);
  }
}

// Funkcija za učitavanje podataka iz CSV fajla i dodavanje u bazu.
const insertAnimalDataFromCSV = async () => {
  const results = [];
  
  // Čitanje CSV fajla.
  fs.createReadStream('./db/animal_data_500.csv')
    .pipe(csv()) // Parsiranje CSV fajla.
    .on('data', (data) => results.push(data)) // Dodavanje svakog reda u listu rezultata.
    .on('end', async () => {
      // Iteracija kroz listu i dodavanje podataka u bazu.
      for (const animal of results) {
        const { species, breed, averageLifespan, habitatType, dietType, description } = animal;

        // Provera da li životinja već postoji u bazi.
        const existingAnimal = await Animal.findOne({ species, breed });

        if (!existingAnimal) {
          const newAnimal = new Animal({
            species,
            breed,
            averageLifespan: Number(averageLifespan),
            habitatType,
            dietType,
            description,
          });

          try {
            await newAnimal.save(); // Čuvanje novog zapisa u bazi.
            console.log(`Dodata životinja: ${species} (${breed})`);
          } catch (error) {
            console.error(`Greška pri dodavanju ${species} (${breed}):`, error);
          }
        } else {
          console.log(`Životinja već postoji: ${species} (${breed})`);
        }
      }
      console.log('Obrada CSV podataka završena.');
    });
};

// Konekcija sa MongoDB bazom podataka.
const db = process.env.MONGO_URI;
mongoose
  .connect(db)
  .then(async () => {
    console.log(`Baza podataka povezana.`);
    await createAdminUser(); // Kreiranje admin korisnika.
    await insertAnimalDataFromCSV(); // Učitavanje podataka o životinjama iz CSV-a.

    // Kreiranje HTTP servera.
    const http = require("http").createServer(app);
    http.listen(process.env.PORT || 5000, () => console.log(`Server sluša na PORTU ${process.env.PORT || 5000}`));
  })
  .catch((err) => console.log("Greška pri povezivanju sa bazom:", err));

// ------------------------
// REAL-TIME KOMUNIKACIJA SA SOCKET.IO
// ------------------------

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000", // Dozvoljeno samo za lokalni frontend.
  },
});

// Obrada događaja povezivanja korisnika.
io.on("connection", (socket) => {
  console.log("Korisnik je povezan");
  socket.emit("message", "Dobrodošli u AI chatbot");

  // Osluškujemo poruke korisnika.
  socket.on("message", async (msg) => {
    try {
      const decoded = jwt.verify(msg.token, process.env.JWT_SECRET); // Verifikacija tokena.
      const userId = decoded.id;
      const response = await get_response(msg.text); // Dobijanje AI odgovora.

      // Kreiranje nove poruke i čuvanje u bazi.
      const messageToAppend = { text: msg.text, response };
      const newMessage = new Message(messageToAppend);
      await newMessage.save();

      // Ažuriranje korisnikovih poruka u bazi.
      await User.findByIdAndUpdate(userId, { $push: { messages: newMessage._id } });

      // Slanje odgovora nazad korisniku preko Socket.io.
      socket.emit("response", newMessage);
    } catch (error) {
      console.error("Greška prilikom obrade poruke:", error);
      socket.emit("response", { text: "Došlo je do greške pri obradi vaše poruke.", response: error.message });
    }
  });

  // Obrada događaja odspajanja korisnika.
  socket.on("disconnect", () => {
    console.log("Korisnik je napustio konverzaciju");
  });
});

// ------------------------
// DEFINISANJE RUTA ZA API
// ------------------------

// Ruta za korisnike.
app.use("/users", require("./routes/userRoutes"));

// Ruta za chat.
app.use("/chat", require("./routes/chatRoutes"));

// Ruta za poruke.
app.use("/messages", require("./routes/messageRoutes"));

// Ruta za profile korisnika.
app.use("/profiles", require("./routes/profileRoutes"));

// Ruta za informacije o životinjama.
app.use('/animals', require('./routes/animalRoutes'));
