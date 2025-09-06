import { Wrapper, Container } from "../assets/styles"; // Uvozi stilizovane komponente Wrapper i Container iz datoteke sa stilovima
import HeroSection from "../components/HeroSection/HeroSection"; // Uvozi HeroSection komponentu koja prikazuje glavni deo stranice za dobrodošlicu

export default function Landing() {
  return (
    <>
      <Container> {/* Omotava sadržaj stranice u Container komponentu za primenu stilova */}
        <Wrapper> {/* Omotava sadržaj u Wrapper komponentu za dodatno stilizovanje */}
          <HeroSection /> {/* Renderuje HeroSection komponentu koja prikazuje glavni deo stranice za dobrodošlicu */}
        </Wrapper>
      </Container>
    </>
  );
}
