"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { useForm, SubmitHandler } from "react-hook-form"
import styled from 'styled-components'
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"

type Inputs = {
  cpf: string
  nome: string
  email: string
  telefone: string
  endereco: string
  nascimento: string
}

const FormEstilizado = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 30px;
    margin-top: 25px;
`

const DivEstilizada = styled.div`
    display: flex;
`

const Erro = styled.span`
  font-size: 13px;
  color: #DA2A38;
`

const schema = Yup.object().shape({             // cria as regras para formatação
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
      .required('CPF é obrigatório'),
    email: Yup.string()
    .email('Digite um email válido!')
    .required('O campo e-mail é obrigatório!'),
    nome: Yup.string()
    .min(4, 'O nome precisa ter mais de 10 caracteres!')
    .max(100)
    .required('O campo nome é obrigatório!')
    .matches(/^[aA-zZ\s]+$/, "Digite um nome válido!"),
    telefone: Yup.string().required('Telefone é obrigatório!').matches(/\(\d{2}\) \d{5}-\d{4}/, "Digite um telefone válido!"),
    endereco: Yup.string().required('Endereço é obrigatório!'),
    nascimento: Yup.string().required('Nascimento é obrigatório!'),
});


const Cliente = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>(({
    resolver: yupResolver(schema),
  }))


  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data) // o data vem dos register que pega os textos do input "automaticamnte" pelo react-hook-form
    // vamos colocar a código para consumir a API aqui
  }

  return (
    <Menu>

      <Titulo texto="Cadastro de cliente"  />

      <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
        <CampoDigitacao tipo="text" label="CPF" placeholder="Insira seu CPF" register={register("cpf")}  />  
        <Erro>{errors.cpf?.message}</Erro>
        <CampoDigitacao tipo="text" label="Email" placeholder="Insira seu endereço de email" register={register("email")}   />
        <Erro>{errors.email?.message}</Erro>
        <CampoDigitacao tipo="text" label="Nome"  placeholder="Insira seu endereço de email" register={register("nome")} />
        <Erro>{errors.nome?.message}</Erro>
        <CampoDigitacao tipo="text" label="Telefone" placeholder="Insira seu telefone" register={register("telefone")} />
        <Erro>{errors.telefone?.message}</Erro>
        <CampoDigitacao tipo="text" label="Endereço" placeholder="Insira seu endereco" register={register("endereco")}  />
        <Erro>{errors.endereco?.message}</Erro>
        <CampoDigitacao tipo="text" label="Nascimento" placeholder="Insira seu nascimento" register={register("nascimento")} />
        <Erro>{errors.nascimento?.message}</Erro>

      <DivEstilizada>
        <Botao texto='Confirmar' tipo='submit' />
        <Botao texto='Cancelar' secundario={true.toString()} />        
      </DivEstilizada>  
      </FormEstilizado>

    </Menu>
  )
}

export default Cliente