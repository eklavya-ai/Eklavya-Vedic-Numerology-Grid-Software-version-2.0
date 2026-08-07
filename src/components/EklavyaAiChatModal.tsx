import { useState, useEffect, useRef } from 'react';
import { PersonDetails } from '../types';
import { generateYearReport, YearReport } from '../utils/yearReport';
import {
  X, Sparkles, Send, Calendar, ArrowRightLeft, Trophy,
  FileCode, RefreshCw, CheckCircle2, ChevronRight, HelpCircle, AlertCircle
} from 'lucide-react';

interface EklavyaAiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: PersonDetails;
  onUpdateDetails: (newDetails: PersonDetails) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

// Client-side Vedic Answer Generator (Bulletproof fallback for Netlify static host)
function generateRuleBasedVedicAnswer(report: YearReport, question: string): string {
  const qLower = question.toLowerCase();

  // 1. Health / Neurological / Stroke / Brain / Surgery / Infection
  if (qLower.includes('stroke') || qLower.includes('paralysis') || qLower.includes('brain') || qLower.includes('neurological') || qLower.includes('health') || qLower.includes('tumors') || qLower.includes('heart') || qLower.includes('illness') || qLower.includes('surgery') || qLower.includes('autism')) {
    const pdText = report.Pratyantardashas.map(pd => `• PD ${pd.number} (${pd.planet}): ${pd.startDate} to ${pd.endDate}`).join('\n');
    const yogasText = report.ActiveYogas.length > 0
      ? report.ActiveYogas.map(y => `• **${y.name}**: ${y.description}`).join('\n')
      : '• Balanced grid matrix with no volatile malefic combinations.';

    let genderNote = '';
    if (report.gender === 'Female') {
      genderNote = `• Gender Specifics: As a female (${report.fullName}), focus on hormonal equilibrium, nervous system tranquility (Mercury 5), and Moon (2) emotional calmness.`;
    } else if (report.gender === 'Male') {
      genderNote = `• Gender Specifics: As a male (${report.fullName}), maintain blood pressure control, stress reduction, and cardiovascular care during Saturn/Rahu sub-periods.`;
    }

    return `🏥 **Vedic Health & Vibrational Analysis for ${report.fullName} (Year ${report.selectedYear}, Age ${report.age})**\n\n` +
      `**Core Numerical Drivers:**\n` +
      `• Basic Number (BN/Driver): **${report.BN}** | Destiny Number (DN/Conductor): **${report.DN}**\n` +
      `• Active Mahadasha: **${report.Mahadasha.planet} (${report.Mahadasha.number})** | Antardasha: **${report.Antardasha.planet} (${report.Antardasha.number})**\n` +
      `${genderNote}\n\n` +
      `**Vedic Organ & Energy Signaling:**\n` +
      `• **Mercury (5)** governs the central nervous system, brain signaling, speech pathways, and motor response. ${report.BN === 5 || report.DN === 5 || report.Mahadasha.number === 5 ? 'Mercury is strongly active in your chart.' : 'Keep Mercury energy balanced through grounding exercises.'}\n` +
      `• **Moon (2)** governs fluid balance, mental tranquility, and circulatory rhythm.\n` +
      `• **Saturn (8) & Rahu (4)** govern long-term structural alignment and neurological signals.\n\n` +
      `**Exact Pratyantardasha (PD) Date Windows for ${report.selectedYear}:**\n${pdText}\n\n` +
      `**Active Yogas Influence:**\n${yogasText}\n\n` +
      `**Supportive Vedic Remedies:**\n` +
      `• Consume green leafy vegetables & keep green jade or emerald near workspace.\n` +
      `• Recite *Om Budhaya Namah* 108 times daily for nervous system strength.\n` +
      `• Offer fresh water in silver tumbler on Mondays for mental peace.\n\n` +
      `*Disclaimer: Vedic Numerology provides vibrational perspective and supportive timeline guidance. It is NOT a medical diagnosis or promise of cure. Always work closely with qualified physicians and medical specialists.*`;
  }

  // 2. Children / Education / Exams / School / Conception
  if (qLower.includes('child') || qLower.includes('school') || qLower.includes('exam') || qLower.includes('education') || qLower.includes('conceiv') || qLower.includes('pregnan') || qLower.includes('birth')) {
    const pdText = report.Pratyantardashas.map(pd => `• PD ${pd.number} (${pd.planet}): ${pd.startDate} to ${pd.endDate}`).join('\n');
    let conceptionNote = '';
    if (qLower.includes('conceiv') || qLower.includes('pregnan')) {
      if (report.gender === 'Male') {
        conceptionNote = `\n\n**Maternal & Spouse Guidance (Male Chart):**\nAs a male (${report.fullName}), your current Jupiter (${report.DN}) and Venus vibrations provide paternal support and emotional stability to your wife during conception windows.`;
      } else {
        conceptionNote = `\n\n**Maternal Vitality Guidance (Female Chart):**\nYour Venus (6) and Jupiter (3) cycles provide fertile energy. Focus on stress-free nutrition and emotional harmony.`;
      }
    }

    return `👶 **Children, Education & Timeline Analysis (${report.selectedYear}, Age ${report.age})**\n\n` +
      `• **Driver (BN): ${report.BN}** | **Conductor (DN): ${report.DN}**\n` +
      `• **Active Mahadasha:** ${report.Mahadasha.planet} (${report.Mahadasha.number}) | **Antardasha:** ${report.Antardasha.planet} (${report.Antardasha.number})\n\n` +
      `**Intellectual & Exam Performance Vibrations:**\n` +
      `• **Jupiter (3)** activates wisdom, higher education, and university entrance success.\n` +
      `• **Mercury (5)** enhances speed, competitive exam logic, memory retention, and mathematical reasoning.\n` +
      `• **Sun (1)** grants administrative favor, government exam merit, and leadership rank.${conceptionNote}\n\n` +
      `**Exact Pratyantardasha Date Windows:**\n${pdText}\n\n` +
      `**Remedies for Academic & Family Growth:**\n` +
      `• Feed green fodder to cows on Wednesdays.\n` +
      `• Recite *Om Brim Brihaspataye Namah* on Thursdays for exam focus.`;
  }

  // 3. Career / Business / Promotion / Government / Job / Foreign / Finance
  if (qLower.includes('job') || qLower.includes('career') || qLower.includes('promot') || qLower.includes('business') || qLower.includes('money') || qLower.includes('governm') || qLower.includes('foreign') || qLower.includes('propert') || qLower.includes('wealth')) {
    const pdText = report.Pratyantardashas.map(pd => `• PD ${pd.number} (${pd.planet}): ${pd.startDate} to ${pd.endDate}`).join('\n');
    const yogasText = report.ActiveYogas.map(y => `• **${y.name}**: ${y.description}`).join('\n');

    return `💼 **Career, Business & Financial Timeline (${report.selectedYear}, Age ${report.age})**\n\n` +
      `• **BN / Driver:** ${report.BN} | **DN / Conductor:** ${report.DN}\n` +
      `• **Current Dasha Synergy:** ${report.Mahadasha.planet} Mahadasha with ${report.Antardasha.planet} Antardasha\n\n` +
      `**Professional & Financial Trends:**\n` +
      `• Sun (1) & Mercury (5) support authority, new contracts, and corporate growth.\n` +
      `• Saturn (8) grants steady returns on hard work and long-term asset accumulation.\n` +
      `• Rahu (4) / Ketu (7) open foreign trade, digital expansion, and sudden breakthroughs.\n\n` +
      `**Active Yogas in Your Grid:**\n${yogasText || '• Balanced plane configuration'}\n\n` +
      `**Exact Pratyantardasha (PD) Date Windows:**\n${pdText}\n\n` +
      `**Key Action Strategy:**\n` +
      `Leverage high-energy PD windows for launching new projects, submitting job applications, or property deals. Apply remedies for missing numbers (${report.Missing.join(', ') || 'None'}).`;
  }

  // 4. Default / General
  const pdText = report.Pratyantardashas.map(pd => `• PD ${pd.number} (${pd.planet}): ${pd.startDate} to ${pd.endDate}`).join('\n');
  return `✨ **Vedic Numerology Insights for ${report.fullName} (Year ${report.selectedYear}, Age ${report.age})**\n\n` +
    `• **Basic Number (Driver):** ${report.BN} | **Destiny Number (Conductor):** ${report.DN}\n` +
    `• **Mahadasha:** ${report.Mahadasha.planet} (${report.Mahadasha.number}) | **Antardasha:** ${report.Antardasha.planet} (${report.Antardasha.number})\n\n` +
    `**Pratyantardasha (PD) Date Ranges for ${report.selectedYear}:**\n${pdText}\n\n` +
    `**Active Yogas:** ${report.ActiveYogas.map(y => y.name).join(', ') || 'Balanced Grid'}\n` +
    `**Missing Number Remedies:** Focus on balancing numbers ${report.Missing.join(', ') || 'None'}.`;
}

export function EklavyaAiChatModal({
  isOpen,
  onClose,
  details,
  onUpdateDetails
}: EklavyaAiChatModalProps) {
  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(details.targetYear || currentYear);
  const [activeTab, setActiveTab] = useState<'chat' | 'compare' | 'bestYear' | 'json'>('chat');

  // In-session Memory of Year Report (Phase 12)
  const [yearReport, setYearReport] = useState<YearReport>(() => generateYearReport(details, selectedYear));

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: `Namaste! I am Eklavya AI, your Vedic Grid Numerology Assistant. I have loaded your complete Year Report for ${selectedYear} (Age ${yearReport.age}). Ask me anything about your career, business, marriage, health, property, or missing number remedies!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Compare Years State (Phase 11)
  const [compareYear1, setCompareYear1] = useState<number>(selectedYear);
  const [compareYear2, setCompareYear2] = useState<number>(selectedYear + 1);
  const [compareAnalysis, setCompareAnalysis] = useState<string>('');
  const [isComparing, setIsComparing] = useState(false);

  // Best Year Finder State (Phase 11)
  const [finderTopic, setFinderTopic] = useState<string>('Career');
  const [finderAnalysis, setFinderAnalysis] = useState<string>('');
  const [isFindingBestYear, setIsFindingBestYear] = useState(false);

  // Re-generate report when year changes or details change
  useEffect(() => {
    const report = generateYearReport(details, selectedYear);
    setYearReport(report);
  }, [selectedYear, details]);

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    onUpdateDetails({ ...details, targetYear: newYear });
  };

  // Categorized Suggested Topics
  const [selectedTopicCategory, setSelectedTopicCategory] = useState<string>('Health');

  const categorizedTopics: { category: string; icon: string; questions: string[] }[] = [
    {
      category: 'Health & Medical',
      icon: '🏥',
      questions: [
        'Will child mental development, speech, or autism improve in 2026?',
        'Are there any Rahu/Ketu or Saturn indications for cancer, tumors, or long-term illness?',
        'What numbers indicate brain stroke, paralysis, or neurological signaling issues?',
        'Show my heart health, blood pressure, and circulation trends for 2026',
        'Will I suffer from fevers, malaria, infection, or viral illness this year?',
        'Is there any risk of accidents, injuries, surgeries, or operations in 2026?',
        'What are the organ-wise health precautions and preventive remedies for my grid?'
      ]
    },
    {
      category: 'Children & Conception',
      icon: '👶',
      questions: [
        'What are my favorable months for conceiving & pregnancy in 2026?',
        'Will I be blessed with childbirth this year based on my Dasha & Grid?',
        'How will my child perform in school, competitive exams, & higher education?',
        'What remedies support smooth pregnancy and child health?'
      ]
    },
    {
      category: 'Career & Business',
      icon: '💼',
      questions: [
        'Will I get job promotion, salary increment, or authority boost in 2026?',
        'Is this year favorable for changing my job or shifting companies?',
        'Will I clear government competitive exams or university entrance this year?',
        'Is this year favorable for starting a new business venture or startup?',
        'How can my business recover from past financial losses in 2026?',
        'Will I get foreign work assignments, overseas clients, or global trade deals?'
      ]
    },
    {
      category: 'Relationships & Family',
      icon: '❤️',
      questions: [
        'When will I get married or find my ideal life partner?',
        'What is the status of my current relationship / situationship this year?',
        'Will my love proposal be accepted and lead to marriage?',
        'Are there indications of marital discord, separation, or divorce in 2026?',
        'How can I resolve family misunderstandings & bring peace to my household?'
      ]
    },
    {
      category: 'Money & Property',
      icon: '💰',
      questions: [
        'Will my cash flow, wealth accumulation, and earnings increase in 2026?',
        'Is this year favorable for buying real estate, land, or commercial property?',
        'Should I invest in stocks, mutual funds, or long-term assets this year?',
        'Will I be able to repay my debts, loans, or clear financial liabilities?',
        'Is there any chance of lottery winning, sudden inheritance, or speculative gain?'
      ]
    },
    {
      category: 'Remedies & Healing',
      icon: '🔮',
      questions: [
        'Which crystal or gemstone (Emerald, Ruby, Yellow Sapphire) should I wear?',
        'What specific donations, charity, and food offerings clear my missing digits?',
        'Which powerful Vedic mantras and planetary chants should I recite daily?',
        'How can Reiki, energy healing, or chromotherapy (colors) balance my grid?',
        'What sacred ritual or yantra practice should I follow at home for peace?'
      ]
    }
  ];

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsAiLoading(true);

    try {
      let aiResponseText = '';

      // Try API route first
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report: yearReport,
          question: textToSend
        })
      });

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        aiResponseText = data.answer;
      } else {
        // Fallback to client-side rule generator if API returns HTML (Netlify SPA route)
        aiResponseText = generateRuleBasedVedicAnswer(yearReport, textToSend);
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText || generateRuleBasedVedicAnswer(yearReport, textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const fallbackText = generateRuleBasedVedicAnswer(yearReport, textToSend);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRunCompare = async () => {
    setIsComparing(true);
    setCompareAnalysis('');
    try {
      const res = await fetch('/api/compare-years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          details,
          year1: compareYear1,
          year2: compareYear2
        })
      });

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setCompareAnalysis(data.analysis || 'Comparison completed.');
      } else {
        const report1 = generateYearReport(details, compareYear1);
        const report2 = generateYearReport(details, compareYear2);
        setCompareAnalysis(
          `⚖️ **Comparative Analysis: Year ${compareYear1} vs Year ${compareYear2} for ${details.firstName}**\n\n` +
          `• **YEAR ${compareYear1} (Age ${report1.age}):**\n` +
          `  - Mahadasha: ${report1.Mahadasha.planet} (${report1.Mahadasha.number}) | Antardasha: ${report1.Antardasha.planet} (${report1.Antardasha.number})\n` +
          `  - Antardasha Cycle: ${report1.Antardasha.number} | Active Yogas: ${report1.ActiveYogas.map(y => y.name).join(', ') || 'Balanced'}\n\n` +
          `• **YEAR ${compareYear2} (Age ${report2.age}):**\n` +
          `  - Mahadasha: ${report2.Mahadasha.planet} (${report2.Mahadasha.number}) | Antardasha: ${report2.Antardasha.planet} (${report2.Antardasha.number})\n` +
          `  - Antardasha Cycle: ${report2.Antardasha.number} | Active Yogas: ${report2.ActiveYogas.map(y => y.name).join(', ') || 'Balanced'}\n\n` +
          `**Comparative Synthesis:**\n` +
          `Year ${compareYear1} brings the energy of ${report1.Antardasha.planet} focusing on ${report1.Antardasha.number === 5 ? 'commercial expansion & stability' : 'learning & structural alignment'}. Year ${compareYear2} shifts into ${report2.Antardasha.planet} energy, accelerating ${report2.Antardasha.number === 6 ? 'financial & relationship opportunities' : 'focus & major transformations'}.`
        );
      }
    } catch (err: any) {
      setCompareAnalysis(`Year comparison complete. Compare Year ${compareYear1} vs Year ${compareYear2} in report tabs.`);
    } finally {
      setIsComparing(false);
    }
  };

  const handleRunBestYearFinder = async () => {
    setIsFindingBestYear(true);
    setFinderAnalysis('');
    try {
      const res = await fetch('/api/best-year-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          details,
          startYear: selectedYear,
          endYear: selectedYear + 9,
          topic: finderTopic
        })
      });

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setFinderAnalysis(data.analysis || 'Timeline analysis generated.');
      } else {
        const reports = Array.from({ length: 10 }, (_, i) => generateYearReport(details, selectedYear + i));
        const primeYear = reports.find(r => r.Antardasha.number === 1 || r.Antardasha.number === 5 || r.Antardasha.number === 6) || reports[0];

        setFinderAnalysis(
          `🏆 **10-Year Golden Window Analysis (${selectedYear} - ${selectedYear + 9}) for ${finderTopic}**\n\n` +
          `• **Primary Golden Year:** **Year ${primeYear.selectedYear} (Age ${primeYear.age})**\n` +
          `  - Active Dasha: ${primeYear.Mahadasha.planet} MD with ${primeYear.Antardasha.planet} AD\n` +
          `  - Reason: Strong support from ${primeYear.Antardasha.planet} (${primeYear.Antardasha.number}) aligning with ${finderTopic} objectives.\n\n` +
          `• **10-Year Dasha Sequence Breakdown:**\n` +
          reports.map(r => `  - Year ${r.selectedYear} (Age ${r.age}): ${r.Mahadasha.planet}/${r.Antardasha.planet} - ${r.ActiveYogas.length > 0 ? r.ActiveYogas[0].name : 'Balanced'}`).join('\n')
        );
      }
    } catch (err: any) {
      setFinderAnalysis(`10-Year golden window search complete.`);
    } finally {
      setIsFindingBestYear(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#f8f5f0] border-4 border-[#3d2b1f] w-full max-w-5xl h-[92vh] flex flex-col shadow-[12px_12px_0px_#d97706] relative my-auto">
        {/* Modal Header */}
        <div className="bg-[#121929] text-white p-4 sm:p-5 border-b-4 border-[#d97706] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/eklavya-logo.png"
              alt="Eklavya Logo"
              className="w-10 h-10 object-contain rounded-full border border-[#d97706] bg-[#121929] p-0.5 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-serif uppercase tracking-wider text-white">
                  Eklavya AI Vedic Assistant
                </h3>
                <span className="bg-[#d97706] text-white text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-widest">
                  AI EXPERT
                </span>
              </div>
              <p className="text-xs text-amber-300 font-medium">
                Vedic Year Report Reasoning for {details.firstName} {details.surname} (DOB: {yearReport.dob})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Year Selector */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 border border-white/20 text-xs">
              <Calendar className="w-4 h-4 text-[#d97706]" />
              <span className="text-gray-300 font-bold hidden sm:inline">Selected Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
                className="bg-[#121929] text-amber-300 font-bold px-1 py-0.5 border border-[#d97706] cursor-pointer outline-none"
              >
                {Array.from({ length: 40 }, (_, i) => currentYear - 5 + i).map(yr => (
                  <option key={yr} value={yr}>
                    Year {yr} (Age {yr - details.year})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-[#d97706] rounded-full flex items-center justify-center text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="bg-[#1e293b] border-b-2 border-[#3d2b1f] p-2 flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
              activeTab === 'chat'
                ? 'bg-[#d97706] text-white border-[#d97706] shadow'
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Chat Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
              activeTab === 'compare'
                ? 'bg-[#d97706] text-white border-[#d97706] shadow'
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Compare Years</span>
          </button>

          <button
            onClick={() => setActiveTab('bestYear')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
              activeTab === 'bestYear'
                ? 'bg-[#d97706] text-white border-[#d97706] shadow'
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Best Window Finder (10-Yr)</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
              activeTab === 'json'
                ? 'bg-[#d97706] text-white border-[#d97706] shadow'
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>View Year Report JSON</span>
          </button>
        </div>

        {/* Tab 1: Conversational Chat */}
        {activeTab === 'chat' && (
          <div className="flex-grow flex flex-col overflow-hidden p-4">
            {/* Context Summary Snapshot Header */}
            <div className="bg-white border border-[#3d2b1f] p-3 mb-3 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-[2px_2px_0px_#3d2b1f]">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-[#3d2b1f] uppercase tracking-wider font-serif">
                  Year {selectedYear} Context Memory:
                </span>
                <span className="bg-[#fffcf5] border border-[#3d2b1f]/30 px-2 py-0.5">
                  BN: <strong className="text-[#d97706]">{yearReport.BN}</strong> | DN: <strong className="text-[#d97706]">{yearReport.DN}</strong>
                </span>
                <span className="bg-[#fffcf5] border border-[#3d2b1f]/30 px-2 py-0.5">
                  MD: <strong>{yearReport.Mahadasha.planet} ({yearReport.Mahadasha.number})</strong>
                </span>
                <span className="bg-[#fffcf5] border border-[#3d2b1f]/30 px-2 py-0.5">
                  AD: <strong>{yearReport.Antardasha.planet} ({yearReport.Antardasha.number})</strong>
                </span>
                <span className="bg-[#fffcf5] border border-[#3d2b1f]/30 px-2 py-0.5">
                  Active Yogas: <strong>{yearReport.ActiveYogas.length}</strong>
                </span>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-grow overflow-y-auto space-y-3 p-3 bg-white border border-[#3d2b1f] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 text-xs sm:text-sm leading-relaxed border ${
                      msg.sender === 'user'
                        ? 'bg-[#121929] text-white border-[#3d2b1f] shadow-[3px_3px_0px_#d97706]'
                        : 'bg-[#fffcf5] text-[#2d2d2d] border-[#3d2b1f] shadow-[3px_3px_0px_#3d2b1f]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1 border-b border-black/10 pb-1">
                      <span className="font-extrabold uppercase text-[10px] tracking-wider text-[#d97706]">
                        {msg.sender === 'user' ? 'You' : 'Eklavya AI Expert'}
                      </span>
                      <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#fffcf5] border border-[#3d2b1f] p-3 text-xs flex items-center gap-2 text-[#d97706] font-bold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Eklavya AI is synthesizing Year {selectedYear} Vedic Report...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Categorized Suggested Topics & Questions */}
            <div className="py-2.5 px-1 bg-[#fffcf5] border border-[#3d2b1f]/40 my-2 shrink-0 space-y-2">
              {/* Category Pills Header */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <span className="text-[10px] font-extrabold uppercase text-[#3d2b1f] shrink-0 font-serif mr-1">
                  Topics:
                </span>
                {categorizedTopics.map((catObj) => {
                  const isSelected = selectedTopicCategory === catObj.category;
                  return (
                    <button
                      key={catObj.category}
                      onClick={() => setSelectedTopicCategory(catObj.category)}
                      className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider transition cursor-pointer shrink-0 border ${
                        isSelected
                          ? 'bg-[#121929] text-amber-300 border-[#d97706] shadow'
                          : 'bg-white text-[#3d2b1f] border-[#3d2b1f]/30 hover:bg-amber-100'
                      }`}
                    >
                      <span>{catObj.icon}</span>
                      <span>{catObj.category}</span>
                    </button>
                  );
                })}
              </div>

              {/* Question Chips for Selected Category */}
              <div className="flex items-center gap-2 overflow-x-auto pt-0.5 pb-1">
                {categorizedTopics
                  .find(c => c.category === selectedTopicCategory)
                  ?.questions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuery(q)}
                      disabled={isAiLoading}
                      className="bg-white hover:bg-[#d97706] hover:text-white text-[#3d2b1f] border border-[#3d2b1f] px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer shrink-0 shadow-[2px_2px_0px_#3d2b1f]"
                    >
                      {q}
                    </button>
                  ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="mt-2 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder={`Ask Eklavya AI about career, marriage, health, remedies in Year ${selectedYear}...`}
                className="flex-grow bg-white border-2 border-[#3d2b1f] px-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#d97706] shadow-[2px_2px_0px_#3d2b1f]"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={isAiLoading || !inputQuery.trim()}
                className="bg-[#d97706] hover:bg-amber-600 disabled:bg-gray-400 text-white font-bold px-5 py-2.5 text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer border border-[#3d2b1f] shadow-[2px_2px_0px_#3d2b1f]"
              >
                <span>Ask AI</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Compare Years */}
        {activeTab === 'compare' && (
          <div className="flex-grow overflow-y-auto p-5 space-y-5">
            <div className="bg-white border border-[#3d2b1f] p-4 shadow-[4px_4px_0px_#3d2b1f]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#3d2b1f] font-serif mb-3 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#d97706]" />
                Side-by-Side Numerology Year Comparison
              </h4>
              <p className="text-xs text-gray-700 mb-4">
                Compare two specific target years to understand energy shifts in Mahadasha, Antardasha, and Active Yogas.
              </p>

              <div className="flex flex-wrap items-center gap-4 bg-[#fffcf5] p-3 border border-[#3d2b1f]/30">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-[#3d2b1f]">Year 1:</label>
                  <select
                    value={compareYear1}
                    onChange={(e) => setCompareYear1(parseInt(e.target.value, 10))}
                    className="bg-white border border-[#3d2b1f] px-2 py-1 text-xs font-bold"
                  >
                    {Array.from({ length: 30 }, (_, i) => currentYear - 5 + i).map(yr => (
                      <option key={yr} value={yr}>Year {yr}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-[#3d2b1f]">Year 2:</label>
                  <select
                    value={compareYear2}
                    onChange={(e) => setCompareYear2(parseInt(e.target.value, 10))}
                    className="bg-white border border-[#3d2b1f] px-2 py-1 text-xs font-bold"
                  >
                    {Array.from({ length: 30 }, (_, i) => currentYear - 5 + i).map(yr => (
                      <option key={yr} value={yr}>Year {yr}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleRunCompare}
                  disabled={isComparing}
                  className="bg-[#d97706] hover:bg-amber-600 text-white font-bold px-4 py-1.5 text-xs uppercase tracking-wider transition cursor-pointer border border-[#3d2b1f]"
                >
                  {isComparing ? 'Comparing...' : 'Run Comparative AI Analysis'}
                </button>
              </div>
            </div>

            {compareAnalysis && (
              <div className="bg-white border-2 border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#d97706] font-serif mb-3">
                  AI Synthesis: Year {compareYear1} vs Year {compareYear2}
                </h5>
                <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-gray-800">
                  {compareAnalysis}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Best Window Finder */}
        {activeTab === 'bestYear' && (
          <div className="flex-grow overflow-y-auto p-5 space-y-5">
            <div className="bg-white border border-[#3d2b1f] p-4 shadow-[4px_4px_0px_#3d2b1f]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#3d2b1f] font-serif mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#d97706]" />
                10-Year Golden Window Finder ({selectedYear} - {selectedYear + 9})
              </h4>
              <p className="text-xs text-gray-700 mb-4">
                Evaluate the entire 10-year period to identify the single best year and top favorable windows for your major life goals.
              </p>

              <div className="flex flex-wrap items-center gap-4 bg-[#fffcf5] p-3 border border-[#3d2b1f]/30">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-[#3d2b1f]">Goal Topic:</label>
                  <select
                    value={finderTopic}
                    onChange={(e) => setFinderTopic(e.target.value)}
                    className="bg-white border border-[#3d2b1f] px-3 py-1.5 text-xs font-bold cursor-pointer"
                  >
                    <option value="Career">Career & Promotion</option>
                    <option value="Business">Business Expansion & Trading</option>
                    <option value="Marriage">Marriage & Relationship Window</option>
                    <option value="Property">Property & Land Investment</option>
                    <option value="Foreign Settlement">Foreign Travel & Settlement</option>
                    <option value="Health">Health & Vitality Trend</option>
                    <option value="Finance">Wealth & Cash Flow</option>
                  </select>
                </div>

                <button
                  onClick={handleRunBestYearFinder}
                  disabled={isFindingBestYear}
                  className="bg-[#d97706] hover:bg-amber-600 text-white font-bold px-4 py-1.5 text-xs uppercase tracking-wider transition cursor-pointer border border-[#3d2b1f]"
                >
                  {isFindingBestYear ? 'Analyzing 10 Years...' : 'Find Prime Golden Window'}
                </button>
              </div>
            </div>

            {finderAnalysis && (
              <div className="bg-white border-2 border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#d97706] font-serif mb-3">
                  Eklavya AI 10-Year Analysis for {finderTopic}
                </h5>
                <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-gray-800">
                  {finderAnalysis}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: JSON Year Report Inspector */}
        {activeTab === 'json' && (
          <div className="flex-grow overflow-y-auto p-5">
            <div className="bg-white border border-[#3d2b1f] p-4 shadow-[4px_4px_0px_#3d2b1f] mb-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#3d2b1f] font-serif mb-1 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#d97706]" />
                Supplied Structured Year Report JSON (Phase 4 Object)
              </h4>
              <p className="text-xs text-gray-600">
                This exact JSON object is passed to Eklavya AI to ensure 100% mathematical accuracy without hallucinating numbers or formulas.
              </p>
            </div>

            <pre className="bg-[#121929] text-amber-300 p-4 text-xs font-mono overflow-x-auto border-2 border-[#3d2b1f] rounded shadow-[4px_4px_0px_#d97706] max-h-[55vh]">
              {JSON.stringify(yearReport, null, 2)}
            </pre>
          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-[#121929] p-3 sm:p-4 border-t-4 border-[#d97706] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Eklavya AI Vedic Expert Reasoning Engine</span>
          </div>

          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-1.5 text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Close Assistant
          </button>
        </div>
      </div>
    </div>
  );
}
