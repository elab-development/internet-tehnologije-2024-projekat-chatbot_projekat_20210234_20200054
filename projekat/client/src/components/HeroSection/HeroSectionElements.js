import styled from "styled-components";

export const Head = styled.h2`
  color: #faf9f9;
  font-size: 4rem;
  margin-bottom: 1.5rem;
  font-family: "Oswald", sans-serif;
  font-weight: "bold";
  margin-right: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
`;
export const Para = styled.p`
  color: #faf9f9;
  max-width: 37.5rem;
  font-size: 1.8 rem;
  margin-bottom: 2rem;
  text-align: justify;
  margin-right: 20px;
`;

export const Subs = styled.p`
  color: rgb(129, 182, 76);
  font-weight: bold;
  font-family: "Knewave", serif;
  opacity: 0.95;
  font-size: 1.8rem;
  margin-bottom: 1.25rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
`;

export const CapsLetter = styled.span`
  font-family: 'Modak';
  font-weight: normal;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  font-size: 4.5rem;
  .vet {
    color: rgb(129, 182, 76); /* Green for "Vet" */
    font-family: 'Modak';
    font-weight: normal;
  }

  .pet {
    color: rgb(0, 125, 104); /* Teal for "Pet" */
    font-family: 'Modak';
    font-weight: normal;
  }
`;



export const Logo = styled.img`
  width: 100%;
`;

export const HandleImg = styled.div`
  max-width: 35rem;
  text-align: center;
  @media (max-width: 980px) {
    display: none;
  }
`;
