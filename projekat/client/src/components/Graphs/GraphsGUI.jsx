import React, { useEffect, useState } from 'react'; 
// Uvoz React biblioteke i hookova `useEffect` i `useState`.

import { Pie, Bar } from 'react-chartjs-2'; 
// Uvoz Pie i Bar komponenti za kreiranje dijagrama iz `react-chartjs-2`.

import useCharts from '../../hooks/useCharts'; 
// Uvoz prilagođenog hook-a `useCharts` za dobijanje podataka za dijagrame.

import axios from 'axios'; 
// Uvoz `axios` biblioteke za slanje API zahteva.

import './GraphsGUI.css'; 
// Uvoz CSS fajla za stilizaciju ove komponente.

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'; 
// Uvoz potrebnih modula iz `chart.js` biblioteke.

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement
);
// Registracija elemenata iz `chart.js` kako bi bili dostupni za korišćenje u dijagramima.

const GraphsGUI = () => {
  const { chartData, loading, error } = useCharts(); 
  // Poziv hook-a `useCharts` za dobijanje podataka o dijagramima, statusa učitavanja i grešaka.

  const [dogFact, setDogFact] = useState(''); 
  // State za čuvanje nasumične činjenice o psima.

  useEffect(() => {
    // Hook `useEffect` za dohvaćanje nasumične činjenice o psima kada se komponenta montira.
    const fetchDogFact = async () => {
      try {
        const response = await axios.get('https://dogapi.dog/api/v2/facts?limit=1'); 
        // Slanje GET zahteva za nasumičnu činjenicu o psima.
        if (response.data?.data?.length > 0) {
          setDogFact(response.data.data[0].attributes.body); 
          // Postavljanje dobijene činjenice u state.
        }
      } catch (error) {
        console.error('Error fetching dog fact:', error); 
        // Logovanje greške u slučaju problema sa API zahtevom.
        setDogFact('Unable to load a dog fact at this time.'); 
        // Postavljanje poruke greške u state.
      }
    };

    fetchDogFact(); 
    // Poziv funkcije za dohvaćanje činjenice o psima.
  }, []);

  if (loading) return <div>Loading charts...</div>; 
  // Ako se dijagrami učitavaju, prikazujemo poruku "Loading charts...".

  if (error) return <div>Error loading charts: {error}</div>; 
  // Ako postoji greška pri učitavanju dijagrama, prikazujemo poruku greške.

  return (
    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
      <h1 className="header">Animal Data Diagrams 📊</h1> 
      {/* Naslov za sekciju sa dijagramima. */}

      <div className="graphs-container">
        <div className="graph-box">
          <h2 className="graph-title">Habitat Distribution</h2> 
          {/* Naslov za Pie dijagram. */}
          <Pie
            data={chartData.habitatPieData} 
            // Podaci za Pie dijagram o distribuciji staništa.
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: 'white' 
                    // Boja teksta u legendi.
                  }
                }
              }
            }}
          />
        </div>

        <div className="bar-graph-box">
          <h2 className="graph-title">Animal Messages Distribution</h2> 
          {/* Naslov za Bar dijagram. */}
          <Bar
            data={chartData.barData} 
            // Podaci za Bar dijagram o distribuciji poruka.
            options={{
              scales: {
                x: {
                  ticks: {
                    color: 'white' 
                    // Boja oznaka na x-osi.
                  }
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: 'white' 
                    // Boja oznaka na y-osi.
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: 'white' 
                    // Boja teksta u legendi.
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="graphs-container">
        <div className="bar-graph-box" style={{ marginTop: "30px", paddingBottom: "50px" }}>
          <h2 className="graph-title">Number of Breeds per Species</h2> 
          {/* Naslov za Bar dijagram. */}
          <Bar
            data={chartData.animalBreedsBarData} 
            // Podaci za Bar dijagram o broju rasa po vrstama.
            options={{
              scales: {
                x: {
                  ticks: {
                    color: 'white' 
                    // Boja oznaka na x-osi.
                  }
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: 'white' 
                    // Boja oznaka na y-osi.
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: 'white' 
                    // Boja teksta u legendi.
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="dog-fact-container" style={{ marginTop: "60px", paddingBottom: "20px" }}>
        <h2 style={{ textAlign: "center", fontFamily: "Modak", fontWeight: "normal", textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}>Random Dog Fact 🐶</h2> 
        {/* Naslov za sekciju sa nasumičnom činjenicom o psima. */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p
            style={{
              fontSize: "30px",
              color: "#fff",
              backgroundColor: "#4caf50",
              padding: "10px 20px",
              borderRadius: "8px",
              maxWidth: "70%",
              textAlign: "center",
            }}
          >
            {dogFact} 
            {/* Prikaz nasumične činjenice o psima. */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GraphsGUI; 
// Eksportovanje `GraphsGUI` komponente za korišćenje u drugim delovima aplikacije.
