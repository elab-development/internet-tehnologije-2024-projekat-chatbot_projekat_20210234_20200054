// Učitavanje promenljivih okruženja iz .env fajla ako nije produkciono okruženje.
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Uvoz potrebnih biblioteka.
const fs = require('fs'); // Rad sa fajlovima
const csv = require('csv-parser'); // Parsiranje CSV fajlova
const bcrypt = require("bcryptjs"); // Heširanje lozinki
const express = require("express"); // Web framework za Node.js
const mongoose = require("mongoose"); // Rad sa MongoDB bazom podataka
const morgan = require("morgan"); // Middleware za logovanje HTTP zahteva
const bp = require("body-parser"); // Parsiranje JSON podataka
const jwt = require("jsonwebtoken"); // JWT autentifikacija
const cors = require("cors"); // Omogućavanje CORS zahteva
const helmet = require('helmet'); // Poboljšana sigurnost HTTP zaglavlja
const xssClean = require('xss-clean'); // Sprečavanje XSS napada
const mongoSanitize = require('express-mongo-sanitize'); // Sprečavanje NoSQL injekcija

// Uvoz modela
const User = require("./models/User"); // Model korisnika
const Message = require("./models/Message"); // Model poruka
const Animal = require('./models/Animal'); // Model životinja
const { get_response } = require("./handler/responseHandler"); // Funkcija za generisanje odgovora AI bota

// Inicijalizacija Express aplikacije
const app = express();

// Podešavanje sigurnosnih middleware-a
app.use(cors()); // Omogućavanje CORS-a
app.use(helmet()); // Zaštita HTTP zaglavlja
app.use(xssClean()); // Sprečavanje XSS napada
app.use(mongoSanitize()); // Sprečavanje NoSQL injekcija

// Middleware za logovanje i parsiranje zahteva
app.use(morgan("dev")); // Logovanje HTTP zahteva
app.use(bp.json()); // Parsiranje JSON podataka
app.use(bp.urlencoded({ extended: false })); // Parsiranje URL enkodovanih podataka

// Kreiranje HTTP servera
const http = require("http").createServer(app);

// Inicijalizacija Socket.IO servera na istom HTTP serveru
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000", // Dozvoljeno samo za lokalni frontend
  },
});

// Obrada događaja povezivanja korisnika putem WebSocket-a
io.on("connection", (socket) => {
  console.log("Korisnik je povezan");
  socket.emit("message", "Dobrodošli u AI chatbot");

  // Osluškujemo poruke korisnika
  socket.on("message", async (msg) => {
    try {
      const decoded = jwt.verify(msg.token, process.env.JWT_SECRET); // Verifikacija tokena
      const userId = decoded.id;
      const response = await get_response(msg.text); // Generisanje AI odgovora

      // Kreiranje i čuvanje poruke u bazi
      const messageToAppend = { text: msg.text, response };
      const newMessage = new Message(messageToAppend);
      await newMessage.save();

      // Ažuriranje poruka korisnika
      await User.findByIdAndUpdate(userId, { $push: { messages: newMessage._id } });

      // Slanje odgovora nazad korisniku putem WebSocket-a
      socket.emit("response", newMessage);
    } catch (error) {
      console.error("Greška prilikom obrade poruke:", error);
      socket.emit("response", { text: "Došlo je do greške pri obradi vaše poruke.", response: error.message });
    }
  });

  // Obrada događaja odspajanja korisnika
  socket.on("disconnect", () => {
    console.log("Korisnik je napustio konverzaciju");
  });
});

// Funkcija za kreiranje admin korisnika ako ne postoji u bazi
async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

      const adminUser = new User({
        name: "Chat Bot Admin",
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

// Funkcija za učitavanje podataka o životinjama iz CSV fajla
const insertAnimalDataFromCSV = async () => {
  const results = [];

  fs.createReadStream('./db/animal_data_500.csv')
    .pipe(csv()) 
    .on('data', (data) => results.push(data)) 
    .on('end', async () => {
      for (const animal of results) {
        const { species, breed, averageLifespan, habitatType, dietType, description } = animal;

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
            await newAnimal.save();
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

// Konekcija sa MongoDB bazom podataka
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Baza podataka povezana.");
    await createAdminUser(); // Kreiranje admin korisnika
    await insertAnimalDataFromCSV(); // Učitavanje podataka iz CSV-a

    // Pokretanje servera nakon uspešne konekcije sa bazom
    http.listen(process.env.PORT || 5000, () =>
      console.log(`Server sluša na portu ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.log("Greška pri povezivanju sa bazom:", err));

// Definisanje API ruta
app.use("/users", require("./routes/userRoutes"));
app.use("/chat", require("./routes/chatRoutes"));
app.use("/messages", require("./routes/messageRoutes"));
app.use("/profiles", require("./routes/profileRoutes"));
app.use("/animals", require("./routes/animalRoutes"));
