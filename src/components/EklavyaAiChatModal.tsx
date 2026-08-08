import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
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
  const pdText = report.Pratyantardashas.map(pd => `• PD ${pd.number} (${pd.planet}): ${pd.startDate} to ${pd.endDate}`).join('\n');
  const yogasText = report.ActiveYogas.length > 0
    ? report.ActiveYogas.map(y => `• **${y.name}**: ${y.description}`).join('\n')
    : '• Balanced grid matrix with no volatile malefic combinations.';

  // 1. Brain Stroke, Paralysis & Neurological Signaling
  if (qLower.includes('stroke') || qLower.includes('paralysis') || qLower.includes('brain') || qLower.includes('neurological')) {
    return `🏥 **Neurological Signaling & Brain Health Assessment for ${report.fullName} (Year ${report.selectedYear}, Age ${report.age})**\n\n` +
      `**Core Grid Diagnostic:**\n` +
      `• Basic Number (BN): **${report.BN}** | Destiny Number (DN): **${report.DN}**\n` +
      `• Active Mahadasha: **${report.Mahadasha.planet} (${report.Mahadasha.number})** | Antardasha: **${report.Antardasha.planet} (${report.Antardasha.number})**\n\n` +
      `**Vedic Organ & Nerve Vibration:**\n` +
      `• **Mercury (5)** rules the brain's motor pathways, central nervous system, speech centers, and synapsis signaling. ${report.BN === 5 || report.DN === 5 || report.Mahadasha.number === 5 ? 'Mercury energy is active in your primary chart.' : 'Keep Mercury balanced through grounding routines.'}\n` +
      `• **Saturn (8) & Rahu (4)** govern long-term structural nerves, spine, and sudden electrical impulses in the body.\n` +
      `• **Moon (2)** governs fluid pressure and cerebral spinal fluid circulation.\n\n` +
      `**Pratyantardasha (PD) Windows for ${report.selectedYear}:**\n${pdText}\n\n` +
      `**Active Yogas & Balance:**\n${yogasText}\n\n` +
      `**Supportive Vedic Remedies:**\n` +
      `• Recite *Om Budhaya Namah* 108 times daily for nervous system equilibrium.\n` +
      `• Wear or place Green Jade near your sleeping area.\n\n` +
      `*Medical Disclaimer: Vedic Numerology provides vibrational perspective and supportive timeline guidance. It is NOT a medical diagnosis or promise of cure. Always consult qualified neurologists and doctors.*`;
  }

  // 2. Heart Health, Blood Pressure & Circulation
  if (qLower.includes('heart') || qLower.includes('blood pressure') || qLower.includes('circulation')) {
    return `❤️ **Cardiovascular & Circulation Health Trends (${report.selectedYear}, Age ${report.age})**\n\n` +
      `• **Sun (1)** rules heart vitality, arterial rhythm, and core stamina.\n` +
      `• **Moon (2) & Mars (9)** rule blood pressure, emotional surges, and hemoglobin levels.\n` +
      `• Your active **${report.Mahadasha.planet} / ${report.Antardasha.planet}** dasha advises maintaining steady emotional balance and monitoring sodium intake during Mars or Sun sub-periods.\n\n` +
      `**Pratyantardasha Windows:**\n${pdText}\n\n` +
      `**Remedies:** Offer water to the rising Sun daily in a copper vessel; recite *Om Suryaya Namah*.`;
  }

  // 3. Rahu/Ketu/Saturn Long-term Illness, Tumors, Cancer
  if (qLower.includes('cancer') || qLower.includes('tumor') || qLower.includes('long-term illness') || qLower.includes('rahu') || qLower.includes('ketu')) {
    return `⚕️ **Vedic Malefic Energy & Immunity Assessment (${report.selectedYear}, Age ${report.age})**\n\n` +
      `• **Rahu (4) & Ketu (7)** represent subtle viral energy, shadow vibrations, and unexpected cell changes.\n` +
      `• **Saturn (8)** indicates chronic, slow-developing patterns or bone/joint alignment.\n` +
      `• Current Mahadasha (${report.Mahadasha.planet} ${report.Mahadasha.number}) and Antardasha (${report.Antardasha.planet} ${report.Antardasha.number}) show ${report.Antardasha.number === 4 || report.Antardasha.number === 7 || report.Antardasha.number === 8 ? 'increased need for regular medical checkups and cellular detox.' : 'a protective energetic barrier against severe malefic afflictions.'}\n\n` +
      `**PD Date Ranges:**\n${pdText}\n\n` +
      `*Disclaimer: Consult licensed medical practitioners for health screening.*`;
  }

  // 4. Fevers, Infections, Surgeries, Accidents
  if (qLower.includes('fever') || qLower.includes('infection') || qLower.includes('accident') || qLower.includes('surgery') || qLower.includes('injury')) {
    return `🛡️ **Vitality & Safety Analysis (${report.selectedYear}, Age ${report.age})**\n\n` +
      `• **Mars (9)** governs heat, fevers, blood vitality, and surgical procedures.\n` +
      `• **Rahu (4)** rules sudden incidents or viral infections.\n` +
      `• Exercise caution in driving and physical exertion during Mars / Rahu Pratyantardashas.\n\n` +
      `**PD Date Ranges:**\n${pdText}\n\n` +
      `**Remedy:** Recite Hanuman Chalisa on Tuesdays for physical protection.`;
  }

  // 5. Child Development, Autism, Speech, School
  if (qLower.includes('autism') || qLower.includes('speech') || (qLower.includes('child') && (qLower.includes('school') || qLower.includes('develop')))) {
    return `🧒 **Child Milestone, Speech & Academic Growth Analysis (${report.selectedYear})**\n\n` +
      `• **Mercury (5)** governs speech clarity, vocabulary retention, and sensory processing.\n` +
      `• **Moon (2)** governs emotional comfort, sleep, and social bonding.\n` +
      `• **Jupiter (3)** expands cognitive learning and comprehension in school.\n\n` +
      `**Timeline & Sub-Periods:**\n${pdText}\n\n` +
      `**Supportive Guidance:** Keep a green clover or jade crystal near study desk; engage in rhythmic speech therapy and positive praise.`;
  }

  // 6. Pregnancy & Conceiving Favorable Months
  if (qLower.includes('conceiv') || qLower.includes('pregnan') || qLower.includes('childbirth')) {
    let genderNote = '';
    if (report.gender === 'Male') {
      genderNote = `As a male (${report.fullName}), your active Jupiter (${report.DN}) and Venus vibrations provide paternal support and stability to your spouse during conception windows.`;
    } else {
      genderNote = `As a female (${report.fullName}), your Venus (6) and Jupiter (3) cycles provide strong fertile energy and maternal strength.`;
    }

    return `👶 **Pregnancy & Family Growth Window (${report.selectedYear})**\n\n` +
      `${genderNote}\n\n` +
      `• **Jupiter (3) & Venus (6)** are the primary significators of progeny and family creation.\n` +
      `• **Pratyantardasha Windows:**\n${pdText}\n\n` +
      `**Remedies:** Keep yellow brass or cow ghee lamps lit on Thursdays for Jupiter's grace.`;
  }

  // 7. Government Competitive Exams & University Entrance
  if (qLower.includes('government') || qLower.includes('entrance') || (qLower.includes('exam') && qLower.includes('competitive'))) {
    return `🎓 **Government Exam & Entrance Merit Assessment (${report.selectedYear})**\n\n` +
      `• **Sun (1)** rules government merit, administrative selection, authority positions, and official approval.\n` +
      `• **Mercury (5) & Jupiter (3)** grant logical speed, memory retention, and high rank in competitive entrance tests.\n` +
      `• Your active **${report.Mahadasha.planet} MD** and **${report.Antardasha.planet} AD** provide ${report.Antardasha.number === 1 || report.Antardasha.number === 3 || report.Antardasha.number === 5 ? 'a highly favorable window for clearing examinations with top scores.' : 'a period requiring disciplined preparation and consistency.'}\n\n` +
      `**Key Test Date Windows (PDs):**\n${pdText}\n\n` +
      `**Exam Remedy:** Offer water to the Sun every morning and recite *Om Aditya Namah* before exam preparation.`;
  }

  // 8. Job Promotion, Salary Increment, Authority Boost
  if (qLower.includes('promot') || qLower.includes('salary') || qLower.includes('increment') || qLower.includes('authority')) {
    return `📈 **Career Promotion & Increment Prospects (${report.selectedYear}, Age ${report.age})**\n\n` +
      `• **Sun (1)** brings leadership elevation and recognition from superiors.\n` +
      `• **Saturn (8) & Mercury (5)** deliver financial increments and contractual growth.\n` +
      `• Your grid indicates strong potential for role expansion during Sun (1), Mercury (5), and Venus (6) Pratyantardasha cycles.\n\n` +
      `**Favorable Action Windows:**\n${pdText}\n\n` +
      `**Strategy:** Present performance metrics clearly to management during high-energy PD windows.`;
  }

  // 9. Job Change & Company Shift
  if (qLower.includes('change') && (qLower.includes('job') || qLower.includes('company') || qLower.includes('shifting'))) {
    return `🔄 **Job Change & Career Transition Analysis (${report.selectedYear})**\n\n` +
      `• **Rahu (4) & Mercury (5)** trigger career mobility, new job offers, and company shifts.\n` +
      `• **Jupiter (3)** ensures that job transitions lead to salary growth and professional learning.\n\n` +
      `**Optimal Switch Windows (PDs):**\n${pdText}\n\n` +
      `**Remedy:** Keep green cardamom in wallet on interview days for Mercury's blessing.`;
  }

  // 10. Business Startup / New Venture
  if (qLower.includes('startup') || qLower.includes('new venture') || (qLower.includes('starting') && qLower.includes('business'))) {
    return `🚀 **New Business Venture & Startup Feasibility (${report.selectedYear})**\n\n` +
      `• **Mercury (5)** rules commercial trade, market expansion, and business strategy.\n` +
      `• **Venus (6)** brings luxury branding, investor capital, and customer attraction.\n` +
      `• Launching during Mercury (5) or Venus (6) Pratyantardasha maximizes market reception.\n\n` +
      `**Launch Windows (PDs):**\n${pdText}`;
  }

  // 11. Business Recovery from Losses
  if (qLower.includes('loss') || qLower.includes('recover')) {
    return `⚖️ **Financial Recovery & Loss Reversal Strategy (${report.selectedYear})**\n\n` +
      `• **Saturn (8)** governs debt restructuring, cost optimization, and steady recovery.\n` +
      `• **Mercury (5)** aids renegotiation of contracts and cash flow stabilization.\n\n` +
      `**Recovery Timeline:**\n${pdText}`;
  }

  // 12. Foreign Work, Overseas Clients, Global Trade
  if (qLower.includes('foreign') || qLower.includes('overseas') || qLower.includes('global') || qLower.includes('visa')) {
    return `✈️ **Foreign Work, Overseas Clients & Global Trade (${report.selectedYear})**\n\n` +
      `• **Rahu (4) & Ketu (7)** represent international travel, foreign client contracts, and cross-border trade.\n` +
      `• **Moon (2)** rules overseas voyages and water-crossing travel.\n\n` +
      `**Foreign Window (PDs):**\n${pdText}`;
  }

  // 13. Marriage & Life Partner
  if (qLower.includes('marri') || qLower.includes('life partner')) {
    return `💍 **Marriage & Life Partner Timing Analysis (${report.selectedYear})**\n\n` +
      `• **Venus (6)** is the primary planet of marital harmony, love, and life partnership.\n` +
      `• **Moon (2) & Jupiter (3)** bring emotional compatibility, family approval, and auspicious ceremonies.\n\n` +
      `**Auspicious Marriage Windows (PDs):**\n${pdText}`;
  }

  // 14. Relationships, Proposals & Compatibility
  if (qLower.includes('proposal') || qLower.includes('love') || qLower.includes('relationship') || qLower.includes('situationship')) {
    return `💕 **Relationship & Proposal Acceptance Trends (${report.selectedYear})**\n\n` +
      `• **Venus (6) & Moon (2)** enhance charm, romantic attraction, and emotional expression.\n` +
      `• Proposing during Venus or Jupiter Pratyantardasha yields highest harmony.\n\n` +
      `**Romantic Windows:**\n${pdText}`;
  }

  // 15. Marital Discord, Divorce, Family Misunderstandings
  if (qLower.includes('divorce') || qLower.includes('discord') || qLower.includes('family misunderstanding') || qLower.includes('separation')) {
    return `🕊️ **Family Harmony & Conflict Resolution (${report.selectedYear})**\n\n` +
      `• **Saturn (8) & Mars (9)** can bring friction or misunderstandings if unmanaged.\n` +
      `• **Jupiter (3) & Moon (2)** restore peace, mutual understanding, and elder advice.\n\n` +
      `**Peace Periods (PDs):**\n${pdText}`;
  }

  // 16. Wealth Accumulation, Cash Flow & Earnings
  if (qLower.includes('wealth') || qLower.includes('cash flow') || qLower.includes('earnings') || qLower.includes('money')) {
    return `💰 **Wealth Accumulation & Cash Flow Report (${report.selectedYear})**\n\n` +
      `• **Venus (6)** governs financial luxury, assets, and high revenue streams.\n` +
      `• **Mercury (5)** ensures liquid cash flow and business profitability.\n` +
      `• **Saturn (8)** builds long-term wealth reserves and immovable assets.\n\n` +
      `**Wealth Windows (PDs):**\n${pdText}`;
  }

  // 17. Real Estate & Property Purchase
  if (qLower.includes('property') || qLower.includes('real estate') || qLower.includes('land') || qLower.includes('house')) {
    return `🏡 **Property, Land & Real Estate Acquisition (${report.selectedYear})**\n\n` +
      `• **Mars (9)** governs land, construction, and property ownership.\n` +
      `• **Saturn (8)** governs structural buildings and long-term real estate holdings.\n\n` +
      `**Property Purchase Windows (PDs):**\n${pdText}`;
  }

  // 18. Stocks, Mutual Funds, Speculative Gains, Lottery
  if (qLower.includes('stock') || qLower.includes('lottery') || qLower.includes('speculat') || qLower.includes('invest')) {
    return `📊 **Speculative Investments & Market Trends (${report.selectedYear})**\n\n` +
      `• **Rahu (4)** triggers sudden speculative gains or market volatility.\n` +
      `• **Mercury (5) & Jupiter (3)** advise calculated, analytical investments rather than blind gambling.\n\n` +
      `**Investment Timing (PDs):**\n${pdText}`;
  }

  // 19. Debt & Loan Repayment
  if (qLower.includes('debt') || qLower.includes('loan') || qLower.includes('liability')) {
    return `💳 **Debt Relief & Loan Repayment Timeline (${report.selectedYear})**\n\n` +
      `• **Saturn (8) & Mars (9)** assist in structured debt settlement and clearing liabilities.\n\n` +
      `**Repayment Windows (PDs):**\n${pdText}`;
  }

  // 20. General / Custom Query
  return `✨ **Vedic Numerology Analysis for "${question}" (${report.selectedYear})**\n\n` +
    `• **User:** ${report.fullName} (DOB: ${report.dob}, Age: ${report.age})\n` +
    `• **Basic Number (Driver):** ${report.BN} | **Destiny Number (Conductor):** ${report.DN}\n` +
    `• **Current Dasha:** ${report.Mahadasha.planet} (${report.Mahadasha.number}) MD with ${report.Antardasha.planet} (${report.Antardasha.number}) AD\n\n` +
    `**Active Yogas:**\n${yogasText}\n\n` +
    `**Pratyantardasha (PD) Date Ranges for ${report.selectedYear}:**\n${pdText}\n\n` +
    `**Remedial Guidance:** Apply remedies for missing numbers (${report.Missing.join(', ') || 'None'}) to balance overall energy.`;
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
  const [isTopicsCollapsed, setIsTopicsCollapsed] = useState(false);
  const [isContextCollapsed, setIsContextCollapsed] = useState(false);
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

  // Gemini API Key management for static hostings (e.g. Netlify)
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_gemini_api_key') || '';
    }
    return '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);

  const getEffectiveApiKey = (): string => {
    const stored = customApiKey.trim();
    if (stored) return stored;
    return import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (typeof window !== 'undefined') {
      if (key.trim()) {
        localStorage.setItem('user_gemini_api_key', key.trim());
      } else {
        localStorage.removeItem('user_gemini_api_key');
      }
    }
  };

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

  // Helper functions for client-side Gemini AI calls when on static deployments (e.g., Netlify SPA)
  const callClientGeminiAi = async (report: YearReport, question: string): Promise<string | null> => {
    const apiKey = getEffectiveApiKey();
    if (!apiKey) return null;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.6-flash'];
    const ai = new GoogleGenAI({ apiKey });
    const contextPrompt = `
You are Eklavya AI, an expert master in Vedic Grid Numerology (3x3 Grid Matrix, Mahadasha, Antardasha, Pratyantardasha, Yogas, and Remedies).

SUPPLIED YEAR REPORT DATA FOR USER (${report.fullName}, DOB: ${report.dob}, Target Year: ${report.selectedYear}, Age: ${report.age}):
\`\`\`json
${JSON.stringify(report, null, 2)}
\`\`\`

USER QUESTION:
"${question}"

Provide a natural, insightful, date-specific, and accurate Eklavya AI Vedic Numerology response based on the supplied Year Report. Always include exact Pratyantardasha (PD) start and end dates when discussing timing. Include medical disclaimers if asking about health/children.
`;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contextPrompt
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        console.warn(`Client-side Gemini AI (${modelName}) failed, trying next model candidate:`, err?.message || err);
      }
    }
    return null;
  };

  const callClientGeminiCompare = async (year1: number, year2: number): Promise<string | null> => {
    const apiKey = getEffectiveApiKey();
    if (!apiKey) return null;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.6-flash'];
    const report1 = generateYearReport(details, year1);
    const report2 = generateYearReport(details, year2);
    const ai = new GoogleGenAI({ apiKey });

    const comparePrompt = `
You are Eklavya AI, an expert master in Vedic Grid Numerology.
Compare two distinct numerology years for ${details.firstName} ${details.surname}:
YEAR 1 (${year1}):
\`\`\`json
${JSON.stringify(report1, null, 2)}
\`\`\`

YEAR 2 (${year2}):
\`\`\`json
${JSON.stringify(report2, null, 2)}
\`\`\`

TASK:
Provide a comprehensive comparative synthesis comparing Year ${year1} vs Year ${year2} across Career, Finance, Property, Relationships, and Strategic Recommendations.
`;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: comparePrompt
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        console.warn(`Client-side Gemini compare (${modelName}) failed:`, err?.message || err);
      }
    }
    return null;
  };

  const callClientGeminiBestYear = async (startYear: number, endYear: number, topic: string): Promise<string | null> => {
    const apiKey = getEffectiveApiKey();
    if (!apiKey) return null;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.6-flash'];
    const yearReports: YearReport[] = [];
    for (let yr = startYear; yr <= endYear; yr++) {
      yearReports.push(generateYearReport(details, yr));
    }
    const ai = new GoogleGenAI({ apiKey });

    const windowPrompt = `
You are Eklavya AI, an expert master in Vedic Grid Numerology.
Analyze the 10-year timeline (${startYear} to ${endYear}) for ${details.firstName} ${details.surname} specifically for topic: "${topic}".

10-YEAR REPORTS DATA:
\`\`\`json
${JSON.stringify(yearReports, null, 2)}
\`\`\`

TASK:
1. Identify the SINGLE BEST YEAR and TOP 3 FAVORABLE WINDOWS between ${startYear} and ${endYear} for "${topic}".
2. Rank the top years with clear Vedic rationale.
`;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: windowPrompt
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        console.warn(`Client-side Gemini best year (${modelName}) failed:`, err?.message || err);
      }
    }
    return null;
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isAiLoading) return;

    // Automatically collapse suggested questions box so reading area takes full height
    setIsTopicsCollapsed(true);

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
        // Try client-side Gemini AI if server endpoint returns HTML (e.g., Netlify static host)
        const clientAiText = await callClientGeminiAi(yearReport, textToSend);
        aiResponseText = clientAiText || generateRuleBasedVedicAnswer(yearReport, textToSend);
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText || generateRuleBasedVedicAnswer(yearReport, textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const clientAiText = await callClientGeminiAi(yearReport, textToSend);
      const fallbackText = clientAiText || generateRuleBasedVedicAnswer(yearReport, textToSend);
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
        const clientCompareText = await callClientGeminiCompare(compareYear1, compareYear2);
        if (clientCompareText) {
          setCompareAnalysis(clientCompareText);
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
      }
    } catch (err: any) {
      const clientCompareText = await callClientGeminiCompare(compareYear1, compareYear2);
      setCompareAnalysis(clientCompareText || `Year comparison complete. Compare Year ${compareYear1} vs Year ${compareYear2} in report tabs.`);
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
        const clientBestText = await callClientGeminiBestYear(selectedYear, selectedYear + 9, finderTopic);
        if (clientBestText) {
          setFinderAnalysis(clientBestText);
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
      }
    } catch (err: any) {
      const clientBestText = await callClientGeminiBestYear(selectedYear, selectedYear + 9, finderTopic);
      setFinderAnalysis(clientBestText || `10-Year golden window search complete.`);
    } finally {
      setIsFindingBestYear(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-1 sm:p-4 overflow-y-auto">
      <div className="bg-[#f8f5f0] border-2 sm:border-4 border-[#3d2b1f] w-full max-w-5xl h-[96vh] sm:h-[92vh] flex flex-col shadow-[12px_12px_0px_#d97706] relative my-auto">
        {/* Modal Header */}
        <div className="bg-[#121929] text-white p-2.5 sm:p-5 border-b-2 sm:border-b-4 border-[#d97706] flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <img
              src="/eklavya-logo.png"
              alt="Eklavya Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full border border-[#d97706] bg-[#121929] p-0.5 shrink-0"
            />
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-xl font-bold font-serif uppercase tracking-wider text-white truncate">
                  Eklavya AI Assistant
                </h3>
                <span className="bg-[#d97706] text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 uppercase tracking-widest shrink-0">
                  AI EXPERT
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-amber-300 font-medium truncate hidden sm:block">
                Vedic Year Report Reasoning for {details.firstName} {details.surname} (DOB: {yearReport.dob})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Gemini API Key Toggle */}
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`px-2 py-1 text-[11px] sm:text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                getEffectiveApiKey()
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 hover:bg-emerald-900'
                  : 'bg-amber-950/90 text-amber-300 border-amber-500 hover:bg-amber-900 animate-pulse'
              }`}
              title="Configure Gemini API Key"
            >
              <span>🔑</span>
              <span className="hidden sm:inline">
                {getEffectiveApiKey() ? 'Gemini AI Active' : 'Set API Key'}
              </span>
            </button>

            {/* Year Selector */}
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 border border-white/20 text-xs">
              <Calendar className="w-3.5 h-3.5 text-[#d97706]" />
              <span className="text-gray-300 font-bold hidden sm:inline">Selected Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
                className="bg-[#121929] text-amber-300 font-bold px-1 py-0.5 border border-[#d97706] cursor-pointer outline-none text-xs"
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
              className="w-7 h-7 sm:w-8 sm:h-8 bg-white/10 hover:bg-[#d97706] rounded-full flex items-center justify-center text-white transition cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* API Key Management Bar */}
        {showKeyInput ? (
          <div className="bg-[#2a1b12] text-amber-100 px-4 py-2.5 border-b-2 border-[#d97706] text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">⚡ Live Gemini AI Status:</span>
              <span>
                {getEffectiveApiKey() 
                  ? (customApiKey.trim() ? 'Using Custom User API Key.' : '✅ System API Key active from Netlify! All users have instant AI access.') 
                  : '⚠️ No API Key found. Paste a key below or configure VITE_GEMINI_API_KEY in Netlify.'}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                placeholder={getEffectiveApiKey() ? "System key active (Optional custom key...)" : "Paste Gemini API Key (AIzaSy...)"}
                value={customApiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                className="bg-[#121929] text-white px-2.5 py-1 text-xs border border-amber-500/50 rounded focus:border-amber-400 outline-none w-full sm:w-64 placeholder:text-gray-400"
              />
              {customApiKey && (
                <button
                  onClick={() => handleSaveApiKey('')}
                  className="text-amber-400 hover:text-red-400 underline text-[11px] shrink-0 cursor-pointer"
                >
                  Clear Custom
                </button>
              )}
            </div>
          </div>
        ) : !getEffectiveApiKey() ? (
          <div className="bg-red-950/90 text-red-200 px-4 py-2 border-b-2 border-red-600 text-xs flex items-center justify-between shrink-0">
            <span>⚠️ Gemini AI is offline. Click 🔑 to enter an API key or configure VITE_GEMINI_API_KEY in Netlify.</span>
            <button 
              onClick={() => setShowKeyInput(true)}
              className="bg-red-800 hover:bg-red-700 text-white px-2 py-0.5 rounded font-bold cursor-pointer"
            >
              Enter Key
            </button>
          </div>
        ) : null}

        {/* Feature Navigation Tabs */}
        <div className="bg-[#1e293b] border-b-2 border-[#3d2b1f] p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2 overflow-x-auto whitespace-nowrap shrink-0 scrollbar-thin">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
              activeTab === 'chat'
                ? 'bg-[#d97706] text-white border-[#d97706] shadow'
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>AI Chat Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
              activeTab === 'compare'
                ? 'bg-[#d97706] text-white border-[#d97706] shadow'
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Compare Years</span>
          </button>

          <button
            onClick={() => setActiveTab('bestYear')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
              activeTab === 'bestYear'
                ? 'bg-[#d97706] text-white border-[#d97706] shadow'
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Best Window Finder (10-Yr)</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
              activeTab === 'json'
                ? 'bg-[#d97706] text-white border-[#d97706] shadow'
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>View Year Report JSON</span>
          </button>
        </div>

        {/* Tab 1: Conversational Chat */}
        {activeTab === 'chat' && (
          <div className="flex-grow flex flex-col overflow-hidden p-2 sm:p-4">
            {/* Context Summary Snapshot Header */}
            <div className="bg-white border border-[#3d2b1f] p-2 sm:p-3 mb-2 sm:mb-3 text-xs shrink-0 shadow-[2px_2px_0px_#3d2b1f]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#3d2b1f] uppercase tracking-wider font-serif text-[11px] sm:text-xs">
                    Year {selectedYear} Context:
                  </span>
                  <span className="bg-[#fffcf5] border border-[#3d2b1f]/30 px-2 py-0.5 text-[11px]">
                    BN: <strong className="text-[#d97706]">{yearReport.BN}</strong> | DN: <strong className="text-[#d97706]">{yearReport.DN}</strong>
                  </span>
                  {!isContextCollapsed && (
                    <>
                      <span className="bg-[#fffcf5] border border-[#3d2b1f]/30 px-2 py-0.5 text-[11px]">
                        MD: <strong>{yearReport.Mahadasha.planet} ({yearReport.Mahadasha.number})</strong>
                      </span>
                      <span className="bg-[#fffcf5] border border-[#3d2b1f]/30 px-2 py-0.5 text-[11px] hidden sm:inline">
                        AD: <strong>{yearReport.Antardasha.planet} ({yearReport.Antardasha.number})</strong>
                      </span>
                      <span className="bg-[#fffcf5] border border-[#3d2b1f]/30 px-2 py-0.5 text-[11px] hidden sm:inline">
                        Active Yogas: <strong>{yearReport.ActiveYogas.length}</strong>
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setIsContextCollapsed(!isContextCollapsed)}
                  className="text-[10px] uppercase font-bold text-[#d97706] hover:underline cursor-pointer shrink-0"
                >
                  {isContextCollapsed ? 'Show Details ▼' : 'Compact ▲'}
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-grow flex-1 overflow-y-auto space-y-3 p-2.5 sm:p-3 bg-white border border-[#3d2b1f] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)] min-h-[180px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[92%] sm:max-w-[85%] p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed border ${
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
            {isTopicsCollapsed ? (
              <div className="my-2 p-2 bg-[#fffcf5] border border-[#3d2b1f]/40 shrink-0 flex items-center justify-between shadow-[2px_2px_0px_#3d2b1f]">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-amber-700 font-bold text-xs shrink-0">💡 Suggested Topics:</span>
                  <span className="bg-[#121929] text-amber-300 text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider shrink-0 border border-[#d97706]">
                    {selectedTopicCategory}
                  </span>
                  <span className="text-xs text-gray-600 truncate hidden sm:inline">
                    (Click expand to select topics & questions)
                  </span>
                </div>
                <button
                  onClick={() => setIsTopicsCollapsed(false)}
                  className="bg-[#d97706] hover:bg-amber-600 text-white font-bold px-3 py-1 text-[11px] uppercase tracking-wider transition cursor-pointer border border-[#3d2b1f] shrink-0 flex items-center gap-1 shadow-sm"
                >
                  <span>Expand Questions</span>
                  <span>▲</span>
                </button>
              </div>
            ) : (
              <div className="py-2 px-2 bg-[#fffcf5] border border-[#3d2b1f]/40 my-2 shrink-0 space-y-2 relative shadow-[2px_2px_0px_#3d2b1f]">
                <div className="flex items-center justify-between gap-2 border-b border-[#3d2b1f]/20 pb-1">
                  <span className="text-[11px] font-extrabold uppercase text-[#3d2b1f] font-serif">
                    💡 Select a Topic & Question:
                  </span>
                  <button
                    onClick={() => setIsTopicsCollapsed(true)}
                    className="text-[#d97706] hover:text-amber-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span>Collapse Reading View</span>
                    <span>▼</span>
                  </button>
                </div>

                {/* Category Pills Header */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
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
                    ?.questions.map((q) => (
                      <button
                        key={`${selectedTopicCategory}-${q}`}
                        onClick={() => handleSendQuery(q)}
                        disabled={isAiLoading}
                        className="bg-white hover:bg-[#d97706] hover:text-white text-[#3d2b1f] border border-[#3d2b1f] px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer shrink-0 shadow-[2px_2px_0px_#3d2b1f]"
                      >
                        {q}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="mt-1 sm:mt-2 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder={`Ask Eklavya AI about career, marriage, health, remedies in Year ${selectedYear}...`}
                className="flex-grow bg-white border-2 border-[#3d2b1f] px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#d97706] shadow-[2px_2px_0px_#3d2b1f]"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={isAiLoading || !inputQuery.trim()}
                className="bg-[#d97706] hover:bg-amber-600 disabled:bg-gray-400 text-white font-bold px-3 py-2 sm:px-5 sm:py-2.5 text-xs uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition cursor-pointer border border-[#3d2b1f] shadow-[2px_2px_0px_#3d2b1f] shrink-0"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
