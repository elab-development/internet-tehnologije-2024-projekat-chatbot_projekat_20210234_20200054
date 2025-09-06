import logo from "../../assets/images/main.png"; 
// Uvoz slike logotipa koja će se koristiti u ovoj komponenti.

import { StyledBtn } from "../../assets/styles/ButtonElements"; 
// Uvoz stilizovanog dugmeta za korišćenje u formi.

import { useForm } from "react-hook-form"; 
// Uvoz `useForm` hook-a za rad sa validacijom i kontrolom formi.

import { Head, Form, Input, Formgroup, Linkspan, Footer, Para, Select } from "./FormElements"; 
// Uvoz stilizovanih elemenata za formu, uključujući input polja, grupu polja i dugmad.

import { Container, Wrapper } from "../../assets/styles"; 
// Uvoz stilizovanih kontejnera za organizaciju sadržaja stranice.

import { HandleImg, Logo } from "../HeroSection/HeroSectionElements"; 
// Uvoz stilizovanih elemenata za prikaz slika i logotipa.

import api from "../../api/posts"; 
// Uvoz API instance za slanje HTTP zahteva ka serveru.

export default function SignUp({ setisLoggedIn }) { 
  // Definišemo funkcionalnu komponentu `SignUp`, koja prima prop `setisLoggedIn`.

  const {
    register, 
    // Funkcija za registraciju input polja u okviru forme.
    handleSubmit, 
    // Funkcija za rukovanje slanjem forme.
    formState: { errors }, 
    // Objekat za praćenje grešaka u validaciji forme.
  } = useForm(); 
  // Koristimo `useForm` hook za kontrolu forme i validaciju podataka.

  const onSubmit = async formData => { 
    // Funkcija koja se poziva prilikom slanja forme.
    try {
      const response = await api.post("/users/register", formData); 
      // Slanje POST zahteva ka serveru za registraciju korisnika sa podacima iz forme.
      setisLoggedIn(true); 
      // Postavljamo status korisnika na prijavljen nakon uspešne registracije.
    } catch (err) {
      if (err.response && err.response.status === 409) { 
        // Ako server vrati grešku sa statusom 409 (konflikt), prikazujemo poruku korisniku.
        alert(err.response.data.msg || 'An error occurred. Please try again.');
      } else {
        console.log(`Error : ${err.message}`); 
        // U slučaju drugih grešaka, logujemo poruku greške u konzolu.
      }
    }
  };

  return (
    <>
      <Container> 
        {/* Glavni kontejner stranice za registraciju. */}
        <Wrapper> 
          {/* Obuhvat koji sadrži sadržaj stranice za stilizaciju. */}
          <div>
            <Head style={{ marginTop: "30px" }}>Create a new account</Head> 
            {/* Naslov stranice za registraciju. */}
            
            <Form onSubmit={handleSubmit(onSubmit)}> 
              {/* Forma za registraciju korisnika, koristi `handleSubmit` za obradu podataka. */}
              <Formgroup> 
                {/* Grupa polja za unos email adrese. */}
                <label>Email</label> 
                {/* Labela za polje email. */}
                <Input
                  type="email" 
                  // Polje za unos email adrese.
                  name="email" 
                  // Naziv polja.
                  placeholder="Enter your email" 
                  // Placeholder tekst.
                  {...register("email", { 
                    // Registracija polja sa pravilima za validaciju.
                    required: "Email is required", 
                    // Email je obavezno polje.
                    pattern: {
                      value: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
                      // Regex za validaciju email adrese.
                      message: "This is not a valid email address", 
                      // Poruka greške ako email nije validan.
                    },
                  })}
                />
                <Para>{errors.email?.message}</Para> 
                {/* Prikaz poruke greške za email polje ako postoji. */}
              </Formgroup>

              <Formgroup> 
                {/* Grupa polja za unos imena korisnika. */}
                <label>Name</label> 
                <Input
                  type="text" 
                  // Polje za unos imena.
                  name="name" 
                  placeholder="Enter your name" 
                  {...register("name", { 
                    required: "Name is required", 
                    // Polje ime je obavezno.
                    minLength: {
                      value: 3, 
                      // Minimalna dužina imena.
                      message: "Name must be at least 3 characters", 
                    },
                    maxLength: {
                      value: 30, 
                      // Maksimalna dužina imena.
                      message: "Name cannot exceed more than 30 characters", 
                    },
                  })}
                />
                <Para>{errors.name?.message}</Para> 
                {/* Prikaz poruke greške za ime ako postoji. */}
              </Formgroup>

              <Formgroup> 
                {/* Grupa za unos lozinke. */}
                <label>Password</label> 
                <Input
                  type="password" 
                  name="password" 
                  placeholder="Enter your password" 
                  {...register("password", { 
                    required: "Password is required", 
                    minLength: {
                      value: 7, 
                      message: "Password must be at least 7 characters", 
                    },
                    maxLength: {
                      value: 15, 
                      message: "Password cannot exceed more than 15 characters", 
                    },
                  })}
                />
                <Para>{errors.password?.message}</Para> 
              </Formgroup>

              <Formgroup> 
                {/* Grupa za izbor pola korisnika. */}
                <label>Gender</label> 
                <Select {...register("gender", { required: "Gender is required" })}>
                  <option value="Other">Other</option> 
                  <option value="Male">Male</option> 
                  <option value="Female">Female</option> 
                </Select>
                <Para>{errors.gender?.message}</Para> 
              </Formgroup>

              <Formgroup> 
                {/* Grupa za unos biografije korisnika. */}
                <label>Bio</label> 
                <Input
                  type="text" 
                  name="bio" 
                  placeholder="Enter your bio" 
                  {...register("bio", { 
                    required: "Bio is required", 
                    maxLength: {
                      value: 150, 
                      message: "Bio cannot exceed more than 150 characters", 
                    },
                  })}
                />
                <Para>{errors.bio?.message}</Para> 
              </Formgroup>

              <Formgroup> 
                {/* Grupa za unos URL avatara korisnika. */}
                <label>Avatar URL</label> 
                <Input
                  type="text" 
                  name="avatar" 
                  placeholder="Enter avatar URL" 
                  {...register("avatar", { 
                    required: "Avatar URL is required", 
                    pattern: {
                      value: /^(ftp|http|https):\/\/[^ "]+$/,
                      message: "This is not a valid URL", 
                    },
                  })}
                />
                <Para>{errors.avatar?.message}</Para> 
              </Formgroup>

              <StyledBtn>Register</StyledBtn> 
              {/* Dugme za slanje forme za registraciju. */}
            </Form>

            <Footer style={{ marginBottom: "30px" }}> 
              {/* Footer deo stranice sa linkom za prijavu. */}
              Already have an account?{" "} 
              <Linkspan
                onClick={() => {
                  setisLoggedIn(true); 
                  // Funkcija za prebacivanje na ekran za prijavu.
                }}
              >
                Sign in
              </Linkspan>
            </Footer>
          </div>

          <HandleImg> 
            {/* Kontejner za prikaz logotipa. */}
            <Logo src={logo} /> 
            {/* Prikaz logotipa aplikacije. */}
          </HandleImg>
        </Wrapper>
      </Container>
    </>
  );
}
