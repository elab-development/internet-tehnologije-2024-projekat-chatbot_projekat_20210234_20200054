import { useContext } from "react"; // Uvozi useContext hook iz React-a koji omogućava pristup kontekstualnim vrednostima
import { AuthContext } from "../context/AuthContext"; // Uvozi AuthContext iz modula gde je definisan kontekst

// Prilagođeni hook za pristup autentifikacionom kontekstu
export const useAuth = () => {
  // Koristi useContext da pristupi trenutnim vrednostima iz AuthContext-a
  const context = useContext(AuthContext);

  // Proverava da li je kontekst undefined, što znači da hook nije korišćen unutar AuthProvider
  if (context === undefined) {
    // Ako je kontekst undefined, baca grešku da bi se obavestilo o pogrešnoj upotrebi hook-a
    throw new Error("useAuth() must be used inside AuthProvider");
  }

  // Vraća trenutni kontekst, što omogućava komponentama da koriste autentifikacione podatke i funkcije
  return context;
};
