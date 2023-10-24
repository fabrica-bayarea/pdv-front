"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { FormEvent, useState } from 'react'
import styled from 'styled-components'
import * as Yup from 'yup';

const FormEstilizado = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 30px;
`

const DivEstilizada = styled.div`
    display: flex;
`

const Erro = styled.span`
  font-size: 18px;
  color: "#DA2A38";
`

const schema = Yup.object().shape({
  cpf: Yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
    .required('CPF é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  nome: Yup.string().required('Nome é obrigatório'),
  telefone: Yup.string().required('Telefone é obrigatório'),
  endereco: Yup.string().required('Endereço é obrigatório'),
  nascimento: Yup.string().required('Nascimento é obrigatório'),
});


const Cliente = () => {

  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [cpf, setCPF] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [nascimento, setNascimento] = useState('')

  const [erros, setErros] = useState({
    cpf: '',
    email: '',
    nome: '',
    telefone: '',
    endereco: '',
    nascimento: '',
  });
  
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    schema
      .validate(
        { cpf, email, nome, telefone, endereco, nascimento },
        { abortEarly: false }
      )
      .then(() => {
        console.log('Formulário válido, envie os dados');
      })
      .catch((error: Yup.ValidationError) => {
        console.log(error)
      });
  }
  


  return (
    <Menu>
      <Titulo texto="Cadastro de cliente"  />
      <FormEstilizado onSubmit={handleSubmit}>
        <CampoDigitacao tipo="text" label="CPF" valor={cpf} placeholder="Insira seu CPF" onChange={setCPF} />
        {erros.cpf && <Erro className="erro">{erros.cpf}</Erro>}
        <CampoDigitacao tipo="email" label="Email" valor={email} placeholder="Insira seu endereço de email" onChange={setEmail} />
        {erros.email && <Erro className="erro">{erros.email}</Erro>} 
        <CampoDigitacao tipo="text" label="Nome" valor={nome} placeholder="Insira seu endereço de email" onChange={setNome} />
        <CampoDigitacao tipo="text" label="Telefone" valor={telefone} placeholder="Insira seu telefone" onChange={setTelefone} />
        <CampoDigitacao tipo="text" label="Endereço" valor={endereco} placeholder="Insira seu endereco" onChange={setEndereco} />
        <CampoDigitacao tipo="text" label="Nascimento" valor={nascimento} placeholder="Insira seu nascimento" onChange={setNascimento} />
        {Object.values(erros).map((error, index) => (
          <Erro key={index}>{error}</Erro>
        ))}

      <DivEstilizada>
        <Botao texto='Confirmar' tipo='submit' />
        <Botao texto='Cancelar' secundario={true.toString()} />        
      </DivEstilizada>  
      </FormEstilizado>

    </Menu>
  )
}

export default Cliente