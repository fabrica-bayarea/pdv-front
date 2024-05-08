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
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ICliente } from '@/interfaces/ICliente';
import { IVendedor } from '@/interfaces/IVendedor';

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

type Inputs = {
    vendedorId: { label?: string | undefined, value?: number | undefined },
    clienteId: { label?: string | undefined, value?: number | undefined },
};

const form = Yup.object().shape({
    vendedorId: Yup.object().shape({
        label: Yup.string(),
        value: Yup.number(),
      }),

    clienteId: Yup.object().shape({
        label: Yup.string(),
        value: Yup.number(),
      }),
});


export default function Venda() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  const [solicitacaoCompraId, setSolicitacaoCompraId] = useState<number | null>(null);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [vendedores, setVendedores] = useState<IVendedor[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      if (token) {
        Promise.all([
          http.request({
            url: '/cliente',
            method: 'GET',
          }),
          http.request({
            url: '/vendedor',
            method: 'GET',
          })
        ])
        .then(([clientesResponse, vendedoresResponse]) => {
          const clientesData = clientesResponse.data;
          const vendedoresData = vendedoresResponse.data;
          setClientes(clientesData);
          setVendedores(vendedoresData);
        })
        .catch(error => {
          console.error('Erro:', error);
        })
        .finally(() => {
          setLoading(false);
        });
      } else {
        push('/erro');
      }
    }, 2000);
  }, [push]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(form),
  });

  const onSubmit: SubmitHandler<Inputs> = async (dados) => {
    try {
      const vendedorSelecionado = dados.vendedorId ? dados.vendedorId.value : null;
      const clienteSelecionado = dados.clienteId ? dados.clienteId.value : null;

      const dadosParaEnviar = {
        vendedorId: vendedorSelecionado,
        clienteId: clienteSelecionado,
      };

      const response = await http.request({
        url: '/solicitacao-compra',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: dadosParaEnviar
      });

      const id = response.data.id;
      setSolicitacaoCompraId(id);

      toast.success(`Cadastro feito! SolicitacaoCompraId: ${id}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error(`Erro ao cadastrar. Tente novamente.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (solicitacaoCompraId !== null) {
      push(`/cadastro/venda/${solicitacaoCompraId}`);
    }
  }, [push, solicitacaoCompraId]);

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
  );
}
