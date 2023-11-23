"use client"
import Botao from '@/components/Botao'
import CampoDigitacao from '@/components/CampoDigitacao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import styled from 'styled-components'
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { mask } from 'remask'
import { http, httpTeste } from '@/services'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from 'next/navigation'
import Select from "react-select";
import { useEffect, useState } from 'react'

type Inputs = {
  codigo_finalizador?: string | undefined
  nome_finalizador?: string | undefined
  situacao_finalizador?: string | undefined
  grupo_receita?: string | undefined
  bandeira: { label?: string | '' };
}

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

const schema = Yup.object().shape({             // cria as regras para formatação
    codigo_finalizador: Yup.string(),
    nome_finalizador: Yup.string()
    .min(3, 'O nome precisa ter mais de 3 caracteres!')
    .max(100),
    situacao_finalizador: Yup.string(),
    grupo_receita: Yup.string(),
    bandeira: Yup.object().shape({
      label: Yup.string(),
    }),
});

const Finalizador = () => {
    const params = useParams()
    const { push } = useRouter()

    const [bandeiraFinalizador, setBandeiraFinalizador] = useState('')

  useEffect(() => {
    if (params) {
      http.get('/finalizador/' + params.id).then(resultado => {
        const finalizador = resultado.data;
        setBandeiraFinalizador(finalizador?.bandeira)
        for (let atributo in finalizador) {
            if (atributo === "codigo_finalizador" || atributo === "nome_finalizador" || atributo === "situacao_finalizador" || atributo === "grupo_receita" || atributo === "bandeira") {
              setValue(atributo, finalizador[atributo]);
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
  } = useForm<Inputs>({ resolver: yupResolver(schema) });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nome = event.target.name;
    const valor = event.target.value;

    switch (nome) {
        case "codigo_finalizador":
            setValue("codigo_finalizador", mask(valor, '999.999.999-99'));
            break;
    }
}

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // try {
    //   http.request({
    //       url: '/finalizadores',
    //       method: 'POST',
    //       headers: {
    //           'Content-Type': 'application/json'
    //       },
    //       data: data
    // })

    // toast.success('Cadastro feito!', {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "light",
    //   });

    //   push('/gerenciamento/finalizador')

    // }  catch(error) {
    //   console.log(error) 
    //   toast.error('Erro ao fazer o cadastro!', {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //     }); 
    // }
    try {
      const bandeiraSelecionada = data.bandeira ? data.bandeira.label : null;
      const dadosParaEnviar = {
        ...data,
        bandeira: bandeiraSelecionada,
      };

      await httpTeste.put('/finalizadores/' + params.id, dadosParaEnviar);

      toast.success('Edição feita!', {
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
        push('/gerenciamento/finalizador');
      }, 3000);

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
    <Menu>

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

      <Titulo texto="Cadastro de finalizador"  />

      <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
        <CampoDigitacao tipo="text" label="Código" placeholder="Insira o código do finalizador" register={{...register('codigo_finalizador', {
                                                                                            onChange: (e) => {handleChange(e)},
                                                                                      })}}  />
        <Erro>{errors.codigo_finalizador?.message}</Erro>
        <CampoDigitacao tipo="text" label="Nome"  placeholder="Insira o nome do finalizador" register={register("nome_finalizador")} />
        <Erro>{errors.nome_finalizador?.message}</Erro>
        <CampoDigitacao tipo="text" label="Situação" placeholder="Insira a situação do finalizador" register={register("situacao_finalizador")}  />
        <Erro>{errors.situacao_finalizador?.message}</Erro>
        <CampoDigitacao tipo="text" label="Grupo da Receita" placeholder="Insira o grupo da receita" register={{...register('grupo_receita', {
                                                                                            onChange: (e) => {handleChange(e)},
                                                                                      })}} />
        <Erro>{errors.grupo_receita?.message}</Erro>
        
        <Rotulo>Bandeira</Rotulo>
        <Controller
          name="bandeira"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { label: "Elo" },
                { label: "Alelo" },
                { label: "Visa" },
                { label: "Master" },
                { label: "Pix" },
                { label: "Dinheiro" },
              ]}
            />
          )}
        />                                                                      

      <DivEstilizada>
        <Botao texto='Confirmar' tipo='submit' />
        <Botao texto='Cancelar' secundario={true.toString()} />        
      </DivEstilizada>  
      </FormEstilizado>
     
    </Menu>
  )
}

export default Finalizador