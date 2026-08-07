import { useState } from 'react';
import { PersonDetails, NumerologyResult } from '../types';
import { calculateNumerology, getRawDobDigits } from '../utils/numerology';
import { Calendar, ChevronDown, ChevronRight, Sparkles, Layers, ShieldCheck, Gem, Compass } from 'lucide-react';

interface LifeGridTimelineViewProps {
  details: PersonDetails;
  initialResult: NumerologyResult;
  onUpdateDetails: (newDetails: PersonDetails) => void;
}

export function LifeGridTimelineView({ details, initialResult, onUpdateDetails }: LifeGridTimelineViewProps) {
  const currentYear = new Date().getFullYear();
  const birthYear = details.year;
  const currentAge = currentYear - birthYear;

  // Selected age range tab (e.g. Current Age window, Age 0-20, 20-40, 40-60, 60-80, 80-100, 100-135)
  const [selectedRange, setSelectedRange] = useState<'current' | '0-20' | '21-40' | '41-60' | '61-80' | '81-100' | '101-135'>('current');

  // Specific selected year in the timeline to feature
  const [selectedYear, setSelectedYear] = useState<number>(details.targetYear || currentYear);

  // Expanded cards state (year -> boolean)
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({
    [details.targetYear || currentYear]: true
  });

  // Pratyantardasha override state per year (year -> pdNumber)
  const [pdOverrides, setPdOverrides] = useState<Record<number, number>>({});

  // Expanded yoga sections per year (year -> boolean)
  const [expandedYogas, setExpandedYogas] = useState<Record<number, boolean>>({
    [details.targetYear || currentYear]: true
  });

  // Individual yoga items expand state (yogaKey -> boolean)
  const [expandedYogaItems, setExpandedYogaItems] = useState<Record<string, boolean>>({});

  // Expanded prediction sections per year (year -> boolean)
  const [expandedPredictions, setExpandedPredictions] = useState<Record<number, boolean>>({});

  // Generate array of years based on selectedRange
  let displayYears: number[] = [];

  if (selectedRange === 'current') {
    // Show 7 years centered around current targetYear
    const startY = Math.max(birthYear, selectedYear - 3);
    for (let y = startY; y <= startY + 6; y++) {
      if (y - birthYear <= 135) displayYears.push(y);
    }
  } else if (selectedRange === '0-20') {
    for (let y = birthYear; y <= birthYear + 20; y++) displayYears.push(y);
  } else if (selectedRange === '21-40') {
    for (let y = birthYear + 21; y <= birthYear + 40; y++) displayYears.push(y);
  } else if (selectedRange === '41-60') {
    for (let y = birthYear + 41; y <= birthYear + 60; y++) displayYears.push(y);
  } else if (selectedRange === '61-80') {
    for (let y = birthYear + 61; y <= birthYear + 80; y++) displayYears.push(y);
  } else if (selectedRange === '81-100') {
    for (let y = birthYear + 81; y <= birthYear + 100; y++) displayYears.push(y);
  } else if (selectedRange === '101-135') {
    for (let y = birthYear + 101; y <= birthYear + 135; y++) displayYears.push(y);
  }

  const toggleYearExpand = (yearNum: number) => {
    setExpandedYears((prev) => ({ ...prev, [yearNum]: !prev[yearNum] }));
  };

  const toggleYogaExpand = (yearNum: number) => {
    setExpandedYogas((prev) => ({ ...prev, [yearNum]: !prev[yearNum] }));
  };

  const toggleYogaItem = (key: string) => {
    setExpandedYogaItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePredictionExpand = (yearNum: number) => {
    setExpandedPredictions((prev) => ({ ...prev, [yearNum]: !prev[yearNum] }));
  };

  // Matrix structure: 3x3 Vedic Grid
  const vedicMatrix = [
    [3, 1, 9],
    [6, 7, 5],
    [2, 8, 4]
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Control: 135-Year Timeline Window Selector */}
      <div className="bg-white border border-[#3d2b1f] shadow-[6px_6px_0px_#3d2b1f] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b-2 border-[#3d2b1f]">
          <div>
            <h2 className="text-xl font-bold text-[#3d2b1f] font-serif flex items-center gap-2 uppercase tracking-wide">
              <Calendar className="w-5 h-5 text-[#d97706]" />
              135-Year Life Grid Timeline & Dashas
            </h2>
            <p className="text-xs font-medium text-gray-600 mt-1 uppercase tracking-wider">
              Explore year-by-year Vedic Grids (3-1-9 / 6-7-5 / 2-8-4), Mahadasha, Antardasha, Pratyantardasha, Active Yogas, and Predictions.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#fffcf5] p-2 border border-[#3d2b1f]">
            <span className="text-xs font-bold text-[#3d2b1f] uppercase tracking-wider">Quick Target Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => {
                const newY = Number(e.target.value);
                setSelectedYear(newY);
                onUpdateDetails({ ...details, targetYear: newY });
              }}
              className="bg-white border border-[#3d2b1f] px-3 py-1.5 text-xs font-bold text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706]"
            >
              {Array.from({ length: 136 }, (_, i) => birthYear + i).map((y) => (
                <option key={y} value={y}>
                  Age {y - birthYear} (Year {y}) {y === currentYear ? '★ Current' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Range Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mr-2">Age Filter:</span>
          {[
            { id: 'current', label: `Focused Window (Age ${Math.max(0, selectedYear - birthYear - 3)} - ${selectedYear - birthYear + 3})` },
            { id: '0-20', label: 'Age 0 – 20' },
            { id: '21-40', label: 'Age 21 – 40' },
            { id: '41-60', label: 'Age 41 – 60' },
            { id: '61-80', label: 'Age 61 – 80' },
            { id: '81-100', label: 'Age 81 – 100' },
            { id: '101-135', label: 'Age 101 – 135' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedRange(btn.id as any)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition border cursor-pointer ${
                selectedRange === btn.id
                  ? 'bg-[#3d2b1f] text-white border-[#3d2b1f] shadow-[2px_2px_0px_#d97706]'
                  : 'bg-[#fffcf5] text-[#3d2b1f] border-[#3d2b1f]/30 hover:border-[#3d2b1f]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Cards Stream */}
      <div className="space-y-6">
        {displayYears.map((targetYear) => {
          const yearResult = calculateNumerology({ ...details, targetYear });
          const age = targetYear - birthYear;
          const isSelected = targetYear === selectedYear;
          const isExpanded = !!expandedYears[targetYear];
          const isYogaExpanded = expandedYogas[targetYear] !== false; // expanded by default
          const isPredictionExpanded = !!expandedPredictions[targetYear];

          const pdOverride = pdOverrides[targetYear] || 0; // 0 = default (no PD selected in grid)

          // Compute exact cell counts matching grid display using yearResult
          const activeGridCounts: Record<number, number> = { ...yearResult.targetGridCounts };
          if (pdOverride > 0) {
            activeGridCounts[pdOverride] = (activeGridCounts[pdOverride] || 0) + 1;
          }

          // Compute Present, Missing, and Repeated numbers for active grid
          const presentNumbers: number[] = [];
          const missingNumbersList: number[] = [];
          const repeatedNumbers: { num: number; count: number }[] = [];

          for (let n = 1; n <= 9; n++) {
            const cnt = activeGridCounts[n] || 0;
            if (cnt > 0) {
              presentNumbers.push(n);
              if (cnt > 1) {
                repeatedNumbers.push({ num: n, count: cnt });
              }
            } else {
              missingNumbersList.push(n);
            }
          }

          const dayStr = details.day.toString().padStart(2, '0');
          const monthStr = details.month.toString().padStart(2, '0');
          const anniversaryText = `${dayStr}/${monthStr}/${targetYear} to ${dayStr}/${monthStr}/${targetYear + 1}`;

          return (
            <div
              key={targetYear}
              className={`bg-white border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-[#d97706] shadow-[8px_8px_0px_#3d2b1f]'
                  : 'border-[#3d2b1f] shadow-[4px_4px_0px_#3d2b1f]'
              }`}
            >
              {/* Card Header Bar */}
              <div
                onClick={() => toggleYearExpand(targetYear)}
                className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none transition ${
                  isSelected ? 'bg-[#3d2b1f] text-white' : 'bg-[#fffcf5] text-[#3d2b1f] hover:bg-[#f3ebd7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold transition-transform ${isSelected ? 'text-[#d97706]' : 'text-[#3d2b1f]'}`}>
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold font-serif uppercase tracking-wide">
                        Age {age} <span className="opacity-80">({targetYear})</span>
                      </h3>
                      {targetYear === currentYear && (
                        <span className="bg-[#d97706] text-white text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-widest rounded-sm">
                          Current Running Year
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] font-medium tracking-wider uppercase mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                      Anniversary: {anniversaryText}
                    </p>
                  </div>
                </div>

                {/* Dasha Badges & Colored Quick Stats */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-700 border border-pink-300 font-extrabold shadow-sm">
                    BN-{yearResult.basicNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-300 font-extrabold shadow-sm">
                    DN-{yearResult.destinyNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-300 font-extrabold shadow-sm">
                    MD-{age > 0 ? yearResult.mahadasha.number : '_'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-300 font-extrabold shadow-sm">
                    AD-{age > 0 ? yearResult.antardasha.number : '_'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-300 font-extrabold shadow-sm">
                    PD-{pdOverride > 0 ? pdOverride : 'None'}
                  </span>
                </div>
              </div>

              {/* Card Expanded Content */}
              {isExpanded && (
                <div className="p-6 space-y-6 border-t border-[#3d2b1f]/20 bg-white">
                  {/* Grid & Details 2-Column Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* 3x3 Vedic Grid Visual (5 columns) */}
                    <div className="lg:col-span-5 bg-[#281a10] p-4 border-2 border-[#d97706] shadow-[4px_4px_0px_#3d2b1f] rounded-lg">
                      <div className="flex justify-between items-center text-white text-xs font-extrabold uppercase tracking-widest mb-3 border-b border-white/20 pb-2">
                        <span className="font-serif">VEDIC 3X3 GRID ({targetYear})</span>
                        <span className="text-[#d97706] font-mono text-sm font-extrabold">AGE {age}</span>
                      </div>

                      {/* Colored Badges Row in Grid Box */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3 bg-[#1c120a] p-2 border border-white/10 rounded">
                        <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-pink-100 text-pink-700 border border-pink-300">
                          BN-{yearResult.basicNumber}
                        </span>
                        <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                          DN-{yearResult.destinyNumber}
                        </span>
                        <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-red-100 text-red-700 border border-red-300">
                          MD-{age > 0 ? yearResult.mahadasha.number : '_'}
                        </span>
                        <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                          AD-{age > 0 ? yearResult.antardasha.number : '_'}
                        </span>
                        <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-purple-100 text-purple-700 border border-purple-300">
                          PD-{pdOverride > 0 ? pdOverride : 'None'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {vedicMatrix.flat().map((num) => {
                          const rawDobDigits = getRawDobDigits(details.day, details.month, details.year);
                          const rawDobCount = rawDobDigits.filter((d) => d === num).length;

                          const hasBN = yearResult.basicNumber === num;
                          const hasDN = yearResult.destinyNumber === num;
                          const hasMD = age > 0 && yearResult.mahadasha.number === num;
                          const hasAD = age > 0 && yearResult.antardasha.number === num;
                          const hasPD = pdOverride > 0 && pdOverride === num;

                          const cellTotalCount =
                            rawDobCount +
                            (hasBN ? 1 : 0) +
                            (hasDN ? 1 : 0) +
                            (hasMD ? 1 : 0) +
                            (hasAD ? 1 : 0) +
                            (hasPD ? 1 : 0);

                          const isMissing = cellTotalCount === 0;

                          return (
                            <div
                              key={num}
                              className={`p-1.5 flex flex-col justify-between border-2 rounded min-h-[90px] ${
                                isMissing
                                  ? 'bg-[#1a120c] border-amber-900/30 text-gray-500'
                                  : 'bg-[#fffdfa] border-[#d97706] text-[#3d2b1f] shadow-sm'
                              }`}
                            >
                              {/* Top row: #num on left, multiplier on right */}
                              <div className="w-full flex justify-between items-center text-[9px] font-extrabold uppercase">
                                <span className={isMissing ? 'text-gray-600' : 'text-gray-500'}>#{num}</span>
                                {cellTotalCount > 1 && (
                                  <span className="text-[9px] font-extrabold bg-[#d97706] text-white px-1.5 py-0.5 rounded-sm uppercase">
                                    {cellTotalCount}X
                                  </span>
                                )}
                              </div>

                              {/* Center content: Plain DOB digits + Colored badges for BN, DN, MD, AD, PD inside cell */}
                              <div className="w-full flex flex-wrap items-center justify-center gap-1 my-1">
                                {isMissing ? (
                                  <span className="text-xl font-bold text-gray-600 font-serif">—</span>
                                ) : (
                                  <>
                                    {rawDobCount > 0 && (
                                      <span className="text-lg sm:text-2xl font-extrabold font-serif text-[#3d2b1f] leading-none">
                                        {num.toString().repeat(rawDobCount)}
                                      </span>
                                    )}
                                    {hasBN && (
                                      <span className="px-1 text-[8px] sm:text-[9px] font-extrabold rounded bg-pink-100 text-pink-700 border border-pink-300">
                                        BN-{yearResult.basicNumber}
                                      </span>
                                    )}
                                    {hasDN && (
                                      <span className="px-1 text-[8px] sm:text-[9px] font-extrabold rounded bg-emerald-100 text-emerald-700 border border-emerald-300">
                                        DN-{yearResult.destinyNumber}
                                      </span>
                                    )}
                                    {hasMD && (
                                      <span className="px-1 text-[8px] sm:text-[9px] font-extrabold rounded bg-red-100 text-red-700 border border-red-300">
                                        MD-{yearResult.mahadasha.number}
                                      </span>
                                    )}
                                    {hasAD && (
                                      <span className="px-1 text-[8px] sm:text-[9px] font-extrabold rounded bg-blue-100 text-blue-700 border border-blue-300">
                                        AD-{yearResult.antardasha.number}
                                      </span>
                                    )}
                                    {hasPD && (
                                      <span className="px-1 text-[8px] sm:text-[9px] font-extrabold rounded bg-purple-100 text-purple-700 border border-purple-300">
                                        PD-{pdOverride}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* Bottom label */}
                              <div className="w-full text-center">
                                <span
                                  className={`text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest ${
                                    isMissing ? 'text-gray-600' : 'text-[#3d2b1f]'
                                  }`}
                                >
                                  {isMissing ? 'MISSING' : 'PRESENT'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dasha & Pratyantardasha Details (7 columns) */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="bg-[#fffcf5] border border-[#3d2b1f] p-4 shadow-[2px_2px_0px_#3d2b1f]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-3 pb-2 border-b border-[#3d2b1f]/20 flex flex-wrap items-center justify-between gap-2">
                          <span className="font-serif text-sm">Dasha Periods for Age {age} ({anniversaryText})</span>
                          <div className="flex items-center gap-1 text-[11px] font-extrabold">
                            <span className="text-pink-600">BN-{yearResult.basicNumber}</span> |{' '}
                            <span className="text-emerald-600">DN-{yearResult.destinyNumber}</span> |{' '}
                            <span className="text-red-600">MD-{age > 0 ? yearResult.mahadasha.number : '_'}</span> |{' '}
                            <span className="text-blue-600">AD-{age > 0 ? yearResult.antardasha.number : '_'}</span> |{' '}
                            <span className="text-purple-600">PD-{pdOverride > 0 ? pdOverride : 'None'}</span>
                          </div>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="bg-white p-3 border border-[#3d2b1f]">
                            <span className="text-[10px] font-bold uppercase text-red-600 block mb-0.5">Mahadasha (MD):</span>
                            <span className="text-sm font-extrabold text-red-700 font-serif">
                              MD-{yearResult.mahadasha.number} ({yearResult.mahadasha.planet})
                            </span>
                            <p className="text-[10px] text-gray-600 mt-1">
                              {yearResult.mahadasha.meaning}
                            </p>
                          </div>

                          <div className="bg-white p-3 border border-[#3d2b1f]">
                            <span className="text-[10px] font-bold uppercase text-blue-600 block mb-0.5">Antardasha (AD / PYN):</span>
                            <span className="text-sm font-extrabold text-blue-700 font-serif">
                              AD-{yearResult.antardasha.number} ({yearResult.antardasha.planet})
                            </span>
                            <p className="text-[10px] text-gray-600 mt-1">
                              Personal Year Vibration for {targetYear}
                            </p>
                          </div>
                        </div>

                        {/* Pratyantardasha Selection */}
                        <div className="mt-4 pt-3 border-t border-[#3d2b1f]/20">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3d2b1f] mb-1.5 flex justify-between items-center">
                            <span>Test Pratyantardasha (PD) Sub-Period:</span>
                            <span className="text-purple-700 font-extrabold">
                              {pdOverride > 0 ? `Selected: PD-${pdOverride}` : 'Default (No PD in Grid)'}
                            </span>
                          </label>
                          <select
                            value={pdOverride}
                            onChange={(e) => setPdOverrides((prev) => ({ ...prev, [targetYear]: Number(e.target.value) }))}
                            className="w-full bg-white border border-[#3d2b1f] p-2 text-xs font-bold text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                          >
                            <option value={0}>-- Select Pratyantardasha (PD) Sub-Period (Optional) --</option>
                            {yearResult.pratyantardashaList.map((pd) => (
                              <option key={pd.index} value={pd.number}>
                                PD #{pd.index}: No. {pd.number} ({pd.planet}) – {pd.durationDays} Days ({pd.startDate} to {pd.endDate})
                              </option>
                            ))}
                          </select>

                          {/* Detailed Number Analysis Breakdown */}
                          <div className="mt-3 p-3 bg-white border border-[#3d2b1f] space-y-1.5 text-xs text-[#3d2b1f]">
                            <p className="flex items-center gap-1.5">
                              <strong className="text-emerald-700 uppercase font-bold min-w-[130px]">Number Present:</strong>
                              <span className="font-extrabold text-gray-900">
                                {presentNumbers.length > 0 ? presentNumbers.join(', ') : 'None'}
                              </span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <strong className="text-rose-700 uppercase font-bold min-w-[130px]">Missing Number:</strong>
                              <span className="font-extrabold text-gray-900">
                                {missingNumbersList.length > 0 ? missingNumbersList.join(', ') : 'None'}
                              </span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <strong className="text-amber-700 uppercase font-bold min-w-[130px]">Multiple (Repeated):</strong>
                              <span className="font-extrabold text-gray-900">
                                {repeatedNumbers.length > 0
                                  ? repeatedNumbers.map((item) => `${item.num} (${item.count}x)`).join(', ')
                                  : 'None'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Yogas Accordion Block */}
                  <div className="border border-[#3d2b1f] bg-[#fffcf5]">
                    <div
                      onClick={() => toggleYogaExpand(targetYear)}
                      className="p-3.5 bg-[#3d2b1f] text-white flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#d97706]">
                          {isYogaExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </span>
                        <Layers className="w-4 h-4 text-[#d97706]" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                          Active Vedic Yogas for {targetYear} ({yearResult.yogas.length} Formed Yogas)
                        </h4>
                      </div>

                      <span className="text-[10px] font-bold text-[#d97706] uppercase tracking-wider">
                        {isYogaExpanded ? 'Click to Collapse ▲' : 'Click to Expand ▼'}
                      </span>
                    </div>

                    {isYogaExpanded && (
                      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {yearResult.yogas.length === 0 ? (
                          <p className="text-xs text-gray-600 italic">No major plane yogas in this grid view.</p>
                        ) : (
                          yearResult.yogas.map((yoga) => {
                            const yogaKey = `${targetYear}-${yoga.id}`;
                            const isItemExpanded = !!expandedYogaItems[yogaKey];
                            return (
                              <div
                                key={yoga.id}
                                className="bg-white border border-[#3d2b1f] shadow-[2px_2px_0px_#3d2b1f]"
                              >
                                <div
                                  onClick={() => toggleYogaItem(yogaKey)}
                                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-[#fffcf5] select-none"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#d97706]">
                                      {isItemExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </span>
                                    <span className="text-xs font-bold text-[#3d2b1f] font-serif">{yoga.name}</span>
                                    <span className="text-[9px] bg-[#3d2b1f] text-[#d97706] px-2 py-0.5 font-extrabold uppercase">
                                      [{yoga.numbers.join(', ')}]
                                    </span>
                                  </div>

                                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                                    {yoga.category}
                                  </span>
                                </div>

                                {isItemExpanded && (
                                  <div className="p-3 border-t border-[#3d2b1f]/20 bg-[#fffcf5] space-y-2 text-xs text-[#3d2b1f]">
                                    <p className="font-medium leading-relaxed">{yoga.description}</p>
                                    <div className="bg-white p-2 border border-[#3d2b1f]/30 font-bold text-[#3d2b1f]">
                                      <span className="text-[#d97706]">Effect:</span> {yoga.effect}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  {/* Yearly Prediction Reading Accordion Block */}
                  <div className="border border-[#3d2b1f] bg-[#fffcf5]">
                    <div
                      onClick={() => togglePredictionExpand(targetYear)}
                      className="p-3.5 bg-[#2d1f15] text-white flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#d97706]">
                          {isPredictionExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </span>
                        <Sparkles className="w-4 h-4 text-[#d97706]" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                          Yearly Prediction Reading & Specific Guidance for Age {age} ({targetYear})
                        </h4>
                      </div>

                      <span className="text-[10px] font-bold text-[#d97706] uppercase tracking-wider">
                        {isPredictionExpanded ? 'Click to Collapse ▲' : 'Click to Expand ▼'}
                      </span>
                    </div>

                    {isPredictionExpanded && (
                      <div className="p-5 space-y-4 bg-white text-xs text-[#3d2b1f]">
                        <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f]">
                          <h5 className="font-bold text-sm text-[#3d2b1f] font-serif mb-2 uppercase tracking-wider">
                            Overview for Age {age} (Personal Year Vibration {yearResult.antardasha.number})
                          </h5>
                          <p className="leading-relaxed font-medium text-gray-800">
                            During Age {age} ({targetYear}), your life is influenced by Mahadasha planet{' '}
                            <span className="font-bold text-[#3d2b1f]">{yearResult.mahadasha.planet}</span> and Antardasha vibration{' '}
                            <span className="font-bold text-[#3d2b1f]">{yearResult.antardasha.planet}</span>. This combination signals major momentum in personal projects, focus on career growth, and dynamic energy alignment.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f]">
                            <h6 className="font-bold text-xs text-[#d97706] uppercase tracking-wider mb-2">Key Focus & Opportunities</h6>
                            <ul className="list-disc list-inside space-y-1 font-medium text-gray-800">
                              <li>Favorable period for structured decision making and professional development.</li>
                              <li>Financial steady growth with mindful asset allocation.</li>
                              <li>Relationship harmony when clear communication is practiced.</li>
                            </ul>
                          </div>

                          <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f]">
                            <h6 className="font-bold text-xs text-rose-700 uppercase tracking-wider mb-2">Caution & Precautions</h6>
                            <ul className="list-disc list-inside space-y-1 font-medium text-gray-800">
                              <li>Avoid rushed investments during unaligned sub-period months.</li>
                              <li>Maintain work-life balance to manage stress and energetic exhaustion.</li>
                              <li>Perform daily grounding remedies for missing numbers.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
