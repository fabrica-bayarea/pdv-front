import React from 'react'
import styled from 'styled-components'

interface Props {
    valor: string
    tipo: string
    placeholder: string
    label?: string
    onChange: (value: string) => void
}

const Campo = styled.input`
    background: #F0F0F0;
    margin: 1em 0;
    box-sizing: border-box;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    width: 100%;
    padding: 16px;
    border: none;
    &:active {
        
    }
`;

const Rotulo = styled.label`
    display: block;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #DA2A38;
`

const Container = styled.div`
    width: 100%;
`

const CampoDigitacao = ({tipo, valor, placeholder, onChange, label}: Props) => {
  return (
    <Container>
      <Rotulo>{label}</Rotulo>
    <Campo 
        type={tipo}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required
    />
    </Container>
  )
}

export default CampoDigitacao