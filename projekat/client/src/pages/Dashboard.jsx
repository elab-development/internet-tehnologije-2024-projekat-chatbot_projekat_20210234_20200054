import { Container, Wrapper } from "../assets/styles"; // Uvozi stilizovane komponente Container i Wrapper iz datoteke sa stilovima
import DashboardGUI from "../components/Dashboard/DashboardGUI"; // Uvozi DashboardGUI komponentu koja prikazuje sadržaj stranice za administraciju

export default function Dashboard() {
  return (
    <>
      <Container> {/* Omotava sadržaj stranice u Container komponentu za primenu stilova */}
        <Wrapper> {/* Omotava sadržaj u Wrapper komponentu za dodatno stilizovanje */}
          <DashboardGUI /> {/* Renderuje DashboardGUI komponentu koja prikazuje glavni sadržaj stranice za administraciju */}
        </Wrapper>
      </Container>
    </>
  );
}
