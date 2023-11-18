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

const GerenciamentoNota = () => {

  const [notas, setNotas] = useState<any[]>([])

  useEffect(() => {
      httpTeste.get('/notas').then(resultado => {
          setNotas(resultado.data)
      })
  }, [])

  function excluir(id: number) {
    if (confirm('Deseja realmente excluir a nota?')) {
      try {
        httpTeste.delete(`notas/${id}`).then(resultado => {
          if (resultado.status == 204 || resultado.status == 200) {
            setNotas(notas => {
              return notas.filter(nota => nota.id !== id)
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
      <Titulo texto='Gerenciamento de Notas' />

      <TableContainer component={Paper} sx={{ marginTop: 10}} >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tipo</TableCell>
            <TableCell align="right">Modelo</TableCell>
            <TableCell align="right">Data da emissão</TableCell>
            <TableCell align="right"> <BuildIcon /> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {notas?.map((nota) => (
            <TableRow
              key={nota.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {nota.tipoDeNota.label}
              </TableCell>
              <TableCell align="right">{nota.modelo.label}</TableCell>
              <TableCell align="right">{nota.dataEmissao}</TableCell>
              <TableCell align="right"> <Link href={'/cadastro/nota/' + nota.id}> <EditIcon /> </Link>  <DeleteForeverIcon onClick={() => excluir(nota.id)} /> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </PaginaPadrao>
  )
}

export default GerenciamentoNota;
