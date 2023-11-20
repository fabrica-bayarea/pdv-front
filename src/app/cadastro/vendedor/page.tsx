"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http } from '@/services'
import { yupResolver } from "@hookform/resolvers/yup"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from "react-hook-form"
import { toast, ToastContainer } from 'react-toastify'
import { mask } from 'remask'
import styled from 'styled-components'
import * as Yup from 'yup'
import "react-toastify/dist/ReactToastify.css";

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

type Inputs = {
    cpf: string
    email: string
    nome: string
    telefone: string
    endereco: string
    dataNascimento: string
}


const form = Yup.object().shape({             // cria as regras para formatação
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
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm<Inputs>(({
        resolver: yupResolver(form),
      }))

    const { push } = useRouter()

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
        console.log(data) // o data vem dos register que pega os textos do input "automaticamnte" pelo react-hook-form
        // data.nascimento = new Date(data.nascimento).toISOString();
        try{
            await http.post('/vendedores', data);
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
          
                push('/gerenciamento/vendedor')
        } catch(error){
            console.log(error)
        }    
    }

    // Objeto para facilitar a adição de mascaras no formulario
    const addMasks = {
        onChange: formatMask,
    };

    return (
        <div>
            <Menu>

                <Titulo texto="Cadastro de vendedor" />

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
        </div>
    )


}