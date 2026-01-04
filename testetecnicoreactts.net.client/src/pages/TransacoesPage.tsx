import React, { useState, useEffect } from 'react';
import { TransacaoService, PessoaService, CategoriaService } from '../api/services';
import { Transacao, CriarTransacaoDTO, Pessoa, Categoria, TipoTransacao } from '../types';
import Modal from '../components/Modal';

/**
 * Página de gerenciamento de transações
 * Permite listar e criar transações com validações
 */
const TransacoesPage: React.FC = () => {
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [novaTransacao, setNovaTransacao] = useState<CriarTransacaoDTO>({
        descricao: '',
        valor: 0,
        tipo: TipoTransacao.Despesa,
        categoriaId: 0,
        pessoaId: 0
    });

    // Filtro para categorias por tipo
    const categoriasFiltradas = categorias.filter(categoria => {
        if (novaTransacao.tipo === TipoTransacao.Despesa) {
            return categoria.finalidade === 'Despesa' || categoria.finalidade === 'Ambas';
        } else {
            return categoria.finalidade === 'Receita' || categoria.finalidade === 'Ambas';
        }
    });

    // Carregar dados ao montar o componente
    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const [transacoesData, pessoasData, categoriasData] = await Promise.all([
                TransacaoService.getTransacoes(),
                PessoaService.getPessoas(),
                CategoriaService.getCategorias()
            ]);

            setTransacoes(transacoesData);
            setPessoas(pessoasData);
            setCategorias(categoriasData);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar dados');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCriarTransacao = async () => {
        try {
            if (!novaTransacao.descricao.trim() || novaTransacao.valor <= 0) {
                setError('Descrição e valor são obrigatórios');
                return;
            }

            if (novaTransacao.categoriaId === 0 || novaTransacao.pessoaId === 0) {
                setError('Selecione uma categoria e uma pessoa');
                return;
            }

            // Verificar se pessoa selecionada é menor de idade tentando criar receita
            const pessoaSelecionada = pessoas.find(p => p.id === novaTransacao.pessoaId);
            if (pessoaSelecionada?.isMenorDeIdade && novaTransacao.tipo === TipoTransacao.Receita) {
                setError('Menores de idade não podem ter receitas');
                return;
            }

            await TransacaoService.criarTransacao(novaTransacao);
            setShowModal(false);
            setNovaTransacao({
                descricao: '',
                valor: 0,
                tipo: TipoTransacao.Despesa,
                categoriaId: 0,
                pessoaId: 0
            });
            carregarDados();
        } catch (err: any) {
            setError(err.response?.data || 'Erro ao criar transação');
            console.error(err);
        }
    };

    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    if (loading) {
        return <div className="text-center">Carregando...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Transações</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Nova Transação
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Tipo</th>
                            <th>Categoria</th>
                            <th>Pessoa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacoes.map((transacao) => (
                            <tr key={transacao.id}>
                                <td>{formatarData(transacao.data)}</td>
                                <td>{transacao.descricao}</td>
                                <td className={transacao.tipo === 'Receita' ? 'text-success' : 'text-danger'}>
                                    {transacao.tipo === 'Receita' ? '+' : '-'} {formatarMoeda(transacao.valor)}
                                </td>
                                <td>
                                    <span className={`badge ${transacao.tipo === 'Receita' ? 'bg-success' : 'bg-danger'}`}>
                                        {transacao.tipoDescricao}
                                    </span>
                                </td>
                                <td>{transacao.categoriaDescricao}</td>
                                <td>{transacao.pessoaNome}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para criar nova transação */}
            <Modal
                show={showModal}
                title="Nova Transação"
                onClose={() => setShowModal(false)}
                onConfirm={handleCriarTransacao}
            >
                <div className="mb-3">
                    <label htmlFor="descricao" className="form-label">
                        Descrição *
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="descricao"
                        value={novaTransacao.descricao}
                        onChange={(e) => setNovaTransacao({ ...novaTransacao, descricao: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="valor" className="form-label">
                        Valor *
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="valor"
                        min="0.01"
                        step="0.01"
                        value={novaTransacao.valor}
                        onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: parseFloat(e.target.value) })}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="tipo" className="form-label">
                        Tipo *
                    </label>
                    <select
                        className="form-select"
                        id="tipo"
                        value={novaTransacao.tipo}
                        onChange={(e) => {
                            const tipo = e.target.value as TipoTransacao;
                            setNovaTransacao({ ...novaTransacao, tipo, categoriaId: 0 });
                        }}
                        required
                    >
                        <option value={TipoTransacao.Despesa}>Despesa</option>
                        <option value={TipoTransacao.Receita}>Receita</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="pessoa" className="form-label">
                        Pessoa *
                    </label>
                    <select
                        className="form-select"
                        id="pessoa"
                        value={novaTransacao.pessoaId}
                        onChange={(e) => setNovaTransacao({ ...novaTransacao, pessoaId: parseInt(e.target.value) })}
                        required
                    >
                        <option value="0">Selecione uma pessoa</option>
                        {pessoas.map((pessoa) => (
                            <option key={pessoa.id} value={pessoa.id}>
                                {pessoa.nome} ({pessoa.idade} anos)
                            </option>
                        ))}
                    </select>
                    {novaTransacao.pessoaId > 0 && (
                        <small className="form-text text-muted">
                            {pessoas.find(p => p.id === novaTransacao.pessoaId)?.isMenorDeIdade
                                ? 'Menor de idade: apenas despesas permitidas'
                                : 'Maior de idade: despesas e receitas permitidas'}
                        </small>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="categoria" className="form-label">
                        Categoria *
                    </label>
                    <select
                        className="form-select"
                        id="categoria"
                        value={novaTransacao.categoriaId}
                        onChange={(e) => setNovaTransacao({ ...novaTransacao, categoriaId: parseInt(e.target.value) })}
                        required
                    >
                        <option value="0">Selecione uma categoria</option>
                        {categoriasFiltradas.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.descricao} ({categoria.finalidadeDescricao})
                            </option>
                        ))}
                    </select>
                </div>
            </Modal>
        </div>
    );
};

export default TransacoesPage;
