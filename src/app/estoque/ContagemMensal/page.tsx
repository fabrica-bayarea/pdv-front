"use client"
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CircularProgress, IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { useParams, useRouter } from 'next/navigation';
import { http } from '@/services';
import Menu from '@/components/PaginaPadrao'; 
import { IProduto } from '@/interfaces/IProduto'; 

const MonthlyCountContainer = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h5`
  color: #5F0000;
  font-family: Italiana;
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
`;

const PrinterTicketTable = styled.table`
  width: 100%;
  max-width: 800px; 
  font-weight: light;
  line-height: 1.5em;
  margin-top: 30px;
  border-collapse: collapse;
  border-spacing: 0;

  th, td {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  td {
    word-break: break-word;
  }
`;

const Botao = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const Loading = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ContagemMensal {
  id: number;
  mes: number;
  ano: number;
  localizacao?: string | null;
  responsavel: string;
  dataHoraContagem: string;
  observacoes?: string | null;
  produtos: IProduto[]; 
}

const ContagemMensalPage = () => {
  const { id } = useParams(); 
  const { push } = useRouter(); 
  const [contagem, setContagem] = useState<ContagemMensal | null>(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchContagem = async () => {
      try {
        const response = await http.get(`/contagemMensal/${id}`);
        const data = response.data;
        setContagem(data);
      } catch (error) {
        console.error('Erro ao carregar a contagem mensal:', error);
        setLoading(false); 
      }
    };

    fetchContagem(); 
  }, [id]); 

  const componentRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (loading) {
    return (
      <Loading>
        <CircularProgress size={68} color="primary" />
      </Loading>
    );
  }

  return (
    <Menu>
    <MonthlyCountContainer>
      <Title>Contagem Mensal de Estoque</Title>
      <PrinterTicketTable ref={componentRef}>
        <thead>
          <tr>
            <th colSpan={3}>Detalhes da Contagem</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ID:</td>
            <td colSpan={2}>{contagem?.id}</td>
          </tr>
          <tr>
            <td>Mês:</td>
            <td colSpan={2}>{contagem?.mes}</td>
          </tr>
          <tr>
            <td>Ano:</td>
            <td colSpan={2}>{contagem?.ano}</td>
          </tr>
          <tr>
            <td>Localização:</td>
            <td colSpan={2}>{contagem?.localizacao || 'Não especificada'}</td>
          </tr>
          <tr>
            <td>Responsável:</td>
            <td colSpan={2}>{contagem?.responsavel}</td>
          </tr>
          <tr>
            <td>Data e Hora:</td>
            <td colSpan={2}>{new Date(contagem?.dataHoraContagem).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Observações:</td>
            <td colSpan={2}>{contagem?.observacoes || 'Nenhuma observação'}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>
              <b>Produtos Contados:</b>
            </td>
          </tr>
          {contagem?.produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.quantidade}</td>
              <td>{produto.valor}</td>
            </tr>
          ))}
        </tfoot>
      </PrinterTicketTable>
      <Botao>
        <IconButton color="primary" aria-label="Imprimir" onClick={handlePrint}>
          <PrintIcon />
        </IconButton>
      </Botao>
    </MonthlyCountContainer>
  </Menu>
);
};

export default ContagemMensalPage;