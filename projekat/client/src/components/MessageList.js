import React, { useState, useEffect } from "react"; 
// Uvoz React biblioteke, zajedno sa `useState` i `useEffect` hook-ovima za upravljanje stanjem i efektima.

import { useAuth } from "../hooks/useAuth"; 
// Uvoz prilagođenog hook-a za autentifikaciju korisnika.

import api from "../api/posts"; 
// Uvoz API instance za komunikaciju sa serverom.

import logo from "../assets/images/main.png"; 
// Uvoz slike koja predstavlja avatar bota.

export default function MessageList({ messages }) { 
  // Definicija funkcionalne komponente `MessageList`, koja prima `messages` kao prop.

  const { user, token } = useAuth(); 
  // Dohvatanje podataka o korisniku i tokenu iz hook-a `useAuth`.

  const [profile, setProfile] = useState(null); 
  // Definišemo state za čuvanje podataka o profilu korisnika.

  useEffect(() => {
    // Efekat koji se pokreće pri montaži komponente ili promeni korisnika/tokena.
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profiles/${user.id}`); 
        // API zahtev za dohvatanje podataka o profilu korisnika.
        setProfile(response.data); 
        // Postavljanje podataka o profilu u state.
      } catch (error) {
        console.error("Error fetching profile:", error); 
        // Logujemo grešku ako dođe do problema prilikom dohvatanja podataka.
      }
    };

    fetchProfile(); 
    // Poziv funkcije za dohvatanje podataka o profilu.
  }, [user.id, token]); 
  // Zavisnosti efekta su `user.id` i `token`.

  const defaultAvatar = "https://cdn-icons-png.freepik.com/512/3177/3177440.png"; 
  // URL podrazumevanog avatara koji se koristi ako profil korisnika nema avatar.

  const isImageResponse = (response) => {
    // Funkcija za proveru da li odgovor bota sadrži <img> tag.
    const regex = /<img.*?src="(.*?)".*?>/; 
    // Regex za pronalaženje <img> taga u odgovoru.
    return regex.test(response); 
    // Vraća true ako odgovor sadrži <img> tag.
  };

  return (
    <>
      {messages
        .slice(0) 
        // Kopiramo niz poruka da bismo izbegli mutaciju originalnog niza.
        .reverse() 
        // Obrćemo redosled poruka da bismo najnoviju prikazali na vrhu.
        .map((message, index) => (
          <div key={message._id ? message._id : index}> 
            {/* Koristimo `_id` poruke kao ključ, a ako ne postoji, koristimo indeks. */}

            {/* Poruka korisnika */}
            <div className="msg right-msg">
              <div
                className="msg-img"
                style={{
                  backgroundImage: `url(${profile ? profile.avatar : defaultAvatar})`, 
                  // Prikazujemo avatar korisnika ili podrazumevani avatar.
                }}
              />
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">{user ? user.name : "You"}</div> 
                  {/* Prikazujemo ime korisnika ili "You" ako korisnik nije prijavljen. */}
                </div>
                <div className="msg-text">{message.text}</div> 
                {/* Prikazujemo tekst poruke korisnika. */}
              </div>
            </div>

            {/* Poruka bota */}
            <div className="msg left-msg">
              <div
                className="msg-img"
                style={{ backgroundImage: `url(${logo})` }} 
                // Prikazujemo avatar bota.
              />
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">VetPet Chatbot</div> 
                  {/* Prikazujemo ime bota. */}
                </div>
                <div className="msg-text">
                  {/* Proveravamo da li odgovor bota sadrži <img> tag. */}
                  {isImageResponse(message.response) ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: message.response }} 
                      // Ako postoji <img> tag, renderujemo HTML direktno.
                    />
                  ) : (
                    message.response 
                    // Ako nema <img> taga, prikazujemo samo tekst odgovora.
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
