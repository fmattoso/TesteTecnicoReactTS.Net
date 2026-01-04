import api from './axiosConfig';
import {
    Pessoa,
    CriarPessoaDTO,
    Categoria,
    CriarCategoriaDTO,
    Transacao,
    CriarTransacaoDTO,
    ResumoGeral,
    ResumoCategoriaGeral,
    FinalidadeCategoria,
    TipoTransacao
} from '../types';

/**
 * Serviço para gerenciamento de Pessoas
 */
export const PessoaService = {
    // Obter todas as pessoas
    getPessoas: async (): Promise<Pessoa[]> => {
        const response = await api.get<Pessoa[]>('/pessoas');
        return response.data;
    },

    // Obter uma pessoa específica
    getPessoa: async (id: number): Promise<Pessoa> => {
        const response = await api.get<Pessoa>(`/pessoas/${id}`);
        return response.data;
    },

    // Criar uma nova pessoa
    criarPessoa: async (dto: CriarPessoaDTO): Promise<Pessoa> => {
        const response = await api.post<Pessoa>('/pessoas', dto);
        return response.data;
    },

    // Excluir uma pessoa
    excluirPessoa: async (id: number): Promise<void> => {
        await api.delete(`/pessoas/${id}`);
    },

    // Obter resumo por pessoa
    getResumoPorPessoa: async (): Promise<ResumoGeral> => {
        const response = await api.get<ResumoGeral>('/pessoas/resumo');
        return response.data;
    }
};

/**
 * Serviço para gerenciamento de Categorias
 */
export const CategoriaService = {
    // Obter todas as categorias
    getCategorias: async (): Promise<Categoria[]> => {
        const response = await api.get<Categoria[]>('/categorias');
        return response.data;
    },

    // Obter categorias por finalidade
    getCategoriasPorFinalidade: async (finalidade: FinalidadeCategoria): Promise<Categoria[]> => {
        const response = await api.get<Categoria[]>(`/categorias/por-finalidade/${finalidade}`);
        return response.data;
    },

    // Criar uma nova categoria
    criarCategoria: async (dto: CriarCategoriaDTO): Promise<Categoria> => {
        const response = await api.post<Categoria>('/categorias', dto);
        return response.data;
    },

    // Obter resumo por categoria
    getResumoPorCategoria: async (): Promise<ResumoCategoriaGeral> => {
        const response = await api.get<ResumoCategoriaGeral>('/categorias/resumo');
        return response.data;
    }
};

/**
 * Serviço para gerenciamento de Transações
 */
export const TransacaoService = {
    // Obter todas as transações
    getTransacoes: async (): Promise<Transacao[]> => {
        const response = await api.get<Transacao[]>('/transacoes');
        return response.data;
    },

    // Criar uma nova transação
    criarTransacao: async (dto: CriarTransacaoDTO): Promise<Transacao> => {
        const response = await api.post<Transacao>('/transacoes', dto);
        return response.data;
    }
};
