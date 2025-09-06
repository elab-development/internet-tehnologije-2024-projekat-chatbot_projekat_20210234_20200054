import main from "../../assets/images/main.png"; 
// Uvoz slike logotipa.

import { StyledBtn } from "../../assets/styles/ButtonElements"; 
// Uvoz stilizovanog dugmeta.

import { useForm } from "react-hook-form"; 
// Uvoz hook-a za rad sa formama.

import { Container, Wrapper } from "../../assets/styles"; 
// Uvoz stilizovanih komponenti za glavni kontejner i obuhvat.

import { useNavigate } from "react-router-dom"; 
// Uvoz hook-a za navigaciju između stranica.

import { HandleImg, Logo } from "../HeroSection/HeroSectionElements"; 
// Uvoz stilizovanih elemenata za slike iz HeroSection-a.

import { Head, Form, Input, Formgroup, Linkspan, Footer, Para } from "./FormElements"; 
// Uvoz stilizovanih elemenata specifičnih za formu.

import { useAuth } from "../../hooks/useAuth"; 
// Uvoz hook-a za autentifikaciju korisnika.

import api from "../../api/posts"; 
// Uvoz API-a za slanje zahteva serveru.

export default function Login({ setisLoggedIn }) { 
  // Definišemo funkcionalnu komponentu Login koja prima prop `setisLoggedIn`.

  const { loginUser } = useAuth(); 
  // Iz hook-a za autentifikaciju uzimamo funkciju za prijavu korisnika.

  let navigate = useNavigate(); 
  // Inicijalizujemo hook za navigaciju između stranica.

  const {
    register, 
    // Funkcija za registraciju input polja.
    handleSubmit, 
    // Funkcija koja upravlja slanjem forme.
    formState: { errors }, 
    // Pristup greškama u validaciji forme.
  } = useForm(); 
  // Koristimo `useForm` za upravljanje formom.

  const onSubmit = async formData => { 
    // Funkcija koja se poziva prilikom slanja forme.
    try {
      const response = await api.post("/users/login", formData); 
      // Šaljemo POST zahtev za prijavu korisnika sa podacima iz forme.
      console.log(response.data); 
      // Logujemo odgovor servera za proveru.
      loginUser(response.data); 
      // Pozivamo funkciju za prijavu korisnika i čuvanje podataka.
      navigate("/"); 
      // Navigacija na početnu stranicu nakon uspešne prijave.
    } catch (err) {
      if (err.response && err.response.status === 409) { 
        // Proveravamo da li je greška povezana sa konfliktom (status 409).
        alert(err.response.data.msg || 'An error occurred. Please try again.'); 
        // Prikazujemo odgovarajuću grešku korisniku.
      } else {
        console.log(`Error : ${err.message}`); 
        // Logujemo sve ostale greške.
      }
    }
  };

  return (
    <Container> 
      {/* Glavni kontejner za login stranicu. */}
      <Wrapper> 
        {/* Obuhvat za sadržaj i stilizaciju. */}
        <div>
          <Head>Access your account</Head> 
          {/* Naslov stranice za prijavu. */}

          <Form onSubmit={handleSubmit(onSubmit)}> 
            {/* Forma za unos podataka za prijavu. */}
            <Formgroup> 
              {/* Grupa za unos email-a. */}
              <label>Email</label> 
              {/* Labela za polje email. */}
              <Input
                type="email" 
                // Tip inputa postavljen na email.
                name="email" 
                // Naziv polja za validaciju.
                placeholder="Enter your email" 
                // Tekst koji se prikazuje kao placeholder.
                {...register("email", { 
                  // Registracija input polja sa validacijom.
                  required: "Email is required", 
                  // Validacija da je email obavezan.
                  pattern: {
                    value: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
                    // Regex za validaciju email-a.
                    message: "This is not a valid email address", 
                    // Poruka greške za nevalidan email.
                  },
                })}
              />
              <Para>{errors.email?.message}</Para> 
              {/* Prikaz greške za polje email ako postoji. */}
            </Formgroup>

            <Formgroup> 
              {/* Grupa za unos lozinke. */}
              <label>Password</label> 
              {/* Labela za polje lozinke. */}
              <Input
                type="password" 
                // Tip inputa postavljen na password.
                name="password" 
                // Naziv polja za validaciju.
                placeholder="Enter your password" 
                // Tekst koji se prikazuje kao placeholder.
                {...register("password", { 
                  // Registracija input polja sa validacijom.
                  required: "Password is required", 
                  // Validacija da je lozinka obavezna.
                  minLength: {
                    value: 7, 
                    // Minimalna dužina lozinke.
                    message: "Password must be at least 7 characters", 
                    // Poruka greške za kratku lozinku.
                  },
                  maxLength: {
                    value: 15, 
                    // Maksimalna dužina lozinke.
                    message: "Password cannot exceed more than 15 characters", 
                    // Poruka greške za predugu lozinku.
                  },
                })}
              />
              <Para>{errors.password?.message}</Para> 
              {/* Prikaz greške za polje lozinke ako postoji. */}
            </Formgroup>

            <StyledBtn>Log in</StyledBtn> 
            {/* Stilizovano dugme za slanje forme za prijavu. */}
          </Form>

          <Footer> 
            {/* Footer deo stranice sa linkom ka registraciji. */}
            Don't have an account?{" "} 
            <Linkspan
              onClick={() => {
                setisLoggedIn(false); 
                // Funkcija za prebacivanje na ekran za registraciju.
              }}
            >
              Sign up
            </Linkspan>
          </Footer>
        </div>
        <HandleImg> 
          {/* Kontejner za sliku logotipa. */}
          <Logo src={main} /> 
          {/* Prikaz logotipa aplikacije. */}
        </HandleImg>
      </Wrapper>
    </Container>
  );
}
