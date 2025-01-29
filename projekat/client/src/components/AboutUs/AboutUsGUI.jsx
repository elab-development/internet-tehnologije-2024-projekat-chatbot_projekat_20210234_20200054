import React from "react"; // Uvozimo React biblioteku koja nam omogućava korišćenje JSX sintakse i pravljenje komponenti.

import "./AboutUsGUI.css"; // Uvozimo CSS fajl sa stilovima specifičnim za ovu komponentu.
import gif from "../../assets/images/gif.gif"; // Uvozimo sliku (gif) koja će biti korišćena unutar komponente.

const AboutUsGUI = () => { // Definišemo funkcionalnu komponentu pod imenom AboutUsGUI.
  
  return (
    <section className="about-us"> 
     {/* Vraćamo JSX strukturu koja prikazuje sadržaj ove komponente unutar HTML 
    section elementa sa klasom "about-us". */}
    <div style={{ position: "relative", display: "inline-block" }}>
      <img 
        style={{
          height: "500px", // Visina slike postavljena na 500px.
          width: "1300px", // Širina slike postavljena na 1300px.
          borderRadius: "25%", // Zaobljene ivice slike sa radijusom 25%.
          border: "5px solid rgb(0, 125, 104)", // Zeleni okvir oko slike.
          boxShadow: "2px 2px 4px rgba(0,0,0,0.6)" // Senka oko slike za efekt dubine.
        }} 
        src={gif} // Postavljanje izvorne datoteke slike (gif).
        alt="Vet Pet Interactive Model" // Alternativni tekst za sliku.
      />
      <iframe 
        src="https://lottie.host/embed/97ba73db-111c-462d-a8d2-474ccca670b9/l6n80hoQoU.lottie" 
        // Izvor za iframe koji prikazuje animaciju.
        style={{
          position: "absolute", // Pozicioniranje unutar roditeljskog elementa (apsolutno).
          bottom: "10px", // Pozicioniranje iframe-a 10px od dna slike.
          right: "10px", // Pozicioniranje iframe-a 10px od desne ivice slike.
          height: "400px", // Visina iframe-a postavljena na 400px.
          width: "500px", // Širina iframe-a postavljena na 500px.
          border: "none", // Uklanjanje okvira oko iframe-a.
          borderRadius: "10px" // Zaobljene ivice iframe-a sa radijusom 10px.
        }}
      />
    </div>
       {/* Prikazujemo sliku (gif) koja je uvezena ranije, sa zadatim stilovima za visinu, širinu i zaobljenost ivica. */}
      <header className="about-us-header"> 
        {/* HTML element <header> sa klasom "about-us-header", koji sadrži naslov sekcije. */}
        <h1 className="header">About Us</h1> 
        {/* Naslov "About Us" prikazan unutar <h1> elementa sa klasom "header". */}
      </header>

      <main className="about-us-content"> 
      {/* Glavni sadržaj stranice, unutar <main> elementa sa klasom "about-us-content". */}
     
        <div className="text-and-quote"> 
        {/* Div sa klasom "text-and-quote", verovatno za tekst i neki citat u okviru stranice. */}
          
            <span className="subheading"> Vet Pet: Your Intelligent Veterinary Assistant </span><br />
            {/* Tekstualni podnaslov koji opisuje Vet Pet kao inteligentnog asistenta za vlasnike kućnih ljubimaca. */}
        </div>
           
            
            Vet Pet is a cutting-edge web application designed to transform the way pet owners and veterinary professionals interact with vital pet care information. 
            Powered by advanced artificial intelligence, Vet Pet serves as a reliable and knowledgeable assistant, offering instant, accurate responses to a wide range
            of pet-related queries.<br /><br />
            {/* Tekstualni opis Vet Pet aplikacije koji objašnjava njene funkcionalnosti i upotrebu veštačke inteligencije. */}
        
      </main>
    </section>
  );
};
// Eksportujemo AboutUsGUI komponentu da bi mogla da bude korišćena u drugim delovima aplikacije.
export default AboutUsGUI;


