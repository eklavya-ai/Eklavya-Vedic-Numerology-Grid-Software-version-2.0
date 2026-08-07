import { Sparkles, Award, Download } from 'lucide-react';

interface HeaderProps {
  onOpenReport?: () => void;
  hasResult: boolean;
  onOpenAiMaster?: () => void;
  onOpenAiChat?: () => void;
  activeViewMode?: 'timeline' | 'report';
  onToggleViewMode?: (mode: 'timeline' | 'report') => void;
}

export function Header({ onOpenReport, hasResult, onOpenAiMaster, onOpenAiChat, activeViewMode, onToggleViewMode }: HeaderProps) {
  return (
    <header className="bg-[#121929] text-[#f8f5f0] border-b-4 border-[#d97706] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/eklavya-logo.png"
            alt="Eklavya Vedic Numerology Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-full border-2 border-[#d97706] shadow-lg bg-[#121929] p-0.5 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase leading-none font-serif text-white">
                Eklavya Vedic Numerology
              </h1>
              <span className="text-[10px] tracking-[0.2em] bg-[#d97706] text-white px-2 py-0.5 font-bold uppercase rounded-sm">
                ADVANCED GRID
              </span>
            </div>
            <p className="text-[11px] tracking-[0.15em] text-[#d97706] font-bold uppercase mt-1">
              ADVANCED LIFE GRID SOFTWARE • LEARN TO EARN
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f8f5f0]">
          {onToggleViewMode && (
            <div className="bg-[#1a233a] p-1 rounded border border-[#d97706]/40 flex items-center gap-1">
              <button
                onClick={() => onToggleViewMode('timeline')}
                className={`px-3 py-1.5 rounded transition text-[11px] font-bold cursor-pointer ${
                  activeViewMode === 'timeline'
                    ? 'bg-[#d97706] text-white shadow'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                135-Year Life Grid
              </button>
              <button
                onClick={() => onToggleViewMode('report')}
                className={`px-3 py-1.5 rounded transition text-[11px] font-bold cursor-pointer ${
                  activeViewMode === 'report'
                    ? 'bg-[#d97706] text-white shadow'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Step Report View
              </button>
            </div>
          )}

          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-1.5 bg-[#d97706] hover:bg-amber-600 text-white font-extrabold px-3 py-2 rounded shadow border border-amber-300/40 transition cursor-pointer uppercase tracking-wider text-xs animate-bounce"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Ask Eklavya AI</span>
            </button>
          )}

          {onOpenAiMaster && (
            <button
              onClick={onOpenAiMaster}
              className="flex items-center gap-1.5 bg-[#1a233a] hover:bg-[#232f4e] text-amber-300 font-extrabold px-3 py-2 rounded shadow border border-[#d97706]/50 transition cursor-pointer uppercase tracking-wider text-xs"
            >
              <Award className="w-4 h-4 text-[#d97706]" />
              <span>AI Master Summary</span>
            </button>
          )}

          {hasResult && onOpenReport && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 bg-[#d97706] hover:bg-amber-600 text-white font-bold px-3.5 py-2 rounded shadow border border-white/20 transition cursor-pointer uppercase tracking-wider text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1.5 bg-[#1a233a] px-3 py-1.5 rounded border border-[#d97706]/40 text-amber-300">
            <Award className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Vedic 3x3 Grid</span>
          </div>
        </div>
      </div>
    </header>
  );
}


