import React from 'react';

interface ModalProps {
    show: boolean;
    title: string;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
}

/**
 * Componente de Modal reutilizável
 */
const Modal: React.FC<ModalProps> = ({ show, title, onClose, onConfirm, children }) => {
    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">{children}</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="btn btn-primary" onClick={onConfirm}>
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </div>
    );
};

export default Modal;
