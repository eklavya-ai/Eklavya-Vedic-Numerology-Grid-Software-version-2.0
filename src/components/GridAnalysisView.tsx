import { useState } from 'react';
import { NumerologyResult, PersonDetails } from '../types';
import { getRawDobDigits } from '../utils/numerology';
import { Sparkles, Calendar, ShieldCheck, ShieldAlert, Award, Layers } from 'lucide-react';

interface GridAnalysisViewProps {
  result: NumerologyResult;
  details: PersonDetails;
  onUpdateTargetYear: (newYear: number) => void;
}

export function GridAnalysisView({ result, details, onUpdateTargetYear }: GridAnalysisViewProps) {
  const [selectedPD, setSelectedPD] = useState<number>(0);

  const {
    basicNumber,
    destinyNumber,
    nameNumber,
    relationship,
    luckyNumbers,
    unluckyNumbers,
    neutralNumbers,
    targetGridCounts,
    ageInTargetYear,
    mahadasha,
    antardasha,
    pratyantardashaList
  } = result;

  const rawDobDigits = getRawDobDigits(details.day, details.month, details.year);

  // Selected PD item details (1-indexed for PD1 to PD9)
  const selectedPDItem = selectedPD > 0 && pratyantardashaList[selectedPD - 1] ? pratyantardashaList[selectedPD - 1] : null;
  const selectedPDNum = selectedPDItem ? selectedPDItem.number : 0;

  // Active grid counts incorporating selected PD (Pratyantardasha)
  const activeGridCounts = { ...targetGridCounts };
  if (selectedPDNum > 0) {
    activeGridCounts[selectedPDNum] = (activeGridCounts[selectedPDNum] || 0) + 1;
  }

  const activeMissingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    (n) => (activeGridCounts[n] || 0) === 0
  );

  // Standard Vedic 3x3 Grid Matrix: 3, 1, 9 / 6, 7, 5 / 2, 8, 4
  const gridMatrix = [
    [3, 1, 9],
    [6, 7, 5],
    [2, 8, 4]
  ];

  // Multi-year comparison options around targetYear or birthYear
  const birthY = details.year;
  const currentT = details.targetYear;
  const comparisonYears = [
    birthY,
    currentT - 2,
    currentT - 1,
    currentT,
    currentT + 1,
    currentT + 2,
    currentT + 3
  ].filter((y, idx, arr) => y >= birthY && arr.indexOf(y) === idx);

  return (
    <div className="space-y-8">
      {/* Step 3: Core Basic & Destiny Analysis */}
      <div className="bg-white border border-[#3d2b1f] shadow-[6px_6px_0px_#3d2b1f] p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b-2 border-[#3d2b1f]">
          <div>
            <h3 className="text-xl font-bold text-[#3d2b1f] font-serif flex items-center gap-2 uppercase tracking-wide">
              <Award className="w-5 h-5 text-[#d97706]" />
              Step 3 & 4 – Comprehensive Grid & Number Analysis
            </h3>
            <p className="text-xs font-medium text-gray-600 mt-1 uppercase tracking-wider">
              Profile for <span className="font-bold text-[#3d2b1f]">{details.firstName} {details.middleName} {details.surname}</span> (DOB: {details.day}/{details.month}/{details.year})
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#fffcf5] px-4 py-2 border border-[#3d2b1f]">
            <Calendar className="w-4 h-4 text-[#d97706]" />
            <span className="text-xs font-bold text-[#3d2b1f] uppercase tracking-wider">Analysis Year:</span>
            <select
              value={details.targetYear}
              onChange={(e) => onUpdateTargetYear(Number(e.target.value))}
              className="bg-white border border-[#3d2b1f] px-2 py-1 text-sm font-bold text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706]"
            >
              {comparisonYears.map((y) => (
                <option key={y} value={y}>
                  {y} {y === details.year ? '(Birth)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Core Number Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#fffcf5] border border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f]/70">Basic Number (Birth Number - BN)</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-4xl font-extrabold text-[#3d2b1f] font-serif">{basicNumber}</span>
              <span className="text-xs font-bold px-2.5 py-1 bg-[#3d2b1f] text-white uppercase tracking-wider">
                {mahadasha.planet.split(' ')[0]}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">Represents your inner self, personality, and core nature.</p>
          </div>

          <div className="bg-[#fffcf5] border border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f]/70">Destiny Number (DN)</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-4xl font-extrabold text-[#3d2b1f] font-serif">{destinyNumber}</span>
              <span className="text-xs font-bold px-2.5 py-1 bg-[#3d2b1f] text-white uppercase tracking-wider">
                Life Path
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">Represents your destiny, life purpose, and outer path.</p>
          </div>

          <div className="bg-[#fffcf5] border border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f]/70">Chaldean Name Number</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-4xl font-extrabold text-[#3d2b1f] font-serif">{nameNumber}</span>
              <span className="text-xs font-bold px-2.5 py-1 bg-[#3d2b1f] text-white uppercase tracking-wider">
                Vibration
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">Calculated from full name energy vibration.</p>
          </div>

          <div className="bg-[#fffcf5] border border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f]/70">Age in {details.targetYear}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-4xl font-extrabold text-[#3d2b1f] font-serif">{ageInTargetYear}</span>
              <span className="text-xs font-bold px-2.5 py-1 bg-[#3d2b1f] text-white uppercase tracking-wider">
                Years
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">Current running age for the selected year.</p>
          </div>
        </div>

        {/* Relationship & Numbers Compatibility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#fffcf5] border border-[#3d2b1f] p-6">
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-[#3d2b1f]/20 pb-4 md:pb-0 md:pr-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">BN & DN Relationship</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-[#3d2b1f] text-white">
                {basicNumber} & {destinyNumber}
              </span>
              <span className="text-sm font-bold text-[#3d2b1f]">{relationship.title}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">{relationship.description}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f]">Number Compatibility</h4>
            <div className="space-y-2 text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-700 w-20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Lucky:
                </span>
                <span className="text-gray-900 font-bold">{luckyNumbers.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-700 w-20 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Neutral:
                </span>
                <span className="text-gray-900 font-bold">{neutralNumbers.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-700 w-20 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Unlucky:
                </span>
                <span className="text-gray-900 font-bold">{unluckyNumbers.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f]">Current Dasha Periods</h4>
            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between items-center bg-white px-3 py-2 border border-[#3d2b1f]">
                <span className="text-gray-600 font-bold uppercase text-[10px]">Mahadasha:</span>
                <span className="font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-300">
                  {ageInTargetYear > 0 ? `MD-${mahadasha.number} (${mahadasha.planet})` : 'MD-_ (Age 0)'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white px-3 py-2 border border-[#3d2b1f]">
                <span className="text-gray-600 font-bold uppercase text-[10px]">Antardasha:</span>
                <span className="font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-300">
                  {ageInTargetYear > 0 ? `AD-${antardasha.number} (${antardasha.planet})` : 'AD-_ (Age 0)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 5 & 6: Vedic Grid Box Information */}
      <div className="bg-white border border-[#3d2b1f] shadow-[6px_6px_0px_#3d2b1f] p-6 md:p-8">
        <div className="mb-6 pb-4 border-b-2 border-[#3d2b1f] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#3d2b1f] font-serif flex items-center gap-2 uppercase tracking-wide">
              <Sparkles className="w-5 h-5 text-[#d97706]" />
              Step 5 & 6 – Vedic Grid Box Information ({details.targetYear})
            </h3>
            <p className="text-xs font-medium text-gray-600 mt-1 uppercase tracking-wider">
              Each box displays the frequency of numbers present, repeated repetitions, and missing numbers for fast analysis.
            </p>
          </div>

          {/* Test Pratyantardasha (PD) Sub-Period Control */}
          <div className="flex items-center gap-2 bg-[#fffcf5] px-3 py-1.5 border border-[#3d2b1f] shrink-0">
            <span className="text-xs font-bold text-[#3d2b1f] uppercase tracking-wider">Test PD Sub-Period:</span>
            <select
              value={selectedPD}
              onChange={(e) => setSelectedPD(Number(e.target.value))}
              className="bg-white border border-[#3d2b1f] px-2 py-1 text-xs font-extrabold text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706]"
            >
              <option value={0}>Default (No PD in Grid)</option>
              {pratyantardashaList.map((pd) => (
                <option key={pd.index} value={pd.index}>
                  PD-{pd.index}: No. {pd.number} ({pd.planet}) – {pd.durationDays} Days ({pd.startDate} to {pd.endDate})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected PD Active Banner with Start Date & End Date for Selected Year */}
        {selectedPDItem ? (
          <div className="mb-6 p-3.5 bg-[#fffcf5] border-2 border-[#d97706] text-xs font-bold text-[#3d2b1f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_#3d2b1f]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#3d2b1f] text-white font-extrabold rounded-xs text-[10px] uppercase">
                Active Test PD #{selectedPDItem.index}
              </span>
              <span>
                Planet: <strong className="text-[#3d2b1f] font-serif">{selectedPDItem.planet}</strong> (Number <strong className="text-[#d97706] text-sm font-serif">{selectedPDItem.number}</strong>)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-800">
              <span>Start Date: <strong className="underline text-[#3d2b1f]">{selectedPDItem.startDate}</strong></span>
              <span>End Date: <strong className="underline text-[#3d2b1f]">{selectedPDItem.endDate}</strong></span>
              <span className="bg-[#3d2b1f] text-[#d97706] px-2 py-0.5 font-extrabold text-[10px] uppercase">
                Duration: {selectedPDItem.durationDays} Days ({details.targetYear})
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-2.5 bg-[#fffcf5] border border-[#3d2b1f]/20 text-xs text-gray-600 font-medium">
            💡 <strong>Default View:</strong> No Pratyantardasha (PD) added to grid. Select a PD sub-period from the dropdown above to test its number vibration in the 3x3 Grid and view exact active date ranges.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* 3x3 Grid Visual */}
          <div className="lg:col-span-2">
            <div className="max-w-md mx-auto bg-[#3d2b1f] p-4 border-4 border-[#3d2b1f] shadow-[8px_8px_0px_#d97706]">
              {/* Badges Bar above Grid */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4 bg-[#281a10] p-2.5 border border-[#d97706]/40 text-xs font-extrabold uppercase">
                <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-700 border border-pink-300 shadow-sm">
                  BN-{basicNumber}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm">
                  DN-{destinyNumber}
                </span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-300 shadow-sm">
                  MD-{ageInTargetYear > 0 ? mahadasha.number : '_'}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-300 shadow-sm">
                  AD-{ageInTargetYear > 0 ? antardasha.number : '_'}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-300 shadow-sm">
                  PD-{selectedPDNum > 0 ? selectedPDNum : 'None'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {gridMatrix.flat().map((num) => {
                  const rawDobCount = rawDobDigits.filter((d) => d === num).length;

                  const hasBN = basicNumber === num;
                  const hasDN = destinyNumber === num;
                  const hasMD = ageInTargetYear > 0 && mahadasha.number === num;
                  const hasAD = ageInTargetYear > 0 && antardasha.number === num;
                  const hasPD = selectedPDNum > 0 && selectedPDNum === num;

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
                      className={`relative min-h-[120px] p-2 flex flex-col items-center justify-between transition-all duration-300 border-2 rounded ${
                        isMissing
                          ? 'bg-[#2d1f15] border-[#d97706]/30 text-gray-400 opacity-60'
                          : cellTotalCount > 1
                          ? 'bg-[#fffcf5] border-[#d97706] text-[#3d2b1f] shadow-md'
                          : 'bg-white border-[#3d2b1f] text-[#3d2b1f]'
                      }`}
                    >
                      <div className="w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-wider opacity-70">
                        <span>No. {num}</span>
                        {cellTotalCount > 1 && (
                          <span className="bg-[#d97706] text-white px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded">
                            {cellTotalCount}x Rep
                          </span>
                        )}
                      </div>

                      {/* Cell Content: Plain DOB digits + Colored Tag Badges for BN, DN, MD, AD, PD */}
                      <div className="my-2 flex flex-wrap items-center justify-center gap-1.5">
                        {isMissing ? (
                          <span className="text-3xl font-extrabold font-serif text-gray-500">—</span>
                        ) : (
                          <>
                            {rawDobCount > 0 && (
                              <span className="text-2xl sm:text-3xl font-extrabold font-serif text-[#3d2b1f] tracking-wide">
                                {num.toString().repeat(rawDobCount)}
                              </span>
                            )}
                            {hasBN && (
                              <span className="px-1.5 py-0.5 text-xs font-extrabold rounded bg-pink-100 text-pink-700 border border-pink-300 shadow-sm">
                                BN-{basicNumber}
                              </span>
                            )}
                            {hasDN && (
                              <span className="px-1.5 py-0.5 text-xs font-extrabold rounded bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm">
                                DN-{destinyNumber}
                              </span>
                            )}
                            {hasMD && (
                              <span className="px-1.5 py-0.5 text-xs font-extrabold rounded bg-red-100 text-red-700 border border-red-300 shadow-sm">
                                MD-{mahadasha.number}
                              </span>
                            )}
                            {hasAD && (
                              <span className="px-1.5 py-0.5 text-xs font-extrabold rounded bg-blue-100 text-blue-700 border border-blue-300 shadow-sm">
                                AD-{antardasha.number}
                              </span>
                            )}
                            {hasPD && (
                              <span className="px-1.5 py-0.5 text-xs font-extrabold rounded bg-purple-100 text-purple-700 border border-purple-300 shadow-sm">
                                PD-{selectedPDNum}
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      <div className="w-full text-center text-[10px] font-bold uppercase tracking-wider">
                        {isMissing ? 'Missing' : cellTotalCount > 1 ? 'Repeated' : 'Present'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#fffcf5] border border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-3">Grid Status Summary</h4>
              <div className="space-y-3 text-xs text-[#3d2b1f] font-medium">
                <div className="flex justify-between items-center bg-white px-3 py-2 border border-[#3d2b1f]">
                  <span className="font-bold">Total Present Numbers:</span>
                  <span className="font-extrabold text-emerald-700">
                    {Object.values(activeGridCounts).filter((c) => c > 0).length} / 9
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white px-3 py-2 border border-[#3d2b1f]">
                  <span className="font-bold">Missing Numbers Count:</span>
                  <span className="font-extrabold text-rose-700">{activeMissingNumbers.length}</span>
                </div>
                <div className="flex justify-between items-center bg-white px-3 py-2 border border-[#3d2b1f]">
                  <span className="font-bold">Missing Digits:</span>
                  <span className="font-extrabold text-[#3d2b1f]">
                    {activeMissingNumbers.length > 0 ? activeMissingNumbers.join(', ') : 'None (Complete Grid)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#fffcf5] border border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">Multi-Year Comparison Tip</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Use the target year dropdown above to switch between past, present, and future years. The software automatically updates grid counts, age, and dasha sequences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

