import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bold, ChevronDown, ChevronLeft, ChevronRight, Italic, Save } from 'lucide-react';

type PillarId =
  | 'genius-zone'
  | 'market-positioning'
  | 'unique-positioning'
  | 'persona-research'
  | 'guide-method'
  | 'universal-offer';

type TextStyle = 'Paragraph' | 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Heading 4' | 'Heading 5' | 'Heading 6';

type PillarContent = {
  text: string;
  style: TextStyle;
  bold: boolean;
  italic: boolean;
  savedAt?: string;
};

const PILLARS: Array<{ id: PillarId; label: string }> = [
  { id: 'genius-zone', label: 'Zona de Genialidade' },
  { id: 'market-positioning', label: 'Posicionamento de Mercado' },
  { id: 'unique-positioning', label: 'Posicionamento Único' },
  { id: 'persona-research', label: 'Investigação da Persona' },
  { id: 'guide-method', label: 'Método Guia' },
  { id: 'universal-offer', label: 'Oferta Universal' },
];

const TEXT_STYLES: TextStyle[] = ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'];

const buildInitialContent = (): Record<PillarId, PillarContent> =>
  PILLARS.reduce((content, pillar) => {
    content[pillar.id] = {
      text: '',
      style: 'Paragraph',
      bold: false,
      italic: false,
    };
    return content;
  }, {} as Record<PillarId, PillarContent>);

export const BusinessPillarsPage = () => {
  const [activePillar, setActivePillar] = useState<PillarId>('genius-zone');
  const [contents, setContents] = useState<Record<PillarId, PillarContent>>(buildInitialContent);
  const [isStyleOpen, setIsStyleOpen] = useState(false);

  const activeContent = contents[activePillar];
  const activeLabel = useMemo(
    () => PILLARS.find((pillar) => pillar.id === activePillar)?.label ?? PILLARS[0].label,
    [activePillar]
  );

  const updateContent = (partial: Partial<PillarContent>) => {
    setContents((current) => ({
      ...current,
      [activePillar]: {
        ...current[activePillar],
        ...partial,
      },
    }));
  };

  const registerContent = () => {
    updateContent({
      savedAt: new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
    });
  };

  const goToAdjacentPillar = (direction: -1 | 1) => {
    const currentIndex = PILLARS.findIndex((pillar) => pillar.id === activePillar);
    const nextIndex = (currentIndex + direction + PILLARS.length) % PILLARS.length;
    setActivePillar(PILLARS[nextIndex].id);
    setIsStyleOpen(false);
  };

  return (
    <section className="pillars-page">
      <nav className="pillars-tabs" aria-label="Pilares do negócio">
        {PILLARS.map((pillar) => (
          <button
            key={pillar.id}
            type="button"
            className={activePillar === pillar.id ? 'active' : ''}
            onClick={() => {
              setActivePillar(pillar.id);
              setIsStyleOpen(false);
            }}
          >
            {pillar.label}
          </button>
        ))}
      </nav>

      <header className="pillars-header">
        <div>
          <p className="eyebrow">Pilar estratégico</p>
          <h2>{activeLabel}</h2>
        </div>

        <div className="pillars-business-switch glass-panel">
          <button type="button" onClick={() => goToAdjacentPillar(-1)} aria-label="Pilar anterior">
            <ChevronLeft size={22} />
          </button>
          <strong>teste</strong>
          <button type="button" onClick={() => goToAdjacentPillar(1)} aria-label="Próximo pilar">
            <ChevronRight size={22} />
          </button>
        </div>
      </header>

      <motion.div
        className="pillar-editor glass-panel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="pillar-editor-toolbar">
          <div className="pillar-style-picker">
            <button
              type="button"
              className={`pillar-style-trigger ${isStyleOpen ? 'open' : ''}`}
              onClick={() => setIsStyleOpen((current) => !current)}
            >
              {activeContent.style}
              <ChevronDown size={17} />
            </button>

            {isStyleOpen && (
              <div className="pillar-style-menu glass-panel">
                {TEXT_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={activeContent.style === style ? 'selected' : ''}
                    onClick={() => {
                      updateContent({ style });
                      setIsStyleOpen(false);
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className={`pillar-format-btn ${activeContent.bold ? 'active' : ''}`}
            onClick={() => updateContent({ bold: !activeContent.bold })}
            aria-label="Negrito"
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            className={`pillar-format-btn ${activeContent.italic ? 'active' : ''}`}
            onClick={() => updateContent({ italic: !activeContent.italic })}
            aria-label="Itálico"
          >
            <Italic size={18} />
          </button>
        </div>

        <div
          key={activePillar}
          className={`pillar-editor-body ${activeContent.style.toLowerCase().replace(/\s/g, '-')} ${activeContent.bold ? 'is-bold' : ''} ${activeContent.italic ? 'is-italic' : ''}`}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={`Escreva sobre ${activeLabel.toLowerCase()}...`}
          onInput={(event) => updateContent({ text: event.currentTarget.innerText })}
        >
          {activeContent.text}
        </div>
      </motion.div>

      <div className="pillars-actions">
        {activeContent.savedAt && (
          <span>Último registro às {activeContent.savedAt}</span>
        )}

        <motion.button
          type="button"
          className="btn-primary pillars-save-btn"
          onClick={registerContent}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={18} />
          Registrar
        </motion.button>
      </div>
    </section>
  );
};
