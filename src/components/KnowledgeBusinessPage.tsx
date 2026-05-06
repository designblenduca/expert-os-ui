import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useAdaptivePageSize } from '../hooks/useAdaptivePageSize';

type KnowledgeBusiness = {
  id: number;
  name: string;
  description: string;
  metricIds: number[];
};

type BusinessForm = Omit<KnowledgeBusiness, 'id'>;

type WizardMode = 'create' | 'edit';

const METRIC_OPTIONS = [
  { id: 1, name: 'Taxa de Conversão' },
  { id: 2, name: 'Custo por Aquisição (CAC)' },
  { id: 3, name: 'ROI de Campanhas' },
  { id: 4, name: 'Quantidade de parceiros diretos' },
  { id: 5, name: 'Custos & Despesas' },
  { id: 6, name: 'Quantidade de funis em operação' },
  { id: 7, name: 'Receita Recorrente Mensal' },
  { id: 8, name: 'Ticket Médio' },
];

const INITIAL_BUSINESSES: KnowledgeBusiness[] = [
  {
    id: 62,
    name: 'teste',
    description: 'Negócio de conhecimento de teste',
    metricIds: [1, 2, 3],
  },
];

const emptyForm: BusinessForm = {
  name: '',
  description: '',
  metricIds: [],
};

const STEPS = [
  'Criação do Negócio de Conhecimento',
  'Vínculo de Métricas',
  'Confirmação',
];

export const KnowledgeBusinessPage = () => {
  const [businesses, setBusinesses] = useState<KnowledgeBusiness[]>(INITIAL_BUSINESSES);
  const [page, setPage] = useState(1);
  const [wizardMode, setWizardMode] = useState<WizardMode | null>(null);
  const [editingBusiness, setEditingBusiness] = useState<KnowledgeBusiness | null>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BusinessForm>(emptyForm);
  const [touched, setTouched] = useState(false);

  const { containerRef: tablePanelRef, pageSize } = useAdaptivePageSize<HTMLElement>({
    rowHeight: 58,
    minRows: 5,
    maxRows: 20,
  });

  const totalPages = Math.max(1, Math.ceil(businesses.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageBusinesses = useMemo(
    () => businesses.slice(startIndex, startIndex + pageSize),
    [businesses, pageSize, startIndex]
  );

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const openCreateWizard = () => {
    setWizardMode('create');
    setEditingBusiness(null);
    setStep(0);
    setTouched(false);
    setForm(emptyForm);
  };

  const openEditWizard = (business: KnowledgeBusiness) => {
    setWizardMode('edit');
    setEditingBusiness(business);
    setStep(0);
    setTouched(false);
    setForm({
      name: business.name,
      description: business.description,
      metricIds: business.metricIds,
    });
  };

  const closeWizard = () => {
    setWizardMode(null);
    setEditingBusiness(null);
    setTouched(false);
  };

  const deleteBusiness = (id: number) => {
    setBusinesses((current) => current.filter((business) => business.id !== id));
  };

  const hasStepOneErrors = form.name.trim() === '' || form.description.trim() === '';
  const selectedMetrics = METRIC_OPTIONS.filter((metric) => form.metricIds.includes(metric.id));

  const goNext = () => {
    if (step === 0 && hasStepOneErrors) {
      setTouched(true);
      return;
    }

    setStep((current) => Math.min(2, current + 1));
  };

  const goBack = () => {
    if (step === 0) {
      closeWizard();
      return;
    }

    setStep((current) => Math.max(0, current - 1));
  };

  const toggleMetric = (metricId: number) => {
    setForm((current) => {
      const hasMetric = current.metricIds.includes(metricId);
      return {
        ...current,
        metricIds: hasMetric
          ? current.metricIds.filter((id) => id !== metricId)
          : [...current.metricIds, metricId],
      };
    });
  };

  const selectAllMetrics = () => {
    setForm((current) => ({ ...current, metricIds: METRIC_OPTIONS.map((metric) => metric.id) }));
  };

  const clearMetrics = () => {
    setForm((current) => ({ ...current, metricIds: [] }));
  };

  const saveBusiness = () => {
    if (hasStepOneErrors) {
      setStep(0);
      setTouched(true);
      return;
    }

    if (wizardMode === 'edit' && editingBusiness) {
      setBusinesses((current) =>
        current.map((business) =>
          business.id === editingBusiness.id ? { id: editingBusiness.id, ...form } : business
        )
      );
      closeWizard();
      return;
    }

    const nextId = Math.max(...businesses.map((business) => business.id), 0) + 1;
    setBusinesses((current) => [{ id: nextId, ...form }, ...current]);
    setPage(1);
    closeWizard();
  };

  return (
    <>
      <header className="page-header metrics-page-header knowledge-page-header">
        <div>
          <p className="eyebrow">Estratégia</p>
          <h2>Negócios de <span className="highlight">Conhecimento</span></h2>
        </div>
        <motion.button
          type="button"
          className="btn-primary metrics-create-btn"
          onClick={openCreateWizard}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Adicionar Novo Negócio
        </motion.button>
      </header>

      <section ref={tablePanelRef} className="metrics-table-panel knowledge-table-panel glass-panel">
        <div className="metrics-table-wrap">
          <table className="metrics-table knowledge-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Negócio de Conhecimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pageBusinesses.map((business) => (
                <tr key={business.id}>
                  <td>{business.id}</td>
                  <td className="metric-name-cell">
                    <strong>{business.name}</strong>
                    <span>{business.metricIds.length} métricas vinculadas</span>
                  </td>
                  <td>
                    <div className="metrics-actions">
                      <button type="button" className="metrics-action-btn" onClick={() => openEditWizard(business)}>
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button type="button" className="metrics-action-btn danger" onClick={() => deleteBusiness(business.id)}>
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageBusinesses.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <div className="metrics-empty-state">
                      <h3>Nenhum negócio cadastrado</h3>
                      <p>Crie um negócio de conhecimento para vincular métricas e acompanhar evolução.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="metrics-table-footer">
          <span>Rows per page: {pageSize}</span>
          <span>{businesses.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, businesses.length)} of {businesses.length}</span>
          <div className="pagination-controls">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}>
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {createPortal(
        <AnimatePresence>
          {wizardMode && (
            <motion.div
              className="metrics-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="knowledge-wizard-modal glass-panel"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <button type="button" className="metrics-modal-close" onClick={closeWizard}>
                  <X size={18} />
                </button>

                <div className="knowledge-wizard-header">
                  <p className="eyebrow">{wizardMode === 'edit' ? 'Edição' : 'Novo negócio'}</p>
                  <h3>{wizardMode === 'edit' ? 'Editar Negócio de Conhecimento' : 'Criação do Negócio de Conhecimento'}</h3>
                </div>

                <div className="knowledge-stepper" aria-label="Etapas do cadastro">
                  {STEPS.map((label, index) => (
                    <div key={label} className={`knowledge-step ${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`}>
                      <span className="knowledge-step-dot">{index < step ? <Check size={13} /> : index + 1}</span>
                      <strong>{label}</strong>
                    </div>
                  ))}
                </div>

                <div className="knowledge-wizard-body">
                  {step === 0 && (
                    <motion.div className="knowledge-step-content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="knowledge-step-copy">
                        Preencha os campos abaixo para criar um novo negócio de conhecimento.
                      </p>

                      <label className={`agent-field ${touched && form.name.trim() === '' ? 'error' : ''}`}>
                        <span>Nome do Negócio de Conhecimento*</span>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                        />
                        {touched && form.name.trim() === '' && <small>Campo obrigatório</small>}
                      </label>

                      <label className={`agent-field ${touched && form.description.trim() === '' ? 'error' : ''}`}>
                        <span>Descrição do Negócio de Conhecimento*</span>
                        <textarea
                          value={form.description}
                          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                        />
                        {touched && form.description.trim() === '' && <small>Campo obrigatório</small>}
                      </label>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div className="knowledge-step-content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="knowledge-step-copy">
                        Escolha quais métricas devem aparecer para este negócio.
                      </p>

                      <div className="knowledge-metric-picker">
                        <div className="knowledge-metric-panel">
                          <div className="knowledge-metric-panel-head">
                            <strong>Métricas disponíveis</strong>
                            <span>{METRIC_OPTIONS.length}</span>
                          </div>

                          <div className="knowledge-metric-list">
                            {METRIC_OPTIONS.map((metric) => (
                              <label key={metric.id} className="knowledge-checkbox-row">
                                <input
                                  type="checkbox"
                                  checked={form.metricIds.includes(metric.id)}
                                  onChange={() => toggleMetric(metric.id)}
                                />
                                <span />
                                <strong>{metric.name}</strong>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="knowledge-transfer-controls" aria-label="Ações de vínculo">
                          <button type="button" onClick={selectAllMetrics} title="Vincular todas">
                            <ArrowRight size={17} />
                          </button>
                          <button type="button" onClick={clearMetrics} title="Remover todas">
                            <ArrowLeft size={17} />
                          </button>
                        </div>

                        <div className="knowledge-metric-panel selected">
                          <div className="knowledge-metric-panel-head">
                            <strong>Métricas vinculadas</strong>
                            <span>{selectedMetrics.length}</span>
                          </div>

                          <div className="knowledge-selected-list">
                            {selectedMetrics.length > 0 ? (
                              selectedMetrics.map((metric) => (
                                <button key={metric.id} type="button" onClick={() => toggleMetric(metric.id)}>
                                  {metric.name}
                                  <X size={13} />
                                </button>
                              ))
                            ) : (
                              <p>Nenhuma métrica vinculada ainda.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div className="knowledge-step-content confirmation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <h4>Você tem certeza que deseja executar esta ação?</h4>

                      <div className="knowledge-confirm-grid">
                        <div>
                          <span>Negócio</span>
                          <strong>{form.name || 'Sem nome'}</strong>
                        </div>
                        <div>
                          <span>Métricas vinculadas</span>
                          <strong>{selectedMetrics.length}</strong>
                        </div>
                      </div>

                      <p>{form.description || 'Nenhuma descrição informada.'}</p>
                    </motion.div>
                  )}
                </div>

                <div className="knowledge-modal-actions">
                  <button type="button" className="btn-secondary" onClick={goBack}>
                    {step === 0 ? 'Cancelar' : 'Voltar'}
                  </button>

                  {step < 2 ? (
                    <button type="button" className="btn-primary" onClick={goNext}>
                      Avançar
                    </button>
                  ) : (
                    <button type="button" className="btn-primary" onClick={saveBusiness}>
                      {wizardMode === 'edit' ? 'Salvar Negócio de Conhecimento' : 'Criar Negócio de Conhecimento'}
                    </button>
                  )}
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
