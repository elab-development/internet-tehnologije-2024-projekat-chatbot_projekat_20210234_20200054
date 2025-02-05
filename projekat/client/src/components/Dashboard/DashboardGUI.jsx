import "./DashboardGUI.css"; 
// Uvozimo CSS fajl za stilizaciju komponente DashboardGUI.
import React, { Fragment, useState, useEffect } from "react"; 
// Uvozimo React biblioteku i hookove Fragment, useState i useEffect.
import api from "../../api/posts"; 
// Uvozimo API instance za slanje HTTP zahteva ka serveru.

export default function DashboardGUI() { 
  // Definišemo funkcionalnu komponentu DashboardGUI.

  const [users, setUsers] = useState([]); 
  // State za čuvanje liste korisnika.
  const [searchTerm, setSearchTerm] = useState(""); 
  // State za tekst pretrage korisnika.
  const [sortOrder, setSortOrder] = useState("ascending"); 
  // State za sortiranje korisnika po broju poruka.
  const [genderFilter, setGenderFilter] = useState(""); 
  // State za filtriranje korisnika po polu.
  const [editUserId, setEditUserId] = useState(null); 
  // State za ID korisnika koji se uređuje.
  const [editUserData, setEditUserData] = useState({ name: "", email: "" }); 
  // State za podatke korisnika koji se uređuju.
  const [currentPage, setCurrentPage] = useState(1); 
  // State za trenutnu stranicu u paginaciji.
  const usersPerPage = 2; 
  // Broj korisnika prikazanih po stranici.

  const getUsers = async () => { 
    // Asinhrona funkcija za dobijanje korisnika sa servera.
    try {
      const response = await api.get("/users"); 
      // Šaljemo GET zahtev ka /users endpointu.
      setUsers(response.data); 
      // Postavljamo korisnike u state.
    } catch (error) {
      console.error("Error fetching users:", error); 
      // Logujemo grešku ako dođe do problema.
    }
  };

  const handleDelete = async (userId) => { 
    // Funkcija za brisanje korisnika.
    try {
      await api.delete(`/users/${userId}`); 
      // Šaljemo DELETE zahtev ka serveru.
      setUsers(users.filter((user) => user._id !== userId)); 
      // Ažuriramo listu korisnika nakon brisanja.
    } catch (error) {
      console.error("Error deleting user:", error); 
      // Logujemo grešku ako dođe do problema.
    }
  };

  const handleEditChange = (e) => { 
    // Funkcija za ažuriranje state-a prilikom izmene podataka u formi.
    const { name, value } = e.target; 
    // Izvlačimo ime i vrednost polja koje se menja.
    setEditUserData({ ...editUserData, [name]: value }); 
    // Ažuriramo podatke o korisniku koji se uređuje.
  };

  const handleUpdate = async () => { 
    // Funkcija za ažuriranje korisnika na serveru.
    try {
      await api.put(`/users/${editUserId}`, editUserData); 
      // Šaljemo PUT zahtev sa izmenjenim podacima.
      getUsers(); 
      // Ponovo dobijamo korisnike nakon ažuriranja.
      setEditUserId(null); 
      // Resetujemo ID korisnika koji se uređuje.
      setEditUserData({ name: "", email: "" }); 
      // Resetujemo podatke u formi za uređivanje.
    } catch (error) {
      console.error("Error updating user:", error); 
      // Logujemo grešku ako dođe do problema.
    }
  };

  useEffect(() => { 
    // useEffect hook za inicijalno dobijanje korisnika.
    getUsers(); 
    // Pozivamo funkciju za dobijanje korisnika kada se komponenta montira.
  }, []);

  const filteredUsers = users.filter((user) => { 
    // Filtriramo korisnike prema tekstu pretrage i polu.
    const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()); 
    // Proveravamo da li ime korisnika sadrži tekst pretrage.
    const matchesGender = genderFilter === "" || user.gender === genderFilter; 
    // Proveravamo da li pol odgovara filteru.
    return matchesSearchTerm && matchesGender; 
    // Vraćamo samo korisnike koji zadovoljavaju oba uslova.
  });

  const sortedUsers = filteredUsers.sort((a, b) => { 
    // Sortiramo korisnike prema broju poruka.
    const aMessages = a.messages.length; 
    const bMessages = b.messages.length; 
    if (sortOrder === "ascending") {
      return aMessages - bMessages; 
      // Sortiranje uzlazno.
    } else {
      return bMessages - aMessages; 
      // Sortiranje silazno.
    }
  });

  const indexOfLastUser = currentPage * usersPerPage; 
  // Indeks poslednjeg korisnika na trenutnoj stranici.
  const indexOfFirstUser = indexOfLastUser - usersPerPage; 
  // Indeks prvog korisnika na trenutnoj stranici.
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser); 
  // Dobijamo korisnike za trenutnu stranicu.

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage); 
  // Računamo ukupan broj stranica za paginaciju.

  const convertToCSV = (data) => { 
    // Funkcija za konvertovanje podataka u CSV format.
    const header = ['User Name', 'User Email', 'Gender', 'Number of Messages']; 
    // Definišemo zaglavlje CSV fajla.
    const rows = data.map(user => [user.name, user.email, user.gender, user.messages.length]); 
    // Kreiramo redove za CSV fajl.
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n'); 
    // Formatiramo CSV fajl.
    return csvContent;
  };

  const exportToCSV = () => { 
    // Funkcija za izvoz podataka u CSV fajl.
    const csvContent = convertToCSV(sortedUsers); 
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); 
    const link = document.createElement('a'); 
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob); 
      link.setAttribute('href', url); 
      link.setAttribute('download', 'users.csv'); 
      link.style.visibility = 'hidden'; 
      document.body.appendChild(link); 
      link.click(); 
      document.body.removeChild(link); 
    }
  };

  return (
    <Fragment>
      <section className="dashboard"> 
        {/* Glavna sekcija za dashboard */}
        <header className="dashboard-header">
          <h1 className="header">Dashboard</h1> 
          {/* Naslov dashboard-a */}
        </header>

        <main className="dashboard-content">
          {/* Glavni sadržaj dashboard-a */}
          {/* Pretraga, sortiranje i filteri */}
          <div className="filter-bar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by user name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                // Ažuriramo tekst pretrage.
                className="search-input"
              />
            </div>
            <div className="sort-bar">
              <label htmlFor="sortOrder" className="sortLabel">Sort by number of messages:</label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)} 
                // Ažuriramo sortiranje.
                className="sort-select"
              >
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>
            <div className="gender-filter-bar">
              <label htmlFor="genderFilter" className="genderLabel">Filter by gender:</label>
              <select
                id="genderFilter"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)} 
                // Ažuriramo filter po polu.
                className="gender-select"
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button onClick={exportToCSV} className="export-btn">Export to CSV</button> 
            {/* Dugme za izvoz podataka */}
          </div>
          
          {/* Popup za uređivanje korisnika */}
          {editUserId && (
            <div className="edit-popup">
              <div className="edit-form">
                <h2 style={{marginBottom: "30px", color:"#fff"}}>Edit User</h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editUserData.name} // Polje za uređivanje imena korisnika.
                  onChange={handleEditChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editUserData.email} // Polje za uređivanje email-a korisnika.
                  onChange={handleEditChange}
                />
                <button onClick={handleUpdate}>Update User</button> 
                {/* Dugme za ažuriranje korisnika */}
                <button onClick={() => setEditUserId(null)}>Cancel</button> 
                {/* Dugme za otkazivanje uređivanja */}
              </div>
            </div>
          )}

          {/* Tabela sa korisnicima */}
          <table className="user-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Gender</th>
                <th>Number of Messages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-users-message">
                    No Data
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.messages.length}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditUserId(user._id); 
                          setEditUserData({
                            name: user.name,
                            email: user.email
                          }); 
                        }}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)} 
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Kontrole za paginaciju */}
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-label">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages} 
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </main>
      </section>
    </Fragment>
  );
}
