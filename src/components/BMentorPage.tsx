import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  streaming?: boolean;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: "Olá! Eu sou o B', a Inteligência Artificial da Blenduca, como posso te ajudar hoje?",
  },
];

const growthAnswer = `Para impulsionar seu negócio, é fundamental adotar estratégias que engajem seu público e gerem conversões. Uma abordagem eficaz é implementar ofertas de impulso, que são produtos de entrada criados para transformar contatos em clientes. Essas ofertas devem ser rápidas, com duração de 7 a 10 dias, e focar em resolver uma dor específica do seu público. Isso não apenas gera vendas imediatas, mas também ajuda a nutrir relacionamentos com potenciais clientes.

Além disso, criar um motor de crescimento através de conteúdo é essencial. Utilize plataformas como Instagram, newsletters e comunidades para atrair seguidores, converter leads e nutrir esses contatos com informações valiosas. O uso de automação e inteligência artificial pode otimizar esses processos, permitindo que você se concentre em construir relacionamentos significativos com seus clientes.

Para aprofundar mais no assunto, recomendo o vídeo "Estratégias de Crescimento e Ofertas de Impulso", onde você encontrará insights práticos sobre como implementar essas táticas no seu negócio.`;

const fallbackAnswer = `Boa pergunta. Para avançar com clareza, eu começaria organizando o problema em três partes: objetivo, gargalo atual e próxima ação mensurável.

Primeiro, defina qual resultado você quer melhorar nos próximos 30 dias. Depois, identifique onde o processo trava hoje: aquisição, conversão, entrega, retenção ou oferta. Com isso em mãos, escolha uma ação pequena o suficiente para ser executada esta semana e importante o suficiente para gerar aprendizado real.

Se quiser, me diga um pouco mais sobre seu negócio, público e principal meta atual que eu te ajudo a transformar isso em um plano prático.`;

const getMentorAnswer = (question: string) => {
  const normalizedQuestion = question.toLowerCase();

  if (
    normalizedQuestion.includes('impulsionar') ||
    normalizedQuestion.includes('crescer') ||
    normalizedQuestion.includes('negócio') ||
    normalizedQuestion.includes('negocio')
  ) {
    return growthAnswer;
  }

  return fallbackAnswer;
};

export const BMentorPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messageIdRef = useRef(2);
  const streamIntervalRef = useRef<number | null>(null);
  const thinkingTimeoutRef = useRef<number | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isThinking]);

  useEffect(() => () => {
    if (streamIntervalRef.current) {
      window.clearInterval(streamIntervalRef.current);
    }
    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
    }
  }, []);

  const stopPendingResponse = () => {
    if (streamIntervalRef.current) {
      window.clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }

    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
  };

  const resetChat = () => {
    stopPendingResponse();
    setMessages(INITIAL_MESSAGES);
    setInputValue('');
    setIsThinking(false);
    messageIdRef.current = 2;
  };

  const streamAnswer = (answer: string) => {
    const assistantId = messageIdRef.current++;
    let cursor = 0;

    setMessages((current) => [
      ...current,
      { id: assistantId, role: 'assistant', content: '', streaming: true },
    ]);

    streamIntervalRef.current = window.setInterval(() => {
      cursor += 4;
      const nextContent = answer.slice(0, cursor);
      const isComplete = cursor >= answer.length;

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, content: nextContent, streaming: !isComplete }
            : message
        )
      );

      if (isComplete && streamIntervalRef.current) {
        window.clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    }, 18);
  };

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();

    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isThinking || streamIntervalRef.current) return;

    const userMessage: ChatMessage = {
      id: messageIdRef.current++,
      role: 'user',
      content: trimmedInput,
    };

    setMessages((current) => [...current, userMessage]);
    setInputValue('');
    setIsThinking(true);

    thinkingTimeoutRef.current = window.setTimeout(() => {
      setIsThinking(false);
      thinkingTimeoutRef.current = null;
      streamAnswer(getMentorAnswer(trimmedInput));
    }, 850);
  };

  return (
    <section className="bmentor-page">
      <header className="bmentor-header">
        <div>
          <p className="eyebrow">Mentoria IA</p>
          <h2>B'Mentor</h2>
        </div>
        <button type="button" className="bmentor-new-chat-btn" onClick={resetChat}>
          <Sparkles size={15} />
          Novo chat
        </button>
      </header>

      <div className="bmentor-shell glass-panel">
        <div className="bmentor-thread" aria-live="polite">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`bmentor-message-row ${message.role}`}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {message.role === 'assistant' && <BMentorAvatar />}
                <div className={`bmentor-bubble ${message.role}`}>
                  {message.content.split('\n').map((line, index) => (
                    <p key={`${message.id}-${index}`}>{line}</p>
                  ))}
                  {message.streaming && <span className="bmentor-stream-caret" />}
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <motion.div
                key="typing"
                className="bmentor-message-row assistant"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                <BMentorAvatar />
                <div className="bmentor-typing-bubble">
                  <span />
                  <span />
                  <span />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={scrollAnchorRef} />
        </div>

        <form className="bmentor-input-bar" onSubmit={sendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Tire sua dúvida aqui..."
            disabled={isThinking || Boolean(streamIntervalRef.current)}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking || Boolean(streamIntervalRef.current)}
            aria-label="Enviar pergunta"
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </section>
  );
};

const BMentorAvatar = () => (
  <div className="bmentor-avatar" aria-hidden="true">
    <span>B'</span>
  </div>
);
