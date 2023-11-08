"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http } from '@/services'
import { yupResolver } from "@hookform/resolvers/yup"
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from "react-hook-form"
import { toast, ToastContainer } from 'react-toastify'
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
    cnpj?: string | undefined
    inscricao?: string | undefined
    nome?: string | undefined
    razao?: string | undefined
    data?: string | undefined
    tipo?: string | undefined
}


const form = Yup.object().shape({             // cria as regras para formatação
    cnpj: Yup.string()
      .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, 'CNPJ inválido'),
    inscricao: Yup.string(),
    nome: Yup.string()
    .min(4, 'O nome precisa ter mais de 10 caracteres!')
    .max(100)
    .matches(/^[aA-zZ\s]+$/, "Digite um nome válido!"),
    razao: Yup.string(),
    data: Yup.string(),
    tipo: Yup.string(),
});


export default function Fornecedor() {
    const params = useParams()
    const { push } = useRouter()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm<Inputs>(({
        resolver: yupResolver(form),
      }))


      useEffect(() => {
        if (params) {
          http.get('/fornecedores/' + params.id).then(resultado => {
            const fornecedor = resultado.data;
        
            for (let atributo in fornecedor) {
                if (atributo === "cnpj" || atributo === "inscricao" || atributo === "nome" || atributo === "razao" || atributo === "data" || atributo === "tipo") {
                  setValue(atributo, fornecedor[atributo]);
                }
              }
              
          });
        }
      
      }, [params])

    function formatMask(event: React.ChangeEvent<HTMLInputElement>) {
        const nome = event.target.name;
        const valor = event.target.value;

        switch (nome) {
            case "cnpj":
                setValue("cnpj", mask(valor, '99.999.999/9999-99'));
                break;
            case "data":
                setValue("data", mask(valor, '99/99/9999'));
                break;
        }
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data) // o data vem dos register que pega os textos do input "automaticamnte" pelo react-hook-form
        // data.nascimento = new Date(data.nascimento).toISOString();
        try{
            await http.put('/fornecedores/' + params.id, data);
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
          
                push('/gerenciamento/fornecedor')
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
                <Titulo texto="Cadastro de fornecedor" />

                <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
                    <CampoDigitacao tipo="text" label="tipo" placeholder="Insira o tipo" register={register('tipo', addMasks)} />
                    <Erro>{errors.tipo?.message}</Erro>

                    <CampoDigitacao tipo="text" label="CNPJ" placeholder="Insira o CNPJ" register={register('cnpj', addMasks)} />
                    <Erro>{errors.cnpj?.message}</Erro>

                    <CampoDigitacao tipo="text" label="Inscrição Estadual" placeholder="Inscrição Estadual" register={register("inscricao")} />
                    <Erro>{errors.inscricao?.message}</Erro>

                    <CampoDigitacao tipo="text" label="Nome Fantasia" placeholder="Insira o nome fantasia" register={register("nome")} />
                    <Erro>{errors.nome?.message}</Erro>

                    <CampoDigitacao tipo="text" label="Razão Social" placeholder="Insira a razão social" register={register("razao", addMasks)} />
                    <Erro>{errors.razao?.message}</Erro>

                    <CampoDigitacao tipo="text" label="Data da inscrição" placeholder="Insira a data da inscrição" register={register("data", addMasks)} />
                    <Erro>{errors.data?.message}</Erro>


                    <DivEstilizada>
                        <Botao texto='Confirmar' tipo='submit' />
                        <Botao texto='Cancelar' secundario={true.toString()} />
                    </DivEstilizada>
                </FormEstilizado>

            </Menu>
        </div>
    )


}