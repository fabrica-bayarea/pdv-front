"use client"
import { CircularProgress, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { http } from '@/services';
import { useParams, useRouter } from 'next/navigation';
import { ICarrinho } from '@/interfaces/ICarrinho';

const PrinterTicketTable = styled.table`
  display: table !important;
  width: 100%;
  max-width: 500px;
  font-weight: light;
  line-height: 1.3em;
  margin: 0 auto; 
  font-family: Tahoma, Geneva, sans-serif;
  font-size: 14px;
  padding-top: 30px;

  th:nth-child(2),
  td:nth-child(2) {
    width: 50px;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 90px;
    text-align: right;
  }

  th {
    font-weight: inherit;
    padding: 10px 0;
    text-align: center;
    border-bottom: 1px dashed #BCBCBC;
  }

  tbody {
    tr:last-child td {
      padding-bottom: 10px;
    }
  }

  tfoot {
    .sup td {
      padding: 10px 0;
      border-top: 1px dashed #BCBCBC;
    }
    .sup.p--0 td {
      padding-bottom: 0;
    }
  }

  .title {
    font-size: 1.5em;
    padding: 15px 0; /* Adjust as needed */
  }

  .top {
    td {
      padding-top: 10px;
    }
  }

  .last td {
    padding-bottom: 10px;
  }
`;

const Botao = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`
const Loading = styled.div`
  height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
`

const CupomVenda = () => {
  const params = useParams()
  const { push } = useRouter()
  const [carrinho, setCarrinho] = useState<ICarrinho[]>([])
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const carregarCarrinho = async () => {
      try {
        const response = await http.request({
          url: '/produto-solicitacao/solicitacao/' + params.id,
          method: 'GET',
        });
  
        const carrinhoData = response.data;
        setCarrinho(carrinhoData);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    const token = localStorage.getItem('token');
      setTimeout(() => {
        if (token) {
          setLoading(false);
        } else {
          push('/erro');
        }
      }, 2000);
  
    carregarCarrinho(); 
 
  }, []);

  const dataAtual = new Date();

  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth() + 1; 
  const dia = dataAtual.getDate();
  const horas = dataAtual.getHours();
  const minutos = dataAtual.getMinutes();
  // const segundos = dataAtual.getSeconds();

  const componentRef = useRef(null);

  const imprimirNota = useReactToPrint({
    content: () => componentRef.current,
  });

  const totalSubtotal = carrinho?.reduce((total, item) => total + item.valor_subtotal, 0);

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
            color: "#5F0000",
            alignItems: "center",
            justifyContent: "center"
        }}
      />
  </Loading>
    ) : (
      <>
      <PrinterTicketTable className="printer-ticket" ref={componentRef}>
          <thead>
           <tr>
               <th className="title" colSpan={3}>PDV</th>
           </tr>
           <tr>
               <th colSpan={3}>{`${dia} / ${mes} / ${ano} - ${horas}:${minutos}`}</th>
           </tr>
           <tr>
           </tr>
           <tr>
               <th className="ttu" colSpan={3}>
                   <b>Cupom não fiscal</b>
               </th>
           </tr>
       </thead>
       <tbody>
           {carrinho.map((carrinho) => (
            <>
                <tr className="top">
                  <td colSpan={3}>{carrinho.nome_produto}</td>
              </tr>
              <tr>
                  <td>{carrinho.valor_unit}</td>
                  <td>{carrinho.quantidade}</td>
                  <td>R${carrinho.valor_subtotal}</td>
              </tr>
            </>
           ))}
       </tbody>
       <tfoot>
           <tr className="sup ttu p--0">
               <td colSpan={3}>
                   <b>Totais</b>
               </td>
           </tr>
           <tr className="ttu">
               <td colSpan={2}>Total</td>
               <td align="right">R${totalSubtotal}</td>
           </tr>
           <tr className="sup">
               <td colSpan={3} align="center">
                   www.site.com
               </td>
           </tr>
       </tfoot>
    </PrinterTicketTable>

    <Botao>
      <IconButton color="error" aria-label="add to shopping cart" onClick={imprimirNota}>
          <PrintIcon />
      </IconButton>
    </Botao>
      </>
    )}
  </>
  );
};

export default CupomVenda;
