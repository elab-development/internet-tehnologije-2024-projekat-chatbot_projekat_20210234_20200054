import { Container, Wrapper } from "../assets/styles"; // Uvozi stilizovane komponente Container i Wrapper iz datoteke sa stilovima
import AboutUsGUI from "../components/AboutUs/AboutUsGUI"; // Uvozi AboutUsGUI komponentu koja prikazuje sadržaj stranice "About Us"

export default function AboutUs() {
  return (
    <>
      <Container> {/* Omotava sadržaj stranice u Container komponentu za primenu stilova */}
        <Wrapper> {/* Omotava sadržaj u Wrapper komponentu za dodatno stilizovanje */}
          <AboutUsGUI /> {/* Renderuje AboutUsGUI komponentu koja prikazuje sadržaj o nama */}
        </Wrapper>
      </Container>
    </>
  );
}
