"use client"
import Botao from '@/components/Botao';
import CampoDigitacao from '@/components/CampoDigitacao';
import Menu from '@/components/PaginaPadrao';
import Titulo from '@/components/Titulo';
import { http } from '@/services';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import * as Yup from 'yup';
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

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
    nome: string;
    marca: string;
    descricao: string;
    cnpj_fornecedor: string;
    codigo_produto: string;
    nome_categoria: string;
    unidade_medida: { label: string };
    preco: number;
    estoque_atual: number;
}

const form = Yup.object().shape({
    nome: Yup.string().required('O campo nome é obrigatório!'),
    marca: Yup.string().required('O campo marca é obrigatório!'),
    descricao: Yup.string()
        .min(10, 'A descrição precisa ter mais de 10 caracteres!')
        .max(100)
        .required('O campo descrição é obrigatório!'),
    cnpj_fornecedor: Yup.string().required('O campo CNPJ do fornecedor é obrigatório!'),
    codigo_produto: Yup.string()
        .matches(/^[0-9]+$/, 'O campo deve conter apenas números.')
        .required('O campo código do produto é obrigatório!'),
    nome_categoria: Yup.string().required('O campo nome da categoria é obrigatório!'),
    unidade_medida: Yup.object().shape({
        label: Yup.string().required("O campo unidade de medida é obrigatório!"),
    }).required("O campo unidade de medida é obrigatório!"),
    preco: Yup.number().required('O campo preço é obrigatório!'),
    estoque_atual: Yup.number().positive().required('O campo estoque atual é obrigatório!'),
});

export default function Fornecedor() {

    const { push } = useRouter();

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
    } = useForm<Inputs>({
        resolver: yupResolver(form),
    });

    const onSubmit: SubmitHandler<Inputs> = async (dados) => {
        console.log(dados); 
        const unidade_medidaSelecionado = dados.unidade_medida ? dados.unidade_medida.label : null;

        const dadosParaEnviar = {
            ...dados,
            unidade_medida: unidade_medidaSelecionado
        };
        console.log(dadosParaEnviar);

        try {
            await http.request({
                url: '/produto',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                push('/gerenciamento/produto');
            }, 1000);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Erro de resposta do servidor
                if (error.response?.status === 404 && error.response?.data?.message) {
                    toast.error(`Erro: ${error.response.data.message}`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                } else {
                    console.error('Response data:', error.response?.data);
                    console.error('Response status:', error.response?.status);
                    console.error('Response headers:', error.response?.headers);

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
            } else {
                // Outro erro
                console.error('Error message:', error);
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
                <Menu>
                    <Titulo texto="Cadastro de Produto" />
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
                        <CampoDigitacao tipo="text" label="Nome" placeholder="Insira o nome" register={register('nome')} />
                        <Erro>{errors.nome?.message}</Erro>

                        <CampoDigitacao tipo="text" label="Marca" placeholder="Insira a marca" register={register('marca')} />
                        <Erro>{errors.marca?.message}</Erro>

                        <CampoDigitacao tipo="text" label="Descrição" placeholder="Insira a descrição" register={register("descricao")} />
                        <Erro>{errors.descricao?.message}</Erro>

                        <CampoDigitacao tipo="text" label="CNPJ do Fornecedor" placeholder="Insira o CNPJ do fornecedor" register={register("cnpj_fornecedor")} />
                        <Erro>{errors.cnpj_fornecedor?.message}</Erro>

                        <CampoDigitacao tipo="text" label="Código do Produto" placeholder="Insira o código do produto" register={register("codigo_produto")} />
                        <Erro>{errors.codigo_produto?.message}</Erro>

                        <CampoDigitacao tipo="text" label="Categoria" placeholder="Insira o nome da Categoria" register={register("nome_categoria")} />
                        <Erro>{errors.nome_categoria?.message}</Erro>

                        <Rotulo>Unidade de Medida</Rotulo>
                        <Controller
                            name="unidade_medida"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={[
                                        { label: "kg - quilograma" },
                                        { label: "mg - miligrama" },
                                        { label: "cm - centímetros" },
                                        { label: "mm - milímetros" },
                                        { label: "l - litros" },
                                        { label: "ml - mililitros" },
                                    ]}
                                />
                            )}
                        />
                        <Erro>{errors.unidade_medida?.label?.message}</Erro>

                        <CampoDigitacao tipo="text" label="Preço" placeholder="Insira o preço" register={register("preco")} />
                        <Erro>{errors.preco?.message}</Erro>

                        <CampoDigitacao tipo="text" label="Estoque Atual" placeholder="Insira o estoque atual" register={register("estoque_atual")} />
                        <Erro>{errors.estoque_atual?.message}</Erro>

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
