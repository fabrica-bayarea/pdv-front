"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { useForm, SubmitHandler } from "react-hook-form"
import styled from 'styled-components'
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { mask } from 'remask'
import { http } from '@/services'
import { ICliente } from '@/interfaces/ICliente'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


type Inputs = {
  cpf?: string | undefined
  nome?: string | undefined
  email?: string | undefined
  telefone?: string | undefined
  endereco?: string | undefined
  nascimento?: string | undefined
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
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
    email: Yup.string()
    .email('Digite um email válido!'),
    nome: Yup.string()
    .min(4, 'O nome precisa ter mais de 10 caracteres!')
    .max(100)
    .matches(/^[aA-zZ\s]+$/, "Digite um nome válido!"),
    telefone: Yup.string().matches(/\(\d{2}\) \d{5}-\d{4}/, "Digite um telefone válido!"),
    endereco: Yup.string(),
    nascimento: Yup.string()
});


const FormCliente = () => {
  const params = useParams()
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nome = event.target.name;
    const valor = event.target.value;

    switch (nome) {
        case "cpf":
            setValue("cpf", mask(valor, '999.999.999-99'));
            break;
        case "telefone":
            setValue("telefone", mask(valor, '(99) 99999-9999'));
            break;
        case "nascimento":
            setValue("nascimento", mask(valor, '99/99/9999'));
            break;    
    }
}

useEffect(() => {
  if (params) {
    http.get('/clientes/' + params.id).then(resultado => {
      const autor = resultado.data;
      const atributos:any[] = ["cpf", "email", "nome", "telefone", "endereco"];
      
      for (let atributo in autor) {
        if (atributo === 'nascimento') {
          setValue(atributo, new Date(autor[atributo]).toLocaleDateString());
        }
        if (atributos.includes(atributo)) {
          setValue(atributo, autor[atributo]);
        }
      }
    });
  }

}, [params])

  const onSubmit: SubmitHandler<Inputs> = (data: ICliente) => {
    try {
      http.request({
          url: '/clientes/' + params.id,
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          data: data
    })

    toast.success('Usuário editado!', {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });

      setTimeout(() => {
        push('/gerenciamento/cliente');
      }, 500);

    }  catch(error) {
      console.log(error)  
    }}
  

  return (
    <Menu>

    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
    />

      <Titulo texto="Cadastro de cliente"  />

      <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
        <CampoDigitacao tipo="text" label="CPF" placeholder="Insira seu CPF" register={{...register('cpf', {
                                                                                            onChange: (e) => {handleChange(e)},
                                                                                      })}}  />
        <Erro>{errors.cpf?.message}</Erro>
        <CampoDigitacao tipo="text" label="Email" placeholder="Insira seu endereço de email" register={register("email")}   />
        <Erro>{errors.email?.message}</Erro>
        <CampoDigitacao tipo="text" label="Nome"  placeholder="Insira seu endereço de email" register={register("nome")} />
        <Erro>{errors.nome?.message}</Erro>
        <CampoDigitacao tipo="text" label="Telefone" placeholder="Insira seu telefone" register={{...register('telefone', {
                                                                                            onChange: (e) => {handleChange(e)},
                                                                                      })}} />
        <Erro>{errors.telefone?.message}</Erro>
        <CampoDigitacao tipo="text" label="Endereço" placeholder="Insira seu endereco" register={register("endereco")}  />
        <Erro>{errors.endereco?.message}</Erro>
        <CampoDigitacao tipo="text" label="Nascimento" placeholder="Insira seu nascimento" register={{...register('nascimento', {
                                                                                            onChange: (e) => {handleChange(e)},
                                                                                      })}} />
        <Erro>{errors.nascimento?.message}</Erro>

      <DivEstilizada>
        <Botao texto='Confirmar' tipo='submit' />
        <Botao texto='Cancelar' secundario={true.toString()} />        
      </DivEstilizada>  
      </FormEstilizado>

    </Menu>
  )
}

export default FormCliente