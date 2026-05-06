import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  LogIn,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useAdaptivePageSize } from '../hooks/useAdaptivePageSize';

type Expert = {
  id: number;
  name: string;
  email: string;
  password?: string;
  admin: boolean;
};

type ExpertForm = {
  name: string;
  email: string;
  password: string;
  admin: boolean;
};

const INITIAL_EXPERTS: Expert[] = [
  { id: 13, name: 'Lisa Dossi', email: 'lisa@isvfo.com.br', admin: false },
  { id: 26, name: 'CAROLINA BRUGALLI BORTONCELLO', email: 'carolina@soullasa.com.br', admin: false },
  { id: 33, name: 'SAMIA CRUANES DE SOUZA DIAS', email: 'samia.cruanes@gmail.com', admin: false },
  { id: 36, name: 'MARISTELA LOFFREDA GORAYB', email: 'maristela@ancorconsultoria.com.br', admin: false },
  { id: 37, name: 'FLAVIA PEREZ COUTINHO', email: 'flavia@ancorconsultoria.com.br', admin: false },
];

const buildExperts = () => {
  const samples = [
    ['ANA PAULA MENDES', 'ana@expertos.com.br'],
    ['BRUNO ALMEIDA', 'bruno@expertos.com.br'],
    ['CAMILA RIBEIRO', 'camila@expertos.com.br'],
    ['DANIEL BARROS', 'daniel@expertos.com.br'],
    ['ELISA MOREIRA', 'elisa@expertos.com.br'],
    ['FERNANDO COSTA', 'fernando@expertos.com.br'],
    ['GABRIELA LIMA', 'gabriela@expertos.com.br'],
    ['HELENA MARTINS', 'helena@expertos.com.br'],
    ['IGOR NUNES', 'igor@expertos.com.br'],
    ['JULIA CASTRO', 'julia@expertos.com.br'],
    ['KAREN ROCHA', 'karen@expertos.com.br'],
    ['LEONARDO SALES', 'leonardo@expertos.com.br'],
    ['MARIANA FARIAS', 'mariana@expertos.com.br'],
    ['NATALIA PIRES', 'natalia@expertos.com.br'],
    ['OTAVIO SANTOS', 'otavio@expertos.com.br'],
    ['PRISCILA MOURA', 'priscila@expertos.com.br'],
    ['RAFAEL DIAS', 'rafael@expertos.com.br'],
    ['SOFIA TAVARES', 'sofia@expertos.com.br'],
    ['THAIS CARDOSO', 'thais@expertos.com.br'],
    ['VICTOR FREITAS', 'victor@expertos.com.br'],
    ['WILLIAM FONSECA', 'william@expertos.com.br'],
    ['YASMIN CAMPOS', 'yasmin@expertos.com.br'],
    ['LUCAS FERREIRA', 'lucas@expertos.com.br'],
    ['BIANCA REIS', 'bianca@expertos.com.br'],
    ['RENATA VIEIRA', 'renata@expertos.com.br'],
    ['MATEUS LOPES', 'mateus@expertos.com.br'],
    ['PATRICIA AZEVEDO', 'patricia@expertos.com.br'],
  ];

  return [
    ...INITIAL_EXPERTS,
    ...samples.map(([name, email], index) => ({
      id: index + 38,
      name,
      email,
      admin: index % 9 === 0,
    })),
  ];
};

const emptyForm: ExpertForm = {
  name: '',
  email: '',
  password: '',
  admin: false,
};

const validateForm = (form: ExpertForm, mode: 'create' | 'edit') => ({
  name: form.name.trim() === '',
  email: form.email.trim() === '',
  password: mode === 'create' && form.password.trim() === '',
});

const hasErrors = (errors: ReturnType<typeof validateForm>) =>
  Object.values(errors).some(Boolean);

export const MyClientsPage = () => {
  const [experts, setExperts] = useState<Expert[]>(buildExperts);
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [form, setForm] = useState<ExpertForm>(emptyForm);
  const [touched, setTouched] = useState(false);
  const [assumedExpertId, setAssumedExpertId] = useState<number | null>(null);

  const { containerRef: tablePanelRef, pageSize } = useAdaptivePageSize<HTMLElement>({
    rowHeight: 58,
    minRows: 5,
    maxRows: 20,
  });

  const totalPages = Math.max(1, Math.ceil(experts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageExperts = useMemo(
    () => experts.slice(startIndex, startIndex + pageSize),
    [experts, pageSize, startIndex]
  );
  const selectedCount = assumedExpertId ? 1 : 0;
  const assumedExpert = experts.find((expert) => expert.id === assumedExpertId);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingExpert(null);
    setForm(emptyForm);
    setTouched(false);
  };

  const openEditModal = (expert: Expert) => {
    setModalMode('edit');
    setEditingExpert(expert);
    setForm({
      name: expert.name,
      email: expert.email,
      password: '',
      admin: expert.admin,
    });
    setTouched(false);
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingExpert(null);
    setTouched(false);
  };

  const updateForm = (field: keyof ExpertForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveExpert = () => {
    if (!modalMode) return;

    const errors = validateForm(form, modalMode);
    setTouched(true);

    if (hasErrors(errors)) return;

    if (modalMode === 'edit' && editingExpert) {
      setExperts((current) =>
        current.map((expert) =>
          expert.id === editingExpert.id
            ? { ...expert, name: form.name.trim(), email: form.email.trim(), admin: form.admin }
            : expert
        )
      );
      closeModal();
      return;
    }

    const nextId = Math.max(...experts.map((expert) => expert.id), 0) + 1;
    setExperts((current) => [
      { id: nextId, name: form.name.trim(), email: form.email.trim(), password: form.password, admin: form.admin },
      ...current,
    ]);
    setPage(1);
    closeModal();
  };

  const deleteExpert = (id: number) => {
    setExperts((current) => current.filter((expert) => expert.id !== id));
    setAssumedExpertId((current) => (current === id ? null : current));
  };

  const formErrors = modalMode ? validateForm(form, modalMode) : validateForm(form, 'create');
  const modalTitle = modalMode === 'edit' ? 'Editar Expert' : 'Criar Expert';
  const modalDescription =
    modalMode === 'edit'
      ? 'Atualize os dados do expert selecionado.'
      : 'Preencha os campos abaixo para criar um novo expert.';

  return (
    <>
      <header className="page-header clients-page-header">
        <div>
          <p className="eyebrow">Clientes</p>
          <h2>Lista de Experts <span className="highlight">Ativos</span></h2>
          {assumedExpert && (
            <p className="clients-assumed-copy">
              Perfil assumido: <strong>{assumedExpert.email}</strong>
            </p>
          )}
        </div>

        <motion.button
          type="button"
          className="btn-primary metrics-create-btn"
          onClick={openCreateModal}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Criar Expert
        </motion.button>
      </header>

      <section ref={tablePanelRef} className="clients-table-panel glass-panel">
        <div className="clients-table-wrap">
          <table className="clients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome Completo</th>
                <th>E-mail</th>
                <th>Ações</th>
                <th>Assumir Perfil</th>
              </tr>
            </thead>
            <tbody>
              {pageExperts.map((expert) => (
                <tr key={expert.id} className={assumedExpertId === expert.id ? 'selected' : ''}>
                  <td>{expert.id}</td>
                  <td className="clients-name-cell">{expert.name}</td>
                  <td>{expert.email}</td>
                  <td>
                    <div className="metrics-actions clients-actions">
                      <button type="button" className="metrics-action-btn" onClick={() => openEditModal(expert)}>
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button type="button" className="metrics-action-btn danger" onClick={() => deleteExpert(expert.id)}>
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`clients-assume-btn ${assumedExpertId === expert.id ? 'active' : ''}`}
                      onClick={() => setAssumedExpertId(expert.id)}
                    >
                      {assumedExpertId === expert.id ? <Check size={16} /> : <LogIn size={16} />}
                      {assumedExpertId === expert.id ? 'Ativo' : 'Assumir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="metrics-table-footer clients-table-footer">
          <span>{selectedCount} row selected</span>
          <div className="entry-footer-meta">
            <span>Rows per page: {pageSize}</span>
            <span>{experts.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, experts.length)} of {experts.length}</span>
            <div className="pagination-controls">
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}>
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {createPortal(
        <AnimatePresence>
          {modalMode && (
            <motion.div
              className="metrics-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="client-modal glass-panel"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <button type="button" className="metrics-modal-close" onClick={closeModal}>
                  <X size={18} />
                </button>

                <div className="client-modal-header">
                  <p className="eyebrow">{modalMode === 'edit' ? 'Edição' : 'Novo acesso'}</p>
                  <h3>{modalTitle}</h3>
                  <p>{modalDescription}</p>
                </div>

                <ExpertField
                  label={modalMode === 'edit' ? 'Nome do Expert' : 'Nome do Expert*'}
                  value={form.name}
                  error={touched && formErrors.name}
                  onChange={(value) => updateForm('name', value)}
                />

                <ExpertField
                  label={modalMode === 'edit' ? 'E-mail do Expert' : 'E-mail do Expert*'}
                  value={form.email}
                  error={touched && formErrors.email}
                  onChange={(value) => updateForm('email', value)}
                />

                {modalMode === 'create' && (
                  <ExpertField
                    label="Senha inicial*"
                    value={form.password}
                    type="password"
                    error={touched && formErrors.password}
                    onChange={(value) => updateForm('password', value)}
                  />
                )}

                <label className="client-admin-check">
                  <input
                    type="checkbox"
                    checked={form.admin}
                    onChange={(event) => updateForm('admin', event.target.checked)}
                  />
                  <span>{form.admin && <Check size={16} />}</span>
                  <strong>{modalMode === 'edit' ? 'Usuário administrador?' : 'O Usuário é um administrador?'}</strong>
                </label>

                <div className="client-modal-actions">
                  <button type="button" className="btn-primary" onClick={saveExpert}>
                    {modalMode === 'edit' ? 'Salvar' : 'Criar'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

const ExpertField = ({
  label,
  value,
  type = 'text',
  error,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  error?: boolean;
  onChange: (value: string) => void;
}) => (
  <label className={`agent-field client-field ${error ? 'error' : ''}`}>
    <span>{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    {error && <small>Campo obrigatório</small>}
  </label>
);
