/**
 * Tipos para o sistema de controle de gastos
 */

// Tipos para Pessoa
export interface Pessoa {
    id: number;
    nome: string;
    idade: number;
    isMenorDeIdade: boolean;
}

export interface CriarPessoaDTO {
    nome: string;
    idade: number;
}

// Tipos para Categoria
export enum FinalidadeCategoria {
    Despesa = 'Despesa',
    Receita = 'Receita',
    Ambas = 'Ambas'
}

export interface Categoria {
    id: number;
    descricao: string;
    finalidade: FinalidadeCategoria;
    finalidadeDescricao: string;
}

export interface CriarCategoriaDTO {
    descricao: string;
    finalidade: FinalidadeCategoria;
}

// Tipos para Transação
export enum TipoTransacao {
    Despesa = 'Despesa',
    Receita = 'Receita'
}

export interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    tipoDescricao: string;
    data: string;
    categoriaId: number;
    categoriaDescricao: string;
    pessoaId: number;
    pessoaNome: string;
}

export interface CriarTransacaoDTO {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    categoriaId: number;
    pessoaId: number;
}

// Tipos para Resumos
export interface ResumoPessoa {
    pessoaId: number;
    nome: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

export interface ResumoGeral {
    resumoPorPessoa: ResumoPessoa[];
    totalGeralReceitas: number;
    totalGeralDespesas: number;
    saldoLiquido: number;
}

export interface ResumoCategoria {
    categoriaId: number;
    descricao: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

export interface ResumoCategoriaGeral {
    resumoPorCategoria: ResumoCategoria[];
    totalGeralReceitas: number;
    totalGeralDespesas: number;
    saldoLiquido: number;
}
