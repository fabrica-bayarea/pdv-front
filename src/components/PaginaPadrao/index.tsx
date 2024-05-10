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
  width: 350px;
  flex-shrink: 0;
  background-color: #F6F6F6;
  /* height: 100%; */
  overflow: auto;
  padding-top: 0px;
  transition: transform 0.3s;
`;

const Header = styled.div`
  display: flex;
  flex-direction: ;
  gap: 10px; 
  align-items: center; 
  padding: 0px; 
  width: 350px;
  background-color: #F6F6F6;
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
    padding-left: 90px;
    height: 100%;
`

export default function PaginaPadrao({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Main>
      <Header>
        <FaList onClick={toggleSidebar} size={40} color="#5F0000" />
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
