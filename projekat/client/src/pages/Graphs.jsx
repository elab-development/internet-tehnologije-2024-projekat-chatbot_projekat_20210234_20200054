import { Container, Wrapper } from "../assets/styles"; // Uvozi stilizovane komponente Container i Wrapper iz datoteke sa stilovima
import GraphsGUI from "../components/Graphs/GraphsGUI"; // Uvozi 

export default function AboutUs() {
  return (
    <>
      <Container> {/* Omotava sadržaj stranice u Container komponentu za primenu stilova */}
        <Wrapper> {/* Omotava sadržaj u Wrapper komponentu za dodatno stilizovanje */}
          <GraphsGUI /> {/* Renderuje  komponentu koja prikazuje sadržaj o nama */}
        </Wrapper>
      </Container>
    </>
  );
}