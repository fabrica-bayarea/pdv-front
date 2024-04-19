"use client"
import PaginaPadrao from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http, httpTeste } from '@/services'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BuildIcon from '@mui/icons-material/Build';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import LogoutIcon from '@mui/icons-material/Logout';

const GerenciamentoProduto= () => {

  const [produtos, setProduto] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      if (token) {
        http.get('/produto').then(resultado => {
            setProduto(resultado.data)
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
    if (confirm('Deseja realmente excluir a produto?')) {
      try {
        http.delete(`produto/${id}`).then(resultado => {
          if (resultado.status == 204 || resultado.status == 200) {
            setProduto(produtos => {
              return produtos.filter(produto => produto.id !== id)
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

          <Titulo texto='Gerenciamento de Produtos' />

          <TableContainer component={Paper} sx={{ marginTop: 10 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Nome</TableCell>
                  <TableCell align="right">Marca</TableCell>
                  <TableCell align="right">Preço</TableCell>
                  <TableCell align="right"> <BuildIcon /> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtos?.map((produto) => (
                  <TableRow
                    key={produto.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {produto.tipoDeproduto}
                    </TableCell>
                    <TableCell align="right">{produto.nome}</TableCell>
                    <TableCell align="right">{produto.marca}</TableCell>
                    <TableCell align="right">{produto.preco}</TableCell>
                    <TableCell align="right">
                      <Link href={'/cadastro/produto/' + produto.id}>
                        <EditIcon />
                      </Link>
                      <DeleteForeverIcon onClick={() => excluir(produto.id)} />
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

export default GerenciamentoProduto;
