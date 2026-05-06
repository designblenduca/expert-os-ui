import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Bot, Megaphone, Package, RefreshCw, Search, Users } from 'lucide-react';

type AgentCategory = 'operations' | 'marketing' | 'sales' | 'product';

type Agent = {
  id: string;
  categoryId: AgentCategory;
  name: string;
  description: string;
  tags: string[];
  imageVariant: number;
};

const CHATGPT_URL = 'https://chatgpt.com/';

const CATEGORIES = [
  {
    id: 'operations',
    label: 'Operação',
    description: 'Área de Operação',
    count: 5,
    icon: RefreshCw,
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Área de Marketing',
    count: 10,
    icon: Megaphone,
  },
  {
    id: 'sales',
    label: 'Vendas',
    description: 'Área de Vendas',
    count: 5,
    icon: BarChart3,
  },
  {
    id: 'product',
    label: 'Produto',
    description: 'Área de Produto',
    count: 5,
    icon: Package,
  },
] as const;

const AGENTS: Agent[] = [
  {
    id: 'proposal-generator',
    categoryId: 'operations',
    name: "B'Agent Gerador de Proposta Comercial",
    description: 'Crie uma proposta comercial a partir do seu posicionamento, pesquisa de persona, oferta e tom de voz.',
    tags: ['Operações', 'IA'],
    imageVariant: 1,
  },
  {
    id: 'positioning-agent',
    categoryId: 'operations',
    name: "B'Agent Posicionamento Único",
    description: 'Mostra quem você é, o que sabe e como se posicionar com clareza comercial no seu mercado.',
    tags: ['Operações', 'Persona'],
    imageVariant: 2,
  },
  {
    id: 'mentorship-transcript',
    categoryId: 'operations',
    name: "B'Agent De Análise De Transcrição De Mentoria",
    description: 'Transforma conversas e mentorias em pontos de ação, plano prático e próximos passos.',
    tags: ['IA'],
    imageVariant: 3,
  },
  {
    id: 'agent-builder',
    categoryId: 'operations',
    name: "B'Agent Gerador de Agentes de IA",
    description: 'Especialista em engenharia de prompts para ajudar você a criar agentes de IA sob medida.',
    tags: ['Operações'],
    imageVariant: 4,
  },
  {
    id: 'workflow-map',
    categoryId: 'operations',
    name: "B'Agent Mapa de Processos",
    description: 'Organize processos, gargalos e automações em um fluxo operacional mais simples de executar.',
    tags: ['Operações'],
    imageVariant: 5,
  },
  {
    id: 'strategic-sequence',
    categoryId: 'marketing',
    name: "B'Agent Sequência de Mensagens Estratégicas",
    description: 'Cria sequências de mensagens para inscrição, aquecimento e conversão em campanhas.',
    tags: ['Marketing'],
    imageVariant: 6,
  },
  {
    id: 'bdr-approach',
    categoryId: 'marketing',
    name: "B'Agent BDR E Abordagem Comercial",
    description: 'Apoia abordagens, scripts e argumentos para prospecção com mais precisão.',
    tags: ['Marketing', 'Vendas'],
    imageVariant: 7,
  },
  {
    id: 'linguistic-patterns',
    categoryId: 'marketing',
    name: "B'Agent Extrator De Padrões Linguísticos",
    description: 'Extrai padrões de fala, palavras e objeções para fortalecer sua mensagem comercial.',
    tags: ['Marketing'],
    imageVariant: 8,
  },
  {
    id: 'photoshoot',
    categoryId: 'marketing',
    name: 'Agente Photoshoot',
    description: 'Ajuda a criar, analisar ou descrever imagens com nível profissional para campanhas.',
    tags: ['Marketing'],
    imageVariant: 9,
  },
  {
    id: 'content-calendar',
    categoryId: 'marketing',
    name: "B'Agent Calendário Editorial",
    description: 'Planeja pautas, cadência e intenção de conteúdo para diferentes canais.',
    tags: ['Marketing'],
    imageVariant: 10,
  },
  {
    id: 'creative-hooks',
    categoryId: 'marketing',
    name: "B'Agent Ganchos Criativos",
    description: 'Gera ideias de criativos e ganchos para anúncios, posts e vídeos curtos.',
    tags: ['Marketing'],
    imageVariant: 11,
  },
  {
    id: 'offer-universal',
    categoryId: 'sales',
    name: "B'Agent Oferta Universal",
    description: 'Transforma o que você vende em uma oferta clara, desejável e fácil de entender.',
    tags: ['Vendas'],
    imageVariant: 12,
  },
  {
    id: 'sales-proposal',
    categoryId: 'sales',
    name: "B'Agent Gerador De Proposta Comercial",
    description: 'Converte diagnóstico e contexto comercial em proposta persuasiva e objetiva.',
    tags: ['Vendas'],
    imageVariant: 1,
  },
  {
    id: 'dm-flow',
    categoryId: 'sales',
    name: "B'Agent Fluxo DM",
    description: 'Transforma conversas em mensagens estratégicas para Direct, WhatsApp e follow-up.',
    tags: ['Vendas'],
    imageVariant: 13,
  },
  {
    id: 'sales-call-analyzer',
    categoryId: 'sales',
    name: "B'Agent Agente Analisador De Calls De Vendas",
    description: 'Analisa reuniões comerciais, objeções e oportunidades para melhorar fechamento.',
    tags: ['Vendas'],
    imageVariant: 14,
  },
  {
    id: 'closer-script',
    categoryId: 'sales',
    name: "B'Agent Script de Fechamento",
    description: 'Estrutura perguntas, argumentos e próximos passos para fechar com mais segurança.',
    tags: ['Vendas'],
    imageVariant: 15,
  },
  {
    id: 'guide-method',
    categoryId: 'product',
    name: "B'Agent Método Guia",
    description: 'Organiza o seu método em uma estrutura comercializável, clara e sem perder essência.',
    tags: ['Produto'],
    imageVariant: 16,
  },
  {
    id: 'knowledge-base',
    categoryId: 'product',
    name: "B'Agent Base de Conhecimento",
    description: 'Transforma conteúdos soltos em aulas, módulos, frameworks e materiais de apoio.',
    tags: ['Produto'],
    imageVariant: 17,
  },
  {
    id: 'expert-dna',
    categoryId: 'product',
    name: "B'Agent DNA do Expert",
    description: 'Converte experiência e trajetória em posicionamento, método e diferenciais.',
    tags: ['Produto'],
    imageVariant: 18,
  },
  {
    id: 'meta-prompt',
    categoryId: 'product',
    name: "B'Agent Meta-Prompt Expert",
    description: 'Cria prompts avançados para extrair máximo desempenho de qualquer agente.',
    tags: ['Produto'],
    imageVariant: 19,
  },
  {
    id: 'product-sprint',
    categoryId: 'product',
    name: "B'Agent Sprint de Produto",
    description: 'Ajuda a validar módulos, entregáveis e melhorias com foco em experiência.',
    tags: ['Produto'],
    imageVariant: 20,
  },
];

export const IntelligenceCenter = ({
  searchTerm,
  setSearchTerm,
}: any) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const agentsByCategory = useMemo(() => {
    return CATEGORIES.reduce<Record<AgentCategory, Agent[]>>((acc, category) => {
      acc[category.id] = AGENTS.filter((agent) => {
        const matchesCategory = agent.categoryId === category.id;
        const matchesSearch =
          normalizedSearch === '' ||
          agent.name.toLowerCase().includes(normalizedSearch) ||
          agent.description.toLowerCase().includes(normalizedSearch) ||
          agent.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));

        return matchesCategory && matchesSearch;
      });

      return acc;
    }, {} as Record<AgentCategory, Agent[]>);
  }, [normalizedSearch]);

  const scrollToCategory = (categoryId: AgentCategory) => {
    document.getElementById(`agents-${categoryId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const openAgent = () => {
    window.open(CHATGPT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="intelligence-page">
      <header className="intelligence-hero">
        <p className="eyebrow">Agentes especialistas</p>
        <h2>Central de <span className="highlight">Inteligência</span></h2>
        <p className="subtitle">Explore nossos agentes e especializações para potencializar seu negócio.</p>
      </header>

      <div className="search-container intelligence-search glass-panel">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Buscar agentes por nome, descrição ou função..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="search-input"
        />
      </div>

      <section className="intelligence-specialties" aria-label="Áreas de especialização">
        <div className="intelligence-section-heading">
          <h3>Áreas de Especialização</h3>
        </div>

        <div className="specialty-grid">
          {CATEGORIES.map((category, index) => (
            <motion.button
              key={category.id}
              type="button"
              className="specialty-card glass-panel"
              onClick={() => scrollToCategory(category.id)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="specialty-icon">
                <category.icon size={24} />
              </span>
              <strong>{category.label}</strong>
              <small>{category.description}</small>
              <em>{category.count} agentes</em>
            </motion.button>
          ))}
        </div>
      </section>

      <div className="agent-sections">
        {CATEGORIES.map((category) => {
          const categoryAgents = agentsByCategory[category.id];

          return (
            <section
              key={category.id}
              id={`agents-${category.id}`}
              className="agent-category-section"
            >
              <div className="agent-section-header">
                <div>
                  <h3>{category.label}</h3>
                  <span>{category.count} agentes</span>
                </div>
                <div className="agent-chips">
                  <span>Todos</span>
                  <span>{category.label}</span>
                </div>
              </div>

              {categoryAgents.length > 0 ? (
                <>
                  <div className="agent-rail" aria-label={`Agentes de ${category.label}`}>
                    {categoryAgents.map((agent) => (
                      <motion.button
                        key={agent.id}
                        type="button"
                        className="intelligence-agent-card glass-panel"
                        onClick={openAgent}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`agent-image-placeholder variant-${agent.imageVariant}`}>
                          <Bot size={34} />
                          <span />
                        </div>
                        <div className="agent-card-body">
                          <small>AGENTE</small>
                          <h4>{agent.name}</h4>
                          <p>{agent.description}</p>
                          <div className="agent-card-tags">
                            {agent.tags.map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                    <button type="button" className="rail-next-btn" onClick={() => scrollToCategory(category.id)} title="Ver mais">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                  <div className="rail-hint">Arraste para ver mais agentes</div>
                </>
              ) : (
                <div className="empty-state glass-panel">
                  <Users size={42} className="empty-icon" />
                  <h4>Nenhum agente encontrado</h4>
                  <p>Não encontramos agentes nesta área para a busca atual.</p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
