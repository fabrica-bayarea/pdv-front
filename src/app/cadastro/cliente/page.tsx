"use client"
import Botao from '@/components/Botao';
import CampoDigitacao from '@/components/CampoDigitacao';
import Menu from '@/components/PaginaPadrao';
import Titulo from '@/components/Titulo';
import { useForm, SubmitHandler } from 'react-hook-form';
import styled from 'styled-components';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { mask } from 'remask';
import { http } from '@/services';
import { ICliente } from '@/interfaces/ICliente';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

type Inputs = {
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  data_nascimento: string;
};

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
  color: #da2a38;
`;

const Loading = styled.div`
  height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
`

const schema = Yup.object().shape({
  cpf: Yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
    .required('CPF é obrigatório'),
  email: Yup.string().email('Digite um email válido!').required('O campo e-mail é obrigatório!'),
  nome: Yup.string()
    .min(4, 'O nome precisa ter mais de 10 caracteres!')
    .max(100)
    .required('O campo nome é obrigatório!')
    .matches(/^[aA-zZ\s]+$/, 'Digite um nome válido!'),
  telefone: Yup.string().required('Telefone é obrigatório!').matches(/\(\d{2}\) \d{5}-\d{4}/, 'Digite um telefone válido!'),
  endereco: Yup.string().required('Endereço é obrigatório!'),
  data_nascimento: Yup.string().required('Nascimento é obrigatório!'),
});

const Cliente = () => {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState('');

  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      if (token) {
        setLoading(false);
        setAccessToken(token);
      } else {
        push('/erro');
      }
    }, 2000);

  }, [push]);

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
      case 'cpf':
        setValue('cpf', mask(valor, '999.999.999-99'));
        break;
      case 'telefone':
        setValue('telefone', mask(valor, '(99) 99999-9999'));
        break;
      case 'data_nascimento':
        setValue('data_nascimento', mask(valor, '99/99/9999'));
        break;
    }
  }

  const onSubmit: SubmitHandler<Inputs> = async (data: ICliente) => {
    console.log(data);
    try {
      await http.request({
        url: '/cliente',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        data: data,
      });

      toast.success('Cadastro feito!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

      push('/gerenciamento/cliente');
      
    } catch (error) {
      console.log(error);
      toast.error('Erro ao fazer o cadastro!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

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
            color: "#da2a38",
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
            <CampoDigitacao
              tipo="text"
              label="CPF"
              placeholder="Insira seu CPF"
              register={{
                ...register('cpf', {
                  onChange: (e) => {
                    handleChange(e);
                  },
                }),
              }}
            />
            <Erro>{errors.cpf?.message}</Erro>
            <CampoDigitacao
              tipo="text"
              label="Email"
              placeholder="Insira seu endereço de email"
              register={register('email')}
            />
            <Erro>{errors.email?.message}</Erro>
            <CampoDigitacao tipo="text" label="Nome" placeholder="Insira seu endereço de email" register={register('nome')} />
            <Erro>{errors.nome?.message}</Erro>
            <CampoDigitacao
              tipo="text"
              label="Telefone"
              placeholder="Insira seu telefone"
              register={{
                ...register('telefone', {
                  onChange: (e) => {
                    handleChange(e);
                  },
                }),
              }}
            />
            <Erro>{errors.telefone?.message}</Erro>
            <CampoDigitacao tipo="text" label="Endereço" placeholder="Insira seu endereco" register={register('endereco')} />
            <Erro>{errors.endereco?.message}</Erro>
            <CampoDigitacao
              tipo="text"
              label="Nascimento"
              placeholder="Insira seu data_nascimento"
              register={{
                ...register('data_nascimento', {
                  onChange: (e) => {
                    handleChange(e);
                  },
                }),
              }}
            />
            <Erro>{errors.data_nascimento?.message}</Erro>

            <DivEstilizada>
              <Botao texto="Confirmar" tipo="submit" />
              <Botao texto="Cancelar" secundario={true.toString()} />
            </DivEstilizada>
          </FormEstilizado>
        </Menu>  
        </>
      )}
    </>
  );
};

export default Cliente;
