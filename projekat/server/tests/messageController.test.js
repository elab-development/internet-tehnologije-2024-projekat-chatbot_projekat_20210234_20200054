// messageController.test.js

// Mokiramo model Message kako bismo mogli da kontrolišemo njegovo ponašanje u testovima.
jest.mock('../models/Message');

// Uvozimo model Message i kontroler koji testiramo.
const Message = require('../models/Message');
const { get_message } = require('../controllers/messageController');

describe('Message Controller - get_message', () => {
  // Resetujemo mokirane funkcije pre svakog testa kako bismo izbegli uticaj prethodnih testova.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('trebalo bi da vrati JSON poruku kada je poruka pronađena', async () => {
    // Priprema: Kreiramo lažnu poruku.
    const fakeMessage = {
      _id: 'someid',
      text: 'Hello',
      response: 'World',
    };

    // Postavljamo mokiranu funkciju Message.findById da vrati lažnu poruku.
    Message.findById.mockResolvedValue(fakeMessage);

    // Kreiramo lažni zahtev sa ID-em poruke u parametrima.
    const req = {
      params: { id: 'someid' },
    };

    // Kreiramo lažni objekat za odgovor sa jest funkcijama.
    const res = {
      status: jest.fn().mockReturnThis(), // Omogućava chaining: res.status().json()
      json: jest.fn(),
      send: jest.fn(),
    };

    // Izvršenje: Pozivamo kontroler funkciju.
    await get_message(req, res);

    // Provera: Osiguravamo da je Message.findById pozvan sa tačnim ID-em
    // i da je res.json pozvan sa lažnom porukom.
    expect(Message.findById).toHaveBeenCalledWith('someid');
    expect(res.json).toHaveBeenCalledWith(fakeMessage);
  });

  it('trebalo bi da vrati 404 i poruku o grešci kada poruka nije pronađena', async () => {
    // Priprema: Postavljamo Message.findById da vrati null (nije pronađena poruka).
    Message.findById.mockResolvedValue(null);

    const req = { params: { id: 'nonexistentid' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Izvršenje: Pozivamo kontroler funkciju.
    await get_message(req, res);

    // Provera: Funkcija bi trebalo da pozove res.status sa 404 i vrati poruku o grešci.
    expect(Message.findById).toHaveBeenCalledWith('nonexistentid');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Message not found' });
  });

  it('trebalo bi da vrati 500 i "Server Error" kada dođe do greške', async () => {
    // Priprema: Kreiramo grešku i postavljamo Message.findById da baci ovu grešku.
    const error = new Error('Database failure');
    Message.findById.mockRejectedValue(error);

    const req = { params: { id: 'errorid' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Izvršenje: Pozivamo kontroler funkciju.
    await get_message(req, res);

    // Provera: Osiguravamo da je greška logovana i da je funkcija vratila status 500.
    expect(Message.findById).toHaveBeenCalledWith('errorid');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server Error');
  });
});
