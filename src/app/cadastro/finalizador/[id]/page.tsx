import Botao from '@/components/Botao';
import CampoDigitacao from '@/components/CampoDigitacao';
import Menu from '@/components/Menu';
import Titulo from '@/components/Titulo';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import styled from 'styled-components';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { mask } from 'remask';
import { http, httpTeste } from '@/services';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'; // Importar o hook useRouter
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

type Inputs = {
  codigo?: string | undefined;
  nome?: string | undefined;
  situacao?: string | undefined;
  grupoReceita?: string | undefined;
  bandeira: { label?: string | '' };
};

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
  color: #5f0000;
`;

const Rotulo = styled.label`
  display: block;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #5f0000;
`;

const Loading = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const schema = Yup.object().shape({
  codigo: Yup.string(),
  nome: Yup.string()
    .min(3, 'O nome precisa ter mais de 3 caracteres!')
    .max(100),
  situacao: Yup.string(),
  grupoReceita: Yup.string(),
  bandeira: Yup.object().shape({
    label: Yup.string(),
  }),
});

const Finalizador = () => {
  const router = useRouter(); // Usar o hook useRouter
  const [bandeiraFinalizador, setBandeiraFinalizador] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      if (token) {
        setLoading(false);
      } else {
        router.push('/erro');
      }
    }, 2000);
  }, [router]);

  useEffect(() => {
    const { id } = router.query; // Acessar os parâmetros da rota usando router.query
    if (id) {
      http.get('/finalizador/' + id).then((resultado) => {
        const finalizador = resultado.data;
        setBandeiraFinalizador(finalizador?.bandeira);
        for (let atributo in finalizador) {
          if (
            atributo === 'codigo' ||
            atributo === 'nome' ||
            atributo === 'situacao' ||
            atributo === 'grupoReceita' ||
            atributo === 'bandeira'
          ) {
            setValue(atributo, finalizador[atributo]);
          }
        }
      });
    }
  }, [router]);

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
      case 'codigo':
        setValue('codigo', mask(valor, '999.999.999-99'));
        break;
    }
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // Código de envio do formulário
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
              color: '#5F0000',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </Loading>
      ) : (
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

          <Titulo texto="Cadastro de finalizador" />

          <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
            <CampoDigitacao
              tipo="text"
              label="Código"
              placeholder="Insira o código do finalizador"
              register={{
                ...register('codigo', {
                  onChange: (e) => {
                    handleChange(e);
                  },
                }),
              }}
            />
            <Erro>{errors.codigo?.message}</Erro>
            <CampoDigitacao
              tipo="text"
              label="Nome"
              placeholder="Insira o nome do finalizador"
              register={register('nome')}
            />
            <Erro>{errors.nome?.message}</Erro>
            <CampoDigitacao
              tipo="text"
              label="Situação"
              placeholder="Insira a situação do finalizador"
              register={register('situacao')}
            />
            <Erro>{errors.situacao?.message}</Erro>
            <CampoDigitacao
              tipo="text"
              label="Grupo da Receita"
              placeholder="Insira o grupo da receita"
              register={{
                ...register('grupoReceita', {
                  onChange: (e) => {
                    handleChange(e);
                  },
                }),
              }}
            />
            <Erro>{errors.grupoReceita?.message}</Erro>

            <Rotulo>Bandeira</Rotulo>
            <Controller
              name="bandeira"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: 'Elo' },
                    { label: 'Alelo' },
                    { label: 'Visa' },
                    { label: 'Master' },
                    { label: 'Pix' },
                    { label: 'Dinheiro' },
                  ]}
                />
              )}
            />

            <DivEstilizada>
              <Botao texto="Confirmar" tipo="submit" />
              <Botao texto="Cancelar" secundario={true.toString()} />
            </DivEstilizada>
          </FormEstilizado>
        </Menu>
      )}
    </>
  );
};

export default Finalizador;