import React, { useState } from "react";
import { HiArrowDown } from 'react-icons/hi';
import { FaClipboardList, FaLocationArrow, FaList } from "react-icons/fa";
import { FaHandHoldingDollar, FaGear } from "react-icons/fa6";
import styled from "styled-components";
import rec from './rec.png';
import Image from "next/image";
import { Divider } from "@mui/material";
import Link from "next/link";

const SidebarItemWrapper = styled.div`
  padding: .75em 1em;
  display: block;
  transition: background-color .15s;
  border-radius: 5px;
  margin-bottom: 30px;

  &.open {
    .toggle-btn { 
      transform: rotate(180deg);
    }
  }
`;

const SideBarSubList = styled.div`
padding: .75em 1em;
display: flex;
align-items: center;
transition: background-color .15s;
border-radius: 5px;
margin-bottom: 10px;
`

const SidebarTitle = styled.div`
  display: flex;
  font-size: 1.2em;
  justify-content: space-around;
`;

const ToggleButton = styled(HiArrowDown)`
  cursor: pointer;
  transition: transform .3s;

  .open & {
    transform: rotate(180deg);
  }
`;

const SidebarContent = styled.div`
  padding-top: .25em;
  height: 0;
  overflow: hidden;
  background-color: "#000";
    &.open {
    height: auto;
  }
`;

const SidebarPlainLink = styled(Link)`
  color: #000;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 15px;
  &:hover {
    text-decoration: underline;
  }
`;
  

const IconContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ContainerLink = styled.div`
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  padding-left: 60px;
  gap: 10px;
`

const SidebarItem = ({ item }: { item: any }) => {
  const [open, setOpen] = useState(false);

  let iconComponent = null;

  if (item.childrens) {
    switch (item.icon) {
      case "FaHandHoldingDollar":
        iconComponent = <FaHandHoldingDollar color="#DA2A38" size={25} />;
        break;
      case "FaLocationArrow":
        iconComponent = <FaLocationArrow color="#DA2A38" size={25} />;
        break;
      case "FaGear":
        iconComponent = <FaGear color="#DA2A38" size={25} />;
        break;
        case "FaClipboardList":
          iconComponent = <FaClipboardList color="#DA2A38" size={25} />;
          break;
      default:
        break;
    }

    return (
      <SidebarItemWrapper className={open ? "open" : ""}>
        <SidebarTitle>
          <IconContainer>
            {iconComponent}
            {item.title}
            </IconContainer>
          
          <ToggleButton className="bi-chevron-down toggle-btn" onClick={() => setOpen(!open)} />
        </SidebarTitle>
        <SidebarContent className={open ? "open" : ""}>
          {item.childrens.map((child: { child: any }, index: { index: any }) => (
            <SidebarItem item={child} />
          ))}
        </SidebarContent>
        <Divider variant="middle" sx={{marginTop: '10px'}} />
      </SidebarItemWrapper>
    );
  } else {
    return (
        <ContainerLink>
            <SideBarSubList>
                <SidebarPlainLink href={item.path || "#"} className="plain">
                <Image src={rec} alt="" />
                {item.title}
                </SidebarPlainLink> 
            </SideBarSubList>
        </ContainerLink>
    );
  }
};

export default SidebarItem;
