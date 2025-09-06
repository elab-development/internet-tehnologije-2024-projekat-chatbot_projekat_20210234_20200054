const User = require("../models/User"); 
// Uvoz modela `User` koji predstavlja korisnike u bazi podataka.
const Message = require("../models/Message"); 
// Uvoz modela `Message` za rad sa porukama korisnika.
const Profile = require("../models/Profile"); 
// Uvoz modela `Profile` koji predstavlja profile korisnika.
const bcrypt = require("bcryptjs"); 
// Uvoz biblioteke za heširanje lozinki.
const jwt = require("jsonwebtoken"); 
// Uvoz biblioteke za generisanje JWT tokena.

// Kontroler za registraciju korisnika
const user_register = (req, res) => {
  const { name, email, password, gender, bio, avatar } = req.body; 
  // Dohvatamo podatke iz zahteva.
  console.log(req.body);

  // Proveri da li je email već registrovan
  User.findOne({ email }).then(user => {
    if (user) return res.status(409).json({ msg: "Email already registered" });

    // Ako email nije registrovan, kreiraj novog korisnika
    const newUser = new User({
      name,
      email,
      password,
      gender
    });

    // Kreiraj salt i hashuj lozinku
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return res.status(400).json({ msg: "Invalid data received" });

        newUser.password = hash;

        // Sačuvaj korisnika
        newUser.save().then(user => {
          // Kreiraj novi profil za korisnika
          const newProfile = new Profile({
            user: user._id,
            bio,
            avatar,
          });

          newProfile.save().then(profile => {
            // Generiši JWT token
            jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
              if (err) throw err;

              // Vrati token i podatke o korisniku i profilu
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  gender: user.gender
                },
                profile: {
                  bio: profile.bio,
                  avatar: profile.avatar,
                },
              });
            });
          }).catch(err => {
            res.status(500).json({ msg: "Error creating profile" });
          });
        }).catch(err => {
          res.status(500).json({ msg: "Error saving user" });
        });
      });
    });
  });
};

// Kontroler za prijavu korisnika
const user_login = (req, res) => {
  const { email, password } = req.body; 
  // Dohvatamo email i lozinku iz zahteva.

  // Proveri da li je email registrovan
  User.findOne({ email }).then(user => {
    if (!user) return res.status(409).json({ msg: "User does not exist" });

    // Proveri da li se lozinka poklapa
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      // Generiši JWT token
      jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;

        // Vrati token i podatke o korisniku
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            gender: user.gender
          },
        });
      });
    });
  });
};

// Kontroler za preuzimanje svih korisnika osim administratora
const user_get_all = (req, res) => {
  User.find({ isAdmin: false }) 
    // Filtriraj korisnike gde je isAdmin false.
    .populate('messages') 
    // Popuni sve poruke korisnika.
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ msg: "Error fetching users" });
    });
};

// Kontroler za brisanje korisnika
const user_delete = async (req, res) => {
  const userId = req.params.id; 
  // Dohvatamo ID korisnika iz parametara.

  try {
    // Pronađi korisnika i popuni njegove poruke
    const user = await User.findById(userId).populate('messages');

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Obriši sve poruke povezane sa korisnikom
    await Message.deleteMany({ _id: { $in: user.messages } });

    // Obriši korisnikov profil
    await Profile.findOneAndDelete({ user: userId });

    // Obriši korisnika
    await User.findByIdAndDelete(userId);

    res.json({ msg: "User and associated data deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting user" });
  }
};

// Kontroler za ažuriranje podataka o korisniku
const user_update = async (req, res) => {
  const userId = req.params.id; 
  // Dohvatamo ID korisnika iz parametara.
  const { name, email } = req.body; 
  // Dohvatamo nova polja iz zahteva.

  try {
    // Pronađi korisnika po ID-u
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Ažuriraj podatke o korisniku
    if (name) user.name = name;
    if (email) user.email = email;

    // Sačuvaj ažuriranog korisnika
    const updatedUser = await user.save();

    // Generiši novi token (opciono)
    const token = jwt.sign({ id: updatedUser.id }, process.env.JWT_SECRET, { expiresIn: 3600 });

    res.json({
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        gender: updatedUser.gender
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating user" });
  }
};

// Izvoz kontrolera
module.exports = {
  user_get_all,
  user_delete,
  user_register,
  user_login,
  user_update
};
