"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { useForm, SubmitHandler } from "react-hook-form"
import styled from 'styled-components'
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { ChangeEvent } from 'react'
import { mask } from 'remask'

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
    codigo: string
    nome: string
    unimedida: string
    grupo: string
    valor: string
    registro: string
}


const form = Yup.object<Inputs>().shape({
    codigo: Yup.string()
        .matches(/^\d{1}\ \d{6}\ \d{6}$/, "Código Inválido")
        .required("O código é obrigatório é obrigatório"),
    nome: Yup.string()
        .min(10, "O nome precisa ter mais de 10 caracters")
        .max(100)
        .matches(/^[aA-zZ\s]+$/, "Digite um nome válido!").required('O campo nome é obrigatório!'),
    valor: Yup.string()
        .matches(/^\d{1}\ \d{6}\ \d{6}$/, "Código Inválido")
        .required("O código é obrigatório é obrigatório"),
        
   

});



export default function Produto() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>(({
        //resolver: yupResolver(form),
    }))


    function formatMask(event: React.ChangeEvent<HTMLInputElement>) {
        const nome = event.target.name;
        const valor = event.target.value;

        switch (nome) {
            case "codigo":
                setValue("codigo", mask(valor, '9 999999 999999'));
                break;
            case "valor":
                setValue("valor", mask(valor, '999,99'));
                break;
            
            
        }
    }



    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data) // o data vem dos register que pega os textos do input "automaticamnte" pelo react-hook-form
        // vamos colocar a código para consumir a API aqui
    }

    // Objeto para facilitar a adição de mascaras no formulario
    const addMasks = {
        onChange: formatMask,
    };

    return (
        <div>
            <Menu>

                <Titulo texto="Cadastro de produtos" />

                <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
                    <CampoDigitacao
                     tipo="text" 
                     label="Codigo" 
                     placeholder="Insira o Código" 
                     register={register('codigo', addMasks)} />
                    <Erro>{errors.codigo?.message}</Erro>

                    <CampoDigitacao 
                    tipo="text" 
                    label="Nome" 
                    placeholder="Insira o nome"
                    register={register("nome")} />
                    <Erro>{errors.nome?.message}</Erro>

                    <CampoDigitacao 
                    tipo="text" 
                    label="Grupo" 
                    placeholder="Insira o grupo"
                    register={register("grupo")} />
                    <Erro>{errors.grupo?.message}</Erro>

                    <CampoDigitacao 
                    tipo="dropdown" 
                    label="Unidade de Medida"
                    placeholder="Informe a Unidade de Medida" 
                    register={register("unimedida")} />
                    <Erro>{errors.unimedida?.message}</Erro>

                    <CampoDigitacao 
                    tipo="text" 
                    label="Valor" 
                    placeholder="Insira o Valor"
                    register={register("valor")} />
                    <Erro>{errors.valor?.message}</Erro>

                    <CampoDigitacao 
                    tipo="text" 
                    label="Registro" 
                    placeholder="Insira o registro"
                    register={register("registro")} />
                    <Erro>{errors.registro?.message}</Erro>

                    <DivEstilizada>
                        <Botao texto='Confirmar' tipo='submit' />
                        <Botao texto='Cancelar' secundario={true.toString()} />
                    </DivEstilizada>
                </FormEstilizado>

            </Menu>
        </div>
    )


}