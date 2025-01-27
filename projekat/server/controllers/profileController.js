const Profile = require("../models/Profile"); 
// Importujemo model Profile koji predstavlja kolekciju profila u bazi podataka.

// Kontroler za preuzimanje profila
const get_profile = async (req, res) => {
    try {
        // Pronađi profil korisnika prema ID-u korisnika iz parametara zahteva
        const profile = await Profile.findOne({ user: req.params.userId });

        if (!profile) {
            // Ako profil nije pronađen, vraćamo HTTP status 404 (Not Found) i poruku o grešci
            return res.status(404).json({ error: "Profile not found" });
        }

        // Ako je profil pronađen, vraćamo ga kao JSON odgovor
        res.json(profile);
    } catch (error) {
        // Ako dođe do greške, logujemo grešku i vraćamo HTTP status 500 (Server Error) sa porukom o grešci
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Kontroler za ažuriranje profila
const update_profile = async (req, res) => {
    const { bio, avatar } = req.body; 
    // Ekstrahujemo polja `bio` i `avatar` iz tela zahteva
    const { userId } = req.params; 
    // Dohvatamo `userId` iz parametara zahteva

    try {
        // Pronađi profil korisnika i ažuriraj sa novim podacima
        let profile = await Profile.findOneAndUpdate(
            { user: userId }, 
            // Uslov pretrage - korisnik po ID-u
            { bio, avatar }, 
            // Polja za ažuriranje
            { new: true } 
            // Opcija koja omogućava vraćanje ažuriranog profila
        );

        // Ako profil ne postoji, kreiraj novi profil
        if (!profile) {
            profile = new Profile({ user: userId, bio, avatar }); 
            // Kreiramo novi profil sa prosleđenim podacima
            await profile.save(); 
            // Čuvamo novi profil u bazi podataka
        }

        // Vraćamo ažurirani ili novokreirani profil kao JSON odgovor
        res.json(profile);
    } catch (err) {
        // Ako dođe do greške, logujemo grešku u konzolu
        console.error(err.message);
        // Vraćamo HTTP status 500 (Server Error) sa porukom o grešci
        res.status(500).send("Server Error");
    }
};

// Izvoz funkcija kontrolera kako bi mogle da se koriste u drugim delovima aplikacije
module.exports = {
    get_profile,
    update_profile
};
