import { createContext, useReducer } from "react"; // Uvoz funkcija za kreiranje konteksta i korišćenje reducer-a

// Kreira kontekst za autentifikaciju
export const AuthContext = createContext();

// Reducer funkcija za upravljanje stanjem autentifikacije
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      // Kada je korisnik prijavljen
      return { 
        ...state, 
        token: localStorage.getItem("token"), // Postavlja token iz localStorage
        isAuthenticated: true, // Postavlja status autentifikacije na true
        user: action.payload.user // Postavlja podatke o korisniku
      };
    case "LOGOUT_USER":
      // Kada je korisnik odjavljen
      return { 
        ...state, 
        token: null, // Uklanja token
        isAuthenticated: false, // Postavlja status autentifikacije na false
        user: null // Postavlja korisnika na null
      };
    default:
      // Vraća prethodno stanje ako akcija nije prepoznata
      return state;
  }
};

// Provider komponenta za autentifikaciju
export const AuthProvider = ({ children }) => {
  // Inicijalno stanje za useReducer
  const [state, dispatch] = useReducer(authReducer, { 
    token: localStorage.getItem("token"), // Uzima token iz localStorage
    isAuthenticated: !!localStorage.getItem("token"), // Postavlja isAuthenticated na true ako postoji token
    user: null 
  });

  // Funkcija za prijavljivanje korisnika
  const loginUser = userData => {
    console.log("AUTH DATA", userData); // Ispisuje podatke o autentifikaciji u konzolu
    localStorage.setItem("token", userData.token); // Postavlja token u localStorage

    dispatch({
      type: "LOGIN_USER", // Akcija za prijavljivanje korisnika
      payload: userData, // Prosleđuje podatke o korisniku
    });
  };

  // Funkcija za odjavu korisnika
  const logoutUser = () => {
    localStorage.removeItem("token"); // Uklanja token iz localStorage
    dispatch({
      type: "LOGOUT_USER", // Akcija za odjavu korisnika
    });
  };

  // Pruža kontekst sa trenutnim stanjem i funkcijama za prijavu/odjavu
  return (
    <AuthContext.Provider value={{ ...state, loginUser, logoutUser }}>
      {children} {/* Renderuje decu koja koriste ovaj kontekst */}
    </AuthContext.Provider>
  );
};
