import React from "react"; 
// Uvoz React biblioteke za kreiranje komponenata.

import "./HeroSection.css"; 
// Uvoz CSS fajla specifičnog za stilizaciju HeroSection komponente.

import { Head, Para, Subs, CapsLetter } from "./HeroSectionElements"; 
// Uvoz stilizovanih elemenata koji se koriste u HeroSection komponenti.

import image1 from "../../assets/images/courasel1.jpg"; 
import image2 from "../../assets/images/courasel2.jpg"; 
import image3 from "../../assets/images/courasel3.jpg"; 
import image4 from "../../assets/images/courasel4.jpg"; 
import image5 from "../../assets/images/courasel5.jpg"; 
// Uvoz slika koje će se koristiti u karuselu.

import adminImage from "../../assets/images/admin.png"; 
// Uvoz slike za admin sekciju.

import { StyledBtn } from "../../assets/styles/ButtonElements"; 
// Uvoz stilizovanog dugmeta.

import { useAuth } from "../../hooks/useAuth"; 
// Uvoz prilagođenog hook-a za autentifikaciju korisnika.

import { Link } from "react-router-dom"; 
// Uvoz `Link` komponente za navigaciju između stranica.

import Slider from "react-slick"; 
// Uvoz Slider komponente iz `slick-carousel` biblioteke za pravljenje karusela.

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
// Uvoz potrebnih stilova za `slick-carousel`.

export default function HeroSection() {
  const { token, user } = useAuth(); 
  // Pristup korisničkom tokenu i podacima o korisniku putem `useAuth` hook-a.

  // Podešavanja za Slider komponentu.
  const settings = {
    dots: false, // Isključuje tačkice za navigaciju.
    infinite: true, // Omogućava beskonačno skrolovanje.
    speed: 500, // Brzina prelaza između slika.
    slidesToShow: 3, // Broj prikazanih slika istovremeno.
    centerMode: true, // Postavlja središnju sliku u fokus.
    centerPadding: "0%", // Bez dodatnog prostora oko središnje slike.
    slidesToScroll: 1, // Pomera jednu sliku po prelazu.
    autoplay: true, // Automatsko rotiranje slika.
    autoplaySpeed: 3000, // Interval za automatsko rotiranje slika (3 sekunde).
  };

  return (
    <>
      {user?.isAdmin ? (
        // Ako je korisnik admin, prikazuje se posebna sekcija za admina.
        <div>
          <Head>
            Welcome, <CapsLetter>Administrator</CapsLetter>
          </Head>
          {/* Naslov sa pozdravom za admina. */}

          <Subs>Admin Dashboard</Subs>
          {/* Podnaslov za admin sekciju. */}

          <Para>Manage users and view Data Analytics.</Para>
          {/* Kratak opis funkcionalnosti dostupnih za admina. */}

          <Link to="/dashboard">
            <StyledBtn zero>Manage Users</StyledBtn>
            {/* Dugme za navigaciju ka admin dashboard stranici. */}
          </Link>
        </div>
      ) : (
        // Ako korisnik nije admin, prikazuje se sekcija za obične korisnike.
        <div>
          <Head>
            Welcome to<br></br>
            <CapsLetter>
              <span className="vet">Vet</span> <span className="pet">Pet</span>
            </CapsLetter>
          </Head>
          {/* Naslov za obične korisnike. */}

          <Subs>Your Intelligent Veterinary Assistant</Subs>
          {/* Podnaslov koji opisuje aplikaciju kao AI asistenta. */}

          <Para>
            Welcome to Vet Pet, the AI-powered assistant revolutionizing pet
            care. Vet Pet combines advanced AI technology with expert veterinary
            insights to deliver quick, reliable answers to all your pet health
            and wellness questions.
          </Para>
          {/* Kratak opis aplikacije i njenih prednosti. */}

          <Link to={token ? "/chat" : "/register"}>
            <StyledBtn>Start now!</StyledBtn>
            {/* Dugme koje vodi ka chatu ako je korisnik prijavljen ili ka registraciji ako nije. */}
          </Link>
        </div>
      )}

      <div className="carousel-container">
        {user?.isAdmin ? (
          // Ako je korisnik admin, prikazuje se slika za admin sekciju.
          <div className="admin-image-container">
            <img src={adminImage} alt="Admin Section" className="admin-image" />
          </div>
        ) : (
          // Ako korisnik nije admin, prikazuje se karusel sa slikama.
          <Slider {...settings}>
            {[image1, image2, image3, image4, image5].map((img, index) => (
              <div key={index}>
                <img src={img} alt="Carousel" className="carousel-image" />
                {/* Svaka slika iz niza se prikazuje unutar karusela. */}
              </div>
            ))}
          </Slider>
        )}
      </div>
    </>
  );
}
// Eksportovanje HeroSection komponente za korišćenje u drugim delovima aplikacije.
