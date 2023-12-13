"use client"
import Botao from '@/components/Botao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http } from '@/services'
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast, ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import * as Yup from 'yup'
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import { ICliente } from '@/interfaces/ICliente'
import { IVendedor } from '@/interfaces/IVendedor'

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

const Rotulo = styled.label`
    display: block;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #DA2A38;
`

const Loading = styled.div`
  height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
`

type Inputs = {
    vendedorId: { label: string | undefined, value: number | string | undefined }
    clienteId: { label: string | undefined, value: number | string | undefined },
}

const form = Yup.object().shape({             // cria as regras para formatação
    vendedorId: Yup.object().shape({
        label: Yup.string().required("Required"),
        value: Yup.number().required("Required"),
      }),
    clienteId: Yup.object().shape({
        label: Yup.string().required("Required"),
        value: Yup.number().required("Required"),
      }),
});


export default function NotaFiscal() {
  const { push } = useRouter()
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [vendedores, setVendedores] = useState<IVendedor[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      if (token) {
        http.request({
            url: '/clientes',
            method: 'GET',
          })
            .then(response => {
              const clientesData = response.data;
              setClientes(clientesData);
            })
            .catch(error => {
              console.error('Erro :', error);
            });
      
        http.request({
            url: '/vendedores',
            method: 'GET',
         })
        .then(response => {
              const vendedoresData = response.data;
              setVendedores(vendedoresData);
            })
            .catch(error => {
              console.error('Erro:', error);
            });

        setLoading(false);
      } else {
        push('/erro');
      }
    }, 2000);

  }, [push]);

  const optionsClientes = clientes.map(cliente => ({
    label: cliente.nome,
    value: cliente.id,
  }));

    const {
        handleSubmit,
        control,
        formState: { errors },
      } = useForm<Inputs>(({
        resolver: yupResolver(form),
      }))

    const onSubmit: SubmitHandler<Inputs> = async (dados) => {
        console.log(dados) // o dados vem dos register que pega os textos do input "automaticamnte" pelo react-hook-form
        // dados.nascimento = new Date(dados.nascimento).toISOString();
        const vendedorSelecionado = dados.vendedorId ? dados.vendedorId.value : null;
        const clienteSelecionado = dados.clienteId ? dados.clienteId.value : null;

        const dadosParaEnviar = {
          vendedorId: vendedorSelecionado,
          clienteId: clienteSelecionado,
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
        <Menu>
          <Titulo texto="Registro de venda" />
          
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

            <Rotulo>Selecione o cliente</Rotulo>
            <Controller
              name="clienteId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={clientes?.map(cliente => ({
                    label: cliente.nome,
                    value: cliente.id,
                  }))}
                />
              )}
            />
            <Erro>{errors.clienteId?.message}</Erro>

            <Rotulo>Selecione o vendedor</Rotulo>
            <Controller
              name="vendedorId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={vendedores.map(vendedor => ({
                    label: vendedor.nome,
                    value: vendedor.id,
                  }))}
                />
              )}
            />
            <Erro>{errors.vendedorId?.message}</Erro>

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