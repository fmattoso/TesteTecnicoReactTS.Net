import React, { useState, useEffect } from 'react';
import { CategoriaService } from '../api/services';
import type { ResumoCategoriaGeral, FinalidadeCategoria } from '../types';

/**
 * Página de resumo financeiro por categoria
 * Exibe totais de receitas, despesas e saldo de cada categoria
 */
const ResumoCategoriasPage: React.FC = () => {
    const [resumo, setResumo] = useState<ResumoCategoriaGeral | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ordenarPor, setOrdenarPor] = useState<'descricao' | 'saldo' | 'receitas' | 'despesas'>('descricao');

    useEffect(() => {
        carregarResumo();
    }, []);

    const carregarResumo = async () => {
        try {
            setLoading(true);
            const data = await CategoriaService.getResumoPorCategoria();
            setResumo(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar resumo');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const obterCorFinalidade = (descricao: string) => {
        // Determinar a cor com base na descrição da categoria
        if (descricao.toLowerCase().includes('salário') ||
            descricao.toLowerCase().includes('investimento')) {
            return 'success'; // Receitas
        } else if (descricao.toLowerCase().includes('transferência')) {
            return 'primary'; // Ambas
        } else {
            return 'danger'; // Despesas
        }
    };

    const ordenarResumo = () => {
        if (!resumo) return [];

        const resumoOrdenado = [...resumo.resumoPorCategoria];

        switch (ordenarPor) {
            case 'descricao':
                return resumoOrdenado.sort((a, b) => a.descricao.localeCompare(b.descricao));
            case 'saldo':
                return resumoOrdenado.sort((a, b) => b.saldo - a.saldo);
            case 'receitas':
                return resumoOrdenado.sort((a, b) => b.totalReceitas - a.totalReceitas);
            case 'despesas':
                return resumoOrdenado.sort((a, b) => b.totalDespesas - a.totalDespesas);
            default:
                return resumoOrdenado;
        }
    };

    if (loading) {
        return <div className="text-center">Carregando...</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    const resumoOrdenado = ordenarResumo();

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Resumo Financeiro por Categoria</h1>

                <div className="d-flex align-items-center">
                    <label className="me-2">Ordenar por:</label>
                    <select
                        className="form-select w-auto"
                        value={ordenarPor}
                        onChange={(e) => setOrdenarPor(e.target.value as any)}
                    >
                        <option value="descricao">Descrição</option>
                        <option value="saldo">Saldo</option>
                        <option value="receitas">Receitas</option>
                        <option value="despesas">Despesas</option>
                    </select>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Receitas</h5>
                            <h2 className="card-text">{formatarMoeda(resumo?.totalGeralReceitas || 0)}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-danger mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Despesas</h5>
                            <h2 className="card-text">{formatarMoeda(resumo?.totalGeralDespesas || 0)}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`card text-white ${(resumo?.saldoLiquido || 0) >= 0 ? 'bg-primary' : 'bg-warning'} mb-3`}>
                        <div className="card-body">
                            <h5 className="card-title">Saldo Líquido</h5>
                            <h2 className="card-text">{formatarMoeda(resumo?.saldoLiquido || 0)}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Categoria</th>
                            <th className="text-end">Total Receitas</th>
                            <th className="text-end">Total Despesas</th>
                            <th className="text-end">Saldo</th>
                            <th className="text-center">Situação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumoOrdenado.map((item) => (
                            <tr key={item.categoriaId}>
                                <td>
                                    <span className={`badge bg-${obterCorFinalidade(item.descricao)} me-2`}>
                                        {item.descricao.includes('Transferência') ? 'Ambas' :
                                            item.descricao.includes('Salário') || item.descricao.includes('Investimento') ? 'Receita' : 'Despesa'}
                                    </span>
                                    {item.descricao}
                                </td>
                                <td className="text-end text-success">
                                    {item.totalReceitas > 0 ? formatarMoeda(item.totalReceitas) : '-'}
                                </td>
                                <td className="text-end text-danger">
                                    {item.totalDespesas > 0 ? formatarMoeda(item.totalDespesas) : '-'}
                                </td>
                                <td className={`text-end ${item.saldo >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {formatarMoeda(item.saldo)}
                                </td>
                                <td className="text-center">
                                    {item.saldo > 0 ? (
                                        <span className="badge bg-success">Superavit</span>
                                    ) : item.saldo < 0 ? (
                                        <span className="badge bg-danger">Deficit</span>
                                    ) : (
                                        <span className="badge bg-secondary">Equilibrado</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="table-dark">
                        <tr>
                            <th>Total Geral</th>
                            <th className="text-end text-success">{formatarMoeda(resumo?.totalGeralReceitas || 0)}</th>
                            <th className="text-end text-danger">{formatarMoeda(resumo?.totalGeralDespesas || 0)}</th>
                            <th className={`text-end ${(resumo?.saldoLiquido || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                                {formatarMoeda(resumo?.saldoLiquido || 0)}
                            </th>
                            <th className="text-center">
                                {(resumo?.saldoLiquido || 0) > 0 ? (
                                    <span className="badge bg-success">Superavit Geral</span>
                                ) : (resumo?.saldoLiquido || 0) < 0 ? (
                                    <span className="badge bg-danger">Deficit Geral</span>
                                ) : (
                                    <span className="badge bg-secondary">Equilibrado Geral</span>
                                )}
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Análise por Categoria</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {resumoOrdenado
                                    .filter(item => item.totalReceitas > 0)
                                    .map(item => (
                                        <li key={item.categoriaId} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{item.descricao}</span>
                                            <span className="text-success">{formatarMoeda(item.totalReceitas)}</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Despesas por Categoria</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {resumoOrdenado
                                    .filter(item => item.totalDespesas > 0)
                                    .map(item => (
                                        <li key={item.categoriaId} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{item.descricao}</span>
                                            <span className="text-danger">{formatarMoeda(item.totalDespesas)}</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumoCategoriasPage;
