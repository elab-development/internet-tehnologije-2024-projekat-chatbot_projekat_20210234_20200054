// tests/userController.test.js

// Osiguravamo da je JWT_SECRET definisan za testiranje.
process.env.JWT_SECRET = "testsecret";

// --- Moke za modele i biblioteke ---
jest.mock("../models/User"); // Mokiramo User model
jest.mock("../models/Profile"); // Mokiramo Profile model
jest.mock("bcryptjs", () => ({ // Mokiramo bcryptjs funkcije
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({ // Mokiramo jsonwebtoken funkciju
  sign: jest.fn(),
}));

// Uvozimo mokirane module i kontrolerske funkcije
const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { user_register, user_login } = require("../controllers/userController");

// Testiranje kontrolera za registraciju korisnika
describe("User Controller - user_register", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Resetujemo mokirane funkcije pre svakog testa.
  });

  it("trebalo bi da registruje novog korisnika i vrati token, korisnika i profil", (done) => {
    // Priprema: Kreiramo lažni req i res objekte.
    const req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "password",
        gender: "Male",
        bio: "Test bio",
        avatar: "http://example.com/avatar.jpg",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(), // Omogućava chaining: res.status().json()
      json: jest.fn((response) => {
        try {
          // Provere za user_register
          expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
          expect(bcrypt.genSalt).toHaveBeenCalledWith(10, expect.any(Function));
          expect(bcrypt.hash).toHaveBeenCalledWith(
            req.body.password,
            "fakesalt",
            expect.any(Function)
          );
          expect(fakeUserInstance.save).toHaveBeenCalled();
          expect(fakeProfileInstance.save).toHaveBeenCalled();
          expect(jwt.sign).toHaveBeenCalledWith(
            { id: "user123" },
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            expect.any(Function)
          );
          expect(response).toEqual({
            token: "faketoken",
            user: {
              id: "user123",
              name: req.body.name,
              email: req.body.email,
              gender: req.body.gender,
            },
            profile: {
              bio: req.body.bio,
              avatar: req.body.avatar,
            },
          });
          done();
        } catch (err) {
          done(err);
        }
      }),
    };

    // Simuliramo da korisnik sa ovim email-om ne postoji.
    User.findOne.mockResolvedValue(null);

    // Kreiramo lažnu instancu korisnika.
    const fakeUserInstance = {
      _id: "user123",
      id: "user123",
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // Sada je definisano!
      gender: req.body.gender,
      save: jest.fn().mockResolvedValue({
        _id: "user123",
        id: "user123",
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
      }),
    };

    // Kada kontroler pozove "new User()", vraća našu lažnu instancu.
    User.mockImplementation(() => fakeUserInstance);

    // Kreiramo lažnu instancu profila.
    const fakeProfileInstance = {
      bio: req.body.bio,
      avatar: req.body.avatar,
      save: jest.fn().mockResolvedValue({
        bio: req.body.bio,
        avatar: req.body.avatar,
      }),
    };
    Profile.mockImplementation(() => fakeProfileInstance);

    // Mokiramo bcrypt funkcije da pozovu callback sa unapred definisanim vrednostima.
    bcrypt.genSalt.mockImplementation((rounds, callback) => {
      callback(null, "fakesalt");
    });
    bcrypt.hash.mockImplementation((password, salt, callback) => {
      callback(null, "hashedpassword");
    });

    // Mokiramo jwt.sign da pozove callback sa lažnim tokenom.
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, "faketoken");
    });

    // Izvršenje: Pozivamo kontroler.
    user_register(req, res);
  });
});

// Testiranje kontrolera za prijavu korisnika
describe("User Controller - user_login", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Resetujemo mokirane funkcije pre svakog testa.
  });

  it("trebalo bi da uspešno prijavi korisnika kada su kredencijali ispravni", (done) => {
    // Priprema
    const req = {
      body: {
        email: "alice@example.com",
        password: "password",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((response) => {
        try {
          // Provere za uspešnu prijavu.
          expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
          expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, fakeUser.password);
          expect(jwt.sign).toHaveBeenCalledWith(
            { id: "user123" },
            process.env.JWT_SECRET,
            { expiresIn: 36000 },
            expect.any(Function)
          );
          expect(response).toEqual({
            token: "faketoken",
            user: {
              id: "user123",
              name: fakeUser.name,
              email: fakeUser.email,
              isAdmin: fakeUser.isAdmin,
              gender: fakeUser.gender,
            },
          });
          done();
        } catch (err) {
          done(err);
        }
      }),
    };

    const fakeUser = {
      id: "user123",
      name: "Alice",
      email: "alice@example.com",
      password: "hashedpassword",
      isAdmin: false,
      gender: "Female",
    };

    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, "faketoken");
    });

    // Izvršenje
    user_login(req, res);
  });

  it("trebalo bi da vrati 409 ako korisnik ne postoji", (done) => {
    // Priprema
    const req = {
      body: {
        email: "nonexistent@example.com",
        password: "password",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((response) => {
        try {
          expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
          expect(res.status).toHaveBeenCalledWith(409);
          expect(response).toEqual({ msg: "User does not exist" });
          done();
        } catch (err) {
          done(err);
        }
      }),
    };

    User.findOne.mockResolvedValue(null);
    // Izvršenje
    user_login(req, res);
  });

  it("trebalo bi da vrati 400 ako je lozinka netačna", (done) => {
    // Priprema
    const req = {
      body: {
        email: "alice@example.com",
        password: "wrongpassword",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((response) => {
        try {
          expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
          expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, fakeUser.password);
          expect(res.status).toHaveBeenCalledWith(400);
          expect(response).toEqual({ msg: "Invalid credentials" });
          done();
        } catch (err) {
          done(err);
        }
      }),
    };

    const fakeUser = {
      id: "user123",
      name: "Alice",
      email: "alice@example.com",
      password: "hashedpassword",
      isAdmin: false,
      gender: "Female",
    };

    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(false);

    // Izvršenje
    user_login(req, res);
  });
});
