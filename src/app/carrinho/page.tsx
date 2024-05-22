"use client"
import React, { useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import CartItem from '@/components/Carrinho/cartItem';
import Botao from '@/components/Botao';
import Menu from '@/components/PaginaPadrao';
import Titulo from '@/components/Titulo';
import CircularProgress from '@mui/material/CircularProgress';
import { IProduto } from '@/interfaces/IProduto';
import { http } from '@/services';

interface CartItemType {
  id: number;
  produto: IProduto;
  quantidade: number;
}

const CartContainer = styled.div`
  padding: 20px;
`;

const CartTotal = styled.div`
  text-align: right;
  margin-top: 20px;
`;

const Loading = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await http.get('/carrinho');
        setCartItems(response.data.itens);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar itens do carrinho", error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemove = async (itemId: number) => {
    try {
      await http.delete(`/carrinho/item/${itemId}`);
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Erro ao remover item do carrinho", error);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const preco = item.produto.preco ? parseFloat(item.produto.preco) : 0;
      return total + (preco * item.quantidade);
    }, 0);
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectAll(event.target.checked);
  };

  return (
    <Menu>
      {loading ? (
        <Loading>
          <CircularProgress
            size={68}
            sx={{
              color: "#5F0000",
            }}
          />
        </Loading>
      ) : (
        <CartContainer>
          <Titulo texto="Carrinho de Compras" />
          {cartItems.length === 0 ? (
            <p>Nenhum item selecionado.</p>
          ) : (
            <>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  Selecionar Todos
                </label>
              </div>
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  //selected={selectAll}
                />
              ))}
            </>
          )}
          <CartTotal>
            <h3>Total: R$ {getTotal().toFixed(2)}</h3>
            <Botao texto="Finalizar Compra" onClick={() => alert("Compra finalizada")} />
          </CartTotal>
        </CartContainer>
      )}
    </Menu>
  );
};

export default Cart;
