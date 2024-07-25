"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import {
  CircularProgress,
  IconButton,
  Box,
  Button,
  Typography,
  MenuItem,
  TextField,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { http } from '@/services';
import Menu from '@/components/PaginaPadrao';
import { IProduto } from '@/interfaces/IProduto';

const TituloEstilizado = styled(Typography)`
  color: #5f0000;
  font-family: Italiana;
  font-size: 40px;
  font-weight: 700;
  margin: 30px 0;
  text-align: center;
`;

const FormEstilizado = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
`;

const TextFieldEstilizado = styled(TextField)`
  .MuiOutlinedInput-root {
    fieldset {
      border-color: #5f0000;
      border-radius: 10px;
    }
    &:hover fieldset {
      border-color: #5f0000;
    }
    &.Mui-focused fieldset {
      border-color: #5f0000;
    }
  }

  .MuiInputLabel-root {
    color: #5f0000;
  }

  .MuiInputLabel-root.Mui-focused {
    color: #5f0000;
  }
`;

const BotaoEstilizado = styled(Button)`
  background-color: #5f0000;
  color: white;
  border-radius: 20px;
  &:hover {
    background-color: #4a0000;
  }
`;

const Erro = styled(Typography)`
  font-size: 13px;
  color: #5f0000;
`;

const Loading = styled(Box)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface FormularioAjusteEstoque {
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
}

const schema = Yup.object().shape({
  produtoId: Yup.number().required('Selecione um produto'),
  quantidade: Yup.number().required('Informe a quantidade'),
  valorUnitario: Yup.number().required('Informe o valor unitário'),
});

const AjusteEstoque: React.FC = () => {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm<FormularioAjusteEstoque>({
    resolver: yupResolver(schema),
  });

  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarProdutos = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/produtos');
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  const onSubmit = async (data: FormularioAjusteEstoque) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/estoque/ajustar/${router.query.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        reset();
        router.push('/estoque');
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Erro ao ajustar estoque:', error);
    } finally {
      setLoading(false);
    }
  };

  const componentRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Menu>
      <Box>
        <TituloEstilizado variant="h1">Ajuste de Custos de Estoque</TituloEstilizado>
        <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Controller
              name="produtoId"
              control={control}
              render={({ field }) => (
                <TextFieldEstilizado
                  select
                  label="Produto"
                  {...field}
                  error={!!errors.produtoId}
                  helperText={errors.produtoId ? errors.produtoId.message : ''}
                  sx={{ minWidth: 300 }} // Define a largura mínima do campo de seleção
                >
                  <MenuItem value="">Selecione um produto...</MenuItem>
                  {produtos.map(produto => (
                    <MenuItem key={produto.id} value={produto.id}>
                      {produto.nome}
                    </MenuItem>
                  ))}
                </TextFieldEstilizado>
              )}
            />
          </Box>

          <Box>
            <Controller
              name="quantidade"
              control={control}
              render={({ field }) => (
                <TextFieldEstilizado
                  type="number"
                  label="Quantidade"
                  {...field}
                  error={!!errors.quantidade}
                  helperText={errors.quantidade ? errors.quantidade.message : ''}
                  sx={{ minWidth: 300 }} // Define a largura mínima do campo de quantidade
                />
              )}
            />
          </Box>

          <Box>
            <Controller
              name="valorUnitario"
              control={control}
              render={({ field }) => (
                <TextFieldEstilizado
                  type="number"
                  label="Valor Unitário"
                  {...field}
                  error={!!errors.valorUnitario}
                  helperText={errors.valorUnitario ? errors.valorUnitario.message : ''}
                  sx={{ minWidth: 300 }} // Define a largura mínima do campo de valor unitário
                />
              )}
            />
          </Box>

          {loading ? (
            <Loading>
              <CircularProgress />
            </Loading>
          ) : (
            <BotaoEstilizado type="submit" variant="contained">
              Realizar Ajuste
            </BotaoEstilizado>
          )}
        </FormEstilizado>

        <Box style={{ display: 'none' }}>
          <Box ref={componentRef}>
            <Typography variant="h2">Etiqueta de Ajuste de Estoque</Typography>
            <Typography>Produto: {getValues().produtoId}</Typography>
            <Typography>Quantidade: {getValues().quantidade}</Typography>
            <Typography>Valor Unitário: {getValues().valorUnitario}</Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" mt={2}>
          <IconButton color="primary" aria-label="Imprimir" onClick={handlePrint}>
            <PrintIcon />
          </IconButton>
        </Box>
      </Box>
    </Menu>
  );
};

export default AjusteEstoque;