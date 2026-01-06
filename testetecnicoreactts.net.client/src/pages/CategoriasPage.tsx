import React, { useState, useEffect } from 'react';
import { CategoriaService } from '../api/services';
import type{ Categoria, CriarCategoriaDTO } from '../types';
import { FinalidadeCategoria } from '../types';
import Modal from '../components/Modal';

/**
 * Página de gerenciamento de categorias
 * Permite listar e criar categorias
 */
const CategoriasPage: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [novaCategoria, setNovaCategoria] = useState<CriarCategoriaDTO>({
        descricao: '',
        finalidade: FinalidadeCategoria.Despesa
    });

    // Carregar categorias ao montar o componente
    useEffect(() => {
        carregarCategorias();
    }, []);

    const carregarCategorias = async () => {
        try {
            setLoading(true);
            const data = await CategoriaService.getCategorias();
            setCategorias(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar categorias');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCriarCategoria = async () => {
        try {
            if (!novaCategoria.descricao.trim()) {
                setError('Descrição é obrigatória');
                return;
            }

            await CategoriaService.criarCategoria(novaCategoria);
            setShowModal(false);
            setNovaCategoria({
                descricao: '',
                finalidade: FinalidadeCategoria.Despesa
            });
            carregarCategorias();
        } catch (err) {
            setError('Erro ao criar categoria');
            console.error(err);
        }
    };

    const obterCorFinalidade = (finalidade: FinalidadeCategoria) => {
        switch (finalidade) {
            case FinalidadeCategoria.Despesa:
                return 'danger';
            case FinalidadeCategoria.Receita:
                return 'success';
            case FinalidadeCategoria.Ambas:
                return 'primary';
            default:
                return 'secondary';
        }
    };

    const obterTextoFinalidade = (finalidade: FinalidadeCategoria) => {
        switch (finalidade) {
            case FinalidadeCategoria.Despesa:
                return 'Despesa';
            case FinalidadeCategoria.Receita:
                return 'Receita';
            case FinalidadeCategoria.Ambas:
                return 'Despesa/Receita';
            default:
                return finalidade;
        }
    };

    if (loading) {
        return <div className="text-center">Carregando...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Categorias</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Nova Categoria
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <p className="card-text">
                                <strong>Legenda:</strong>
                                <span className="badge bg-danger ms-2 me-1">Despesa</span>
                                - Apenas para transações de despesa
                                <br />
                                <span className="badge bg-success ms-2 me-1">Receita</span>
                                - Apenas para transações de receita
                                <br />
                                <span className="badge bg-primary ms-2 me-1">Ambas</span>
                                - Para transações de despesa e receita
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descrição</th>
                            <th>Finalidade</th>
                            <th>Compatível com</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td>{categoria.id}</td>
                                <td>{categoria.descricao}</td>
                                <td>
                                    <span className={`badge bg-${obterCorFinalidade(categoria.finalidade)}`}>
                                        {obterTextoFinalidade(categoria.finalidade)}
                                    </span>
                                </td>
                                <td>
                                    {categoria.finalidade === FinalidadeCategoria.Ambas ? (
                                        <span className="text-muted">Despesas e Receitas</span>
                                    ) : categoria.finalidade === FinalidadeCategoria.Despesa ? (
                                        <span className="text-danger">Apenas Despesas</span>
                                    ) : (
                                        <span className="text-success">Apenas Receitas</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para criar nova categoria */}
            <Modal
                show={showModal}
                title="Nova Categoria"
                onClose={() => setShowModal(false)}
                onConfirm={handleCriarCategoria}
            >
                <div className="mb-3">
                    <label htmlFor="descricao" className="form-label">
                        Descrição *
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="descricao"
                        value={novaCategoria.descricao}
                        onChange={(e) => setNovaCategoria({ ...novaCategoria, descricao: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="finalidade" className="form-label">
                        Finalidade *
                    </label>
                    <select
                        className="form-select"
                        id="finalidade"
                        value={novaCategoria.finalidade}
                        onChange={(e) => setNovaCategoria({
                            ...novaCategoria,
                            finalidade: e.target.value as FinalidadeCategoria
                        })}
                        required
                    >
                        <option value={FinalidadeCategoria.Despesa}>Despesa</option>
                        <option value={FinalidadeCategoria.Receita}>Receita</option>
                        <option value={FinalidadeCategoria.Ambas}>Ambas (Despesa e Receita)</option>
                    </select>
                    <small className="form-text text-muted">
                        A finalidade determina o tipo de transações que podem usar esta categoria.
                    </small>
                </div>
            </Modal>
        </div>
    );
};

export default CategoriasPage;
