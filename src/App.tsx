import { useState } from 'react';
import { PersonDetails, NumerologyResult } from './types';
import { calculateNumerology } from './utils/numerology';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { LifeGridTimelineView } from './components/LifeGridTimelineView';
import { GridAnalysisView } from './components/GridAnalysisView';
import { PratyantardashaView } from './components/PratyantardashaView';
import { YogaPredictionView } from './components/YogaPredictionView';
import { ProfessionView } from './components/ProfessionView';
import { MedicalNumerologyView } from './components/MedicalNumerologyView';
import { PredictionReadingView } from './components/PredictionReadingView';
import { ExportReportModal } from './components/ExportReportModal';
import { AiMasterAnalysisModal } from './components/AiMasterAnalysisModal';
import { EklavyaAiChatModal } from './components/EklavyaAiChatModal';
import { Disclaimer } from './components/Disclaimer';
import { Grid, Clock, Layers, Briefcase, HeartPulse, FileText, Sparkles, Calendar } from 'lucide-react';

export default function App() {
  const currentYear = new Date().getFullYear();
  const [details, setDetails] = useState<PersonDetails>({
    firstName: '',
    middleName: '',
    surname: '',
    gender: 'male',
    day: 15,
    month: 8,
    year: 1990,
    targetYear: currentYear,
    countryCode: '+91',
    mobileNumber: '',
    email: ''
  });

  const [result, setResult] = useState<NumerologyResult>(() => calculateNumerology(details));
  
  // View mode switcher: 'timeline' (135-Year Life Grid Timeline) vs 'report' (Step Report Tabs)
  const [viewMode, setViewMode] = useState<'timeline' | 'report'>('timeline');
  const [activeTab, setActiveTab] = useState<'grid' | 'dasha' | 'yoga' | 'profession' | 'medical' | 'prediction'>('grid');

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAiMasterOpen, setIsAiMasterOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const handleGenerate = (newDetails: PersonDetails) => {
    setDetails(newDetails);
    const newResult = calculateNumerology(newDetails);
    setResult(newResult);
  };

  const handleUpdateTargetYear = (newYear: number) => {
    const updated = { ...details, targetYear: newYear };
    setDetails(updated);
    setResult(calculateNumerology(updated));
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#2d2d2d] font-sans flex flex-col">
      {/* Header */}
      <Header
        onOpenReport={() => setIsReportOpen(true)}
        hasResult={true}
        onOpenAiMaster={() => setIsAiMasterOpen(true)}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        activeViewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Step 1: Input Form */}
        <InputForm onGenerate={handleGenerate} initialDetails={details} />

        {/* View Mode Indicator / Switcher Bar */}
        <div className="bg-[#121929] text-white p-4 mb-6 border-l-4 border-[#d97706] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#d97706] text-white rounded">
              {viewMode === 'timeline' ? <Calendar className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-serif text-white">
                {viewMode === 'timeline' ? '135-Year Life Grid Timeline View' : 'Step-by-Step Numerology Report View'}
              </h3>
              <p className="text-[11px] text-amber-300">
                {viewMode === 'timeline'
                  ? 'Chronological multi-year cards with 3x3 Vedic Grids, active Yogas accordion with triangles, PD selection, and yearly predictions.'
                  : 'Modular tabbed views for deep step-by-step analysis, grid counts, Pratyantardasha tables, and remedies.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                viewMode === 'timeline'
                  ? 'bg-[#d97706] text-white border-[#d97706] shadow'
                  : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
              }`}
            >
              135-Year Life Grid
            </button>
            <button
              onClick={() => setViewMode('report')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                viewMode === 'report'
                  ? 'bg-[#d97706] text-white border-[#d97706] shadow'
                  : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
              }`}
            >
              Step Report View
            </button>
          </div>
        </div>

        {/* Render Selected View Mode */}
        {viewMode === 'timeline' ? (
          <LifeGridTimelineView
            details={details}
            initialResult={result}
            onUpdateDetails={(newDetails) => {
              setDetails(newDetails);
              setResult(calculateNumerology(newDetails));
            }}
          />
        ) : (
          <div className="space-y-6">
            {/* Step Navigation Tabs */}
            <div className="bg-white border border-[#3d2b1f] shadow-[4px_4px_0px_#3d2b1f] p-2 flex flex-wrap items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('grid')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  activeTab === 'grid'
                    ? 'bg-[#3d2b1f] text-white border-[#3d2b1f] shadow-[2px_2px_0px_#d97706]'
                    : 'bg-[#fffcf5] text-[#3d2b1f] border-[#3d2b1f]/30 hover:border-[#3d2b1f]'
                }`}
              >
                <Grid className="w-4 h-4 text-[#d97706]" />
                <span>Grid & Analysis (Steps 3-5)</span>
              </button>

              <button
                onClick={() => setActiveTab('dasha')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  activeTab === 'dasha'
                    ? 'bg-[#3d2b1f] text-white border-[#3d2b1f] shadow-[2px_2px_0px_#d97706]'
                    : 'bg-[#fffcf5] text-[#3d2b1f] border-[#3d2b1f]/30 hover:border-[#3d2b1f]'
                }`}
              >
                <Clock className="w-4 h-4 text-[#d97706]" />
                <span>Pratyantardasha (Step 6)</span>
              </button>

              <button
                onClick={() => setActiveTab('yoga')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  activeTab === 'yoga'
                    ? 'bg-[#3d2b1f] text-white border-[#3d2b1f] shadow-[2px_2px_0px_#d97706]'
                    : 'bg-[#fffcf5] text-[#3d2b1f] border-[#3d2b1f]/30 hover:border-[#3d2b1f]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#d97706]" />
                <span>Yoga & Remedies (Step 7)</span>
              </button>

              <button
                onClick={() => setActiveTab('profession')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  activeTab === 'profession'
                    ? 'bg-[#3d2b1f] text-white border-[#3d2b1f] shadow-[2px_2px_0px_#d97706]'
                    : 'bg-[#fffcf5] text-[#3d2b1f] border-[#3d2b1f]/30 hover:border-[#3d2b1f]'
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#d97706]" />
                <span>Profession Guidance (Step 8)</span>
              </button>

              <button
                onClick={() => setActiveTab('medical')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  activeTab === 'medical'
                    ? 'bg-[#3d2b1f] text-white border-[#3d2b1f] shadow-[2px_2px_0px_#d97706]'
                    : 'bg-[#fffcf5] text-[#3d2b1f] border-[#3d2b1f]/30 hover:border-[#3d2b1f]'
                }`}
              >
                <HeartPulse className="w-4 h-4 text-[#d97706]" />
                <span>Medical Numerology (Step 9)</span>
              </button>

              <button
                onClick={() => setActiveTab('prediction')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  activeTab === 'prediction'
                    ? 'bg-[#3d2b1f] text-white border-[#3d2b1f] shadow-[2px_2px_0px_#d97706]'
                    : 'bg-[#fffcf5] text-[#3d2b1f] border-[#3d2b1f]/30 hover:border-[#3d2b1f]'
                }`}
              >
                <FileText className="w-4 h-4 text-[#d97706]" />
                <span>Prediction Reading (Step 10)</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {activeTab === 'grid' && (
                <GridAnalysisView
                  result={result}
                  details={details}
                  onUpdateTargetYear={handleUpdateTargetYear}
                />
              )}
              {activeTab === 'dasha' && <PratyantardashaView result={result} />}
              {activeTab === 'yoga' && <YogaPredictionView result={result} />}
              {activeTab === 'profession' && <ProfessionView result={result} />}
              {activeTab === 'medical' && <MedicalNumerologyView result={result} />}
              {activeTab === 'prediction' && (
                <PredictionReadingView
                  result={result}
                  details={details}
                  onOpenReport={() => setIsReportOpen(true)}
                />
              )}
            </div>
          </div>
        )}
        {/* Dedicated Disclaimer Component at Bottom of Main Content */}
        <Disclaimer variant="card" />
      </main>

      {/* Footer */}
      <footer className="bg-[#121929] text-[#f8f5f0] py-10 mt-16 border-t-4 border-[#d97706]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <div className="flex items-center gap-3">
              <img src="/eklavya-logo.png" alt="Eklavya Logo" className="w-12 h-12 object-contain rounded-full border border-[#d97706] bg-[#121929] p-0.5 shrink-0" />
              <div className="text-left">
                <p className="font-bold text-white font-serif text-lg uppercase tracking-wider">Eklavya Vedic Numerology</p>
                <p className="text-xs text-[#d97706] font-bold uppercase tracking-widest">Learn to Earn • Professional Grid Software</p>
              </div>
            </div>
          </div>

          {/* Footer Contact Info & Disclaimer */}
          <Disclaimer variant="footer" />
        </div>
      </footer>

      {/* Eklavya AI Master Analysis Modal */}
      <AiMasterAnalysisModal
        isOpen={isAiMasterOpen}
        onClose={() => setIsAiMasterOpen(false)}
        result={result}
        details={details}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Export Report / Download PDF Modal */}
      <ExportReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        result={result}
        details={details}
      />

      {/* Eklavya AI Conversational Assistant & Year Analyzer */}
      <EklavyaAiChatModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        details={details}
        onUpdateDetails={(newDetails) => handleGenerate(newDetails)}
      />

      {/* Floating Gemini AI Chatbot Button (Bottom Right Corner) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 print:hidden">
        {/* Tooltip Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-[#121929] text-white text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-400 shadow-xl animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-300">Eklavya AI Active</span>
          <span className="text-gray-400">• Click to Chat</span>
        </div>

        <button
          onClick={() => setIsAiChatOpen(true)}
          className="relative group flex items-center justify-center cursor-pointer focus:outline-none"
          title="Open Eklavya Gemini AI Assistant"
        >
          {/* Animated Glowing Outer Ring */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 rounded-full blur opacity-80 group-hover:opacity-100 transition duration-300 animate-pulse"></div>

          {/* Button Container */}
          <div className="relative w-14 h-14 bg-[#121929] rounded-full p-1 border-2 border-cyan-400 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <img
              src="/gemini-ai-button.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/eklavya-logo.png';
              }}
              alt="Eklavya Gemini AI"
              className="w-full h-full object-cover rounded-full"
            />

            {/* Active Indicator Pulse Dot */}
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-[#121929]"></span>
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}


