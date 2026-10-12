import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Loader2,
  HelpCircle,
  Copy,
  Check,
  BookOpen
} from 'lucide-react';
import type { CourseModule } from '../types';
import { MathText } from './MathRenderer';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: CourseModule;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  activeModule
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<
    { role: 'user' | 'assistant'; content: string; timestamp: string }[]
  >([
    {
      role: 'assistant',
      content: `Welcome to the Field Spectroscopy Academic AI Tutor. I am configured with deep scientific reasoning (Thinking Mode) to assist you with physical derivations, instrument calibration protocols, Python/R spectral analysis, and RTM canopy physics for Module ${activeModule.moduleNumber}: "${activeModule.shortTitle}". What scientific question would you like to explore?`,
      timestamp: 'Ready'
    }
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const sampleQuestions = [
    `How does the Empirical Line Method (ELM) calibrate drone multispectral imagery to surface reflectance?`,
    `Derive the difference between Hemispherical-Conical Reflectance Factor (HCRF) and BRDF.`,
    `Explain the continuum removal process for the 2200 nm Al-OH doublet in Kaolinite.`,
    `How do we correct for solar zenith angle shifts when taking ASD FieldSpec measurements?`
  ];

  const handleAsk = async (questionText?: string) => {
    const q = questionText || prompt;
    if (!q.trim() || loading) return;

    const userMessage = {
      role: 'user' as const,
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversation((prev) => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          moduleTitle: activeModule.title,
          topic: activeModule.shortTitle
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch academic answer.');
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversation((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${err.message || 'Unable to communicate with the academic reasoning engine.'}`,
          timestamp: 'Error'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-800 flex items-center justify-center text-purple-200">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold leading-none">
                  Spectroscopy Research AI Tutor
                </h3>
                <span className="text-[10px] bg-purple-800 text-purple-200 px-1.5 py-0.5 rounded font-mono font-bold flex items-center space-x-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Gemini 3.1 Pro (High Thinking)</span>
                </span>
              </div>
              <p className="text-[11px] text-purple-200 mt-1">
                Grounded in Module {activeModule.moduleNumber}: {activeModule.shortTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Inquiries */}
        <div className="px-6 py-2.5 bg-purple-50/60 border-b border-purple-100 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-purple-900 font-bold shrink-0">Quick Topics:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              disabled={loading}
              className="px-2.5 py-1 rounded-full bg-white border border-purple-200 text-purple-900 hover:bg-purple-100 transition-colors shrink-0 max-w-[240px] truncate cursor-pointer disabled:opacity-50"
              title={q}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-stone-400">
                <span>{msg.role === 'user' ? 'You' : 'Field Spectroscopy Academic AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl max-w-[90%] text-xs leading-relaxed relative group ${
                  msg.role === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-xs'
                    : 'bg-stone-50 border border-stone-200 text-stone-900 rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="font-sans">
                  <MathText text={msg.content} className="whitespace-pre-wrap" />
                </div>

                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-700 bg-white/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-2 text-xs text-stone-500 bg-stone-50 p-3.5 rounded-xl border border-stone-200 max-w-sm">
              <Loader2 className="w-4 h-4 animate-spin text-purple-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-800 block">Reasoning in Deep Thinking Mode...</span>
                <span className="text-[11px] text-stone-500">
                  Deriving physical formulas, sensor calibration constants, and citations.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask an academic question regarding radiometric physics, protocols, or code..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="p-2.5 bg-purple-800 hover:bg-purple-900 text-white rounded-xl disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
