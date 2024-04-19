"use client"
import PaginaPadrao from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http, httpTeste } from '@/services'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BuildIcon from '@mui/icons-material/Build';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import styled from 'styled-components';

const GerenciamentoFinalizador = () => {

  const [finalizador, setFinalizador] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();

  const Logout = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  `

  const Loading = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      if (token) {
        http.get('/finalizador').then(resultado => {
          setFinalizador(resultado.data)
        });
        setLoading(false);
      } else {
        push('/erro');
      }
    }, 2000);

  }, []);

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

  function logout() {
    localStorage.removeItem("token");
    push('/login')
  }

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
        <PaginaPadrao>

            <Logout>
              <IconButton onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </Logout>

          <Titulo texto='Gerenciamento de Finalizadores' />

          <TableContainer component={Paper} sx={{ marginTop: 10}}>
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
                      {finalizador.nome}
                    </TableCell>
                    <TableCell align="right">{finalizador.situacao}</TableCell>
                    <TableCell align="right">{finalizador.bandeira}</TableCell>
                    <TableCell align="right">
                      <Link href={'/cadastro/finalizador/' + finalizador.id}>
                        <EditIcon />
                      </Link>
                      <DeleteForeverIcon onClick={() => excluir(finalizador.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </PaginaPadrao>
      )}
    </>
  )
}

export default GerenciamentoFinalizador;
