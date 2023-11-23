"use client"
import PaginaPadrao from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http, httpTeste } from '@/services'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BuildIcon from '@mui/icons-material/Build';
import Link from 'next/link'

const GerenciamentoFinalizador = () => {

  const [finalizador, setFinalizador] = useState<any[]>([])

  useEffect(() => {
      http.get('/finalizador').then(resultado => {
          setFinalizador(resultado.data)
      })
      
  }, [])

  function excluir(id: number) {
    if (confirm('Deseja realmente excluir o finalizador?')) {
      try {
        http.delete(`finalizador/${id}`).then(resultado => {
          if (resultado.status == 200) {
            setFinalizador(finalizadores => finalizadores.filter(finalizador => finalizador.id !== id))
          }})
      } catch(error) {
        console.log(error)
      }
    }

  }

  return (
    <PaginaPadrao>
      <Titulo texto='Gerenciamento de Finalizadores' />

      <TableContainer component={Paper} sx={{ marginTop: 10}} >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Finalizador</TableCell>
            <TableCell align="right">Situação</TableCell>
            <TableCell align="right">Bandeira</TableCell>
            <TableCell align="right"> <BuildIcon /> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {finalizador?.map((finalizador) => (
            <TableRow
              key={finalizador.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {finalizador.nome_finalizador}
              </TableCell>
              <TableCell align="right">{finalizador.situacao_finalizador}</TableCell>
              <TableCell align="right">{finalizador.bandeira}</TableCell>
              <TableCell align="right"> <Link href={'/cadastro/finalizadores/' + finalizador.id}> <EditIcon /> </Link>  <DeleteForeverIcon onClick={() => excluir(finalizador.id)} /> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </PaginaPadrao>
  )
}

export default GerenciamentoFinalizador;
