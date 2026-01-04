import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PessoasPage from './pages/PessoasPage';
import CategoriasPage from './pages/CategoriasPage';
import TransacoesPage from './pages/TransacoesPage';
import ResumoPessoasPage from './pages/ResumoPessoasPage';
import ResumoCategoriasPage from './pages/ResumoCategoriasPage';

/**
 * Componente principal da aplicação
 * Define as rotas e a navegação principal
 */
const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <div className="container">
                        <Link className="navbar-brand" to="/">
                            Controle de Gastos Residenciais
                        </Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/pessoas">
                                        Pessoas
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/categorias">
                                        Categorias
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/transacoes">
                                        Transações
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/resumo-pessoas">
                                        Resumo por Pessoa
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/resumo-categorias">
                                        Resumo por Categoria
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<PessoasPage />} />
                        <Route path="/pessoas" element={<PessoasPage />} />
                        <Route path="/categorias" element={<CategoriasPage />} />
                        <Route path="/transacoes" element={<TransacoesPage />} />
                        <Route path="/resumo-pessoas" element={<ResumoPessoasPage />} />
                        <Route path="/resumo-categorias" element={<ResumoCategoriasPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
