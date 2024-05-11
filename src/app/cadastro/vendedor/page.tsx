"use client"
import Botao from '@/components/Botao';
import CampoDigitacao from '@/components/CampoDigitacao';
import Menu from '@/components/PaginaPadrao';
import Titulo from '@/components/Titulo';
import { http } from '@/services';
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { mask } from 'remask';
import * as Yup from 'yup';
import { DivEstilizada, Erro, FormEstilizado, Loading } from './vendedor_styled';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

type Inputs = {
    cpf: string;
    email: string;
    nome: string;
    telefone: string;
    endereco: string;
    dataNascimento: string;
};

const form = Yup.object().shape({
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
      .required('CPF é obrigatório'),
    email: Yup.string()
    .email('Digite um email válido!')
    .required('O campo e-mail é obrigatório!'),
    nome: Yup.string()
    .min(4, 'O nome precisa ter mais de 10 caracteres!')
    .max(100)
    .required('O campo nome é obrigatório!')
    .matches(/^[aA-zZ\s]+$/, "Digite um nome válido!"),
    telefone: Yup.string().required('Telefone é obrigatório!').matches(/\(\d{2}\) \d{5}-\d{4}/, "Digite um telefone válido!"),
    endereco: Yup.string().required('Endereço é obrigatório!'),
    dataNascimento: Yup.string().required('Nascimento é obrigatório!'),
});


export default function Vendedor() {
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
        formState: { errors },
      } = useForm<Inputs>({
        resolver: yupResolver(form),
      });

    function formatMask(event: React.ChangeEvent<HTMLInputElement>) {
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
                setValue("dataNascimento", mask(valor, '99/99/9999'));
                break;
        }
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await http.post('/vendedor', data);
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
            push('/gerenciamento/vendedor');
        } catch(error) {
            toast.error('Erro no cadastro!', {
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

            <Titulo texto="Cadastro de vendedor" />

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
            <CampoDigitacao tipo="text" label="CPF" placeholder="Insira seu CPF" register={register('cpf', addMasks)} />
            <Erro>{errors.cpf?.message}</Erro>

            <CampoDigitacao tipo="text" label="E-mail" placeholder="Insira seu e-mail" register={register("email")} />
            <Erro>{errors.email?.message}</Erro>

            <CampoDigitacao tipo="text" label="Nome" placeholder="Insira seu nome" register={register("nome")} />
            <Erro>{errors.nome?.message}</Erro>

            <CampoDigitacao tipo="text" label="Telefone" placeholder="Insira seu telefone" register={register("telefone", addMasks)} />
            <Erro>{errors.telefone?.message}</Erro>

            <CampoDigitacao tipo="text" label="Endereço" placeholder="Insira seu endereço" register={register("endereco")} />
            <Erro>{errors.endereco?.message}</Erro>

            <CampoDigitacao tipo="text" label="Nascimento" placeholder="Insira seu nascimento" register={register("dataNascimento", addMasks)} />
            <Erro>{errors.dataNascimento?.message}</Erro>

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
