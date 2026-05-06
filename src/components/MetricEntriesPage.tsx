import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Save,
} from 'lucide-react';
import { useAdaptivePageSize } from '../hooks/useAdaptivePageSize';

type EntryArea = 'Operação' | 'Marketing' | 'Vendas' | 'Produto';

type MetricEntry = {
  id: number;
  area: EntryArea;
  name: string;
};

type MonthOption = {
  label: string;
  year: number;
};

const AREAS: EntryArea[] = ['Operação', 'Marketing', 'Vendas', 'Produto'];

const MONTHS: MonthOption[] = [
  { label: 'Março', year: 2026 },
  { label: 'Abril', year: 2026 },
  { label: 'Maio', year: 2026 },
  { label: 'Junho', year: 2026 },
  { label: 'Julho', year: 2026 },
];

const BUSINESSES = ['ExpertOS', 'B Vision', 'Operação Principal'];

const BASE_METRICS: Record<EntryArea, string[]> = {
  Operação: [
    'Taxa de Conversão',
    'Custo por Aquisição (CAC)',
    'ROI de Campanhas',
    'Quantidade de parceiros diretos',
    'Custos & Despesas',
  ],
  Marketing: [
    'Leads Qualificados',
    'Taxa de Abertura',
    'Custo por Lead',
    'Alcance Orgânico',
    'Engajamento por Conteúdo',
  ],
  Vendas: [
    'Receita Recorrente Mensal',
    'Ticket Médio',
    'Ciclo Médio de Venda',
    'Taxa de Fechamento',
    'Pipeline Ponderado',
  ],
  Produto: [
    'NPS',
    'Ativação de Usuários',
    'Retenção Mensal',
    'Churn',
    'Uso de Funcionalidades-Chave',
  ],
};

const buildEntries = (): MetricEntry[] => {
  return AREAS.flatMap((area) =>
    Array.from({ length: area === 'Operação' ? 34 : 33 }, (_, index) => {
      const names = BASE_METRICS[area];
      return {
        id: index + 1,
        area,
        name: names[index % names.length],
      };
    })
  );
};

const metricEntries = buildEntries();

export const MetricEntriesPage = () => {
  const [activeArea, setActiveArea] = useState<EntryArea>('Operação');
  const [monthIndex, setMonthIndex] = useState(2);
  const [businessIndex, setBusinessIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedRowKey, setSelectedRowKey] = useState('Operação-1-2');
  const [savedRows, setSavedRows] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<Record<string, { realized: number; goal: number }>>({
    'Operação-1-2': { realized: 72, goal: 100 },
    'Operação-2-2': { realized: 48, goal: 80 },
    'Operação-3-2': { realized: 31, goal: 45 },
  });

  const { containerRef: tablePanelRef, pageSize } = useAdaptivePageSize<HTMLElement>({
    rowHeight: 40,
    minRows: 5,
    maxRows: 20,
  });
  const currentMonth = MONTHS[monthIndex];
  const currentBusiness = BUSINESSES[businessIndex];

  const visibleEntries = useMemo(
    () => metricEntries.filter((entry) => entry.area === activeArea),
    [activeArea]
  );

  const totalPages = Math.max(1, Math.ceil(visibleEntries.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageEntries = visibleEntries.slice(startIndex, startIndex + pageSize);
  const selectedCount = selectedRowKey.startsWith(activeArea) ? 1 : 0;

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const moveMonth = (direction: -1 | 1) => {
    setMonthIndex((current) => {
      const nextMonth = Math.min(MONTHS.length - 1, Math.max(0, current + direction));
      setSelectedRowKey(`${activeArea}-1-${nextMonth}`);
      return nextMonth;
    });
  };

  const moveBusiness = (direction: -1 | 1) => {
    setBusinessIndex((current) =>
      (current + direction + BUSINESSES.length) % BUSINESSES.length
    );
  };

  const handleAreaChange = (area: EntryArea) => {
    setActiveArea(area);
    setPage(1);
    setSelectedRowKey(`${area}-1-${monthIndex}`);
  };

  const getRowKey = (entry: MetricEntry) => `${entry.area}-${entry.id}-${monthIndex}`;

  const updateValue = (entry: MetricEntry, field: 'realized' | 'goal', value: string) => {
    const rowKey = getRowKey(entry);
    const numericValue = Number(value);

    setValues((current) => ({
      ...current,
      [rowKey]: {
        realized: current[rowKey]?.realized ?? 0,
        goal: current[rowKey]?.goal ?? 0,
        [field]: Number.isNaN(numericValue) ? 0 : numericValue,
      },
    }));

    setSavedRows((current) => ({ ...current, [rowKey]: false }));
  };

  const saveRow = (entry: MetricEntry) => {
    const rowKey = getRowKey(entry);
    setSavedRows((current) => ({ ...current, [rowKey]: true }));
  };

  return (
    <>
      <section className="entry-tabs" aria-label="Áreas de métricas">
        {AREAS.map((area) => (
          <button
            key={area}
            type="button"
            className={activeArea === area ? 'active' : ''}
            onClick={() => handleAreaChange(area)}
          >
            {area}
          </button>
        ))}
      </section>

      <header className="metric-entry-header">
        <div>
          <p className="eyebrow">Lançamento mensal</p>
          <h2>Cadastro de Métricas - <span className="highlight">{activeArea.toUpperCase()}</span></h2>
        </div>

        <div className="entry-period-controls">
          <div className="entry-control-pill glass-panel">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              disabled={monthIndex === 0}
              title="Mês anterior"
            >
              <ArrowLeft size={18} />
            </button>
            <strong>{currentMonth.label} {currentMonth.year}</strong>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              disabled={monthIndex === MONTHS.length - 1}
              title="Próximo mês"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="entry-control-pill business glass-panel">
            <button type="button" onClick={() => moveBusiness(-1)} title="Negócio anterior">
              <ArrowLeft size={18} />
            </button>
            <span>
              <Building2 size={16} />
              {currentBusiness}
            </span>
            <button type="button" onClick={() => moveBusiness(1)} title="Próximo negócio">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </header>

      <motion.section
        className="entry-help-panel glass-panel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Info size={20} />
        <div>
          <p>Aqui você pode cadastrar os dados de uma métrica e definir metas realistas mensalmente para acompanhar o seu negócio.</p>
          <ul>
            <li>Use as setas no mês acima para navegar entre os dados mensais</li>
            <li>Selecione o seu negócio ao lado do botão dos meses</li>
            <li>Clique no ícone das ações para registrar seus dados</li>
          </ul>
        </div>
      </motion.section>

      <motion.section
        ref={tablePanelRef}
        className="metric-entry-table-panel glass-panel"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="entry-table-wrap">
          <table className="entry-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome da Métrica</th>
                <th>Valor Realizado</th>
                <th>Valor Meta</th>
                <th>Atingido</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {pageEntries.map((entry) => {
                  const rowKey = getRowKey(entry);
                  const entryValues = values[rowKey] ?? { realized: 0, goal: 0 };
                  const achieved =
                    entryValues.goal > 0
                      ? Math.min(100, Math.round((entryValues.realized / entryValues.goal) * 100))
                      : 0;
                  const isSelected = selectedRowKey === rowKey;
                  const isSaved = savedRows[rowKey];

                return (
                  <tr
                      key={rowKey}
                      className={isSelected ? 'selected' : ''}
                      onClick={() => setSelectedRowKey(rowKey)}
                    >
                      <td>{entry.id}</td>
                      <td className="entry-name-cell">{entry.name}</td>
                      <td>
                        <input
                          type="number"
                          value={entryValues.realized}
                          onChange={(event) => updateValue(entry, 'realized', event.target.value)}
                          aria-label={`Valor realizado de ${entry.name}`}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={entryValues.goal}
                          onChange={(event) => updateValue(entry, 'goal', event.target.value)}
                          aria-label={`Valor meta de ${entry.name}`}
                        />
                      </td>
                      <td>
                        <div className="achievement-cell">
                          <div className="achievement-bar">
                            <span style={{ width: `${achieved}%` }} />
                          </div>
                          <strong>{achieved}%</strong>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`entry-save-btn ${isSaved ? 'saved' : ''}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            saveRow(entry);
                          }}
                          title="Registrar dados"
                        >
                          {isSaved ? <Check size={18} /> : <Save size={18} />}
                        </button>
                      </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="entry-table-footer">
          <span>{selectedCount} row selected</span>
          <div className="entry-footer-meta">
            <span>Rows per page: {pageSize}</span>
            <span>{startIndex + 1}-{Math.min(startIndex + pageSize, visibleEntries.length)} of 167</span>
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
        </div>
      </motion.section>
    </>
  );
};
