import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { useAdaptivePageSize } from '../hooks/useAdaptivePageSize';

type AgentArea = 'Operação' | 'Marketing' | 'Vendas' | 'Produto';

type ManagedAgent = {
  id: number;
  name: string;
  assistantId: string;
  description: string;
  prompt: string;
  imageUrl: string;
  externalLink: string;
  area: AgentArea;
  active: boolean;
  promptAgent: boolean;
};

type AgentFormState = Omit<ManagedAgent, 'id'>;

const AREAS: AgentArea[] = ['Operação', 'Marketing', 'Vendas', 'Produto'];

const emptyForm: AgentFormState = {
  name: '',
  assistantId: '',
  description: '',
  prompt: '',
  imageUrl: '',
  externalLink: '',
  area: 'Operação',
  active: true,
  promptAgent: false,
};

const INITIAL_AGENTS: ManagedAgent[] = [
  {
    id: 37,
    name: "B'Agent Sequência de Mensagens Estratégicas",
    assistantId: 'asst_d2MwBgITuE4xjcyJijToOJAn',
    description: '1. Sequência de Mensagens Estratégicas (pré-inscrição) 2. Sequência de Aquecimento',
    prompt: 'Prompt',
    imageUrl: 'https://collection.cloudinary.com/dmahyzkbt/30c22ca616abc37ee5a8382275b51de7',
    externalLink: 'https://chatgpt.com/g/g-67af57dbbb1c81919e5ae5ca758acc34-engajamais-b-experts',
    area: 'Marketing',
    active: true,
    promptAgent: false,
  },
  {
    id: 10,
    name: "B'Agent Meta-Prompt Pesquisa Profunda",
    assistantId: 'asst_7TvtCeQlaaSUK8iLlGruq0Bh',
    description: 'Gerador de prompts para realizar pesquisas profundas com estrutura, critérios e síntese.',
    prompt: 'Prompt',
    imageUrl: '',
    externalLink: '',
    area: 'Produto',
    active: false,
    promptAgent: true,
  },
  {
    id: 1,
    name: "B'Agent Roteiro de Vídeos IA",
    assistantId: 'asst_C7wQAZhEsK1ChBtbooEvTLJS',
    description: "B'Agent Roteiro de Vídeos IA",
    prompt: 'Prompt',
    imageUrl: '',
    externalLink: '',
    area: 'Marketing',
    active: false,
    promptAgent: false,
  },
  {
    id: 2,
    name: "B'Agent Fluxo DM",
    assistantId: 'asst_uUysaqNbz3rpyKe74N90SKXp',
    description: "B'Agent Fluxo DM",
    prompt: 'Prompt',
    imageUrl: '',
    externalLink: '',
    area: 'Marketing',
    active: false,
    promptAgent: false,
  },
  {
    id: 3,
    name: "B'Agent Roteiro VSL",
    assistantId: 'asst_CU71donSjOfqMYgRtoc4XTkz',
    description: "B'Agent Roteiro VSL",
    prompt: 'Prompt',
    imageUrl: '',
    externalLink: '',
    area: 'Marketing',
    active: false,
    promptAgent: false,
  },
  {
    id: 4,
    name: "B'Agent Analisador de Calls de Vendas",
    assistantId: 'asst_w1nRfailX89gHKZjJ5en0YYr',
    description: "B'Agent Analisador de Calls de Vendas",
    prompt: 'Prompt',
    imageUrl: '',
    externalLink: '',
    area: 'Vendas',
    active: false,
    promptAgent: false,
  },
  {
    id: 6,
    name: "B'Agent Estrategista Digital",
    assistantId: 'asst_1PheuuJOhGvd0DtPr2Zyw795',
    description: "B'Agent Estrategista Digital",
    prompt: 'Prompt',
    imageUrl: '',
    externalLink: '',
    area: 'Marketing',
    active: false,
    promptAgent: false,
  },
  {
    id: 9,
    name: "B'Agent - BDR - Abordagem Comercial",
    assistantId: 'asst_ZRhx4hAEmqnlnaZmURn27YNk',
    description: "B'Agent - BDR - Abordagem Comercial",
    prompt: 'Prompt',
    imageUrl: '',
    externalLink: '',
    area: 'Vendas',
    active: false,
    promptAgent: false,
  },
  {
    id: 7,
    name: "B'Agent Expert em Ampliação com IA",
    assistantId: 'asst_aCMMurpp0YEowspy3lah3pHD',
    description: "B'Agent Expert em Ampliação com IA",
    prompt: 'Prompt',
    imageUrl: '',
    externalLink: '',
    area: 'Operação',
    active: false,
    promptAgent: false,
  },
  {
    id: 8,
    name: "B'Agent - Análise e Pesquisa de Potenciais",
    assistantId: 'asst_F0I2LUhWKrMhPogKMqTf0528',
    description: "B'Agent - Análise e Pesquisa de Potenciais",
    prompt: 'Prompt',
    imageUrl: '',
    externalLink: '',
    area: 'Vendas',
    active: false,
    promptAgent: false,
  },
];

const buildAgentSeed = () => {
  const extraAgents = Array.from({ length: 30 }, (_, index) => {
    const area = AREAS[index % AREAS.length];
    return {
      ...INITIAL_AGENTS[index % INITIAL_AGENTS.length],
      id: index + 11,
      name: `${INITIAL_AGENTS[index % INITIAL_AGENTS.length].name} ${index + 1}`,
      area,
      active: index % 5 === 0,
    };
  });

  return [...INITIAL_AGENTS, ...extraAgents];
};

const validateForm = (form: AgentFormState) => ({
  name: form.name.trim() === '',
  assistantId: form.assistantId.trim() === '',
  prompt: form.prompt.trim() === '',
});

const hasErrors = (errors: ReturnType<typeof validateForm>) =>
  Object.values(errors).some(Boolean);

export const ManageAgentsPage = () => {
  const [agents, setAgents] = useState<ManagedAgent[]>(buildAgentSeed);
  const [form, setForm] = useState<AgentFormState>(emptyForm);
  const [touched, setTouched] = useState(false);
  const [page, setPage] = useState(1);
  const [editingAgent, setEditingAgent] = useState<ManagedAgent | null>(null);
  const [editForm, setEditForm] = useState<AgentFormState>(emptyForm);
  const [editTouched, setEditTouched] = useState(false);

  const { containerRef: tablePanelRef, pageSize } = useAdaptivePageSize<HTMLElement>({
    rowHeight: 52,
    minRows: 6,
    maxRows: 20,
  });

  const totalPages = Math.max(1, Math.ceil(agents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageAgents = useMemo(
    () => agents.slice(startIndex, startIndex + pageSize),
    [agents, pageSize, startIndex]
  );

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const updateForm = (field: keyof AgentFormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateEditForm = (field: keyof AgentFormState, value: string | boolean) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const saveAgent = () => {
    const errors = validateForm(form);
    setTouched(true);

    if (hasErrors(errors)) return;

    const nextId = Math.max(...agents.map((agent) => agent.id), 0) + 1;
    setAgents((current) => [{ id: nextId, ...form }, ...current]);
    setForm(emptyForm);
    setTouched(false);
    setPage(1);
  };

  const openEdit = (agent: ManagedAgent) => {
    const { id: _id, ...agentForm } = agent;
    setEditingAgent(agent);
    setEditForm(agentForm);
    setEditTouched(false);
  };

  const closeEdit = () => {
    setEditingAgent(null);
    setEditTouched(false);
  };

  const saveEdit = () => {
    const errors = validateForm(editForm);
    setEditTouched(true);

    if (!editingAgent || hasErrors(errors)) return;

    setAgents((current) =>
      current.map((agent) =>
        agent.id === editingAgent.id ? { id: editingAgent.id, ...editForm } : agent
      )
    );
    closeEdit();
  };

  const deleteAgent = (id: number) => {
    setAgents((current) => current.filter((agent) => agent.id !== id));
  };

  const formErrors = validateForm(form);
  const editErrors = validateForm(editForm);

  return (
    <>
      <header className="page-header agents-page-header">
        <div>
          <p className="eyebrow">Administração</p>
          <h2>Gerenciar <span className="highlight">Agentes</span></h2>
        </div>
      </header>

      <section className="agent-manager-panel glass-panel">
        <div className="agent-form-grid">
          <AgentTextField
            label="Nome do Agente*"
            value={form.name}
            error={touched && formErrors.name}
            onChange={(value) => updateForm('name', value)}
          />
          <AgentTextField
            label="ID do Assistant*"
            value={form.assistantId}
            error={touched && formErrors.assistantId}
            onChange={(value) => updateForm('assistantId', value)}
          />
        </div>

        <AgentTextField
          label="Descrição"
          value={form.description}
          onChange={(value) => updateForm('description', value)}
        />

        <AgentTextField
          label="Prompt*"
          value={form.prompt}
          error={touched && formErrors.prompt}
          onChange={(value) => updateForm('prompt', value)}
          textarea
        />

        <AgentTextField
          label="URL da Imagem do Agente"
          value={form.imageUrl}
          onChange={(value) => updateForm('imageUrl', value)}
        />

        <AgentTextField
          label="Link Externo (opcional)"
          value={form.externalLink}
          onChange={(value) => updateForm('externalLink', value)}
        />

        <div className="agent-form-bottom">
          <label className="agent-field agent-select-field">
            <span>Área</span>
            <select value={form.area} onChange={(event) => updateForm('area', event.target.value)}>
              {AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <ChevronDown size={18} />
          </label>

          <div className="agent-toggle-group">
            <AgentSwitch
              label="Agente Ativo"
              checked={form.active}
              onChange={(value) => updateForm('active', value)}
            />
            <AgentSwitch
              label="Agente Prompt"
              checked={form.promptAgent}
              onChange={(value) => updateForm('promptAgent', value)}
            />
          </div>
        </div>

        <button type="button" className="btn-primary agent-save-main" onClick={saveAgent}>
          <Save size={17} />
          Salvar
        </button>
      </section>

      <section ref={tablePanelRef} className="agents-table-panel glass-panel">
        <div className="agents-table-wrap">
          <table className="agents-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome do Agente</th>
                <th>ID do Assistant</th>
                <th>Descrição</th>
                <th>Área</th>
                <th>Link Externo</th>
                <th>Ativo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pageAgents.map((agent) => (
                <tr key={agent.id}>
                  <td>{agent.id}</td>
                  <td className="agent-table-name">{agent.name}</td>
                  <td>{agent.assistantId}</td>
                  <td>{agent.description}</td>
                  <td><span className="area-pill">{agent.area}</span></td>
                  <td>
                    {agent.externalLink ? (
                      <a href={agent.externalLink} target="_blank" rel="noreferrer">Abrir link</a>
                    ) : (
                      <span className="agent-muted">Sem link</span>
                    )}
                  </td>
                  <td>
                    <span className={`agent-status ${agent.active ? 'active' : ''}`}>
                      {agent.active && <Check size={13} />}
                    </span>
                  </td>
                  <td>
                    <div className="metrics-actions">
                      <button type="button" className="metrics-action-btn" onClick={() => openEdit(agent)}>
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button type="button" className="metrics-action-btn danger" onClick={() => deleteAgent(agent.id)}>
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

        <div className="metrics-table-footer">
          <span>Rows per page: {pageSize}</span>
          <span>{agents.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, agents.length)} of {agents.length}</span>
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
          {editingAgent && (
            <motion.div
              className="metrics-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="agent-edit-modal glass-panel"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <button type="button" className="metrics-modal-close" onClick={closeEdit}>
                  <X size={18} />
                </button>
                <h3>Editar Agente</h3>

                <AgentFormFields
                  form={editForm}
                  touched={editTouched}
                  errors={editErrors}
                  onChange={updateEditForm}
                />

                <div className="agent-modal-actions">
                  <button type="button" className="btn-secondary agent-cancel-btn" onClick={closeEdit}>Cancelar</button>
                  <button type="button" className="btn-primary agent-confirm-btn" onClick={saveEdit}>Salvar</button>
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

const AgentFormFields = ({
  form,
  touched,
  errors,
  onChange,
}: {
  form: AgentFormState;
  touched: boolean;
  errors: ReturnType<typeof validateForm>;
  onChange: (field: keyof AgentFormState, value: string | boolean) => void;
}) => (
  <>
    <AgentTextField
      label="Nome do Agente*"
      value={form.name}
      error={touched && errors.name}
      onChange={(value) => onChange('name', value)}
    />
    <AgentTextField
      label="ID do Assistant*"
      value={form.assistantId}
      error={touched && errors.assistantId}
      onChange={(value) => onChange('assistantId', value)}
    />
    <AgentTextField
      label="Descrição"
      value={form.description}
      onChange={(value) => onChange('description', value)}
    />
    <AgentTextField
      label="Prompt*"
      value={form.prompt}
      error={touched && errors.prompt}
      onChange={(value) => onChange('prompt', value)}
      textarea
    />
    <AgentTextField
      label="URL da Imagem do Agente"
      value={form.imageUrl}
      onChange={(value) => onChange('imageUrl', value)}
    />
    <AgentTextField
      label="Link Externo (opcional)"
      value={form.externalLink}
      onChange={(value) => onChange('externalLink', value)}
    />
    <div className="agent-form-bottom modal">
      <label className="agent-field agent-select-field">
        <span>Área</span>
        <select value={form.area} onChange={(event) => onChange('area', event.target.value)}>
          {AREAS.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
        <ChevronDown size={18} />
      </label>

      <div className="agent-toggle-group">
        <AgentSwitch label="Agente Ativo" checked={form.active} onChange={(value) => onChange('active', value)} />
        <AgentSwitch label="Agente Prompt" checked={form.promptAgent} onChange={(value) => onChange('promptAgent', value)} />
      </div>
    </div>
  </>
);

const AgentTextField = ({
  label,
  value,
  error,
  textarea,
  onChange,
}: {
  label: string;
  value: string;
  error?: boolean;
  textarea?: boolean;
  onChange: (value: string) => void;
}) => (
  <label className={`agent-field ${error ? 'error' : ''}`}>
    <span>{label}</span>
    {textarea ? (
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    ) : (
      <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />
    )}
    {error && <small>Campo obrigatório</small>}
  </label>
);

const AgentSwitch = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="agent-switch">
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span className="agent-switch-track" />
    <strong>{label}</strong>
  </label>
);
