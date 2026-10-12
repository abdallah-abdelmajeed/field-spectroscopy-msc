import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { SpectralGlossary } from './SpectralGlossary';
import type { GlossaryTerm } from '../types';

interface SpectralGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string;
  initialSearchQuery?: string;
}

export const SpectralGlossaryModal: React.FC<SpectralGlossaryModalProps> = ({
  isOpen,
  onClose,
  initialTermId,
  initialSearchQuery
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="spectral-glossary-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-stone-100 rounded-3xl w-full max-w-6xl shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900 leading-tight">
                Spectral Glossary &amp; Technical Reference
              </h2>
              <p className="text-xs text-stone-500">
                Authoritative ISO/CEOS radiometric definitions, formulas, and field protocols
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Close Glossary (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <SpectralGlossary
            initialTermId={initialTermId}
            initialSearchQuery={initialSearchQuery}
          />
        </div>
      </div>
    </div>
  );
};
