import React, { useState, useEffect } from "react"; 
// Uvozimo React biblioteku i hook-ove `useState` i `useEffect`.

import { useAuth } from "../../hooks/useAuth"; 
// Uvozimo prilagođeni hook za autentifikaciju korisnika.

import api from "../../api/posts"; 
// Uvozimo API instance za komunikaciju sa serverom.

import "./ProfileDetails.css"; 
// Uvozimo CSS fajl za stilizaciju komponente `ProfileDetails`.

export default function ProfileDetails() { 
  // Definišemo funkcionalnu komponentu `ProfileDetails`.

  const [profile, setProfile] = useState({ bio: "", avatar: "" }); 
  // State za čuvanje trenutnih podataka o profilu korisnika (biografija i avatar).

  const [updatedProfile, setUpdatedProfile] = useState({ bio: "", avatar: "" }); 
  // State za podatke o profilu koji korisnik uređuje.

  const [showModal, setShowModal] = useState(false); 
  // State za kontrolu prikaza modala za uređivanje profila.

  const { user } = useAuth(); 
  // Izvlačimo podatke o trenutno prijavljenom korisniku koristeći `useAuth` hook.

  const getProfile = async () => {
    // Funkcija za dohvaćanje profila korisnika sa servera.
    try {
      const response = await api.get(`/profiles/${user.id}`); 
      // Šaljemo GET zahtev ka serveru koristeći korisnički ID.
      setProfile(response.data); 
      // Postavljamo podatke o profilu u state.
    } catch (error) {
      console.error("Error fetching profile:", error); 
      // Logujemo grešku u slučaju problema sa dohvaćanjem podataka.
    }
  };

  useEffect(() => {
    // useEffect hook za izvršavanje koda pri montaži komponente.
    getProfile(); 
    // Pozivamo funkciju za dohvaćanje podataka o profilu.
  }, []); 
  // Prazan niz zavisnosti znači da se efekat pokreće samo jednom pri montaži.

  const handleEditClick = () => {
    // Funkcija koja se poziva kada korisnik klikne na dugme za uređivanje profila.
    setUpdatedProfile({ ...profile }); 
    // Postavljamo trenutne podatke o profilu u state za uređivanje.
    setShowModal(true); 
    // Prikazujemo modal za uređivanje profila.
  };

  const handleInputChange = (e) => {
    // Funkcija za ažuriranje vrednosti u input poljima.
    const { name, value } = e.target; 
    // Dohvatamo ime polja i vrednost iz događaja.
    setUpdatedProfile({ ...updatedProfile, [name]: value }); 
    // Ažuriramo state sa novim vrednostima.
  };

  const handleSave = async () => {
    // Funkcija za čuvanje promena u profilu korisnika.
    try {
      await api.put(`/profiles/${user.id}`, updatedProfile); 
      // Šaljemo PUT zahtev ka serveru sa ažuriranim podacima.
      setProfile(updatedProfile); 
      // Postavljamo ažurirane podatke u state za prikaz.
      setShowModal(false); 
      // Zatvaramo modal nakon čuvanja.
    } catch (error) {
      console.error("Error updating profile:", error); 
      // Logujemo grešku u slučaju problema sa ažuriranjem podataka.
    }
  };

  return (
    <div className="profile-container"> 
      {/* Glavni kontejner za profil korisnika */}
      
      <div className="profile-avatar-container"> 
        {/* Kontejner za prikaz slike avatara */}
        <img
          src={profile.avatar || "default-avatar.png"} 
          // Prikazujemo avatar korisnika ili podrazumevanu sliku ako avatar nije postavljen.
          alt="Avatar"
          className="profile-avatar" 
        />
      </div>

      <div className="profile-info"> 
        {/* Sekcija sa informacijama o korisniku */}
        
        <div className="profile-name">{user.name}</div> 
        {/* Prikazujemo ime korisnika */}

        <div className="details-container">
          <div className="detail-email">
            <div className="profile-label">Email</div> 
            <p className="profile-email">{user.email}</p> 
            {/* Prikazujemo email korisnika */}
          </div>
          <div className="detail-gender">
            <div className="profile-label">Gender</div> 
            <p className="profile-bio">{user.gender}</p> 
            {/* Prikazujemo pol korisnika */}
          </div>
          <div className="detail-bio">
            <div className="profile-label">Bio</div> 
            <p className="profile-bio">{profile.bio}</p> 
            {/* Prikazujemo biografiju korisnika */}
          </div>
        </div>

        <button 
          style={{ marginLeft: "-50px" }} 
          className="edit-profile-info-button" 
          onClick={handleEditClick}
        >
          Edit Profile Info
        </button> 
        {/* Dugme za uređivanje profila */}

        {showModal && ( 
          // Prikazujemo modal ako je `showModal` true.
          <div className="modal-background"> 
            {/* Pozadinska senka modala */}
            <div className="modal-content"> 
              {/* Sadržaj modala */}
              <div className="modal-field">
                <label>Avatar URL :</label> 
                <input
                  type="text"
                  name="avatar"
                  value={updatedProfile.avatar} 
                  onChange={handleInputChange} 
                  placeholder="Enter new avatar URL" 
                  style={{
                    width: '350px',
                    height: '50px',
                    fontSize: '18px',
                    borderRadius: '10px',
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
                    fontWeight: 'bold'
                  }} 
                />
              </div>
              <div className="modal-field">
                <label>Bio :</label> 
                <textarea
                  name="bio"
                  value={updatedProfile.bio} 
                  onChange={handleInputChange} 
                  placeholder="Enter your bio" 
                  style={{
                    width: '350px',
                    height: '200px',
                    fontSize: '18px',
                    borderRadius: '10px',
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
                    fontWeight: 'bold'
                  }} 
                />
              </div>
              <div className="modal-buttons">
                <button onClick={handleSave}>Save Changes</button> 
                <button onClick={() => setShowModal(false)}>Cancel</button> 
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
