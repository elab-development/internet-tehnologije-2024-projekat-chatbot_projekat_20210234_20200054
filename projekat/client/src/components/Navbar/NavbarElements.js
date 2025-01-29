import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

export const Nav = styled.div`
background: radial-gradient(circle at 24.1% 68.8%, rgb(34, 85, 34) 0%, rgb(0, 50, 0) 99.4%);
  height: 5rem;
  display: flex;
  justify-content: space-between;
  z-index: 10;
`;

export const NavLink = styled(Link)`
  color: #00c6bd;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  cursor: pointer;
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -1.5px;
`;

export const NavBtn = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
`;

export const NavBtnLink = styled(Link)`
  border-radius: 0.25rem;
  background: rgb(0, 125, 104);
  font-weight: bold;
  padding: 0.625rem 1.375rem;
  color: #000;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  border: 1rem;
  border-radius: 2rem;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
`;
export const Navlogo = styled.img`
  width: 100%;
`;

export const HandleLogo = styled.div`
  max-width: 10rem;
  font-size: 2rem;
  margin-left: 1.5rem;
  display: flex;
  align-items: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  img {
    height: 50px;
    width: auto;
    margin-right: 5px;
  }

  span {
    display: flex;
    align-items: baseline;
    font-family: 'Modak', cursive;
    margin-bottom: -10px;
    font-weight: none;
    
    .vet {
      color: rgb(129, 182, 76); /* Green for "Vet" */
      padding-right: 12px;
    }

    .pet {
      color: rgb(0, 125, 104); /* Teal for "Pet" */
    }
  }
`;


