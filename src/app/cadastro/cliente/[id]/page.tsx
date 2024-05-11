import Botao from '@/components/Botao';
import Menu from '@/components/PaginaPadrao';
import Titulo from '@/components/Titulo';
import { http } from '@/services';
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from 'next/router';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ICliente } from '@/interfaces/ICliente';
import { mask } from 'remask';
import CampoDigitacao from '@/components/CampoDigitacao';

type Inputs = {
  cpf?: string | undefined;
  nome?: string | undefined;
  email?: string | undefined;
  telefone?: string | undefined;
  endereco?: string | undefined;
  dataNascimento?: string | undefined;
}

const FormEstilizado = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 30px;
    margin-top: 25px;
`;

const DivEstilizada = styled.div`
    display: flex;
`;

const Erro = styled.span`
  font-size: 13px;
  color: #5F0000;
`;

const Loading = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const schema = Yup.object().shape({
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
  dataNascimento: Yup.string()
});

const FormCliente = () => {
  const router = useRouter(); 
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      if (token) {
        setLoading(false);
        setAccessToken(token);
      } else {
        router.push('/erro'); 
      }
    }, 2000);
  }, [router]);

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
      case "dataNascimento":
        setValue("dataNascimento", mask(valor, '9999-99-99'));
        break;
    }
  }

  useEffect(() => {
    const params = router.query; 
    if (params) {
      http.get('/clientes/' + params.id).then((resultado: { data: any; }) => {
        const autor = resultado.data;
        const atributos: any[] = ["cpf", "email", "nome", "telefone", "endereco"];

        for (let atributo in autor) {
          if (atributo === 'dataNascimento') {
            setValue(atributo, new Date(autor[atributo]).toLocaleDateString());
          }
          if (atributos.includes(atributo)) {
            setValue(atributo as any, autor[atributo]);
          }
        }
      });
    }
  }, [router]);

  const onSubmit: SubmitHandler<Inputs> = (data: ICliente) => {
    try {
      http.request({
        url: '/cliente/' + router.query.id, 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      });

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
        router.push('/gerenciamento/cliente');
      }, 500);

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {loading ? (
        <Loading>
          <CircularProgress
            size={68}
            sx={{
              top: -6,
              left: -6,
              zIndex: 1,
              color: "#5F0000",
              alignItems: "center",
              justifyContent: "center"
            }}
          />
        </Loading>
      ) : (
        <>
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

            <Titulo texto="Cadastro de cliente" />

            <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
              <CampoDigitacao tipo="text" label="CPF" placeholder="Insira seu CPF" register={{
                ...register('cpf', {
                  onChange: (e: any) => { handleChange(e) },
                })
              }} />
              <Erro>{errors.cpf?.message}</Erro>
              <CampoDigitacao tipo="text" label="Email" placeholder="Insira seu endereço de email" register={register("email")} />
              <Erro>{errors.email?.message}</Erro>
              <CampoDigitacao tipo="text" label="Nome" placeholder="Insira seu endereço de email" register={register("nome")} />
              <Erro>{errors.nome?.message}</Erro>
              <CampoDigitacao tipo="text" label="Telefone" placeholder="Insira seu telefone" register={{
                ...register('telefone', {
                  onChange: (e: any) => { handleChange(e) },
                })
              }} />
              <Erro>{errors.telefone?.message}</Erro>
              <CampoDigitacao tipo="text" label="Endereço" placeholder="Insira seu endereco" register={register("endereco")} />
              <Erro>{errors.endereco?.message}</Erro>
              <CampoDigitacao tipo="text" label="dataNascimento" placeholder="Insira sua data" register={{
                ...register('dataNascimento', {
                  onChange: (e: any) => { handleChange(e) },
                })
              }} />
              <Erro>{errors.dataNascimento?.message}</Erro>

              <DivEstilizada>
                <Botao texto='Confirmar' tipo='submit' />
                <Botao texto='Cancelar' secundario={true.toString()} />
              </DivEstilizada>
            </FormEstilizado>

          </Menu>
        </>
      )}
    </>
  )
}

export default FormCliente;
