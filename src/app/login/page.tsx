"use client";
// import wordCloud from "../../../public/wordCloud.jpg";
import CampoDigitacao from "@/components/CampoDigitacao";
import Image from "next/image"
import styled from "styled-components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import Botao from "@/components/Botao";
import { toast, ToastContainer } from "react-toastify";
import { http } from "@/services";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const form = Yup.object().shape({
  // cria as regras para formatação
  email: Yup.string()
    .required("E-mail é obrigatório!")
    .email("Insira um e-mail válido!"),
  senha: Yup.string().required("Senha é obrigatório!"),
});

type Inputs = {
  email: string;
  senha: string;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

const Login = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(form),
  });

  const Main = styled.div`
    display: flex;
    justify-content: center;
    height: 100vh;
    background-color: #E3E3E3;
  `;

  const StyledColumn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const ContainerTopo = styled.div`
    justify-content: flex-start;
  `;

  const Titulo = styled.h1`
  font-family: "Italiana", serif;
  .italiana-regular {
    font-family: "Italiana", sans-serif;
    font-weight: 400;
    font-style: normal;
  }
  color: var(--color-primary);
  width: 100%;
  text-align: center;
  font-size: var(--font-size-0);

  padding:20px;
`;

  const ContainerLogin = styled.div`
    /* justify-content: flex-start; */
    /* width: 20%; */
  `;

  const FormEstilizado = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 30px;
    margin-top: 100px;
  `;

  const DivBotoes = styled.div`
  display: flex;
  flex-direction: column; 
  align-items: center;
  gap: 16px; 
  color: var(--color-primary);

`;


  const Erro = styled.span`
    font-size: 16px;
    color: #5f0000;
  `;

  const onSubmit: SubmitHandler<Inputs> = async (dados) => {
    try {
      const response = await http.request({
        url: "/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: dados,
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        setTimeout(() => {
          push("/cadastro/cliente");
        }, 1000);
      } else {
        throw new Error("Acesso negado!");
      }
    } catch (error) {
      setOpen(true);
    }
  };

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
            <Typography
              id="modal-modal-title"
              variant="h3"
              component="h2"
              sx={{ color: "#5F0000", textAlign: "center" }}
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
        </ContainerTopo>


        <StyledColumn>
          <ContainerLogin>
            <Titulo>PDV</Titulo>
            <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
              <CampoDigitacao
                tipo="text"
                label="E-mail"
                placeholder="Insira o e-mail"
                register={register("email")}
              />

              <Erro>{errors.email?.message}</Erro>

              <CampoDigitacao
                tipo="password"
                label="Senha"
                placeholder="Insira a senha"
                register={register("senha")}
              />

              <Erro>{errors.senha?.message}</Erro>

              <DivBotoes>
                <Botao texto="Entrar" tipo="submit" />
                <Botao texto="Recuperar senha" />
              </DivBotoes>
            </FormEstilizado>
          </ContainerLogin>
        </StyledColumn>
      </Main>
    </>
  );
};

export default Login;
