"use client"

import Botao from "@/components/Botao"
import CampoDigitacao from "@/components/CampoDigitacao"
import PaginaPadrao from "@/components/PaginaPadrao"
import styled from "styled-components"


const StyledTitle = styled.h1`
    font-size: var(--font-size-2);
    color: var(--color-primary);
    font-family: var(--font-family-italiana);
    text-align: center;
    `

const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 28px;
    `

export const ConfiguracoesGerais = () => {

    return(
        <PaginaPadrao>
        <form>
            <StyledTitle>Configurações Gerais</StyledTitle>
            <CampoDigitacao tipo="text" label="Idioma" placeholder=""/>
            <CampoDigitacao tipo="text" label="Moeda" placeholder=""/>
            <CampoDigitacao tipo="text" label="Formato Data/Hora" placeholder=""/>
            <CampoDigitacao tipo="text" label="Unidades de Medida" placeholder=""/>
            <CampoDigitacao tipo="text" label="Configurações de impostos" placeholder=""/>
            <StyledDiv>
                <Botao texto="Confirmar" tipo="submit"/>
                <Botao texto="Cancelar"/>
            </StyledDiv>
        </form>
        </PaginaPadrao>

    )
    
}

export default ConfiguracoesGerais