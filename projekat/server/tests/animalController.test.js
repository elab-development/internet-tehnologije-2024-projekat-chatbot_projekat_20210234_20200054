// animalController.test.js

// Mokiramo model Animal kako bismo mogli da kontrolišemo njegovo ponašanje u testovima.
jest.mock('../models/Animal');

// Uvozimo model Animal i kontroler za životinje koji testiramo.
const Animal = require('../models/Animal');
const { getAllAnimals } = require('../controllers/animalController');

describe('Animal Controller - getAllAnimals', () => {
  // Resetujemo mokirane funkcije pre svakog testa kako bismo izbegli uticaj prethodnih testova.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('trebalo bi da vrati listu životinja sa statusom 200 kada je zahtev uspešan', async () => {
    // Priprema: Kreiramo lažnu listu životinja.
    const mockAnimals = [
      {
        species: 'Dog',
        breed: 'Labrador Retriever',
        averageLifespan: 12,
        habitatType: 'Domestic',
        dietType: 'Omnivore',
        description: 'Friendly and energetic.'
      },
      {
        species: 'Cat',
        breed: 'Siamese',
        averageLifespan: 15,
        habitatType: 'Domestic',
        dietType: 'Carnivore',
        description: 'Vocal and affectionate.'
      }
    ];

    // Postavljamo mokiranu funkciju da vrati lažne životinje.
    Animal.find.mockResolvedValue(mockAnimals);

    // Kreiramo lažne objekte za zahtev i odgovor.
    const req = {}; // Nema potrebe za svojstvima u ovom kontroleru
    const res = {
      status: jest.fn().mockReturnThis(), // Omogućava chaining res.status(...).json(...)
      json: jest.fn(),
    };

    // Izvršenje: Pozivamo kontroler.
    await getAllAnimals(req, res);

    // Provera: Osiguravamo da je Animal.find pozvan i da je odgovor onakav kakav očekujemo.
    expect(Animal.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAnimals);
  });

  it('trebalo bi da vrati status 500 i poruku o grešci kada dođe do greške', async () => {
    // Priprema: Kreiramo grešku koju će Animal.find baciti.
    const error = new Error('Database failure');
    Animal.find.mockRejectedValue(error);

    // Kreiramo lažne objekte za zahtev i odgovor.
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Opcionalno, možete špijunirati console.error ako želite da osigurate da greške budu logovane.
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Izvršenje: Pozivamo kontroler.
    await getAllAnimals(req, res);

    // Provera: Osiguravamo da je Animal.find pozvan i da je odgovor onakav kakav očekujemo.
    expect(Animal.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching animal data' });

    // Čišćenje špijuna za console.error.
    console.error.mockRestore();
  });
});
