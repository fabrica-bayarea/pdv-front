import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  secundario?: boolean | string;
}

const BotaoEstilizado = styled.button<ButtonProps>`
  width: 180px;
  height: 50px;
  color: #fff;
  border: none;
  border-radius: 50px;
  background-color: ${props => (props.secundario ? '#5F0000' : '#5F0000')};
  cursor: pointer;
  box-shadow: 3px 3px 9px rgba(0, 0, 0, 0.25);
  font-family: 'Libre Franklin', sans-serif;
  font-size: 16px;
`;

interface Props {
  texto: string;
  secundario?: boolean | string;
  tipo?: string;
  onClick?: () => void;
}

const Botao = ({ texto, secundario, tipo, onClick }: Props) => {
  return (
    <BotaoEstilizado secundario={secundario} onClick={onClick}>
      {texto}
    </BotaoEstilizado>
  );
};

export default Botao;
