const Message = require("../models/Message"); 
// Importujemo model Message koji predstavlja kolekciju poruka u bazi podataka.

// Kontroler za preuzimanje poruke po ID-u
const get_message = async (req, res) => {
    try {
        // Pokušaj da pronađe poruku po ID-u koji je prosleđen u parametrima zahteva
        const message = await Message.findById(req.params.id);

        if (!message) {
            // Ako poruka nije pronađena, vraćamo HTTP status 404 (Not Found) i poruku o grešci
            return res.status(404).json({ msg: "Message not found" });
        }

        // Ako je poruka pronađena, vraćamo je kao JSON odgovor
        res.json(message);
    } catch (err) {
        // Ako dođe do greške, logujemo grešku u konzolu
        console.error(err.message);

        // Vraćamo HTTP status 500 (Server Error) sa porukom o grešci
        res.status(500).send("Server Error");
    }
};

// Izvoz funkcije kontrolera kako bi mogla da se koristi u drugim delovima aplikacije
module.exports = {
    get_message
};
