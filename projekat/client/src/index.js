import React from "react"; // Uvozi biblioteku React
import ReactDOM from "react-dom"; // Uvozi ReactDOM za renderovanje React komponenti u DOM
import App from "./App"; // Uvozi glavnu App komponentu
import { AuthProvider } from "./context/AuthContext"; // Uvozi AuthProvider iz konteksta autentifikacije

// Renderuje glavnu React aplikaciju u DOM
ReactDOM.render(
  <React.StrictMode> {/* Pruža dodatnu proaktivnu detekciju problema u aplikaciji */}
    <AuthProvider> {/* Omotava aplikaciju u AuthProvider za obezbeđivanje konteksta autentifikacije */}
      <App /> {/* Renderuje glavnu aplikaciju */}
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root") // Ciljani DOM element u kojem će se aplikacija renderovati
);
