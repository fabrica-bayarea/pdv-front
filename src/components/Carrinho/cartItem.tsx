import React from 'react';
import styled from 'styled-components';
import Botao from '@/components/Botao';
import { IProduto } from '@/interfaces/IProduto';

interface CartItemProps {
  item: {
    id: number;
    produto: IProduto;
    quantidade: number;
  };
  onRemove: (id: number) => void;
}

const CartItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
`;

const ItemDetails = styled.div`
  flex-grow: 1;
  padding-left: 20px;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  const { produto, quantidade } = item;
  const preco = produto.preco ? parseFloat(produto.preco) : 0; 

  return (
    <CartItemContainer>
      <ItemImage src={produto.imagem} alt={produto.nome} />
      <ItemDetails>
        <h4>{produto.nome}</h4>
        <p>Quantidade: {quantidade}</p>
        <p>Preço: R$ {preco.toFixed(2)}</p>
      </ItemDetails>
      <Botao texto="Remover" onClick={() => onRemove(item.id)} />
    </CartItemContainer>
  );
};

export default CartItem;
