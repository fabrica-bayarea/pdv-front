import { ReactNode } from "react"
import { Key } from "react-hook-form/dist/types/path/common"

export interface IProduto {
    id: Key | null | undefined
    quantidade: ReactNode
    valor: ReactNode
    nome_produto: any
    imagem: string | undefined
    nome?: string 
    marca?: string 
    descricao?: string 
    id_fornecedor?: number 
    codigo_produto?: string 
    id_categoria?: number 
    unidade_medida?: string
    preco?: string 
    estoque_atual?: string 
}