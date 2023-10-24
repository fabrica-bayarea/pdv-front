"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { useState } from 'react'
import styled from 'styled-components'

const FormEstilizado = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 30px;
`

const DivEstilizada = styled.div`
    display: flex;
`

const Cliente = () => {

  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [cpf, setCPF] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [nascimento, setNascimento] = useState('')

  function handleSubmit() {
    console.log('Submit')
  }

  return (
    <Menu>
      <Titulo texto="Cadastro de cliente"  />
      <FormEstilizado onSubmit={handleSubmit}>
        <CampoDigitacao tipo="text" label="CPF" valor={cpf} placeholder="Insira seu CPF" onChange={setCPF} />
        <CampoDigitacao tipo="email" label="Email" valor={email} placeholder="Insira seu endereço de email" onChange={setEmail} />
        <CampoDigitacao tipo="text" label="Nome" valor={nome} placeholder="Insira seu endereço de email" onChange={setNome} />
        <CampoDigitacao tipo="text" label="Telefone" valor={telefone} placeholder="Insira seu telefone" onChange={setTelefone} />
        <CampoDigitacao tipo="text" label="Endereço" valor={endereco} placeholder="Insira seu endereco" onChange={setEndereco} />
        <CampoDigitacao tipo="text" label="Nascimento" valor={nascimento} placeholder="Insira seu nascimento" onChange={setNascimento} />


      <DivEstilizada>
        <Botao texto='Confirmar' tipo='submit' />
        <Botao texto='Cancelar' secundario={true.toString()} />        
      </DivEstilizada>  
      </FormEstilizado>

    </Menu>
  )
}

export default Cliente