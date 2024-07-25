"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { http } from '@/services';
import { Box, Button, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import Menu from '@/components/PaginaPadrao';
import styled from 'styled-components';


const TituloEstilizado = styled.h1`
    color: #5F0000;
    font-family: Italiana;
    font-size: 40px;
    font-weight: 700;
    margin: 30px 0;
    text-align: center;
`;

const FormEstilizado = styled.form`
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 30px;
    max-width: 600px;
    margin: 0 auto;
`;

const TextFieldEstilizado = styled(TextField)`
    .MuiOutlinedInput-root {
        fieldset {
            border-color: #5F0000;
        }
        &:hover fieldset {
            border-color: #5F0000;
        }
        &.Mui-focused fieldset {
            border-color: #5F0000;
        }
    }

    .MuiInputLabel-root {
        color: #5F0000;
    }

    .MuiInputLabel-root.Mui-focused {
        color: #5F0000;
    }
`;

const BotaoEstilizado = styled(Button)`
    background-color: #5F0000;
    color: white;
    border-radius: 20px;
    &:hover {
        background-color: #4a0000;
    }
`;

const Erro = styled(Typography)`
    font-size: 13px;
    color: #5F0000;
`;

const Loading = styled(Box)`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

interface FormularioAjusteEstoque {
    produtoId: number;
    quantidade: number;
    valorUnitario: number;
}

const schema = Yup.object().shape({
    produtoId: Yup.number().required('Selecione um produto'),
    quantidade: Yup.number().required('Informe a quantidade'),
    valorUnitario: Yup.number().required('Informe o valor unitário'),
});

const AjusteEstoque: React.FC = () => {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors }, reset, register, getValues } = useForm<FormularioAjusteEstoque>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormularioAjusteEstoque) => {
        try {
            await http.post('/api/ajuste-estoque', data);
            reset();
            router.push('/estoque');
        } catch (error) {
            console.error('Erro ao ajustar estoque:', error);
        }
    };

    const componentRef = React.useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <Menu>
            <Box>
                <TituloEstilizado>Ajuste de Estoque</TituloEstilizado>
                <FormEstilizado onSubmit={handleSubmit(onSubmit)}>
                    <TextFieldEstilizado
                        select
                        label="Produto"
                        {...register('produtoId')}
                        error={!!errors.produtoId}
                        helperText={errors.produtoId ? errors.produtoId.message : ''}
                    >
                        <MenuItem value="">Selecione um produto...</MenuItem>
                        <MenuItem value="1">Produto A</MenuItem>
                        <MenuItem value="2">Produto B</MenuItem>
                    </TextFieldEstilizado>

                    <TextFieldEstilizado
                        type="number"
                        label="Quantidade"
                        {...register('quantidade')}
                        error={!!errors.quantidade}
                        helperText={errors.quantidade ? errors.quantidade.message : ''}
                    />

                    <TextFieldEstilizado
                        type="number"
                        label="Valor Unitário"
                        {...register('valorUnitario')}
                        error={!!errors.valorUnitario}
                        helperText={errors.valorUnitario ? errors.valorUnitario.message : ''}
                    />

                    <BotaoEstilizado type="submit" variant="contained">
                        Realizar Ajuste
                    </BotaoEstilizado>
                </FormEstilizado>

                <Box style={{ display: 'none' }}>
                    <Box ref={componentRef}>
                        <Typography variant="h2">Etiqueta de Ajuste de Estoque</Typography>
                        <Typography>Produto: {getValues().produtoId}</Typography>
                        <Typography>Quantidade: {getValues().quantidade}</Typography>
                        <Typography>Valor Unitário: {getValues().valorUnitario}</Typography>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="center" mt={2}>
                    <IconButton color="primary" aria-label="Imprimir" onClick={handlePrint}>
                        <PrintIcon />
                    </IconButton>
                </Box>
            </Box>
        </Menu>
    );
};

export default AjusteEstoque;