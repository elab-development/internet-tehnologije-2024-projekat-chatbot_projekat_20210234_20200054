if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); 
  // Uvoz dotenv-a za učitavanje varijabli okruženja iz .env fajla ako aplikacija nije u produkciji.
}

const fs = require('fs'); 
// Uvoz modula 'fs' za rad sa fajlovima.

const csv = require('csv-parser'); 
// Uvoz 'csv-parser' biblioteke za čitanje CSV fajlova.

const Animal = require('./models/Animal'); 
// Uvoz Mongoose modela za rad sa podacima o životinjama.

const bcrypt = require("bcryptjs"); 
// Uvoz bcrypt biblioteke za heširanje lozinki.

const express = require("express"); 
// Uvoz Express-a za kreiranje API servera.

const mongoose = require("mongoose"); 
// Uvoz Mongoose biblioteke za povezivanje sa MongoDB-om.

const morgan = require("morgan"); 
// Uvoz morgan-a za logovanje HTTP zahteva.

const bp = require("body-parser"); 
// Uvoz body-parser-a za parsiranje tela HTTP zahteva.

const jwt = require("jsonwebtoken"); 
// Uvoz JSON Web Token biblioteke za autentifikaciju.

const cors = require("cors"); 
// Uvoz cors biblioteke za omogućavanje međudomenog pristupa.

const User = require("./models/User"); 
// Uvoz Mongoose modela korisnika.

const Message = require("./models/Message"); 
// Uvoz Mongoose modela poruka.

const { get_response } = require("./handler/responseHandler"); 
// Uvoz funkcije za generisanje odgovora iz responseHandler-a.

const app = express(); 
// Kreiranje Express aplikacije.

app.use(cors()); 
// Dozvola međudomenog pristupa.

const http = require("http").createServer(app); 
// Kreiranje HTTP servera na bazi Express aplikacije.

const PORT = process.env.PORT || 5000; 
// Definisanje porta aplikacije.

const db = process.env.MONGO_URI; 
// URL za povezivanje sa MongoDB bazom.

// Funkcija za kreiranje administratorskog korisnika.
async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL; 
    // Email administratora iz varijabli okruženja.

    const existingAdmin = await User.findOne({ email: adminEmail }); 
    // Provera da li admin već postoji u bazi.

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10); 
      // Generisanje salta za heširanje lozinke.

      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt); 
      // Heširanje administratorske lozinke.

      const adminUser = new User({
        name: "Animal Bot Admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });

      await adminUser.save(); 
      // Čuvanje administratorskog korisnika u bazi.
      console.log("Admin user created:", adminUser);
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating admin user:", error); 
    // Logovanje greške prilikom kreiranja admina.
  }
}

// Funkcija za čitanje CSV fajla i unos podataka o životinjama u bazu.
const insertAnimalDataFromCSV = async () => {
  const results = [];

  fs.createReadStream('./db/animal_data_500.csv') 
  // Čitanje CSV fajla sa podacima o životinjama.

    .pipe(csv())
    .on('data', (data) => results.push(data)) 
    // Dodavanje svakog reda iz CSV fajla u niz `results`.

    .on('end', async () => {
      for (const animal of results) {
        const { species, breed, averageLifespan, habitatType, dietType, description } = animal;

        const existingAnimal = await Animal.findOne({ species, breed }); 
        // Provera da li životinja već postoji u bazi.

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
            // Čuvanje nove životinje u bazi.
            console.log(`Inserted animal: ${species} (${breed})`);
          } catch (error) {
            console.error(`Error inserting ${species} (${breed}):`, error); 
            // Logovanje greške prilikom unosa životinje.
          }
        } else {
          console.log(`Animal already exists: ${species} (${breed})`);
        }
      }
      console.log('CSV data processing completed.');
    });
};

// Povezivanje sa bazom podataka.
mongoose
  .connect(db)
  .then(async () => {
    console.log(`Database connected`);
    await createAdminUser(); 
    // Kreiranje administratorskog korisnika.
    await insertAnimalDataFromCSV(); 
    // Unos podataka o životinjama iz CSV fajla.

    http.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
  })
  .catch((err) => console.log(err));

// Inicijalizacija Socket.io za real-time komunikaciju.
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User is connected");

  socket.emit("message", "Welcome to the AI chatbot"); 
  // Slanje poruke dobrodošlice.

  socket.on("message", async (msg) => {
    try {
      const decoded = jwt.verify(msg.token, process.env.JWT_SECRET); 
      // Dekodiranje JWT tokena.

      const userId = decoded.id; 

      const response = await get_response(msg.text); 
      // Dobijanje odgovora za poruku korisnika.

      const messageToAppend = { text: msg.text, response };

      const newMessage = new Message(messageToAppend);
      await newMessage.save(); 
      // Čuvanje nove poruke u bazi.

      await User.findByIdAndUpdate(userId, { $push: { messages: newMessage._id } }); 
      // Ažuriranje korisnika sa ID-em poruke.

      socket.emit("response", newMessage); 
      // Slanje odgovora korisniku putem soketa.
    } catch (error) {
      console.error("Error handling message:", error); 
      socket.emit("response", { text: "There was an error processing your request.", response: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

// Middleware za logovanje i parsiranje zahteva.
app.use(morgan("dev"));
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

// Rute
app.use("/users", require("./routes/userRoutes"));
app.use("/chat", require("./routes/chatRoutes"));
app.use("/messages", require("./routes/messageRoutes"));
app.use("/profiles", require("./routes/profileRoutes"));
app.use('/animals', require('./routes/animalRoutes')); 
// Ruta za upravljanje podacima o životinjama.
