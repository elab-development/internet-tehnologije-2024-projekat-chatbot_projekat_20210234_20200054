import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  min-height: calc(100vh - 5rem);
  margin: auto;
`;

export const Wrapper = styled.div`
  display: flex;
  width: 90%;
  margin: auto;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 980px) {
    display: block;
  }
`;
