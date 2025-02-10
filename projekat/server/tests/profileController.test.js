// profileController.test.js

// Mokiramo model Profile kako bismo mogli da kontrolišemo njegovo ponašanje u testovima.
jest.mock('../models/Profile');

// Uvozimo model Profile i kontrolere koje testiramo.
const Profile = require('../models/Profile');
const { get_profile, update_profile } = require('../controllers/profileController');

// Testiranje kontrolera za dobavljanje profila
describe('Profile Controller - get_profile', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Resetujemo mokirane funkcije pre svakog testa kako bismo izbegli uticaj prethodnih testova.
  });

  it('trebalo bi da vrati JSON profil kada je profil pronađen', async () => {
    // Priprema: Kreiramo lažni profil.
    const fakeProfile = {
      user: 'userid123',
      bio: 'Test bio',
      avatar: 'http://example.com/avatar.png',
    };

    // Simuliramo uspešno pretragu.
    Profile.findOne.mockResolvedValue(fakeProfile);

    // Kreiramo lažni zahtev i odgovor.
    const req = { params: { userId: 'userid123' } };
    const res = {
      status: jest.fn().mockReturnThis(), // Omogućava chaining: res.status().json()
      json: jest.fn(),
    };

    // Izvršenje: Pozivamo kontroler.
    await get_profile(req, res);

    // Provera:
    expect(Profile.findOne).toHaveBeenCalledWith({ user: 'userid123' });
    expect(res.json).toHaveBeenCalledWith(fakeProfile);
  });

  it('trebalo bi da vrati 404 i poruku o grešci kada profil nije pronađen', async () => {
    // Priprema: Simuliramo da profil nije pronađen.
    Profile.findOne.mockResolvedValue(null);

    const req = { params: { userId: 'nonexistentUser' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Izvršenje:
    await get_profile(req, res);

    // Provera:
    expect(Profile.findOne).toHaveBeenCalledWith({ user: 'nonexistentUser' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Profile not found' });
  });

  it('trebalo bi da vrati 500 i poruku o grešci kada dođe do greške', async () => {
    // Priprema: Simuliramo grešku.
    const error = new Error('Database error');
    Profile.findOne.mockRejectedValue(error);

    const req = { params: { userId: 'userid123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Izvršenje:
    await get_profile(req, res);

    // Provera:
    expect(Profile.findOne).toHaveBeenCalledWith({ user: 'userid123' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});

// Testiranje kontrolera za ažuriranje profila
describe('Profile Controller - update_profile', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Resetujemo mokirane funkcije pre svakog testa kako bismo izbegli uticaj prethodnih testova.
  });

  it('trebalo bi da ažurira postojeći profil i vrati ažurirani profil', async () => {
    // Priprema: Simuliramo ažuriranje postojećeg profila.
    const req = {
      params: { userId: 'userid123' },
      body: { bio: 'Updated bio', avatar: 'http://example.com/newavatar.png' },
    };

    const updatedProfile = {
      user: 'userid123',
      bio: 'Updated bio',
      avatar: 'http://example.com/newavatar.png',
    };

    Profile.findOneAndUpdate.mockResolvedValue(updatedProfile);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Izvršenje:
    await update_profile(req, res);

    // Provera:
    expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
      { user: 'userid123' },
      { bio: 'Updated bio', avatar: 'http://example.com/newavatar.png' },
      { new: true }
    );
    expect(res.json).toHaveBeenCalledWith(updatedProfile);
  });

  it('trebalo bi da kreira novi profil ako nijedan ne postoji i vrati ga', async () => {
    // Priprema: Simuliramo da findOneAndUpdate vrati null (profil ne postoji).
    Profile.findOneAndUpdate.mockResolvedValue(null);

    // Kreiramo lažnu instancu profila sa mokiranom save metodom.
    const fakeProfileInstance = {
      user: 'userid123',
      bio: 'New bio',
      avatar: 'http://example.com/avatar.png',
      save: jest.fn().mockResolvedValue(),
    };

    // Prekrivamo Profile konstruktor za ovaj test.
    Profile.mockImplementation(() => fakeProfileInstance);

    const req = {
      params: { userId: 'userid123' },
      body: { bio: 'New bio', avatar: 'http://example.com/avatar.png' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Izvršenje:
    await update_profile(req, res);

    // Provera:
    expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
      { user: 'userid123' },
      { bio: 'New bio', avatar: 'http://example.com/avatar.png' },
      { new: true }
    );
    // Osiguravamo da je nova instanca profila kreirana i sačuvana.
    expect(fakeProfileInstance.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(fakeProfileInstance);
  });

  it('trebalo bi da vrati 500 i "Server Error" kada dođe do greške prilikom ažuriranja', async () => {
    const error = new Error('Update failed');
    Profile.findOneAndUpdate.mockRejectedValue(error);
  
    const req = {
      params: { userId: 'userid123' },
      body: { bio: 'Some bio', avatar: 'http://example.com/avatar.jpg' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
<<<<<<< HEAD
  
    // Mokiramo console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  
=======

    // Izvršenje:
>>>>>>> d4ce681184a1459b5764ff2ce26552df5a92f33a
    await update_profile(req, res);
  
    expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
      { user: 'userid123' },
      { bio: 'Some bio', avatar: 'http://example.com/avatar.jpg' },
      { new: true }
    );
  
    expect(console.error).toHaveBeenCalledWith(error.message);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server Error');
<<<<<<< HEAD
  
    // Vraćamo originalnu implementaciju console.error
    console.error.mockRestore();
  });  
=======
  });
>>>>>>> d4ce681184a1459b5764ff2ce26552df5a92f33a
});
