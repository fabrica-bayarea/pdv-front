"use client"
import * as React from 'react';
import items from './data/SideBar.json';
import styled from "styled-components";
import SidebarItem from './SideBarItem';
import { FaList } from "react-icons/fa";

interface Props {
  children?: React.ReactNode
}

const Sidebar = styled.div`
  height: 100%;
  flex-shrink: 0;
  background-color: rgba(218, 210, 210, 1);
  overflow: auto;
  padding-top: 0px;
  transition: transform 0.3s;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px; 
  align-items: center; 
  padding: 0px; 
  width:100%;
  background-color:rgba(218, 210, 210, 1);
  cursor: pointer;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FlexContainer = styled.div`
  display: flex;
  height: 100%;
  overflow: auto;
`;

const Conteudo = styled.div`
    display: flex;
    height: 100%;
    overflow-y: scroll;
    flex-grow: 1;
    align-items: center;
    flex-direction: column;
    background-color: rgba(55, 55, 55, 0.08);
`

export default function PaginaPadrao({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Main>
      <Header>
        <FaList onClick={toggleSidebar} size={40} color="black" />
      </Header>
      <FlexContainer>
        <Sidebar style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
        {items.map((item, index) => <SidebarItem key={index} item={item} />)}
      </Sidebar>
      <Conteudo>
        {children}
      </Conteudo>
      </FlexContainer>

    </Main>
  );
}
