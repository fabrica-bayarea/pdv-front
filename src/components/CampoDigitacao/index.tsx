import React from 'react'
import styled from 'styled-components'

interface Props {
    tipo: string
    placeholder: string
    label?: string
    register?: any 
    onChange?: (value: any) => void
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

    &:focus{

      outline: none;

    }
`;

const Rotulo = styled.label`
    display: block;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #5F0000;
`

const Container = styled.div`
    width: 100%;
`

const CampoDigitacao = ({tipo, placeholder, label, register, onChange}: Props) => {
  return (
    <Container>
      <Rotulo>{label}</Rotulo>
    <Campo 
        type={tipo}
        placeholder={placeholder}
        onChange={(e: any) => {
          if (onChange) {
              onChange(e.target.value);
          }
      }}
        {...register}
    />
    </Container>
  )
}

export default CampoDigitacao