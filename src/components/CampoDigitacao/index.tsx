import React from 'react';
import styled, { css } from 'styled-components';

interface Props {
    tipo: string;
    placeholder: string;
    label?: string;
    register?: any;
    labelSize?: string;
    onChange?: (value: any) => void;
}

const Campo = styled.input`
  display: flex;
  justify-content: center; 
  align-items: center; 
  background: rgba(227, 227, 227, 0.5);
  margin: 1em 0;
  box-sizing: border-box;
  width: 500px; 
  padding: 5px; 
  border: none;
  border-bottom: 2px solid #5F0000;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 14px;
  
  &:focus {
    outline: none;
  }
`;

const Rotulo = styled.label<{ $labelSize?: string }>`
    display: block;
    font-weight: var(--font-weight-0);
    color: var(--color-primary);

    ${({ $labelSize }) => $labelSize && css`
        font-size: ${$labelSize};
    `}
`;

const Container = styled.div`
    width: 100%;
`;

const CampoDigitacao = ({ tipo, placeholder, label, register, labelSize, onChange }: Props) => {
    return (
        <Container>
            <Rotulo $labelSize={labelSize}>{label}</Rotulo>
            <Campo 
                type={tipo}
                placeholder={placeholder}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (onChange) {
                        onChange(e.target.value);
                    }
                }}
                {...register}
            />
        </Container>
    );
};

export default CampoDigitacao;
