"use client"
import Botao from '@/components/Botao'
import Menu from '@/components/PaginaPadrao'
import Titulo from '@/components/Titulo'
import { http } from '@/services'
import { yupResolver } from "@hookform/resolvers/yup"
import { useParams, useRouter } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast, ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import * as Yup from 'yup'
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react'
import { Button, CircularProgress, IconButton } from '@mui/material'
import CampoDigitacao from '@/components/CampoDigitacao'
import { IProduto } from '@/interfaces/IProduto'
import Drawer from '@mui/material/Drawer';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';


const FormEstilizado = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 30px;
    margin-top: 25px;
`

const DivEstilizada = styled.div`
    display: flex;
`

const Erro = styled.span`
  font-size: 13px;
  color: #DA2A38;
`

const Rotulo = styled.label`
    display: block;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #DA2A38;
`

const Loading = styled.div`
  height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
`

type Inputs = {
    produto: { label?: string | undefined, value?: string | undefined },
    quantidade: number,
    descricao?: string
}

const form = Yup.object().shape({             // cria as regras para formatação
    produto: Yup.object().shape({
        label: Yup.string(),
        value: Yup.string(),
      }),
    quantidade: Yup.number().required(''),
    descricao: Yup.string(),
});


export default function Venda() {
  const { push } = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [carrinho, setCarrinho] = useState([])

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      if (token) {
        setLoading(false);
      } else {
        push('/erro');
      }
    }, 2000);

  }, [push]);


  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await http.request({
          url: '/produto',
          method: 'GET',
        });
  
        const produtosData = response.data;
        setProdutos(produtosData);
      } catch (error) {
        console.error('Erro:', error);
      }
    };
  
    carregarProdutos(); 
  }, []);

    const {
        handleSubmit,
        control,
        register,
        formState: { errors },
      } = useForm<Inputs>(({
        resolver: yupResolver(form),
      }))

      const onSubmit: SubmitHandler<Inputs> = async (dados) => {
        try {
          const produtoSelecionado = dados.produto ? dados.produto.value : null;
      
          const { produto, ...dadosSemProduto } = dados;

          const dadosParaEnviar = {
          ...dadosSemProduto,
          solicitacaoCompraId: Array.isArray(params.id) ? parseInt(params.id[0]) : parseInt(params.id),
          codigo_produto: produtoSelecionado,
          };
          
          await http.request({
            url: '/produto-solicitacao',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            data: dadosParaEnviar
          });
      
          toast.success(`Produto adicionado!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
      
          const carrinhoAPI = await http.request({
            url: `/produto-solicitacao/solicitacao/${params.id}`,  
            method: 'GET',
          });
      
          const carrinhoData = carrinhoAPI.data;
          setCarrinho(carrinhoData);
      
        } catch (error) {
          console.error('Erro na requisição:', error);
          toast.error(`Erro ao carregar carrinho. Tente novamente.`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      };

      const finalizarCompra = async () => {
        try {
        await http.request({
            url: '/produto-solicitacao/finalizar/' + params.id,
            method: 'PUT',
          });
    
          irParaNota();
        } catch (error: any) {
          toast.error(`Erro ao cadastrar. Tente novamente. ${error.message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      };
  
      const irParaNota = () => {
        push('/nota/' + params.id)
      };
      
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
              color: "#da2a38",
              alignItems: "center",
              justifyContent: "center"
            }}
          />
        </Loading>
      ) : (
        <Menu>
          <Titulo texto="Registro de venda" />
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
              />
             
             <IconButton color="error" aria-label="add to shopping cart" onClick={handleDrawerOpen}>
              <AddShoppingCartIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={openDrawer}
              onClose={handleDrawerClose}
            >
              <div style={{ width: 250, padding: 16 }}>
                <h2>Carrinho</h2>
                <ul>
                  {carrinho?.map((item, index) => (
                    <li key={index}>
                      teste
                    </li>
                  ))}
                </ul>
              </div>
            </Drawer>
      
          <FormEstilizado onSubmit={handleSubmit(onSubmit)}>

            <Rotulo>Selecione o produto</Rotulo>
            <Controller
              name="produto"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={produtos?.map(produto => ({
                    label: produto.nome,
                    value: produto.codigo_produto,
                  }))}
                />
              )}
            />
            <Erro>{errors.produto?.message}</Erro>

            <CampoDigitacao tipo="text" label="Quantidade" placeholder="Insira a quantidade" register={register('quantidade')} />
            <Erro>{errors.quantidade?.message}</Erro>

            <CampoDigitacao tipo="text" label="Descrição" placeholder="Insira a a descrição" register={register('descricao')} />
            <Erro>{errors.descricao?.message}</Erro>

            <DivEstilizada>
              <Botao texto='Adicionar produto' tipo='submit' />
              <Botao texto='Finalizar compra' onClick={finalizarCompra} />
            </DivEstilizada>
          </FormEstilizado>

        </Menu>
      )}

    </>
    )


}