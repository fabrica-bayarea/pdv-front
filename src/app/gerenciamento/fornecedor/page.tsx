"use client"
import PaginaPadrao from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http } from '@/services'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BuildIcon from '@mui/icons-material/Build';
import Link from 'next/link'

const GerenciamentoFornecedor = () => {

  const [fornecedores, setFornecedores] = useState<any[]>([])

  useEffect(() => {
      http.get('/fornecedor').then(resultado => {
          setFornecedores(resultado.data)
      })
  }, [])

  function excluir(id: number) {
    if (confirm('Deseja realmente excluir o fornecedor?')) {
      try {
        http.delete(`fornecedores/${id}`).then(resultado => {
          if (resultado.status == 204) {
            setFornecedores(fornecedores => {
              return fornecedores.filter(fornecedor => fornecedor.id !== id)
            })
          }
        })
      } catch(error) {
        console.log(error)
      }
    }
  }

  return (
    <PaginaPadrao>
      <Titulo texto='Gerenciamento de Fornecedores' />

      <TableContainer component={Paper} sx={{ marginTop: 10}} >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell align="right">CNPJ</TableCell>
            <TableCell align="right"> <BuildIcon /> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {fornecedores?.map((fornecedor) => (
            <TableRow
              key={fornecedor.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {fornecedor.nome_fantasia}
              </TableCell>
              <TableCell align="right">{fornecedor.cnpj}</TableCell>
              <TableCell align="right"> <Link href={'/cadastro/fornecedor/' + fornecedor.id}> <EditIcon /> </Link>  <DeleteForeverIcon onClick={() => excluir(fornecedor.id)} /> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </PaginaPadrao>
  )
}

export default GerenciamentoFornecedor
