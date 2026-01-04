import React, { useState, useEffect } from 'react';
import { PessoaService } from '../api/services';
import { ResumoGeral } from '../types';

/**
 * Página de resumo financeiro por pessoa
 * Exibe totais de receitas, despesas e saldo de cada pessoa
 */
const ResumoPessoasPage: React.FC = () => {
    const [resumo, setResumo] = useState<ResumoGeral | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        carregarResumo();
    }, []);

    const carregarResumo = async () => {
        try {
            setLoading(true);
            const data = await PessoaService.getResumoPorPessoa();
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

    return (
        <div>
            <h1 className="mb-4">Resumo Financeiro por Pessoa</h1>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Pessoa</th>
                            <th className="text-end">Total Receitas</th>
                            <th className="text-end">Total Despesas</th>
                            <th className="text-end">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumo?.resumoPorPessoa.map((item) => (
                            <tr key={item.pessoaId}>
                                <td>{item.nome}</td>
                                <td className="text-end text-success">{formatarMoeda(item.totalReceitas)}</td>
                                <td className="text-end text-danger">{formatarMoeda(item.totalDespesas)}</td>
                                <td className={`text-end ${item.saldo >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {formatarMoeda(item.saldo)}
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
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default ResumoPessoasPage;
