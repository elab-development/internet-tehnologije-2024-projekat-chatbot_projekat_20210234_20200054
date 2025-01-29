import Login from "../components/Forms/Login"; // Uvozi Login komponentu za prijavu korisnika
import Signup from "../components/Forms/SignUp"; // Uvozi Signup komponentu za registraciju korisnika
import { useState } from "react"; // Uvozi useState hook za upravljanje stanjem u funkcionalnim komponentama

export default function Register() {
  // Definiše stanje `isLoggedIn` sa početnom vrednošću `true`
  const [isLoggedIn, setisLoggedIn] = useState(true); 

  return (
    <>
      {/* Renderuje Login komponentu ako je `isLoggedIn` true, inače renderuje Signup komponentu */}
      {isLoggedIn ? <Login setisLoggedIn={setisLoggedIn} /> : <Signup setisLoggedIn={setisLoggedIn} />}
    </>
  );
}
