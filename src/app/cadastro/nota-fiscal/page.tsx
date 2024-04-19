"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http, httpTeste } from '@/services'
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast, ToastContainer } from 'react-toastify'
import { mask } from 'remask'
import styled from 'styled-components'
import * as Yup from 'yup'
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'

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
  color: #5F0000;
`

const Rotulo = styled.label`
    display: block;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #5F0000;
`

const Loading = styled.div`
  height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
`


type Inputs = {
    tipoDeNota: { label: string }
    modelo: { label: string },
    fornecedorId: string
    dataEmissao: string
    dataEntrada: string
    numeroDaNota: string  
}


const form = Yup.object().shape({             // cria as regras para formatação
    tipoDeNota: Yup.object().shape({
        label: Yup.string().required("Required"),
      }),
    dataEmissao: Yup.string().required('Data é obrigatório!'),
    fornecedorId: Yup.string().required('Data é obrigatório!'),
    dataEntrada: Yup.string().required('Data é obrigatório!'),
    numeroDaNota: Yup.string().required('Número é obrigatório!'),
    modelo: Yup.object().shape({
        label: Yup.string().required("Required"),
      }),
});


export default function NotaFiscal() {
  const { push } = useRouter()
  const [loading, setLoading] = useState(true);

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
      } = useForm<Inputs>(({
        resolver: yupResolver(form),
      }))


    function formatMask(event: React.ChangeEvent<HTMLInputElement>) {
        const nome = event.target.name;
        const valor = event.target.value;

        switch (nome) {
            case "dataEntrada":
                setValue("dataEntrada", mask(valor, '99/99/9999'));
                break;
            case "dataEmissao":
                setValue("dataEmissao", mask(valor, '99/99/9999'));
                break;    
        }
    }

    const onSubmit: SubmitHandler<Inputs> = async (dados) => {
        console.log(dados) // o dados vem dos register que pega os textos do input "automaticamnte" pelo react-hook-form
        // dados.nascimento = new Date(dados.nascimento).toISOString();
        const tipoDeNotaSelecionado = dados.tipoDeNota ? dados.tipoDeNota.label : null;
        const modeloSelecionado = dados.modelo ? dados.modelo.label : null;

        const dadosParaEnviar = {
          ...dados,
          tipoDeNota: tipoDeNotaSelecionado,
          modelo: modeloSelecionado,
        };
        console.log(dadosParaEnviar)
        try {
            await http.request({
              url: '/nota-fiscal',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              data: dadosParaEnviar
            });

            toast.success('Cadastro feito!', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
      
            setTimeout(() => {
              push('/gerenciamento/nota-fiscal');
            }, 1000);
      
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

    // Objeto para facilitar a adição de mascaras no formulario
    const addMasks = {
        onChange: formatMask,
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
              color: "#5F0000",
              alignItems: "center",
              justifyContent: "center"
            }}
          />
        </Loading>
      ) : (
        <Menu>
          <Titulo texto="Cadastro de nota fiscal" />
          
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
      
          <FormEstilizado onSubmit={handleSubmit(onSubmit)}>

            <Rotulo>Tipo</Rotulo>
            <Controller
              name="tipoDeNota"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: "Entrada" },
                    { label: "Saída" },
                  ]}
                />
              )}
            />
            <Erro>{errors.tipoDeNota?.message}</Erro>

            <Rotulo>Modelo</Rotulo>
            <Controller
              name="modelo"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: "NF-e" },
                    { label: "NFAe" },
                    { label: "Nota Fiscal de Remessa" },
                  ]}
                />
              )}
            />
            <Erro>{errors.modelo?.message}</Erro>

            <CampoDigitacao tipo="text" label="Fornecedor" placeholder="Insira o fornecedor" register={register("fornecedorId", addMasks)} />
            <Erro>{errors.fornecedorId?.message}</Erro>

            <CampoDigitacao tipo="text" label="Número da nota" placeholder="Insira o número da nota" register={register("numeroDaNota", addMasks)} />
            <Erro>{errors.numeroDaNota?.message}</Erro>

            <CampoDigitacao tipo="text" label="Data da entrada" placeholder="Insira a data da entrada" register={register("dataEntrada", addMasks)} />
            <Erro>{errors.dataEntrada?.message}</Erro>

            <CampoDigitacao tipo="text" label="Data da emissão" placeholder="Insira a data da emissão" register={register("dataEmissao", addMasks)} />
            <Erro>{errors.dataEmissao?.message}</Erro>

            <DivEstilizada>
              <Botao texto='Confirmar' tipo='submit' />
              <Botao texto='Cancelar' secundario={true.toString()} />
            </DivEstilizada>
          </FormEstilizado>

        </Menu>
      )}

    </>
    )


}