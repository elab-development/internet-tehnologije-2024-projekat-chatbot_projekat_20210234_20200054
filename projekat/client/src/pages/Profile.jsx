import { Container, Wrapper } from "../assets/styles"; // Uvozi stilizovane komponente Container i Wrapper iz datoteke sa stilovima
import ProfileDetails from "../components/Profile/ProfileDetails"; // Uvozi ProfileDetails komponentu koja prikazuje detalje profila korisnika

export default function Profile() {
  return (
    <>
      <Container> {/* Omotava sadržaj stranice u Container komponentu za primenu stilova */}
        <Wrapper> {/* Omotava sadržaj u Wrapper komponentu za dodatno stilizovanje */}
          <ProfileDetails /> {/* Renderuje ProfileDetails komponentu koja prikazuje detalje profila korisnika */}
        </Wrapper>
      </Container>
    </>
  );
}
