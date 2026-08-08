import { NumerologyResult, PersonDetails } from '../types';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Compass,
  Printer,
  HeartPulse,
  Baby,
  Briefcase,
  Users,
  ShieldAlert,
  Coins,
  Sparkles,
  Gem,
  ChevronDown,
  ChevronRight,
  Landmark,
  Car
} from 'lucide-react';
import { useState } from 'react';

interface PredictionReadingViewProps {
  result: NumerologyResult;
  details: PersonDetails;
  onOpenReport: () => void;
}

export function PredictionReadingView({ result, details, onOpenReport }: PredictionReadingViewProps) {
  const {
    basicNumber,
    destinyNumber,
    mahadasha,
    antardasha,
    targetGridCounts,
    yogas,
    missingRemedies,
    yearlyPrediction,
    pratyantardashaList
  } = result;

  const targetYear = details.targetYear;
  const age = result.ageInTargetYear;
  const pyn = antardasha.number; // Personal Year Number is Antardasha

  // Accordion open/collapse states for detailed sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    health: true,
    conception: true,
    career: true,
    relationship: true,
    finance: true
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ----------------------------------------------------
  // SECTION 1: Health & Medical Analysis
  // ----------------------------------------------------
  const healthVulnerabilities: string[] = [];
  const illnessYogaRisks: string[] = [];

  // Check planetary health indications
  if (pyn === 1 || basicNumber === 1 || mahadasha.number === 1) {
    healthVulnerabilities.push('Sun Vibration: Pay attention to eye strain, heart vitality, blood circulation, and bone density.');
  }
  if (pyn === 2 || basicNumber === 2 || mahadasha.number === 2) {
    healthVulnerabilities.push('Moon Vibration: Mind sensitivity, fluid balance, anxiety, digestive acidity, and sleep rhythm.');
  }
  if (pyn === 3 || basicNumber === 3 || mahadasha.number === 3) {
    healthVulnerabilities.push('Jupiter Vibration: Liver function, cholesterol management, weight control, and throat care.');
  }
  if (pyn === 4 || basicNumber === 4 || mahadasha.number === 4) {
    healthVulnerabilities.push('Rahu Vibration: Sudden nervous stress, unexplained headaches, skin allergies, and sleep disturbances.');
  }
  if (pyn === 5 || basicNumber === 5 || mahadasha.number === 5) {
    healthVulnerabilities.push('Mercury Vibration: Nervous system tension, speech strain, respiratory sensitivity, and digestion.');
  }
  if (pyn === 6 || basicNumber === 6 || mahadasha.number === 6) {
    healthVulnerabilities.push('Venus Vibration: Kidney health, throat/vocal cord care, hormonal balance, and sugar levels.');
  }
  if (pyn === 7 || basicNumber === 7 || mahadasha.number === 7) {
    healthVulnerabilities.push('Ketu Vibration: Overthinking, spiritual fatigue, joint stiffness, and psychosomatic tension.');
  }
  if (pyn === 8 || basicNumber === 8 || mahadasha.number === 8) {
    healthVulnerabilities.push('Saturn Vibration: Chronic joint pain, backache, teeth/bone health, and slow digestion.');
  }
  if (pyn === 9 || basicNumber === 9 || mahadasha.number === 9) {
    healthVulnerabilities.push('Mars Vibration: Blood pressure spikes, muscular strain, inflammatory conditions, and accidental cuts.');
  }

  // Check Grid Yogas for illness
  const has319 = yogas.some((y) => y.id === '319' || y.numbers.join(',') === '3,1,9');
  const has284 = yogas.some((y) => y.id === '284' || y.numbers.join(',') === '2,8,4');
  const has456 = yogas.some((y) => y.id === '456');

  if (has319) {
    illnessYogaRisks.push('3-1-9 Thought Plane Active: Intense mental activity may trigger migraines, stress, and insomnia. Practice daily meditation.');
  }
  if (has284) {
    illnessYogaRisks.push('2-8-4 Action Plane Active: Physical exertion and fatigue risk. Watch out for joint stiffness and back strain.');
  }
  if (!has456) {
    illnessYogaRisks.push('Missing 4-5-6 Central Equilibrium: Potential energetic fluctuations during seasonal transitions. Immune boosting recommended.');
  }

  // ----------------------------------------------------
  // SECTION 2: Child Birth & Conception Planning
  // ----------------------------------------------------
  let conceptionStatus = 'Moderate / Standard Timing';
  let conceptionAdvice = '';
  const fertileSubPeriods: string[] = [];

  if ([2, 3, 5, 6].includes(pyn)) {
    conceptionStatus = '★ Highly Favorable Window for Conception & Family Planning';
    conceptionAdvice = `In ${targetYear}, the Personal Year Vibration ${pyn} (${antardasha.planet}) works in strong harmony with Jupiter (3) and Venus (6) creative energies. This is an auspicious period for planning childbirth, fertility treatments, and family extension.`;
  } else if ([1, 7].includes(pyn)) {
    conceptionStatus = 'Favorable with Proper Guidance';
    conceptionAdvice = `Personal Year ${pyn} provides good vitality, but spiritual and lifestyle discipline is required. Consult medical specialists and maintain balanced nutrition during conception efforts.`;
  } else {
    conceptionStatus = 'Caution & Detailed Medical Monitoring Required';
    conceptionAdvice = `Personal Year ${pyn} (influenced by Rahu, Saturn, or Mars vibrations) requires thorough medical checkups, stress management, and proper health precautions before proceeding with childbirth planning.`;
  }

  // Find sub-periods with numbers 2, 3, 5, 6 for childbirth
  pratyantardashaList.forEach((pd) => {
    if ([2, 3, 5, 6].includes(pd.number)) {
      fertileSubPeriods.push(`PD-${pd.index} (${pd.planet} - No. ${pd.number}): ${pd.startDate} to ${pd.endDate}`);
    }
  });

  // ----------------------------------------------------
  // SECTION 3: Career, Business & Professional Guidance
  // ----------------------------------------------------
  const careerOpportunities: string[] = [];
  const careerCautions: string[] = [];

  if ([1, 3, 5, 8].includes(pyn)) {
    careerOpportunities.push(`High growth year under Personal Year ${pyn}. Excellent for job promotions, business expansions, and leadership roles.`);
    careerOpportunities.push('Strong professional visibility; superior officers and clients respond positively to initiatives.');
  } else if ([2, 6, 7].includes(pyn)) {
    careerOpportunities.push(`Strategic year for partnerships, skill upgrading, creative projects, and team collaboration.`);
    careerOpportunities.push('Focus on steady progress rather than aggressive risky leaps.');
  } else {
    careerOpportunities.push('Restructuring year: Re-evaluate operating models, streamline expenses, and strengthen existing workflows.');
  }

  if (pyn === 4 || pyn === 9) {
    careerCautions.push('Avoid hasty job switches without verified offers. Double check contracts and legal paperwork.');
  } else if (pyn === 8) {
    careerCautions.push('Workplace workload will be heavy. Practice patience with bureaucracy and senior management.');
  } else {
    careerCautions.push('Maintain clear workplace communication to avoid misunderstandings during transition months.');
  }

  // ----------------------------------------------------
  // SECTION 4: Relationships, Marriage, Divorce, Extra-Marital & Litigation Cautions
  // ----------------------------------------------------
  let maritalHarmonyText = '';
  let divorceRiskText = '';
  let extraMaritalCaution = '';
  let litigationText = '';

  if ([2, 6].includes(pyn)) {
    maritalHarmonyText = `Strong emotional bonding and romantic harmony during Personal Year ${pyn}. Ideal for marriage proposals and deepening marital understanding.`;
    divorceRiskText = 'Low divorce risk. Mutual compassion resolves lingering differences.';
  } else if ([4, 8, 9].includes(pyn)) {
    maritalHarmonyText = `Ego clashes and temperamental friction possible under heavy Rahu/Saturn/Mars vibrations. Open dialogue and compromise are vital.`;
    divorceRiskText = 'Moderate to high friction window. Avoid impulsive separation decisions during heated arguments.';
  } else {
    maritalHarmonyText = `Balanced relationship period. Focus on shared household goals and quality time together.`;
    divorceRiskText = 'Stable relationship status provided financial and family discussions remain transparent.';
  }

  // Extra-Marital Caution
  if ([4, 6].includes(pyn) || (mahadasha.number === 4 && antardasha.number === 6)) {
    extraMaritalCaution = `⚠️ Cautionary Alert: Active Venus-Rahu or Personal Year ${pyn} vibrations can create sudden emotional distractions or illusive external attractions. Guard marital integrity and avoid compromising situations that endanger family stability.`;
  } else {
    extraMaritalCaution = `Maintain healthy boundaries in professional and social interactions. Loyalty and commitment bring peace.`;
  }

  // Litigation & Legal Alert
  if ([4, 8, 9].includes(pyn) || (mahadasha.number === 8 && antardasha.number === 4)) {
    litigationText = `⚠️ Legal Caution Window: Saturn/Rahu/Mars combinations in ${targetYear} advise against unnecessary lawsuits, court battles, or property disputes. Seek out-of-court settlements whenever possible.`;
  } else {
    litigationText = `Favorable legal positioning. Standard contracts and property documentations move forward smoothly.`;
  }

  // ----------------------------------------------------
  // SECTION 5: Finance, Property & Vehicle Buying Yogas
  // ----------------------------------------------------
  const hasPropertyYoga = yogas.some((y) => y.id === '258' || y.numbers.join(',') === '2,5,8') || (targetGridCounts[2] > 0 && targetGridCounts[8] > 0);
  const hasVehicleYoga = yogas.some((y) => y.id === '456' || y.numbers.join(',') === '4,5,6') || [3, 5, 6].includes(pyn);

  return (
    <div className="bg-white border border-[#3d2b1f] shadow-[6px_6px_0px_#3d2b1f] p-6 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b-2 border-[#3d2b1f]">
        <div>
          <h3 className="text-xl font-bold text-[#3d2b1f] font-serif flex items-center gap-2 uppercase tracking-wide">
            <FileText className="w-5 h-5 text-[#d97706]" />
            Step 10 – Detailed Prediction Reading ({targetYear})
          </h3>
          <p className="text-xs font-medium text-gray-600 mt-1 uppercase tracking-wider">
            Health & Medical analysis, Childbirth planning, Career growth, Relationship harmony, Litigation cautions, and Property/Vehicle Yogas.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="flex items-center gap-2 bg-[#d97706] hover:bg-amber-600 text-white font-bold px-5 py-2.5 shadow-[2px_2px_0px_#3d2b1f] transition cursor-pointer text-xs uppercase tracking-wider shrink-0"
        >
          <Printer className="w-4 h-4 text-white" />
          <span>Print / Export Full PDF Report</span>
        </button>
      </div>

      {/* Primary Personal Year Overview Banner */}
      <div className="bg-[#fffcf5] border-2 border-[#3d2b1f] p-6 shadow-[4px_4px_0px_#3d2b1f]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-3 border-b border-[#3d2b1f]/20">
          <h4 className="text-lg font-bold text-[#3d2b1f] font-serif uppercase tracking-wide">
            {yearlyPrediction.title} (Age {age} in Year {targetYear})
          </h4>
          <span className="px-3 py-1 bg-[#3d2b1f] text-white font-extrabold text-xs uppercase tracking-widest">
            Personal Year Number {yearlyPrediction.personalYearNumber} ({antardasha.planet})
          </span>
        </div>
        <p className="text-xs text-[#3d2b1f] leading-relaxed font-medium">
          {yearlyPrediction.numericalGuidance}
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 1: Health & Medical Analysis & Remedies */}
      {/* ---------------------------------------------------- */}
      <div className="border-2 border-[#3d2b1f] bg-white shadow-[4px_4px_0px_#3d2b1f]">
        <div
          onClick={() => toggleSection('health')}
          className="bg-[#3d2b1f] text-white p-4 flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <HeartPulse className="w-5 h-5 text-[#d97706]" />
            <h4 className="text-sm font-bold uppercase tracking-wider font-serif">
              1. Health & Medical Analysis, Illness Risks & Specific Remedies ({targetYear})
            </h4>
          </div>
          <span className="text-xs text-[#d97706] font-bold">
            {openSections.health ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </span>
        </div>

        {openSections.health && (
          <div className="p-6 space-y-6 text-xs text-[#3d2b1f]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vulnerabilities */}
              <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-[#d97706] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Yearly Organ & System Vulnerabilities
                </h5>
                <ul className="space-y-2 list-disc list-inside text-gray-800 font-medium leading-relaxed">
                  {healthVulnerabilities.map((v, i) => (
                    <li key={`vuln-${i}`}>{v}</li>
                  ))}
                </ul>
              </div>

              {/* Yoga Illness Risks */}
              <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> Illness Risks from Active Grid Yogas
                </h5>
                <ul className="space-y-2 list-disc list-inside text-gray-800 font-medium leading-relaxed">
                  {illnessYogaRisks.map((yr, i) => (
                    <li key={`yr-${i}`}>{yr}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Comprehensive Health Remedies Block: Mantras, Crystals, Donations */}
            <div className="bg-[#fffcf5] border border-[#3d2b1f] p-5 space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-[#3d2b1f] font-serif border-b border-[#3d2b1f]/20 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d97706]" /> Recommended Health Remedies for Year {targetYear}
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Mantras */}
                <div className="bg-white p-3 border border-[#3d2b1f] space-y-1">
                  <span className="font-bold text-[#d97706] uppercase tracking-wider text-[10px] block">
                    1. Sacred Mantras
                  </span>
                  <p className="font-bold text-[#3d2b1f]">Mahamrityunjaya Mantra & Om Namah Shivaya</p>
                  <p className="text-gray-600 text-[11px]">
                    Recite 108 times daily during sunrise to strengthen vital prana energy and shield against acute illnesses.
                  </p>
                </div>

                {/* Crystals */}
                <div className="bg-white p-3 border border-[#3d2b1f] space-y-1">
                  <span className="font-bold text-[#d97706] uppercase tracking-wider text-[10px] block">
                    2. Healing Crystals
                  </span>
                  <p className="font-bold text-[#3d2b1f]">Amethyst & Green Aventurine / Clear Quartz</p>
                  <p className="text-gray-600 text-[11px]">
                    Keep an Amethyst cluster near bedside for stress relief, and wear Green Aventurine bracelet for immune balance.
                  </p>
                </div>

                {/* Charity & Donations */}
                <div className="bg-white p-3 border border-[#3d2b1f] space-y-1">
                  <span className="font-bold text-[#d97706] uppercase tracking-wider text-[10px] block">
                    3. Weekly Charity & Donation
                  </span>
                  <p className="font-bold text-[#3d2b1f]">Feed birds & donate green grains / milk</p>
                  <p className="text-gray-600 text-[11px]">
                    Donate green fodder to cows on Wednesdays, feed birds daily, and offer water/milk at temples on Mondays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: Child Birth & Conception Planning */}
      {/* ---------------------------------------------------- */}
      <div className="border-2 border-[#3d2b1f] bg-white shadow-[4px_4px_0px_#3d2b1f]">
        <div
          onClick={() => toggleSection('conception')}
          className="bg-[#3d2b1f] text-white p-4 flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <Baby className="w-5 h-5 text-[#d97706]" />
            <h4 className="text-sm font-bold uppercase tracking-wider font-serif">
              2. Child Birth & Conception Planning ({targetYear})
            </h4>
          </div>
          <span className="text-xs text-[#d97706] font-bold">
            {openSections.conception ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </span>
        </div>

        {openSections.conception && (
          <div className="p-6 space-y-4 text-xs text-[#3d2b1f]">
            <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3d2b1f] uppercase tracking-wider">Conception Timing Status:</span>
                <span className="px-3 py-1 bg-[#3d2b1f] text-white font-extrabold text-[11px] uppercase tracking-wider">
                  {conceptionStatus}
                </span>
              </div>
              <p className="text-gray-800 leading-relaxed font-medium">{conceptionAdvice}</p>
            </div>

            {fertileSubPeriods.length > 0 && (
              <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-[#d97706]">
                  Auspicious Sub-Periods (Pratyantardasha) for Child Birth Planning in {targetYear}:
                </h5>
                <ul className="space-y-1 list-disc list-inside text-gray-800 font-bold">
                  {fertileSubPeriods.map((f, i) => (
                    <li key={`fert-${i}`}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: Career, Business & Professional Guidance */}
      {/* ---------------------------------------------------- */}
      <div className="border-2 border-[#3d2b1f] bg-white shadow-[4px_4px_0px_#3d2b1f]">
        <div
          onClick={() => toggleSection('career')}
          className="bg-[#3d2b1f] text-white p-4 flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-[#d97706]" />
            <h4 className="text-sm font-bold uppercase tracking-wider font-serif">
              3. Career, Business Expansion & Job Opportunities ({targetYear})
            </h4>
          </div>
          <span className="text-xs text-[#d97706] font-bold">
            {openSections.career ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </span>
        </div>

        {openSections.career && (
          <div className="p-6 space-y-4 text-xs text-[#3d2b1f]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Career Growth & Promotions
                </h5>
                <ul className="space-y-1.5 list-disc list-inside text-gray-800 font-medium leading-relaxed">
                  {careerOpportunities.map((op, i) => (
                    <li key={`cop-${i}`}>{op}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Workplace Cautions
                </h5>
                <ul className="space-y-1.5 list-disc list-inside text-gray-800 font-medium leading-relaxed">
                  {careerCautions.map((cc, i) => (
                    <li key={`cca-${i}`}>{cc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 4: Relationships, Marriage, Divorce, Extra-Marital & Litigation Cautions */}
      {/* ---------------------------------------------------- */}
      <div className="border-2 border-[#3d2b1f] bg-white shadow-[4px_4px_0px_#3d2b1f]">
        <div
          onClick={() => toggleSection('relationship')}
          className="bg-[#3d2b1f] text-white p-4 flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#d97706]" />
            <h4 className="text-sm font-bold uppercase tracking-wider font-serif">
              4. Relationships, Marriage, Extra-Marital Caution & Litigation Alerts ({targetYear})
            </h4>
          </div>
          <span className="text-xs text-[#d97706] font-bold">
            {openSections.relationship ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </span>
        </div>

        {openSections.relationship && (
          <div className="p-6 space-y-4 text-xs text-[#3d2b1f]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Marriage & Harmony */}
              <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-[#3d2b1f]">
                  Marital Harmony & Separation/Divorce Risk Evaluation:
                </h5>
                <p className="text-gray-800 font-medium leading-relaxed">{maritalHarmonyText}</p>
                <div className="p-2 bg-white border border-[#3d2b1f]/30 font-bold text-gray-900">
                  Status: {divorceRiskText}
                </div>
              </div>

              {/* Extra-Marital Caution */}
              <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> Extra-Marital Attraction Caution:
                </h5>
                <p className="text-gray-800 font-medium leading-relaxed">{extraMaritalCaution}</p>
              </div>
            </div>

            {/* Litigation & Legal Alert */}
            <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Litigation, Court Cases & Legal Dispute Alert:
              </h5>
              <p className="text-gray-800 font-medium leading-relaxed">{litigationText}</p>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 5: Finance, Property & Vehicle Buying Yogas */}
      {/* ---------------------------------------------------- */}
      <div className="border-2 border-[#3d2b1f] bg-white shadow-[4px_4px_0px_#3d2b1f]">
        <div
          onClick={() => toggleSection('finance')}
          className="bg-[#3d2b1f] text-white p-4 flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-[#d97706]" />
            <h4 className="text-sm font-bold uppercase tracking-wider font-serif">
              5. Finance, Real Estate Property & Vehicle Purchase Yogas ({targetYear})
            </h4>
          </div>
          <span className="text-xs text-[#d97706] font-bold">
            {openSections.finance ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </span>
        </div>

        {openSections.finance && (
          <div className="p-6 space-y-4 text-xs text-[#3d2b1f]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Property Buying Yoga */}
              <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-[#d97706] flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-[#d97706]" /> Property / Land Buying Yoga ({targetYear})
                </h5>
                {hasPropertyYoga ? (
                  <p className="text-emerald-800 font-bold leading-relaxed">
                    ★ Strong Real Estate & Property Purchase Yoga active in {targetYear}! (Influenced by 2-5-8 Earth Empire or 2-8 Land combinations). Excellent time for acquiring flat, plot, or commercial property.
                  </p>
                ) : (
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Standard property alignment in {targetYear}. Property acquisitions require careful legal verification and structured financing before booking.
                  </p>
                )}
              </div>

              {/* Vehicle Buying Yoga */}
              <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-[#d97706] flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#d97706]" /> Vehicle Purchase Yoga ({targetYear})
                </h5>
                {hasVehicleYoga ? (
                  <p className="text-emerald-800 font-bold leading-relaxed">
                    ★ Favorable Vehicle Purchase Yoga active! Personal Year {pyn} combined with Venus/Jupiter vibrations indicates auspicious timing for buying a car, 2-wheeler, or luxury transport asset.
                  </p>
                ) : (
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Vehicle purchases can proceed with normal planning. Choose auspicious weekday timings (Fridays for Venus or Thursdays for Jupiter) when purchasing.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
