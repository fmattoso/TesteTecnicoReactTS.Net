import React, { useState, useEffect } from 'react';
import { PessoaService } from '../api/services';
import type { Pessoa, CriarPessoaDTO } from '../types';
import Modal from '../components/Modal';

/**
 * Página de gerenciamento de pessoas
 * Permite listar, criar e excluir pessoas
 */
const PessoasPage: React.FC = () => {
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [novaPessoa, setNovaPessoa] = useState<CriarPessoaDTO>({
        nome: '',
        idade: 18
    });

    // Carregar pessoas ao montar o componente
    useEffect(() => {
        carregarPessoas();
    }, []);

    const carregarPessoas = async () => {
        try {
            setLoading(true);
            const data = await PessoaService.getPessoas();
            setPessoas(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar pessoas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCriarPessoa = async () => {
        try {
            if (!novaPessoa.nome.trim() || novaPessoa.idade < 1) {
                setError('Nome e idade são obrigatórios');
                return;
            }

            await PessoaService.criarPessoa(novaPessoa);
            setShowModal(false);
            setNovaPessoa({ nome: '', idade: 18 });
            carregarPessoas();
        } catch (err) {
            setError('Erro ao criar pessoa');
            console.error(err);
        }
    };

    const handleExcluirPessoa = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
            try {
                await PessoaService.excluirPessoa(id);
                carregarPessoas();
            } catch (err) {
                setError('Erro ao excluir pessoa');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div className="text-center">Carregando...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Pessoas</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Nova Pessoa
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
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Idade</th>
                            <th>Situação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pessoas.map((pessoa) => (
                            <tr key={pessoa.id}>
                                <td>{pessoa.id}</td>
                                <td>{pessoa.nome}</td>
                                <td>{pessoa.idade}</td>
                                <td>
                                    {pessoa.isMenorDeIdade ? (
                                        <span className="badge bg-warning">Menor de Idade</span>
                                    ) : (
                                        <span className="badge bg-success">Maior de Idade</span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleExcluirPessoa(pessoa.id)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para criar nova pessoa */}
            <Modal
                show={showModal}
                title="Nova Pessoa"
                onClose={() => setShowModal(false)}
                onConfirm={handleCriarPessoa}
            >
                <div className="mb-3">
                    <label htmlFor="nome" className="form-label">
                        Nome *
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="nome"
                        value={novaPessoa.nome}
                        onChange={(e) => setNovaPessoa({ ...novaPessoa, nome: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="idade" className="form-label">
                        Idade *
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="idade"
                        min="1"
                        max="150"
                        value={novaPessoa.idade}
                        onChange={(e) => setNovaPessoa({ ...novaPessoa, idade: parseInt(e.target.value) })}
                        required
                    />
                </div>
            </Modal>
        </div>
    );
};

export default PessoasPage;
