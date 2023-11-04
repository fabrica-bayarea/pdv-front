"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { yupResolver } from "@hookform/resolvers/yup"
import axios from 'axios'
import { SubmitHandler, useForm } from "react-hook-form"
import { mask } from 'remask'
import styled from 'styled-components'
import * as Yup from 'yup'

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


const form = Yup.object<Inputs>().shape({
    cpf: Yup.string()
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
        .required("CPF é obrigatório"),
    email: Yup.string()
        .email("Digite um email válido!")
        .required("O campo e-mail é obrigatório!"),
    nome: Yup.string()
        .max(100),
    telefone: Yup.string()
        .required("Telefone é obrigatório!")
        .matches(/\(\d{2}\) \d{5}-\d{4}/, "Digite um telefone válido!"),
    endereco: Yup.string().required("Endereço é obrigatório"),
    dataNascimento: Yup.string().required("Nascimento é obrigatório"),
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
        // vamos colocar a código para consumir a API aqui
        // const token = (await axios.get('http://localhost:3000/vendedor')).data;
        // data.dataNascimento = new Date(data.dataNascimento).toISOString();
        await axios.post('http://localhost:3000/vendedor', data);
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