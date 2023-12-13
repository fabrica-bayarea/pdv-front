"use client"
import { IconButton } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import PrintIcon from '@mui/icons-material/Print';

const PrinterTicketTable = styled.table`
  display: table !important;
  width: 100%;
  max-width: 400px;
  font-weight: light;
  line-height: 1.3em;
  margin: 0 auto; /* Center the table */
  font-family: Tahoma, Geneva, sans-serif;
  font-size: 10px;

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

const CupomVenda = () => {
  return (
    <>
    <PrinterTicketTable className="printer-ticket">
          <thead>
           <tr>
               <th className="title" colSpan={3}>PDV</th>
           </tr>
           <tr>
               <th colSpan={3}>17/11/2015 - 11:57:52</th>
           </tr>
           <tr>
               <th colSpan={3}>
                   Nome do cliente <br />
                   000.000.000-00
               </th>
           </tr>
           <tr>
               <th className="ttu" colSpan={3}>
                   <b>Cupom não fiscal</b>
               </th>
           </tr>
       </thead>
       <tbody>
           <tr className="top">
               <td colSpan={3}>Doce de brigadeiro</td>
           </tr>
           <tr>
               <td>R$7,99</td>
               <td>2.0</td>
               <td>R$15,98</td>
           </tr>
           <tr>
               <td colSpan={3}>Opcional Adicicional: grande</td>
           </tr>
           <tr>
               <td>R$0,33</td>
               <td>2.0</td>
               <td>R$0,66</td>
           </tr>
       </tbody>
       <tfoot>
           <tr className="sup ttu p--0">
               <td colSpan={3}>
                   <b>Totais</b>
               </td>
           </tr>
           <tr className="ttu">
               <td colSpan={2}>Sub-total</td>
               <td align="right">R$43,60</td>
           </tr>
           <tr className="ttu">
               <td colSpan={2}>Taxa de serviço</td>
               <td align="right">R$4,60</td>
           </tr>
           <tr className="ttu">
               <td colSpan={2}>Desconto</td>
               <td align="right">5,00%</td>
           </tr>
           <tr className="ttu">
               <td colSpan={2}>Total</td>
               <td align="right">R$45,56</td>
           </tr>
           <tr className="sup ttu p--0">
               <td colSpan={3}>
                   <b>Pagamentos</b>
               </td>
           </tr>
           <tr className="ttu">
               <td colSpan={2}>Voucher</td>
               <td align="right">R$10,00</td>
           </tr>
           <tr className="ttu">
               <td colSpan={2}>Dinheiro</td>
               <td align="right">R$10,00</td>
           </tr>
           <tr className="ttu">
               <td colSpan={2}>Total pago</td>
               <td align="right">R$10,00</td>
           </tr>
           <tr className="ttu">
               <td colSpan={2}>Troco</td>
               <td align="right">R$0,44</td>
           </tr>
           <tr className="sup">
               <td colSpan={3} align="center">
                   <b>Pedido:</b>
               </td>
           </tr>
           <tr className="sup">
               <td colSpan={3} align="center">
                   www.site.com
               </td>
           </tr>
       </tfoot>
    </PrinterTicketTable>

    <IconButton color="error" aria-label="add to shopping cart" >
        <PrintIcon />
    </IconButton>
    </>
  );
};

export default CupomVenda;
