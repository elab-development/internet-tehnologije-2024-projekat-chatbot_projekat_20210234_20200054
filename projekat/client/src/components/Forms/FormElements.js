import styled from "styled-components";

export const Head = styled.div`
  font-size: 4rem;
  text-align: center;
  font-family: 'Modak';
  font-weight: normal;
  color: #faf9f9;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
`;

export const Select = styled.select`
  margin-top: 0.3rem;
  min-width: 25em;

  height: 2.5rem;
  padding: 0rem 0.6rem;

  margin-bottom: 0.2rem;
  border: none;
  outline: none;
  border-radius: 1rem;
  transition: all 250ms ease-in-out;

  font-size: 1rem;
  font-weight: bold;

  color: rgb(205, 237, 174);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
  background-color:rgb(167, 164, 152);

  /* Optional: Add a focus style to enhance user experience */
  &:focus {
    background-color: #c0c0c0;
  }
`;

export const Form = styled.form`
  margin-top: 1.5rem;
  display: flex;
  color: #00c6bd;
  flex-direction: column;
`;

export const Formgroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.938rem;
  label {
    font-size: 2rem;
    font-family: "Knewave", serif;
    color: rgb(205, 237, 174);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
  }
`;

export const Input = styled.input`
  margin-top: 0.3rem;
  min-width: 25em;

  height: 2.5rem;
  padding: 0rem 0.6rem;
 
  margin-bottom: 0.2rem;
  border: none;
  outline: none;
  border-radius: 1rem;

  font-size: 1rem;

  color: rgb(205, 237, 174);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
  background-color:rgb(167, 164, 152);

  transition: all 250ms ease-in-out;
`;

export const Para = styled.p`
  color:rgb(251, 0, 0);
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
`;
export const Linkspan = styled.span`
color: rgb(76, 133, 182);
text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
font-family: "Knewave", serif;
  &:hover {
    cursor: pointer;
  }
`;
export const Footer = styled.div`
    font-size: 2rem;
    font-family: "Knewave", serif;
    color: rgb(205, 237, 174);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
`;
