"use client"
import Botao from '@/components/Botao';
import Menu from '@/components/PaginaPadrao';
import Titulo from '@/components/Titulo';
import { http } from '@/services';
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from 'next/navigation';
import { Controller, SubmitHandler} from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import * as Yup from 'yup';
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';
import { CircularProgress, IconButton, Typography } from '@mui/material';
import CampoDigitacao from '@/components/CampoDigitacao';
import { IProduto } from '@/interfaces/IProduto';
import Drawer from '@mui/material/Drawer';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useForm } from 'react-hook-form';

const TituloEstilizado = styled.h5`
    color: #5F0000;
    font-family: Italiana;
    font-size: 40px;
    font-weight: 700;
`

const FormEstilizado = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 30px;
    margin-top: 25px;
`;

const DivEstilizada = styled.div`
    display: flex;
`;

const Erro = styled.span`
    font-size: 13px;
    color: #5F0000;
`;

const Rotulo = styled.label`
    display: block;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #5F0000;
`;

const Loading = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

type Inputs = {
    produto: { label?: string | undefined, value?: string | undefined },
    quantidade: number,
    descricao?: string,

    enderecoEntrega: {
        rua: string,
        cidade: string,
        estado: string,
        pais: string,
        cep: string,
    },
};


const formSchema = Yup.object().shape({
    produto: Yup.object().shape({
        label: Yup.string(),
        value: Yup.string(),
    }).required('O campo produto é obrigatório'),
    quantidade: Yup.number().required('O campo quantidade é obrigatório'),
    descricao: Yup.string(),

    enderecoEntrega: Yup.object().shape({
        rua: Yup.string().required('O campo rua é obrigatório'),
        cidade: Yup.string().required('O campo cidade é obrigatório'),
        estado: Yup.string().required('O campo estado é obrigatório'),
        pais: Yup.string().required('O campo país é obrigatório'),
        cep: Yup.string().required('O campo CEP é obrigatório'),
    }).required('Os campos de endereço são obrigatórios')
});

interface ICarrinhoItem {
    nome: string;
    quantidade: number;
    descricao?: string;
    preco: number;


    enderecoEntrega: {
        rua: string;
        cidade: string;
        estado: string;
        pais: string;
        cep: string;
    };
}

export default function Venda() {
    const router = useRouter();
    const searchParams = useParams<{id: string}>();
    const id = searchParams.id;
    const [loading, setLoading] = useState(true);
    const [produtos, setProdutos] = useState<IProduto[]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [carrinho, setCarrinho] = useState<ICarrinhoItem[]>([]);

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setLoading(false);
        } else {
            router.push('/erro');
        }
    }, [router]);

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
                console.error('Erro ao carregar produtos:', error);
            }
        };
      
        carregarProdutos(); 
    }, []);


    const { 
        handleSubmit,
        control,
        register,
        formState: { errors },
        getValues 
    } = useForm<Inputs>({
        resolver: yupResolver(formSchema),
    });

    const onSubmit: SubmitHandler<Inputs> = async (dados) => {
        try {
            const produtoSelecionado = dados.produto ? dados.produto.value : null;
            const produtoNome = produtos.find(p => p.codigo_produto === produtoSelecionado)?.nome || '';

            const novoItem: ICarrinhoItem = {
                nome: produtoNome,
                quantidade: dados.quantidade,
                preco: produtos.find(p => p.codigo_produto === produtoSelecionado)?.preco || 0,
                descricao: dados.descricao
            };

            setCarrinho([...carrinho, novoItem]);

            toast.success('Produto adicionado!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            const dadosParaEnviar = {
                ...dados,
                solicitacaoCompraId: parseInt(id as string),
                codigo_produto: produtoSelecionado,
            };

            console.log('Dados para enviar:', dadosParaEnviar);

            await http.request({
                url: '/produto-solicitacao',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: dadosParaEnviar
            });

            toast.success('Compra finalizada com sucesso!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        } catch (error: any) {
            console.error('Erro na requisição:', error);
            toast.error(`Erro ao adicionar produto. Tente novamente. ${error.message}`, {
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
                    url: `/produto-solicitacao/finalizar/${id}`,
                    method: 'PUT',
                });

                irParaNota();
        } catch (error: any) {
            toast.error(`Erro ao finalizar compra. Tente novamente. ${error.message}`, {
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
        router.push(`/nota/${id}`);
    };

    const calcularTotal = () => {
        return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    };

    const calcularImpostos = () => {
        const total = calcularTotal();
        const impostos = total * 0.1; // Exemplo: 10% de impostos
        return impostos;
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
                  color: "#5F0000",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              />
            </Loading>
          ) : (
            <Menu>
              <Typography variant="h5" gutterBottom>Registro de venda</Typography>
    
              <IconButton color="error" aria-label="add to shopping cart" onClick={handleDrawerOpen}>
                <AddShoppingCartIcon />
              </IconButton>
    
              <Drawer anchor="right" open={openDrawer} onClose={handleDrawerClose}>
                <div className="carrinho-container">
                  <Typography variant="h5" gutterBottom>Carrinho</Typography>
    
                  {carrinho.length > 0 ? (
                    <div>
                      {carrinho.map((item, index) => (
                        <div key={index} className="item-carrinho">
                          <Typography variant="subtitle1">Produto: {item.nome}</Typography>
                          <Typography variant="body2">Quantidade: {item.quantidade}</Typography>
                          <Typography variant="body2">Preço: R$ {item.preco.toFixed(2)}</Typography>
                          <Typography variant="body2">Descrição: {item.descricao}</Typography>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Typography variant="body1" align="center">Carrinho vazio</Typography>
                  )}
    
                    <div className="resumo-carrinho">
                        <Typography variant="h6">Resumo</Typography>
                        <Typography variant="body2">Impostos: R$ {calcularImpostos().toFixed(2)}</Typography>
                        <Typography variant="body2">Total: R$ {calcularTotal().toFixed(2)}</Typography>
                    </div>
        
                    <div className="endereco-entrega">
                        <Typography variant="h6">Endereço de Entrega</Typography>
                        <p>Rua: {getValues('enderecoEntrega.rua')}</p>
                        <p>Cidade: {getValues('enderecoEntrega.cidade')}</p>
                        <p>Estado: {getValues('enderecoEntrega.estado')}</p>
                        <p>País: {getValues('enderecoEntrega.pais')}</p>
                        <p>CEP: {getValues('enderecoEntrega.cep')}</p>
                    </div>
        
                    <div className="finalizar-compra">
                        <Botao texto='Finalizar compra' onClick={finalizarCompra} />
                    </div>
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
                      options={produtos.map(produto => ({
                        label: produto.nome,
                        value: produto.codigo_produto,
                      }))}
                      placeholder="Selecione o produto"
                    />
                  )}
                />
                <Erro>{errors.produto?.message}</Erro>
    
                <CampoDigitacao tipo="text" label="Quantidade" placeholder="Insira a quantidade" register={register('quantidade')} />
                <Erro>{errors.quantidade?.message}</Erro>
    
                <CampoDigitacao tipo="text" label="Descrição" placeholder="Insira a descrição" register={register('descricao')} />
                <Erro>{errors.descricao?.message}</Erro>
    
                <Rotulo>Endereço de Entrega</Rotulo>
                <CampoDigitacao tipo="text" label="Rua" placeholder="Informe a rua" register={register('enderecoEntrega.rua')} />
                <Erro>{errors.enderecoEntrega?.rua?.message}</Erro>
    
                <CampoDigitacao tipo="text" label="Cidade" placeholder="Informe a cidade" register={register('enderecoEntrega.cidade')} />
                <Erro>{errors.enderecoEntrega?.cidade?.message}</Erro>
    
                <CampoDigitacao tipo="text" label="Estado" placeholder="Informe o estado" register={register('enderecoEntrega.estado')} />
                <Erro>{errors.enderecoEntrega?.estado?.message}</Erro>
    
                <CampoDigitacao tipo="text" label="País" placeholder="Informe o país" register={register('enderecoEntrega.pais')} />
                <Erro>{errors.enderecoEntrega?.pais?.message}</Erro>
    
                <CampoDigitacao tipo="text" label="CEP" placeholder="Informe o CEP" register={register('enderecoEntrega.cep')} />
                <Erro>{errors.enderecoEntrega?.cep?.message}</Erro>
    
                <DivEstilizada>
                            <Botao texto='Adicionar produto' tipo='submit' />
                            <Botao texto='Finalizar compra' onClick={finalizarCompra} />
                        </DivEstilizada>

              </FormEstilizado>
            </Menu>
          )}
        </>
      );
    };
