'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Send, X, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUICK_PROMPTS = [
  'What should I focus on right now?',
  'Plan my next 3 hours',
  'Am I going to miss any deadlines?',
  'Write me a Planic AI message',
];

const SAMPLE_REPLIES: Record<string, string> = {
  default:
    "I've analyzed your 12 active tasks. Your AI Project is due in 19h and you're 55% done — that's your single highest-leverage action. I've blocked 8–11 PM (your peak window) for it. Want me to silence Slack notifications during that block?",
  focus:
    "Right now: ship the AI Project report. You need ~3.6 more hours and your peak focus starts at 8 PM. Everything else can wait. I've snoozed your low-priority tasks until tomorrow.",
  plan:
    "Here's your next 3 hours:\n• 6:00–6:30 PM — Team standup (already scheduled)\n• 6:30–8:00 PM — DSA practice (graph problems for Google)\n• 8:00–11:00 PM — AI Project report (peak focus window)\n\nI've added all three to your calendar.",
  deadlines:
    "⚠️ Risk detected: Your AI Project (19h left, 55% done) is on a trajectory to miss. At your current velocity you'll finish ~2h late. I recommend starting the report now and dropping the newsletter task. Electricity bill is also due in 38h.",
  planic:
    "This is Future You — 11:47 PM tomorrow. The demo video isn't recorded and your heart is pounding. You're whispering 'I had one job.' But right now, in this moment, you still have time. 30 minutes. That's all Future You is asking for.",
};

function replyFor(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes('focus')) return SAMPLE_REPLIES.focus;
  if (lower.includes('plan')) return SAMPLE_REPLIES.plan;
  if (lower.includes('miss') || lower.includes('deadline')) return SAMPLE_REPLIES.deadlines;
  if (lower.includes('planic') || lower.includes('message')) return SAMPLE_REPLIES.planic;
  return SAMPLE_REPLIES.default;
}

interface Msg { role: 'user' | 'ai'; text: string }

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: "Hey, I'm your Planic AI assistant. I've already scanned your inbox and calendar — ask me anything, or try a quick prompt below." },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if Web Speech API is available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', text: replyFor(text) }]);
      setTyping(false);
    }, 900);
  };

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      // Stop any existing recognition first
      try { recognition.stop(); } catch { /* ignore */ }
      setInput('');
      recognition.start();
      setIsListening(true);
    }
  }, [isListening]);

  // Auto-send when user stops speaking and there's text
  useEffect(() => {
    if (!isListening && recognitionRef.current && input.trim()) {
      // Small delay so the final result is captured before sending
      const timer = setTimeout(() => {
        send(input);
      }, 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full border border-border bg-card text-foreground shadow-elev-3 transition-transform hover:scale-105"
        aria-label="Open AI assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 z-40 flex h-[32rem] w-[calc(100vw-3rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-border glass shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border bg-card/60 px-4 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Planic AI Assistant</div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Online · knows your calendar
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm',
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card border border-border rounded-bl-md'
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border bg-card/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isListening) {
                  recognitionRef.current?.stop();
                  setIsListening(false);
                }
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border bg-card/60 px-3 py-2.5"
            >
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={cn(
                    'grid h-8 w-8 place-items-center rounded-lg transition-colors',
                    isListening
                      ? 'bg-destructive text-destructive-foreground animate-pulse'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening…' : 'Ask Planic AI anything…'}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40"
                disabled={!input.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
