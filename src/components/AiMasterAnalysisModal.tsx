import { useState } from 'react';
import { PersonDetails, NumerologyResult } from '../types';
import { X, Sparkles, Printer, Download, Award, ShieldCheck, Compass, Gem, FileText, CheckCircle2 } from 'lucide-react';

interface AiMasterAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: NumerologyResult;
  details: PersonDetails;
  onOpenReport: () => void;
}

export function AiMasterAnalysisModal({
  isOpen,
  onClose,
  result,
  details,
  onOpenReport
}: AiMasterAnalysisModalProps) {
  if (!isOpen) return null;

  const {
    basicNumber,
    destinyNumber,
    nameNumber,
    relationship,
    mahadasha,
    antardasha,
    yogas,
    missingRemedies,
    targetGridCounts,
    ageInTargetYear
  } = result;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#f8f5f0] border-4 border-[#3d2b1f] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[12px_12px_0px_#d97706] relative my-auto">
        {/* Modal Header */}
        <div className="bg-[#121929] text-white p-6 border-b-4 border-[#d97706] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/eklavya-logo.png"
              alt="Eklavya Logo"
              className="w-10 h-10 object-contain rounded-full border border-[#d97706] bg-[#121929] p-0.5 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif uppercase tracking-wider text-white">
                  Eklavya AI Master Analysis Report
                </h3>
                <span className="bg-[#d97706] text-white text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-widest">
                  VEDIC EXPERT SYSTEM
                </span>
              </div>
              <p className="text-xs text-[#d97706] font-bold uppercase tracking-widest mt-0.5">
                Deep Synthesis for {details.firstName} {details.middleName} {details.surname} (Year {details.targetYear})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/10 hover:bg-[#d97706] rounded-full flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#3d2b1f]">
          {/* Executive Summary Card */}
          <div className="bg-white border border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
            <div className="flex items-center gap-2 text-[#d97706] mb-3">
              <Sparkles className="w-5 h-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#3d2b1f] font-serif">
                Executive Vedic Synthesis Overview
              </h4>
            </div>
            <p className="text-xs leading-relaxed font-medium text-gray-800">
              This master report combines the 3x3 Vedic Grid Matrix (3-1-9 Mind Plane, 6-7-5 Soul Plane, 2-8-4 Practical Plane) with planetary dasha cycles. The subject is currently operating with Basic Number <span className="font-extrabold text-[#3d2b1f]">{basicNumber}</span> and Destiny Number <span className="font-extrabold text-[#3d2b1f]">{destinyNumber}</span> under <span className="font-extrabold text-[#3d2b1f]">{mahadasha.planet}</span> Mahadasha and <span className="font-extrabold text-[#3d2b1f]">{antardasha.planet}</span> Antardasha for target year {details.targetYear} (Age {ageInTargetYear}).
            </p>
          </div>

          {/* Core Grid Matrix Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-3 pb-2 border-b border-[#3d2b1f]/20">
                Core Vedic Parameters
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-[#fffcf5] border border-[#3d2b1f]/20 font-medium">
                  <span>Basic Number (Birth Number - BN):</span>
                  <span className="font-bold text-[#3d2b1f]">{basicNumber}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#fffcf5] border border-[#3d2b1f]/20 font-medium">
                  <span>Destiny Number (DN):</span>
                  <span className="font-bold text-[#3d2b1f]">{destinyNumber}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#fffcf5] border border-[#3d2b1f]/20 font-medium">
                  <span>Chaldean Name Number:</span>
                  <span className="font-bold text-[#3d2b1f]">{nameNumber}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#fffcf5] border border-[#3d2b1f]/20 font-medium">
                  <span>BN & DN Relationship:</span>
                  <span className="font-bold text-[#d97706]">{relationship.title}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-3 pb-2 border-b border-[#3d2b1f]/20">
                Dasha Sequence & Planetary Vibrations
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-[#fffcf5] border border-[#3d2b1f]/20 font-medium">
                  <span>Mahadasha (MD):</span>
                  <span className="font-bold text-[#3d2b1f]">{mahadasha.planet}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#fffcf5] border border-[#3d2b1f]/20 font-medium">
                  <span>Antardasha (AD/PYN):</span>
                  <span className="font-bold text-[#3d2b1f]">{antardasha.planet}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#fffcf5] border border-[#3d2b1f]/20 font-medium">
                  <span>Active Yogas Count:</span>
                  <span className="font-bold text-[#d97706]">{yogas.length} Yogas Formed</span>
                </div>
                <div className="flex justify-between p-2 bg-[#fffcf5] border border-[#3d2b1f]/20 font-medium">
                  <span>Missing Digits:</span>
                  <span className="font-bold text-rose-700">{missingRemedies.map(m => m.number).join(', ') || 'None'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Master Key Recommendations */}
          <div className="bg-[#fffcf5] border-2 border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d97706]" />
              Eklavya AI Master Key Recommendations
            </h4>
            <div className="space-y-2 text-xs text-gray-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#3d2b1f]">Primary Focus:</strong> Leverage active plane yogas for career growth during this running dasha cycle.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#3d2b1f]">Remedial Action:</strong> Apply missing number remedies for digits {missingRemedies.map(m => m.number).join(', ') || 'none'} to restore full energetic grid balance.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#121929] p-4 border-t-4 border-[#d97706] flex items-center justify-between shrink-0">
          <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
            Eklavya Vedic Numerology Master System
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenReport();
              }}
              className="flex items-center gap-2 bg-[#d97706] hover:bg-amber-600 text-white font-bold px-5 py-2 text-xs uppercase tracking-widest transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
