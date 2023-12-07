"use client"
import CampoDigitacao from '@/components/CampoDigitacao';
import Image from 'next/image';
import styled from 'styled-components';
import logo from '../../../public/logoIesb.png'
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import * as Yup from 'yup'
import Botao from '@/components/Botao';
import { toast, ToastContainer } from 'react-toastify'
import { http } from '@/services';
import { useRouter } from 'next/navigation'
import "react-toastify/dist/ReactToastify.css";
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const form = Yup.object().shape({             // cria as regras para formatação
  usuario: Yup.string().required('Usuário é obrigatório!'),
  senha: Yup.string().required('Senha é obrigatório!'),
});

type Inputs = {
  usuario: string
  senha: string
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

const Login = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { push } = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Inputs>(({
    resolver: yupResolver(form),
  }))

  const Main = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
  `;

  const ContainerTopo = styled.div`
      justify-content: flex-start;
      margin-top: 57px;
  `

  const Titulo = styled.h1`
    color: #DA2A38;
    text-align: center;
    font-size: 64px;
    margin-top: 20px;
  `

  const ContainerLogin = styled.div`
      justify-content: flex-start;
      margin-top: 57px;
      width: 20%;
  `

  const FormEstilizado = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 30px;
    margin-top: 25px;
`

  const DivBotoes = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-bottom: 30px;
  `

  const Erro = styled.span`
    font-size: 13px;
    color: #DA2A38;
  `

  const onSubmit: SubmitHandler<Inputs> = async (dados) => {
    try {
      const response = await http.request({
        url: '/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: dados
      });

      console.log('token:', response.data.token);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setTimeout(() => {
          push('/gerenciamento/cliente');
        }, 1000);
      } else {
        throw new Error("Acesso negado!");
      }

    } catch (error) {
        setOpen(true);
    }
  }


  

  return (
    <>
        <Main>
        
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h3" 
                component="h2" 
                sx={{ color: '#DA2A38', textAlign: 'center' }}
            >
              Acesso negado!
            </Typography>
          </Box>
        </Modal>

            <ContainerTopo>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
            />
              <Image src={logo} alt='Logo' width={200} height={200} /> 
              <Titulo>PDV</Titulo>
            </ContainerTopo>

            <ContainerLogin>
                <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
                  <CampoDigitacao 
                    tipo="text" 
                    label="Usuário" 
                    placeholder="Insira o usuário" 
                    register={register("usuario")} />

                  <Erro>{errors.usuario?.message}</Erro>

                  <CampoDigitacao 
                    tipo="password" 
                    label="Senha" 
                    placeholder="Insira a senha" 
                    register={register("senha")} />

                  <Erro>{errors.senha?.message}</Erro>

                  <DivBotoes>
                    <Botao texto='Entrar' tipo='submit'/>
                    <Botao texto='Recuperar senha'  />
                  </DivBotoes>
                </FormEstilizado>
            </ContainerLogin>


        </Main>
    </>
  )
}

export default Login