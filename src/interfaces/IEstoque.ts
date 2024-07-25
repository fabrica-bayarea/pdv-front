import { ReactNode } from 'react';

export interface IEstoque {
  id: number;
  produtoId: number;
  quantidade: number;
  localizacao?: string;
  dataValidade?: Date;
  lote?: string;
  precoCompra?: number;
  precoVenda?: number;
  id_fornecedor?: number;
  dataAtualizacao: Date;
  [key: string]: ReactNode | number | string | undefined | Date;
}
