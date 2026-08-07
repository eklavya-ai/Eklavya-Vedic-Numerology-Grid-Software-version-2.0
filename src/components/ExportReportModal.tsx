import { NumerologyResult, PersonDetails } from '../types';
import { X, Printer, Phone, Mail, Award, Sparkles, Download, ShieldAlert, UserCheck } from 'lucide-react';
import { analyzeNameNumerology, getRawDobDigits } from '../utils/numerology';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: NumerologyResult;
  details: PersonDetails;
}

export function ExportReportModal({ isOpen, onClose, result, details }: ExportReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const nameAnalysis = analyzeNameNumerology(
    details.firstName,
    details.middleName,
    details.surname,
    result.basicNumber,
    result.destinyNumber
  );

  const vedicMatrix = [
    [3, 1, 9],
    [6, 7, 5],
    [2, 8, 4]
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-[#3d2b1f] relative my-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#121929] text-white px-6 py-4 flex items-center justify-between z-10 shadow-md border-b-4 border-[#d97706] print:hidden">
          <div className="flex items-center gap-3">
            <img src="/eklavya-logo.png" alt="Eklavya Logo" className="w-8 h-8 object-contain rounded-full border border-[#d97706] bg-[#121929] p-0.5 shrink-0" />
            <div>
              <h2 className="text-base font-bold font-serif uppercase tracking-wider text-white">Eklavya Vedic Numerology PDF Report</h2>
              <p className="text-xs text-[#d97706] font-bold uppercase tracking-widest">Learn to Earn • Professional Analysis Summary</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#d97706] hover:bg-amber-600 text-white font-bold px-4 py-2 text-xs shadow transition cursor-pointer uppercase tracking-widest"
            >
              <Download className="w-4 h-4" /> Save / Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-8 space-y-8 text-[#3d2b1f] bg-white print:p-6">
          {/* Report Header Logo & Title Banner */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-[#3d2b1f]">
            <div className="flex items-center gap-4">
              <img src="/eklavya-logo.png" alt="Eklavya Logo" className="w-16 h-16 object-contain rounded-full border-2 border-[#d97706] bg-[#121929] p-0.5 shrink-0" />
              <div>
                <h1 className="text-2xl font-bold text-[#3d2b1f] font-serif uppercase tracking-wide">
                  Eklavya Vedic Numerology Analysis
                </h1>
                <p className="text-xs font-bold text-[#d97706] uppercase tracking-widest">
                  Professional Vedic Grid & Planetary Report
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-gray-600 font-medium">
              <p><strong className="text-[#3d2b1f]">Subject:</strong> {details.firstName} {details.middleName} {details.surname}</p>
              <p><strong className="text-[#3d2b1f]">DOB:</strong> {details.day}/{details.month}/{details.year}</p>
              <p><strong className="text-[#3d2b1f]">Target Year:</strong> {details.targetYear} (Age {result.ageInTargetYear})</p>
            </div>
          </div>

          {/* Core Numbers Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] text-center">
              <span className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Basic Number (Birth Number - BN)</span>
              <span className="text-3xl font-extrabold text-[#3d2b1f] font-serif">{result.basicNumber}</span>
              <span className="text-[10px] text-[#d97706] font-bold block mt-1">{result.mahadasha.planet.split(' ')[0]}</span>
            </div>

            <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] text-center">
              <span className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Destiny Number (DN)</span>
              <span className="text-3xl font-extrabold text-[#3d2b1f] font-serif">{result.destinyNumber}</span>
              <span className="text-[10px] text-[#d97706] font-bold block mt-1">Life Path</span>
            </div>

            <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] text-center">
              <span className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Chaldean Name Number</span>
              <span className="text-3xl font-extrabold text-[#3d2b1f] font-serif">{result.nameNumber}</span>
              <span className="text-[10px] text-[#d97706] font-bold block mt-1">Compound: {nameAnalysis.totalSum}</span>
            </div>

            <div className="bg-[#fffcf5] p-4 border border-[#3d2b1f] text-center">
              <span className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Target Analysis Age</span>
              <span className="text-3xl font-extrabold text-[#3d2b1f] font-serif">{result.ageInTargetYear}</span>
              <span className="text-[10px] text-[#d97706] font-bold block mt-1">Year {details.targetYear}</span>
            </div>
          </div>

          {/* Chaldean Name Numerology Detailed Analysis Section */}
          <div className="bg-[#fffcf5] border-2 border-[#3d2b1f] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#3d2b1f]/20 pb-2">
              <h3 className="text-sm font-bold text-[#3d2b1f] font-serif uppercase tracking-wide flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#d97706]" /> Chaldean Name Numerology Analysis & Alignment
              </h3>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-[#3d2b1f] text-white">
                Name Compound Sum: {nameAnalysis.totalSum} → Name Number: {nameAnalysis.nameNumber}
              </span>
            </div>

            {/* Letter Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nameAnalysis.firstPart && (
                <div className="bg-white p-3 border border-[#3d2b1f] text-xs space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">First Name Vibration</span>
                  <div className="flex justify-between items-center font-bold text-[#3d2b1f]">
                    <span className="text-sm font-serif">{nameAnalysis.firstPart.name}</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-100 text-amber-800 font-extrabold">
                      Sum: {nameAnalysis.firstPart.sum} → {nameAnalysis.firstPart.singleDigit}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-gray-600 truncate">{nameAnalysis.firstPart.breakdown}</p>
                </div>
              )}

              {nameAnalysis.middlePart && (
                <div className="bg-white p-3 border border-[#3d2b1f] text-xs space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Middle Name Vibration</span>
                  <div className="flex justify-between items-center font-bold text-[#3d2b1f]">
                    <span className="text-sm font-serif">{nameAnalysis.middlePart.name}</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-100 text-amber-800 font-extrabold">
                      Sum: {nameAnalysis.middlePart.sum} → {nameAnalysis.middlePart.singleDigit}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-gray-600 truncate">{nameAnalysis.middlePart.breakdown}</p>
                </div>
              )}

              {nameAnalysis.surnamePart && (
                <div className="bg-white p-3 border border-[#3d2b1f] text-xs space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Surname Vibration</span>
                  <div className="flex justify-between items-center font-bold text-[#3d2b1f]">
                    <span className="text-sm font-serif">{nameAnalysis.surnamePart.name}</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-100 text-amber-800 font-extrabold">
                      Sum: {nameAnalysis.surnamePart.sum} → {nameAnalysis.surnamePart.singleDigit}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-gray-600 truncate">{nameAnalysis.surnamePart.breakdown}</p>
                </div>
              )}
            </div>

            {/* Harmony & Planetary Vibration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white p-3 border border-[#3d2b1f]">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Ruling Planet & Characteristics</span>
                <p className="font-bold text-[#3d2b1f]">{nameAnalysis.rulingPlanet}</p>
                <p className="text-gray-600 text-[11px] leading-relaxed mt-0.5">{nameAnalysis.planetMeaning}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Core Number Compatibility</span>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 border border-gray-300 rounded">
                    <span className="text-[10px] font-bold text-gray-600">With BN ({result.basicNumber}):</span>
                    <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      nameAnalysis.bnCompatibility === 'friendly' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      nameAnalysis.bnCompatibility === 'enemy' ? 'bg-red-100 text-red-800 border border-red-300' :
                      'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {nameAnalysis.bnCompatibility}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 border border-gray-300 rounded">
                    <span className="text-[10px] font-bold text-gray-600">With DN ({result.destinyNumber}):</span>
                    <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      nameAnalysis.dnCompatibility === 'friendly' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      nameAnalysis.dnCompatibility === 'enemy' ? 'bg-red-100 text-red-800 border border-red-300' :
                      'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {nameAnalysis.dnCompatibility}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alignment Evaluation & Advice */}
            <div className="bg-amber-50/60 border border-amber-300 p-3 text-xs space-y-1">
              <span className="font-bold text-[#d97706] uppercase tracking-wider block text-[11px]">
                {nameAnalysis.overallStatus}
              </span>
              <p className="text-[11px] text-[#3d2b1f] leading-relaxed">
                {nameAnalysis.recommendation}
              </p>
            </div>
          </div>

          {/* 3x3 Vedic Grid Display */}
          <div className="bg-[#fffcf5] border border-[#3d2b1f] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f] flex flex-wrap items-center justify-between gap-2 border-b border-[#3d2b1f]/20 pb-2">
              <span>Vedic 3x3 Grid Matrix (3-1-9 / 6-7-5 / 2-8-4)</span>
              <span className="text-[#d97706] font-extrabold">
                BN-{result.basicNumber} | DN-{result.destinyNumber} | MD-{result.ageInTargetYear > 0 ? result.mahadasha.number : '_'} | AD-{result.ageInTargetYear > 0 ? result.antardasha.number : '_'} | PD-None
              </span>
            </h3>

            <div className="max-w-xs mx-auto bg-[#3d2b1f] p-3 border-2 border-[#3d2b1f]">
              <div className="grid grid-cols-3 gap-2">
                {vedicMatrix.flat().map((num) => {
                  const rawDobDigits = getRawDobDigits(details.day, details.month, details.year);
                  const rawDobCount = rawDobDigits.filter((d) => d === num).length;

                  const hasBN = result.basicNumber === num;
                  const hasDN = result.destinyNumber === num;
                  const hasMD = result.ageInTargetYear > 0 && result.mahadasha.number === num;
                  const hasAD = result.ageInTargetYear > 0 && result.antardasha.number === num;

                  const cellTotalCount =
                    rawDobCount +
                    (hasBN ? 1 : 0) +
                    (hasDN ? 1 : 0) +
                    (hasMD ? 1 : 0) +
                    (hasAD ? 1 : 0);

                  const isMissing = cellTotalCount === 0;

                  return (
                    <div
                      key={num}
                      className={`p-1.5 flex flex-col items-center justify-between border rounded min-h-[75px] ${
                        isMissing ? 'bg-[#2d1f15] text-gray-500' : 'bg-white text-[#3d2b1f] font-extrabold'
                      }`}
                    >
                      <span className="text-[8px] opacity-70">#{num}</span>
                      <div className="flex flex-wrap items-center justify-center gap-0.5 my-0.5">
                        {isMissing ? (
                          <span className="text-lg font-serif font-extrabold text-gray-500">—</span>
                        ) : (
                          <>
                            {rawDobCount > 0 && (
                              <span className="text-base font-serif font-extrabold">{num.toString().repeat(rawDobCount)}</span>
                            )}
                            {hasBN && <span className="px-1 text-[7px] font-extrabold rounded bg-pink-100 text-pink-700 border border-pink-300">BN</span>}
                            {hasDN && <span className="px-1 text-[7px] font-extrabold rounded bg-emerald-100 text-emerald-700 border border-emerald-300">DN</span>}
                            {hasMD && <span className="px-1 text-[7px] font-extrabold rounded bg-red-100 text-red-700 border border-red-300">MD</span>}
                            {hasAD && <span className="px-1 text-[7px] font-extrabold rounded bg-blue-100 text-blue-700 border border-blue-300">AD</span>}
                          </>
                        )}
                      </div>
                      <span className="text-[7px] uppercase">{isMissing ? 'Missing' : `${cellTotalCount}x`}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Yogas Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#3d2b1f] font-serif border-b border-[#3d2b1f]/20 pb-2 uppercase tracking-wide">
              Active Vedic Yogas ({result.yogas.length} Formed Yogas)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.yogas.map((yoga) => (
                <div key={yoga.id} className="bg-[#fffcf5] p-3 border border-[#3d2b1f] text-xs">
                  <div className="flex justify-between font-bold text-[#3d2b1f] mb-1">
                    <span>{yoga.name}</span>
                    <span className="text-[#d97706]">[{yoga.numbers.join(', ')}]</span>
                  </div>
                  <p className="text-[#3d2b1f]/80 text-[11px] leading-snug">{yoga.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Remedies */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#3d2b1f] font-serif border-b border-[#3d2b1f]/20 pb-2 uppercase tracking-wide">
              Practical Remedies for Missing Digits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {result.missingRemedies.map((remedy) => (
                <div key={remedy.number} className="bg-[#fffcf5] p-3 border border-[#3d2b1f] text-[11px]">
                  <span className="font-bold text-[#d97706] block mb-1">Missing Digit {remedy.number} ({remedy.element})</span>
                  <p><strong>Color:</strong> {remedy.color}</p>
                  <p><strong>Crystal:</strong> {remedy.crystal}</p>
                  <p><strong>Mantra:</strong> {remedy.mantra}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Vedic Numerology Disclaimer */}
          <div className="bg-[#fffcf5] border border-[#3d2b1f] p-4 text-xs text-[#3d2b1f] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#d97706] uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Disclaimer & Guidance Notice
            </div>
            <p className="text-[11px] leading-relaxed text-gray-700">
              This report is generated strictly for educational, research, and self-guidance purposes in Vedic Numerology. This application does not provide medical or financial advice. All numerical readings provide symbolic planetary guidance and should be evaluated alongside independent certified medical and financial consultation.
            </p>
          </div>

          {/* Footer Branding & Contact */}
          <div className="pt-6 border-t-2 border-[#3d2b1f] flex flex-col sm:flex-row items-center justify-between text-xs text-[#3d2b1f] gap-4">
            <div>
              <p className="font-bold text-[#3d2b1f] font-serif text-sm uppercase">Eklavya Vedic Numerology</p>
              <p className="text-gray-600 text-[10px] uppercase tracking-wider">Learn to Earn • Developed for Professionals</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-[#3d2b1f]">
                <Phone className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Jignesh Dharia: +91 9821030140 / 9653100285</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#3d2b1f]">
                <Mail className="w-3.5 h-3.5 text-[#d97706]" />
                <span>eklavyavedicnumerology@gmail.com | jigneshdharia@hotmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

