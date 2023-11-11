"use client"
import PaginaPadrao from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { ICliente } from '@/interfaces/ICliente'
import { http } from '@/services'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BuildIcon from '@mui/icons-material/Build';
import Link from 'next/link'

const GerenciamentoVendedor = () => {

  const [vendedor, setVendedor] = useState<any[]>([])

  useEffect(() => {
      http.get('/vendedores').then(resultado => {
          setVendedor(resultado.data)
      })
      
  }, [])

  function excluir(id: number) {
    if (confirm('Deseja realmente excluir o vendedor?')) {
      try {
        http.delete(`vendedores/${id}`).then(resultado => {
          if (resultado.status == 200) {
            setVendedor(vendedores => vendedores.filter(vendedor => vendedor.id !== id))
          }})
      } catch(error) {
        console.log(error)
      }
    }

  }

  return (
    <PaginaPadrao>
      <Titulo texto='Gerenciamento de Vendedores' />

      <TableContainer component={Paper} sx={{ marginTop: 10}} >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nome completo</TableCell>
            <TableCell align="right">E-mail</TableCell>
            <TableCell align="right">Telefone</TableCell>
            <TableCell align="right">Data de nascimento</TableCell>
            <TableCell align="right"> <BuildIcon /> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {vendedor?.map((vendedor) => (
            <TableRow
              key={vendedor.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {vendedor.nome}
              </TableCell>
              <TableCell align="right">{vendedor.email}</TableCell>
              <TableCell align="right">{vendedor.telefone}</TableCell>
              <TableCell align="right">{new Date(vendedor.dataNascimento).toLocaleDateString()}</TableCell>
              <TableCell align="right"> <Link href={'/cadastro/vendedor/' + vendedor.id}> <EditIcon /> </Link>  <DeleteForeverIcon onClick={() => excluir(vendedor.id)} /> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </PaginaPadrao>
  )
}

export default GerenciamentoVendedor
