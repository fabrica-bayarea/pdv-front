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
import { useEffect } from 'react'
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

const Rotulo = styled.label`
    display: block;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #DA2A38;
`

type Inputs = {
    tipoDeNota: { label?: string | undefined}
    modelo: { label?: string | undefined}
    fornecedorId?: string | undefined
    dataEmissao?: string | undefined
    dataEntrada?: string | undefined
}

const form = Yup.object().shape({             // cria as regras para formatação
    tipoDeNota: Yup.object().shape({
        label: Yup.string(),
      }),
    dataEmissao: Yup.string(),
    fornecedorId: Yup.string(),
    dataEntrada: Yup.string(),
    modelo: Yup.object().shape({
        label: Yup.string(),
      }),
});


export default function NotaFiscal() {
  const params = useParams()
  const { push } = useRouter()


  useEffect(() => {
    if (params) {
      http.get('/nota-fiscal/' + params.id).then(resultado => {
        const notas = resultado.data;
    
        for (let atributo in notas) {
            if (atributo === "tipoDeNota" || atributo === "dataEmissao" || atributo === "fornecedorId" || atributo === "dataEntrada" || atributo === "modelo") {
              setValue(atributo, notas[atributo]);
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

    function formatMask(event: React.ChangeEvent<HTMLInputElement>) {
        const nome = event.target.name;
        const valor = event.target.value;

        switch (nome) {
            case "dataEntrada":
                setValue("dataEntrada", mask(valor, '99/99/9999'));
                break;
            case "dataEmissao":
                setValue("dataEmissao", mask(valor, '99/99/9999'));
                break;    
        }
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data) // o data vem dos register que pega os textos do input "automaticamnte" pelo react-hook-form
        // data.nascimento = new Date(data.nascimento).toISOString();
        const tipoDeNotaSelecionado = data.tipoDeNota ? data.tipoDeNota.label : null;
        const modeloSelecionado = data.modelo ? data.modelo.label : null;

        const dadosParaEnviar = {
          ...data,
          tipoDeNota: tipoDeNotaSelecionado,
          modelo: modeloSelecionado,
        };

        try {
          await http.put('/nota-fiscal/' + params.id, dadosParaEnviar);
  
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
          push('/gerenciamento/nota-fiscal');
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

    // Objeto para facilitar a adição de mascaras no formulario
    const addMasks = {
        onChange: formatMask,
    };

    return (
        <div>
            <Menu>
                <Titulo texto="Cadastro de nota fiscal" />

                <FormEstilizado onSubmit={handleSubmit(onSubmit)}>

                <Rotulo>Tipo</Rotulo>
                    <Controller
                    name="tipoDeNota"
                    control={control}
                    render={({ field }) => (
                        <Select
                        {...field}
                        options={[
                            { label: "Entrada" },
                            { label: "Saída" },
                        ]}
                        />
                )}
                />    
                <Erro>{errors.tipoDeNota?.message}</Erro>
     

                <Rotulo>Modelo</Rotulo>
                    <Controller
                    name="modelo"
                    control={control}
                    render={({ field }) => (
                        <Select
                        {...field}
                        options={[
                            { label: "NF-e" },
                            { label: "NFAe" },
                            { label: "Nota Fiscal de Remessa" },
                        ]}
                        />
                )}
                />    
                <Erro>{errors.tipoDeNota?.message}</Erro>

                <CampoDigitacao tipo="text" label="Fornecedor" placeholder="Insira o fornecedor" register={register("fornecedorId", addMasks)} />
                <Erro>{errors.fornecedorId?.message}</Erro>

                <CampoDigitacao tipo="text" label="Data da entrada" placeholder="Insira a data da entrada" register={register("dataEntrada", addMasks)} />
                <Erro>{errors.dataEntrada?.message}</Erro>

                <CampoDigitacao tipo="text" label="Data da emissão" placeholder="Insira a data da emissão" register={register("dataEmissao", addMasks)} />                 <Erro>{errors.dataEmissao?.message}</Erro>
                <Erro>{errors.dataEmissao?.message}</Erro>
   
                <DivEstilizada>
                        <Botao texto='Confirmar' tipo='submit' />
                        <Botao texto='Cancelar' secundario={true.toString()} />
                </DivEstilizada>
                </FormEstilizado>

            </Menu>
        </div>
    )


}