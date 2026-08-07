import { NumerologyResult } from '../types';
import { Briefcase, Compass, Award, CheckCircle } from 'lucide-react';

interface ProfessionViewProps {
  result: NumerologyResult;
}

export function ProfessionView({ result }: ProfessionViewProps) {
  const { professionGuidance, destinyNumber } = result;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-600" />
            Step 8 – Profession Selection Guidance (Destiny Number {destinyNumber})
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Career alignment guidance for students, career counselors, and professional numerologists.
          </p>
        </div>

        <span className="bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200">
          Career Alignment System
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overview & Guidance */}
        <div className="lg:col-span-1 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-6 h-6 text-amber-700" />
              <h4 className="text-base font-bold text-amber-950 font-serif">Destiny Number {destinyNumber} Profile</h4>
            </div>
            <p className="text-xs text-amber-950/80 leading-relaxed mb-6">{professionGuidance.guidanceText}</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-amber-200/60 text-xs">
            <div className="flex justify-between">
              <span className="text-amber-900 font-medium">Auspicious Colors:</span>
              <span className="font-bold text-amber-950">{professionGuidance.auspiciousColors.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-900 font-medium">Favorable Direction:</span>
              <span className="font-bold text-amber-950 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-700" /> {professionGuidance.auspiciousDirections.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Career Fields Lists */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b pb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Primary Fields
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              {professionGuidance.primaryFields.map((field) => (
                <li key={`primary-${field}`} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span className="font-medium">{field}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b pb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-amber-600" /> Secondary Fields
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              {professionGuidance.secondaryFields.map((field) => (
                <li key={`secondary-${field}`} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span className="font-medium">{field}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b pb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-amber-600" /> Suitable Business
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              {professionGuidance.suitableBusiness.map((field) => (
                <li key={`business-${field}`} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span className="font-medium">{field}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
