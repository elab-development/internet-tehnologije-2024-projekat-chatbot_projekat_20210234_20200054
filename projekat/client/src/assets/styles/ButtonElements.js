import styled from "styled-components";

export const NavBtn = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
`;
export const StyledBtn = styled.button`
  border-radius: 0.25rem;
  background: rgb(0, 125, 104);
  padding:${props => (props.zero ? "1rem 1.375rem " : "0.625rem 1.375rem")};
  box-shadow: 2px 2px 4px rgba(0,0,0,0.6);
  color:#000;
  outline: none;
  font-size:1rem;
  margin:0 auto;
  justify-content:center;
  cursor: pointer;
  margin-bottom:1.5rem;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  border:1rem;
  font-weight:bold;
  border-radius:${props => (props.zero ? "0rem" : "2rem")};
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;`;
