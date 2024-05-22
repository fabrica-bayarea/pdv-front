"use client"
import Botao from '@/components/Botao';
import CampoDigitacao from '@/components/CampoDigitacao';
import Titulo from '@/components/Titulo';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import styled from 'styled-components';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { mask } from 'remask';
import { http, httpTeste } from '@/services';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import Menu from '@/components/PaginaPadrao'
import { useRouter } from 'next/navigation';

type Inputs = {
  codigo: string;
  nome: string;
  situacao: string;
  grupoReceita: string;
  bandeira: { label: string };
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
  color: #5F0000;
`;

const Rotulo = styled.label`
    display: block;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #5F0000;
`;

const Loading = styled.div`
  height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
`;

const schema = Yup.object().shape({             // cria as regras para formatação
    codigo: Yup.string()
      .required('Código obrigatório'),
    nome: Yup.string()
    .min(3, 'O nome precisa ter mais de 3 caracteres!')
    .max(100)
    .required('O campo nome é obrigatório!'),
    situacao: Yup.string().required('Situação é obrigatório!'),
    grupoReceita: Yup.string().required('O grupo da receita é obrigatório!'),
    bandeira: Yup.object().shape({
      label: Yup.string().required("Required"),
    }),
});

const Finalizador = () => {
  const [loading, setLoading] = useState(true);

  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      if (token) {
        setLoading(false);
      } else {
        push('/erro');
      }
    }, 2000);

  }, [push]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schema) });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nome = event.target.name;
    const valor = event.target.value;

    switch (nome) {
        case "codigo":
            setValue("codigo", mask(valor, '999.999.999-99'));
            break;
    }
}

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)
    const bandeiraSelecionada = data.bandeira ? data.bandeira.label : null;
      const dadosParaEnviar = {
        ...data,
        bandeira: bandeiraSelecionada,
      };
      console.log(dadosParaEnviar)
    try {
      http.request({
          url: '/finalizadores',
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          data: data
    })

    toast.success('Cadastro feito!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });

      push('/gerenciamento/finalizador')

    }  catch(error) {
      console.log(error) 
      toast.error('Erro ao fazer o cadastro!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        }); 
    }
    try {
      await http.request({
        url: '/finalizador',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: dadosParaEnviar
      });

      toast.success('Cadastro feito!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        push('/gerenciamento/finalizador');
      }, 5000);

    } catch (error) {
      console.error(error);

      toast.error('Erro ao fazer o cadastro!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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

            <Titulo texto="Cadastro de Finalizador"  />

            <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
              <CampoDigitacao tipo="text" label="Código" placeholder="Insira o código do finalizador" register={{...register('codigo', {
                                                                                                  onChange: (e) => {handleChange(e)},
                                                                                            })}}  />
              <Erro>{errors.codigo?.message}</Erro>
              <CampoDigitacao tipo="text" label="Nome"  placeholder="Insira o nome do finalizador" register={register("nome")} />
              <Erro>{errors.nome?.message}</Erro>
              <CampoDigitacao tipo="text" label="Situação" placeholder="Insira a situação do finalizador" register={register("situacao")}  />
              <Erro>{errors.situacao?.message}</Erro>
              <CampoDigitacao tipo="text" label="Grupo da Receita" placeholder="Insira o grupo da receita" register={{...register('grupoReceita', {
                                                                                                  onChange: (e) => {handleChange(e)},
                                                                                            })}} />
              <Erro>{errors.grupoReceita?.message}</Erro>
              
              <Rotulo>Bandeira</Rotulo>
              <Controller
                name="bandeira"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { label: "Elo" },
                      { label: "Alelo" },
                      { label: "Visa" },
                      { label: "Master" },
                      { label: "Pix" },
                      { label: "Dinheiro" },
                    ]}
                  />
                )}
              />                                                                      

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

export default Finalizador;
