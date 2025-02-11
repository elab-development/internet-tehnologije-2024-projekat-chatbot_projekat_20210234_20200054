import "./ChatGUI.css"; // Uvozimo CSS fajl za stilizaciju ove komponente.
import React, { Fragment, useState, useEffect } from "react"; 
// Uvozimo React biblioteku i korišćenje Fragmenta, useState i useEffect hookova.
import { io } from "socket.io-client"; 
// Uvozimo socket.io-client za real-time komunikaciju sa serverom putem WebSocket-a.
import { useAuth } from "../../hooks/useAuth"; 
// Uvozimo custom hook za autentifikaciju da bismo dobili korisnikov token.
import api from "../../api/posts"; 
// Uvozimo API instance za slanje HTTP zahteva.
import MessageList from "./MessageList"; 
// Uvozimo komponentu za prikazivanje liste poruka.

let socket; 
// Deklarišemo globalnu promenljivu za socket konekciju.

export default function ChatGUI() { 
  // Definišemo funkcionalnu komponentu ChatGUI.

  const [messages, setMessages] = useState([]); 
  // State za čuvanje liste poruka.
  const [inputMessage, setInputMessage] = useState(""); 
  // State za unos korisničke poruke.
  const [transcript, setTranscript] = useState(""); 
  // State za čuvanje rezultata transkripcije govora u tekst.
  const { token } = useAuth(); 
  // Izvlčimo token iz useAuth hook-a za autentifikaciju.

  const getMessages = async () => { 
    // Asinhrona funkcija za dohvaćanje poruka sa servera.
    const response = await api.get("/chat", { 
      // Šaljemo GET zahtev ka /chat endpointu.
      headers: {
        "x-auth-token": token, 
        // Koristimo token iz autentifikacije za autorizaciju zahteva.
      },
    });
    const messageDetails = await Promise.all(
      response.data.messages.map(async (messageId) => { 
        // Iteriramo kroz ID-jeve poruka i dohvaćamo detalje za svaku.
        const messageResponse = await api.get(`/messages/${messageId}`);
        return messageResponse.data; 
        // Vraćamo podatke o poruci.
      })
    );
    setMessages(messageDetails); 
    // Postavljamo listu poruka u state.
  };

  useEffect(() => { 
    // useEffect hook za inicijalnu postavku pri montaži komponente.
    socket = io("http://localhost:5000"); 
    // Povezujemo se na WebSocket server na lokalnom hostu.
    getMessages(); 
    // Pozivamo funkciju za dohvaćanje poruka.

    socket.on("response", (message) => { 
      // Kada server pošalje novu poruku nazad, ažuriramo listu poruka.
      setMessages((prevMessages) => [...prevMessages, message]); 
      // Dodajemo novu poruku u postojeće poruke.
    });

    return () => { 
      // Funkcija za čišćenje pri demontaži komponente.
      if (socket) {
        socket.disconnect(); 
        // Diskonektujemo socket kako bismo sprečili curenje memorije.
      }
    };
  }, []); 
  // Prazan niz zavisnosti znači da se ovaj efekat pokreće samo jednom, pri montaži komponente.

  const handleSubmit = (e) => { 
    // Funkcija za rukovanje slanjem poruka.
    e.preventDefault(); 
    // Sprečavamo podrazumevano ponašanje forme.
    const text = inputMessage || transcript; 
    // Ako je transkript dostupan, koristi ga, inače koristi ručni unos.
    const userdata = { text, token }; 
    // Kreiramo objekat sa tekstom poruke i korisničkim tokenom.
    socket.emit("message", userdata); 
    // Emitujemo poruku putem socket-a na server.
    setInputMessage(""); 
    // Resetujemo unos poruke.
    setTranscript(""); 
    // Resetujemo transkript.
  };

  return (
    <Fragment>
      {/* Koristimo React Fragment da obuhvatimo više elemenata bez dodatnih HTML čvorova */}
      <section className="msger"> 
        {/* Sekcija za chat interfejs */}
        <header className="msger-header"></header> 
        {/* Prazan header za chat */}

        <main className="msger-chat">
          {messages && <MessageList messages={messages} />} 
          {/* Prikazujemo listu poruka koristeći komponentu MessageList */}
        </main>

        <form className="msger-inputarea" onSubmit={handleSubmit}> 
          {/* Forma za unos poruke */}
          <input
            type="text" 
            // Tip inputa je tekstualni unos.
            style={{color: '#fff', fontWeight: 'bold'}}
            // Stilizacija input polja.
            name="text" 
            // Naziv polja je "text".
            className="msger-input" 
            // Dodajemo klasu za dodatno stilizovanje kroz CSS.
            placeholder="Start a conversation..." 
            // Placeholder tekst unutar input polja.
            onChange={(e) => setInputMessage(e.target.value)} 
            // Ažuriramo state inputMessage na osnovu korisničkog unosa.
            value={inputMessage || transcript} 
            // Prikazujemo uneti tekst ili transkript u input polju.
          />

          <button
            type="submit" 
            // Dugme za slanje poruke.
            className="msger-send-btn"
            disabled={!inputMessage && !transcript} 
            // Onemogućavamo dugme ako nema unosa ni transkripta.
          >
            Send
          </button>
        </form>
      </section>
    </Fragment>
  );
}
