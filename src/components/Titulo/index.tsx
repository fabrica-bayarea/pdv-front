import React from 'react'
import styled from 'styled-components'


const TituloEstilizado = styled.h1`
    color: #5F0000;
    font-family: Italiana;
    font-size: 40px;
    font-weight: 700;
`

const Titulo = ({texto}: {texto: string}) => {
  return (
    <TituloEstilizado>{texto}</TituloEstilizado>
  )

}

export default Titulo