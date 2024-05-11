import React, { useState } from "react";
import { HiArrowDown } from 'react-icons/hi';
import { FaAddressCard, FaClipboardList, FaLocationArrow, FaUserTie } from "react-icons/fa";
import { FaHandHoldingDollar, FaGear, FaUserPen, FaMoneyBillTrendUp, FaCubesStacked } from "react-icons/fa6";
import styled from "styled-components";
import { Divider } from "@mui/material";
import Link from "next/link";

const SidebarItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 25px;
  transition: background-color .15s;
  &.open {
    .toggle-btn { 
      transform: rotate(180deg);
    }
  }
`;

const SideBarSubList = styled.div`
display: flex;
align-items: center;
transition: background-color .15s;
margin-bottom: 10px;
`

const SidebarTitle = styled.div`
  display: flex;
  font-size: 1.2em;
`;

const ToggleButton = styled(HiArrowDown)`
  cursor: pointer;
  transition: transform .3s;

  .open & {
    transform: rotate(180deg);
  }
`;

const SidebarContent = styled.div`
  overflow: hidden;
  height: 0;
  transform: scaleY(0);  
  transform-origin: top;
  transition: transform 0.2s;
  background-color: "#000";
  &.open {
    height: auto;
    transform: scaleY(1);
  }
`;

const SidebarPlainLink = styled(Link)`
  display: flex;
  align-items: center;  
  color: #000;
  text-decoration: none;
  gap: 15px;
  &:hover {
    text-decoration: underline;
  }
`;
  
const IconContainer = styled.div`
  display: flex;
  gap:20px;
`;

const ContainerLink = styled.div`
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  padding-left: 10px;
  gap: 10px;
`

const SidebarItem = ({ item }: { item: any }) => {
  const [open, setOpen] = useState(false);

  let iconComponent = null;

  if (item.childrens) {
    switch (item.icon) {
      // case "FaHandHoldingDollar":
      //   iconComponent = <FaHandHoldingDollar color="black" size={25} />;
      //   break;
      // case "FaLocationArrow":
      //   iconComponent = <FaLocationArrow color="black" size={25} />;
      //   break;
      // case "FaGear":
      //   iconComponent = <FaGear  color="black" size={25} />;
      //   break;
      // case "FaClipboardList":
      //   iconComponent = <FaClipboardList color="black" size={25} />;
      //   break;
// ----------------------------------------------------------------------------------
      case "FaAddressCard":
        iconComponent = <FaAddressCard color="black" size={25} />;
        break;
      case "FaMoneyBillTrendUp":
        iconComponent = <FaMoneyBillTrendUp color="black" size={25} />;
        break;
        case "FaUserTie":
          iconComponent = <FaUserTie color="black" size={25} />;
          break;
      case "FaUserTie":
        iconComponent = <FaUserTie color="black" size={25} />;
        break;
      case "FaCubesStacked":
        iconComponent = <FaCubesStacked color="black" size={25} />;
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
          {item.childrens.map((child: { child: any }, index: number) => (
            <SidebarItem key={index} item={child} />
          ))}
        </SidebarContent>
        <Divider variant="middle" sx={{marginTop: '10px'}} />
      </SidebarItemWrapper>
    );
  } else {
    const estiloIcone = {
      background: 'black',
      width: '24px',
      height: '24px',
      borderRadius: '12px 0',
    };
    
    return (
        <ContainerLink>
            <SideBarSubList>
                <SidebarPlainLink href={item.path || "#"} className="plain">
                {/* <Image src={rec} alt="" /> */}
                <div style={estiloIcone}></div>
                {item.title}
                </SidebarPlainLink> 
            </SideBarSubList>
        </ContainerLink>
    );
  }
};

export default SidebarItem;
