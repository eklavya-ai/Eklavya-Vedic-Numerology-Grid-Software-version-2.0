import { NumerologyResult } from '../types';
import { HeartPulse, ShieldAlert, Sparkles } from 'lucide-react';

interface MedicalNumerologyViewProps {
  result: NumerologyResult;
}

export function MedicalNumerologyView({ result }: MedicalNumerologyViewProps) {
  const { medicalIndications } = result;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-amber-600" />
            Step 9 – Medical Numerology Yoga
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Health-related numerical indications based on number combinations and missing numbers for preventive awareness.
          </p>
        </div>

        <span className="bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200">
          Preventive Awareness System
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medicalIndications.map((ind, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-gray-50 to-amber-50/40 rounded-2xl p-5 border border-amber-200/80 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-base font-bold text-gray-900 font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" /> {ind.title}
              </h4>
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-200/80 text-amber-900 border border-amber-300">
                {ind.associatedNumbers}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <span className="font-semibold text-gray-900 block mb-1">Numerical Indication:</span>
                <p className="text-gray-600 leading-relaxed">{ind.indication}</p>
              </div>

              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 shadow-sm">
                <span className="font-semibold text-amber-950 block mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" /> Preventive Care & Awareness:
                </span>
                <p className="text-amber-900 leading-relaxed">{ind.preventiveCare}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Special Deep Guidance Box for Child Neuro-Development & Mental Health */}
      <div className="mt-8 bg-gradient-to-r from-[#121929] to-[#1e293b] text-white rounded-2xl p-6 border-2 border-[#d97706] shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#d97706]" />
            <h4 className="text-base font-bold text-amber-300 font-serif uppercase tracking-wider">
              Specialized Guidance: Child Neuro-Development & Mental Wellness
            </h4>
          </div>
          <span className="bg-[#d97706] text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
            Parental & Practitioner Guide
          </span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          In Vedic Grid Numerology, child development, cognitive milestones, and nervous system signaling are evaluated through key planetary vibrations:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/10 p-3 rounded border border-white/20 space-y-1">
            <span className="font-bold text-amber-400 block">Mercury (5) – Neural Signals</span>
            <p className="text-gray-300 text-[11px] leading-normal">
              Governs brain signal transmission, speech articulation, and adaptability. Missing 5 requires green chromotherapy and sensory exercises.
            </p>
          </div>

          <div className="bg-white/10 p-3 rounded border border-white/20 space-y-1">
            <span className="font-bold text-amber-400 block">Moon (2) – Emotional Mind</span>
            <p className="text-gray-300 text-[11px] leading-normal">
              Governs peace of mind, sensory tranquility, and motherly bond. Offer water in silver cups and maintain calm music environments.
            </p>
          </div>

          <div className="bg-white/10 p-3 rounded border border-white/20 space-y-1">
            <span className="font-bold text-amber-400 block">Jupiter (3) & Dasha Timelines</span>
            <p className="text-gray-300 text-[11px] leading-normal">
              Jupiter (3) expands learning. Favorable Antardasha/Pratyantardasha periods (Mercury, Moon, Jupiter) mark windows for breakthrough in occupational therapy.
            </p>
          </div>
        </div>

        <div className="bg-amber-950/60 p-3 rounded border border-amber-500/50 text-amber-200 text-xs">
          <strong className="text-amber-300">Ethical Healthcare Note:</strong> Vedic Numerology provides vibrational perspective and timeline guidance for supportive care. It is NOT a medical diagnosis. Always work closely with pediatrician, speech pathologist, occupational therapist, and child psychiatrist.
        </div>
      </div>
    </div>
  );
}
