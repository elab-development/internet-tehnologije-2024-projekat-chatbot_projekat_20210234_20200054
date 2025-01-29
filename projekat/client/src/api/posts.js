import axios from "axios";

// Kreiranje i konfiguracija instance axios objekta
export default axios.create({
  // Osnovni URL za sve HTTP zahteve ka serveru. Svi zahtevi korišćenjem ove instance će koristiti ovaj URL kao osnovu.
  baseURL: "http://localhost:5000",
});
