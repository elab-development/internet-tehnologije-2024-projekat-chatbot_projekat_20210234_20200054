import "./App.css"; // Uvozi stilove za glavnu aplikaciju
import { Routes, Route, BrowserRouter } from "react-router-dom"; // Uvozi komponente za rutiranje iz 'react-router-dom'
import Navbar from "./components/Navbar/Navbar.jsx"; // Uvozi Navbar komponentu
import Landing from "./pages/Landing"; // Uvozi Landing stranicu
import Chat from "./pages/Chat"; // Uvozi Chat stranicu
import { useAuth } from "./hooks/useAuth"; // Uvozi prilagođeni hook za autentifikaciju
import Register from "./pages/Register"; // Uvozi Register stranicu
import Profile from "./pages/Profile"; // Uvozi Profile stranicu
import Dashboard from "./pages/Dashboard"; // Uvozi Dashboard stranicu
import AboutUs from "./pages/AboutUs"; // Uvozi About Us stranicu
import Graphs from "./pages/Graphs"; // Uvozi About Us stranicu

function App() {
  const { token, user } = useAuth(); // Koristi hook za autentifikaciju da bi dobio token i korisničke podatke

  return (
    <div className="main">
      <BrowserRouter>
        <Navbar /> {/* Renderuje Navbar komponentu */}
        <Routes> {/* Definiše rute za aplikaciju */}
          <Route path="/" element={<Landing />} /> {/* Rute za početnu stranicu */}
          {!token && <Route path="/register" element={<Register />} />} {/* Rute za stranicu registracije ako korisnik nije prijavljen */}
          {token && <Route path="/chat" element={<Chat />} />} {/* Rute za stranicu chata ako je korisnik prijavljen */}
          {token && <Route exact path="/profile" element={<Profile />} />} {/* Rute za stranicu profila ako je korisnik prijavljen */}
          {token && user?.isAdmin && <Route path="/dashboard" element={<Dashboard />} />} {/* Rute za stranicu administracije ako je korisnik prijavljen i je admin */}
          <Route path="/about-us" element={<AboutUs />} /> {/* Rute za stranicu O nama */}
          <Route path="/graphs" element={<Graphs />} />  {/* Rute za stranicu dijagrama */}
          <Route path="*" element={<Landing />} /> {/* Rute za sve neprepoznate URL-ove preusmerava na početnu stranicu */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App; // Izvozi glavnu komponentu aplikacije
