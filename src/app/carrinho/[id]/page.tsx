import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Botao from '@/components/Botao';
import Menu from '@/components/PaginaPadrao';
import Titulo from '@/components/Titulo';
import { http } from '@/services';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';

interface ItemCarrinho {
  id: number;
  produto: {
    id: number;
    nome: string;
    preco?: string;
  };
  quantidade: number;
}

interface ICarrinho {
  id: number;
  itens: ItemCarrinho[];
  total: number;
}

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
  color: #5F0000;
`;

const Loading = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarrinhoPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [carrinho, setCarrinho] = useState<ICarrinho | null>(null);

  useEffect(() => {
    const fetchCarrinho = async () => {
      try {
        const { data } = await http.get('/carrinho/' + router.query.id);
        setCarrinho(data);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarrinho();
  }, [router.query.id]);

  const handleUpdateCarrinho = async (updatedCarrinho: ICarrinho) => {
    try {
      await http.put('/carrinho/' + updatedCarrinho.id, updatedCarrinho);
      console.log('Carrinho atualizado com sucesso:', updatedCarrinho);
    } catch (error) {
      console.error('Erro ao atualizar carrinho:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (carrinho) {
      await handleUpdateCarrinho(carrinho);
    }
  };

  if (loading) {
    return (
      <Loading>
        <CircularProgress size={68} />
      </Loading>
    );
  }

  return (
    <Menu>
      <Titulo texto="Edição de Carrinho" />

      {carrinho && (
        <FormEstilizado onSubmit={handleSubmit}>
          {}
          <DivEstilizada>
            <Botao texto="Confirmar" tipo="submit" />
            <Botao texto="Cancelar" secundario />
          </DivEstilizada>
        </FormEstilizado>
      )}
    </Menu>
  );
};

export default CarrinhoPage;
