import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  secundario?: boolean | string;
}

const BotaoEstilizado = styled.button<ButtonProps>`
  width: 100px;
  height: 40px;
  color: #fff;
  border: none;
  border-radius: 8px;
  background-color: ${props => (props.secundario ? '#f08080' : '#DA2A38')};
  cursor: pointer;
  margin-right: 40px;
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
