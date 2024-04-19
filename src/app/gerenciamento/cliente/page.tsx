"use client"
import PaginaPadrao from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http } from '@/services'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BuildIcon from '@mui/icons-material/Build';
import Link from 'next/link'
import LogoutIcon from '@mui/icons-material/Logout';
import styled from 'styled-components'
import { useRouter } from 'next/navigation'

const GerenciamentoCliente = () => {

  const [usuarios, setUsuarios] = useState<any[]>([])
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
        http.get('/cliente').then(resultado => {
          setUsuarios(resultado.data)
        });
        setLoading(false);
      } else {
        push('/erro');
      }
    }, 2000);

  }, []);

  function excluir(id: number) {
    if (confirm('Deseja realmente excluir o usuário?')) {
      try {
        http.delete(`cliente/${id}`).then(resultado => {
          if (resultado.status == 200) {
            setUsuarios(usuarios => usuarios.filter(usuario => usuario.id !== id))
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

          <Titulo texto='Gerenciamento de Cliente' />

          <TableContainer component={Paper} sx={{ marginTop: 10 }}>
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
                {usuarios?.map((usuario) => (
                  <TableRow
                    key={usuario.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {usuario.nome}
                    </TableCell>
                    <TableCell align="right">{usuario.email}</TableCell>
                    <TableCell align="right">{usuario.telefone}</TableCell>
                    <TableCell align="right">{usuario.data_nascimento}</TableCell>
                    <TableCell align="right">
                      <Link href={'/cadastro/cliente/' + usuario.id}>
                        <EditIcon />
                      </Link>
                      <DeleteForeverIcon onClick={() => excluir(usuario.id)} />
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

export default GerenciamentoCliente