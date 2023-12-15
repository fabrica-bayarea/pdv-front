"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http, httpTeste } from '@/services'
import { yupResolver } from "@hookform/resolvers/yup"
import { useParams, useRouter } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast, ToastContainer } from 'react-toastify'
import { mask } from 'remask'
import styled from 'styled-components'
import * as Yup from 'yup'
import Select from "react-select";
import { useEffect, useState } from 'react'
import "react-toastify/dist/ReactToastify.css";
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
   
    nome?: string | undefined
    marca?: string | undefined
    descricao?: string | undefined
    cnpj_fornecedor?: string | undefined
    codigo_produto?: string | undefined
    nome_categoria?: string | undefined
    unidade_medida: { label?: string | undefined}
    preco?: number | undefined
    estoque_atual?: number | undefined

}

const form = Yup.object().shape({             // cria as regras para formatação
    
    nome: Yup.string(),
    marca: Yup.string(),
    descricao: Yup.string(),
    cnpj_fornecedor: Yup.string(),
    codigo_produto: Yup.string(),
    nome_categoria: Yup.string(),
    unidade_medida: Yup.object().shape({
        label: Yup.string(),
      }),
    preco: Yup.number(),
    estoque_atual: Yup.number(),
});


export default function Produto() {
  const params = useParams()
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

  useEffect(() => {
    if (params && loading === false) {
      http.get('/produto/' + params.id).then(resultado => {
        const produtos = resultado.data;
    
        for (let atributo in produtos) {
          if (
            atributo === "nome" ||
            atributo === "marca" ||
            atributo === "descricao" ||
            atributo === "cnpj_fornecedor" ||
            atributo === "codigo_produto" ||
            atributo === "nome_categoria" ||
            atributo === "preco" ||
            atributo === "estoque_atual"
          ) {
            setValue(atributo, produtos[atributo]);
          }
          }
          
      });
    }
  
  }, [params])

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
      } = useForm<Inputs>(({
        resolver: yupResolver(form),
      }))

   

    const onSubmit: SubmitHandler<Inputs> = async (dados) => {
        console.log(dados) // o data vem dos register que pega os textos do input "automaticamnte" pelo react-hook-form
        // data.nascimento = new Date(data.nascimento).toISOString();
        const unidade_medidaSelecionado = dados.unidade_medida ? dados.unidade_medida.label : null;

        const dadosParaEnviar = {
            ...dados,
            unidade_medida: unidade_medidaSelecionado
        };
        console.log(dadosParaEnviar)

        try {
          await http.put('/produto/' + params.id, dadosParaEnviar);
  
        toast.success('Edição feita!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
  
        setTimeout(() => {
          push('/gerenciamento/produto');
        }, 5000);
  
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
          <Titulo texto="Cadastro de Produto" />

          <FormEstilizado onSubmit={handleSubmit(onSubmit)}>

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
      

      <CampoDigitacao tipo="text" label="Nome" placeholder="Insira o nome" register={register('nome')} />
                <Erro>{errors.nome?.message}</Erro>

                <CampoDigitacao tipo="text" label="Marca" placeholder="Insira a marca" register={register('marca')} />
                <Erro>{errors.marca?.message}</Erro>

                <CampoDigitacao tipo="text" label="Descrição" placeholder="Inscrição Estadual" register={register("descricao")} />
                <Erro>{errors.descricao?.message}</Erro>

                <CampoDigitacao tipo="text" label="CNPJ do Fornecedor" placeholder="Insira o CNPJ do fornecedor" register={register("cnpj_fornecedor")} />
                <Erro>{errors.cnpj_fornecedor?.message}</Erro>

                <CampoDigitacao tipo="text" label="Código do Produto" placeholder="Insira o código do produto" register={register("codigo_produto")} />
                <Erro>{errors.codigo_produto?.message}</Erro>

                <CampoDigitacao tipo="text" label="Categoria" placeholder="Insira o o nome da catedoria" register={register("nome_categoria")} />
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
                        { label: "cm - centimetros" },
                        { label: "mm - milimetros" },
                        { label: "l - litros" },
                        { label: "ml - mililitros" },
                      ]}
                    />
                  )}
                />

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