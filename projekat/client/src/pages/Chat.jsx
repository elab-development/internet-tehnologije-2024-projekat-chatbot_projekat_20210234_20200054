import { Container, Wrapper } from "../assets/styles"; // Uvozi stilizovane komponente Container i Wrapper iz datoteke sa stilovima
import ChatGUI from "../components/Chat/ChatGUI"; // Uvozi ChatGUI komponentu koja prikazuje sadržaj stranice za chat

export default function Chat() {
  return (
    <>
      <Container> {/* Omotava sadržaj stranice u Container komponentu za primenu stilova */}
        <Wrapper> {/* Omotava sadržaj u Wrapper komponentu za dodatno stilizovanje */}
          <ChatGUI /> {/* Renderuje ChatGUI komponentu koja prikazuje glavni sadržaj stranice za chat */}
        </Wrapper>
      </Container>
    </>
  );
}
