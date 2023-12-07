"use client"
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import imagemErro from './error.png'
import logo from '../../../public/logoIesb.png'

const Main = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 100%;
    background-color: #FFDBE1;
`

const DivTextos = styled.div`

`
const DivImagem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Titulo = styled.h1`
    color: #384259;
    font-size: 64px;
`

const TextoSecundario = styled.p`
    color: #384259;
    font-size: 32px;
`

const Erro = () => {
  return (
    <Main>
        <DivTextos>
            <Titulo>Ooops....</Titulo>
            <TextoSecundario>
                Tivemos um pequeno erro
            </TextoSecundario>
        </DivTextos>
        <DivImagem>
            <Image src={logo} alt='logo' width={100} height={100} /> 
            <Image src={imagemErro} alt='imagemErro' width={500} height={400} /> 
        </DivImagem>
    </Main>
  )
}

export default Erro