"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http } from '@/services'
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from "react-hook-form"
import { toast, ToastContainer } from 'react-toastify'
import { mask } from 'remask'
import styled from 'styled-components'
import * as Yup from 'yup'
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

const Loading = styled.div`
  height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
`


type Inputs = {
    cnpj: string
    inscricao_estadual: string
    nome_fantasia: string
    razao_social: string
    data_registro: string
    tipo_pessoa: string
}


const form = Yup.object().shape({             // cria as regras para formatação
    cnpj: Yup.string()
      .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, 'CNPJ inválido')
      .required('CNPJ é obrigatório'),
    inscricao_estadual: Yup.string()
    .required('O campo inscrição é obrigatório!'),
    nome_fantasia: Yup.string()
    .min(4, 'O nome precisa ter mais de 10 caracteres!')
    .max(100)
    .required('O campo nome é obrigatório!')
    .matches(/^[aA-zZ\s]+$/, "Digite um nome válido!"),
    razao_social: Yup.string().required('Endereço é obrigatório!'),
    data_registro: Yup.string().required('Data é obrigatório!'),
    tipo_pessoa: Yup.string().required('Tipo é obrigatório!'),
});


export default function Fornecedor() {

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
        formState: { errors },
      } = useForm<Inputs>(({
        resolver: yupResolver(form),
      }))


    function formatMask(event: React.ChangeEvent<HTMLInputElement>) {
        const nome = event.target.name;
        const valor = event.target.value;

        switch (nome) {
            case "cnpj":
                setValue("cnpj", mask(valor, '99.999.999/9999-99'));
                break;
            case "data":
                setValue("data_registro", mask(valor, '99/99/9999'));
                break;
        }
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data) // o data vem dos register que pega os textos do input "automaticamnte" pelo react-hook-form
        // data.nascimento = new Date(data.nascimento).toISOString();
        try{
            await http.post('/fornecedor', data);
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

                
                push('/gerenciamento/fornecedor')
        } catch(error){
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
                <Titulo texto="Cadastro de fornecedor" />
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
                <CampoDigitacao tipo="text" label="tipo" placeholder="Insira o tipo" register={register('tipo_pessoa', addMasks)} />
                <Erro>{errors.tipo_pessoa?.message}</Erro>

                <CampoDigitacao tipo="text" label="CNPJ" placeholder="Insira o CNPJ" register={register('cnpj', addMasks)} />
                <Erro>{errors.cnpj?.message}</Erro>

                <CampoDigitacao tipo="text" label="Inscrição Estadual" placeholder="Inscrição Estadual" register={register("inscricao_estadual")} />
                <Erro>{errors.inscricao_estadual?.message}</Erro>

                <CampoDigitacao tipo="text" label="Nome Fantasia" placeholder="Insira o nome fantasia" register={register("nome_fantasia")} />
                <Erro>{errors.nome_fantasia?.message}</Erro>

                <CampoDigitacao tipo="text" label="Razão Social" placeholder="Insira a razão social" register={register("razao_social", addMasks)} />
                <Erro>{errors.razao_social?.message}</Erro>

                <CampoDigitacao tipo="text" label="Data da inscrição" placeholder="Insira a data da inscrição" register={register("data_registro", addMasks)} />
                <Erro>{errors.data_registro?.message}</Erro>

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