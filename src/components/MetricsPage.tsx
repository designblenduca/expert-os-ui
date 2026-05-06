import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useAdaptivePageSize } from '../hooks/useAdaptivePageSize';

type Area = 'Operações' | 'Marketing' | 'Vendas' | 'Produto';

type Metric = {
  id: number;
  area: Area;
  name: string;
};

type MetricsPageProps = {
  openCreateOnMount?: boolean;
};

const AREAS: Area[] = ['Operações', 'Marketing', 'Vendas', 'Produto'];

const INITIAL_METRICS: Metric[] = [
  { id: 1, area: 'Operações', name: 'Taxa de Conversão' },
  { id: 2, area: 'Operações', name: 'Custo por Aquisição (CAC)' },
  { id: 3, area: 'Operações', name: 'ROI de Campanhas' },
  { id: 4, area: 'Operações', name: 'Quantidade de parceiros diretos' },
  { id: 5, area: 'Operações', name: 'Custos & Despesas' },
  { id: 6, area: 'Marketing', name: 'Leads Qualificados' },
  { id: 7, area: 'Marketing', name: 'Taxa de Abertura' },
  { id: 8, area: 'Marketing', name: 'Custo por Lead' },
  { id: 9, area: 'Marketing', name: 'Alcance Orgânico' },
  { id: 10, area: 'Marketing', name: 'Engajamento por Conteúdo' },
  { id: 11, area: 'Vendas', name: 'Receita Recorrente Mensal' },
  { id: 12, area: 'Vendas', name: 'Ticket Médio' },
  { id: 13, area: 'Vendas', name: 'Ciclo Médio de Venda' },
  { id: 14, area: 'Vendas', name: 'Taxa de Fechamento' },
  { id: 15, area: 'Vendas', name: 'Pipeline Ponderado' },
  { id: 16, area: 'Produto', name: 'NPS' },
  { id: 17, area: 'Produto', name: 'Ativação de Usuários' },
  { id: 18, area: 'Produto', name: 'Retenção Mensal' },
  { id: 19, area: 'Produto', name: 'Churn' },
  { id: 20, area: 'Produto', name: 'Uso de Funcionalidades-Chave' },
];

export const MetricsPage = ({ openCreateOnMount = false }: MetricsPageProps) => {
  const [metrics, setMetrics] = useState<Metric[]>(INITIAL_METRICS);
  const [query, setQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState<Area | 'Todas'>('Todas');
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [formName, setFormName] = useState('');
  const [formArea, setFormArea] = useState<Area>('Operações');
  const [nameTouched, setNameTouched] = useState(false);
  const [isAreaOpen, setIsAreaOpen] = useState(false);

  const { containerRef: tablePanelRef, pageSize } = useAdaptivePageSize<HTMLElement>({
    rowHeight: 58,
    minRows: 5,
    maxRows: 20,
  });

  useEffect(() => {
    if (openCreateOnMount) {
      openCreateModal();
    }
  }, [openCreateOnMount]);

  const filteredMetrics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return metrics.filter((metric) => {
      const matchesArea = areaFilter === 'Todas' || metric.area === areaFilter;
      const matchesSearch =
        normalizedQuery === '' ||
        metric.name.toLowerCase().includes(normalizedQuery) ||
        metric.area.toLowerCase().includes(normalizedQuery);

      return matchesArea && matchesSearch;
    });
  }, [areaFilter, metrics, query]);

  const totalPages = Math.max(1, Math.ceil(filteredMetrics.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMetrics = filteredMetrics.slice(startIndex, startIndex + pageSize);
  const showingFrom = filteredMetrics.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + pageSize, filteredMetrics.length);

  useEffect(() => {
    setPage(1);
  }, [areaFilter, query]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const openCreateModal = () => {
    setSelectedMetric(null);
    setFormName('');
    setFormArea('Operações');
    setNameTouched(false);
    setIsAreaOpen(false);
    setModalMode('create');
  };

  const openEditModal = (metric: Metric) => {
    setSelectedMetric(metric);
    setFormName(metric.name);
    setFormArea(metric.area);
    setNameTouched(false);
    setIsAreaOpen(false);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedMetric(null);
    setIsAreaOpen(false);
  };

  const saveMetric = () => {
    const trimmedName = formName.trim();
    setNameTouched(true);

    if (!trimmedName) {
      return;
    }

    if (modalMode === 'edit' && selectedMetric) {
      setMetrics((current) =>
        current.map((metric) =>
          metric.id === selectedMetric.id
            ? { ...metric, area: formArea, name: trimmedName }
            : metric
        )
      );
    }

    if (modalMode === 'create') {
      const nextId = metrics.length ? Math.max(...metrics.map((metric) => metric.id)) + 1 : 1;
      setMetrics((current) => [...current, { id: nextId, area: formArea, name: trimmedName }]);
    }

    closeModal();
  };

  const deleteMetric = (id: number) => {
    setMetrics((current) => current.filter((metric) => metric.id !== id));
  };

  const hasNameError = nameTouched && formName.trim() === '';
  const modalTitle = modalMode === 'edit' ? 'Editar Métrica' : 'Cadastro de Métricas';
  const modalCta = modalMode === 'edit' ? 'Salvar Alterações' : 'Criar Métrica';

  return (
    <>
      <header className="page-header metrics-page-header">
        <div>
          <p className="eyebrow">Métricas</p>
          <h2>Novas <span className="highlight">Métricas</span></h2>
        </div>
        <motion.button
          type="button"
          className="btn-primary metrics-create-btn"
          onClick={openCreateModal}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Criar Nova Métrica
        </motion.button>
      </header>

      <section className="metrics-toolbar">
        <div className="metrics-search glass-panel">
          <Search size={18} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar métrica ou área"
          />
        </div>

        <div className="metrics-filter-group" aria-label="Filtrar por área">
          {(['Todas', ...AREAS] as Array<Area | 'Todas'>).map((area) => (
            <button
              key={area}
              type="button"
              className={`metrics-filter ${areaFilter === area ? 'active' : ''}`}
              onClick={() => setAreaFilter(area)}
            >
              {area}
            </button>
          ))}
        </div>
      </section>

      <motion.section
        ref={tablePanelRef}
        className="metrics-table-panel glass-panel"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="metrics-table-wrap">
          <table className="metrics-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Área</th>
                <th>Métrica</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMetrics.map((metric) => (
                  <tr
                    key={metric.id}
                  >
                    <td>{metric.id}</td>
                    <td>
                      <span className="area-pill">{metric.area}</span>
                    </td>
                    <td className="metric-name-cell">{metric.name}</td>
                    <td>
                      <div className="metrics-actions">
                        <button
                          type="button"
                          className="metrics-action-btn"
                          onClick={() => openEditModal(metric)}
                          title="Editar métrica"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                        <button
                          type="button"
                          className="metrics-action-btn danger"
                          onClick={() => deleteMetric(metric.id)}
                          title="Excluir métrica"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {paginatedMetrics.length === 0 && (
          <div className="metrics-empty-state">
            <AlertCircle size={28} />
            <h3>Nenhuma métrica encontrada</h3>
          </div>
        )}

        <div className="metrics-table-footer">
          <span>Rows per page: {pageSize}</span>
          <span>{showingFrom}-{showingTo} of {filteredMetrics.length}</span>
          <div className="pagination-controls">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              title="Página anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
              title="Próxima página"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.section>

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
                className="metrics-modal glass-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="metrics-modal-title"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <button
                  type="button"
                  className="metrics-modal-close"
                  onClick={closeModal}
                  title="Fechar"
                >
                  <X size={18} />
                </button>

                <h3 id="metrics-modal-title">{modalTitle}</h3>

                <label className={`metrics-field ${hasNameError ? 'error' : ''}`}>
                  <span>Nome da Métrica*</span>
                  <input
                    autoFocus
                    type="text"
                    value={formName}
                    onChange={(event) => setFormName(event.target.value)}
                    onBlur={() => setNameTouched(true)}
                    placeholder="Ex.: Taxa de Conversão"
                  />
                  {hasNameError && <small>Campo obrigatório</small>}
                </label>

                <div className="metrics-field metrics-select-field">
                  <span>Área</span>
                  <button
                    type="button"
                    className={`metrics-select-trigger ${isAreaOpen ? 'open' : ''}`}
                    onClick={() => setIsAreaOpen((isOpen) => !isOpen)}
                  >
                    {formArea}
                    <ChevronDown size={20} />
                  </button>

                  <AnimatePresence>
                    {isAreaOpen && (
                      <motion.div
                        className="metrics-select-menu glass-panel"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                      >
                        {AREAS.map((area) => (
                          <button
                            key={area}
                            type="button"
                            className={formArea === area ? 'selected' : ''}
                            onClick={() => {
                              setFormArea(area);
                              setIsAreaOpen(false);
                            }}
                          >
                            {area}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button type="button" className="btn-primary metrics-submit-btn" onClick={saveMetric}>
                  {modalCta}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
