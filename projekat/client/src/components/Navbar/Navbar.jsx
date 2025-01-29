import React from "react"; 
// Uvoz React-a za kreiranje funkcionalne komponente.

import { useAuth } from "../../hooks/useAuth"; 
// Uvoz prilagođenog hook-a za autentifikaciju korisnika.

import { 
  Nav, NavLink, NavMenu, NavBtn, NavBtnLink, HandleLogo 
} from "./NavbarElements"; 
// Uvoz stilizovanih elemenata za navigaciju.

import logo from "../../assets/images/logo.png"; 
// Uvoz logotipa aplikacije.

export default function Navbar() { 
  // Definišemo funkcionalnu komponentu `Navbar`.

  const { logoutUser, token, user } = useAuth(); 
  // Pristup funkcijama za odjavu korisnika i informacijama o trenutnom korisniku iz hook-a `useAuth`.

  return (
    <Nav>
      {/* Glavna navigacija aplikacije */}
      
      {/* Link za početnu stranicu */}
      <NavLink to="/">
        <HandleLogo>
          <img src={logo} style={{ height: "75px", width: "auto" }} alt="Logo" /> 
          {/* Prikaz logotipa aplikacije */}
          
          <span>
            <span className="vet">Vet</span> 
            <span className="pet">Pet</span>
          </span>
          {/* Prikaz naziva aplikacije uz stilizaciju */}
        </HandleLogo>
      </NavLink>

      <NavMenu>
        {/* Navigacioni meni */}
        
        {/* Link ka dijagramima podataka, vidljiv samo za admin korisnike */}
        <NavBtn>
          {token && user?.isAdmin && (
            <NavBtnLink to="/graphs">Data Diagrams</NavBtnLink>
          )}
        </NavBtn>

        {/* Link ka stranici "About Us", vidljiv samo za korisnike koji nisu admini */}
        <NavBtn>
          {!user?.isAdmin && (
            <NavBtnLink to="/about-us">About Us</NavBtnLink>
          )}
        </NavBtn>

        {/* Link ka profilu korisnika, vidljiv samo za prijavljene korisnike koji nisu admini */}
        <NavBtn>
          {token && !user?.isAdmin && (
            <NavBtnLink to="/profile">View profile</NavBtnLink>
          )}
        </NavBtn>

        {/* Link za odjavu, vidljiv samo za prijavljene korisnike */}
        <NavBtn>
          {token && (
            <NavBtnLink
              onClick={() => {
                logoutUser(); 
                // Poziv funkcije za odjavu korisnika.
              }}
              to="/"
            >
              Log out
            </NavBtnLink>
          )}

          {/* Link za registraciju ili prijavu, vidljiv samo za neprijavljene korisnike */}
          {!token && <NavBtnLink to="/register">Sign in</NavBtnLink>}
        </NavBtn>
      </NavMenu>
    </Nav>
  );
}
