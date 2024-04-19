"use client"
import PaginaPadrao from '@/components/PaginaPadrao';
import Titulo from '@/components/Titulo';
import { http } from '@/services';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BuildIcon from '@mui/icons-material/Build';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import LogoutIcon from '@mui/icons-material/Logout';

const GerenciamentoFornecedor = () => {

  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      if (token) {
        http.get('/fornecedor').then(resultado => {
          setFornecedores(resultado.data)
        });
        setLoading(false);
      } else {
        push('/erro');
      }
    }, 2000);

  }, []);

  const Loading = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  const Logout = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  `

  function excluir(id: number) {
    if (confirm('Deseja realmente excluir o fornecedor?')) {
      try {
        http.delete(`fornecedor/${id}`).then(resultado => {
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

          <Titulo texto='Gerenciamento de Fornecedores' />

          <TableContainer component={Paper} sx={{ marginTop: 10 }}>
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
                    <TableCell align="right">
                      <Link href={'/cadastro/fornecedor/' + fornecedor.id}>
                        <EditIcon />
                      </Link>
                      <DeleteForeverIcon onClick={() => excluir(fornecedor.id)} />
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

export default GerenciamentoFornecedor
