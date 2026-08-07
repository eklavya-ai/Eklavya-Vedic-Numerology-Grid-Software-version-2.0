import { NumerologyResult, PersonDetails } from '../types';
import { FileText, CheckCircle, AlertTriangle, Calendar, Compass, Printer } from 'lucide-react';

interface PredictionReadingViewProps {
  result: NumerologyResult;
  details: PersonDetails;
  onOpenReport: () => void;
}

export function PredictionReadingView({ result, details, onOpenReport }: PredictionReadingViewProps) {
  const { yearlyPrediction } = result;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Step 10 – Prediction Reading ({details.targetYear})
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Detailed yearly interpretation including opportunities, challenges, supportive periods, and caution windows.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-yellow-800 hover:from-amber-800 hover:to-yellow-900 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer text-xs"
        >
          <Printer className="w-4 h-4 text-yellow-300" />
          <span>Print Complete Professional Report</span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h4 className="text-lg font-bold text-amber-950 font-serif">{yearlyPrediction.title}</h4>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900 border border-amber-300">
            Personal Year Number {yearlyPrediction.personalYearNumber}
          </span>
        </div>
        <p className="text-xs text-amber-950/80 leading-relaxed">{yearlyPrediction.numericalGuidance}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Key Opportunities
          </h4>
          <ul className="space-y-2 text-xs text-gray-700">
            {yearlyPrediction.opportunities.map((opp) => (
              <li key={`opp-${opp}`} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">{opp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Challenges & Cautions
          </h4>
          <ul className="space-y-2 text-xs text-gray-700">
            {yearlyPrediction.challenges.map((chal) => (
              <li key={`chal-${chal}`} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">{chal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-gray-900 block mb-1">Supportive Periods:</span>
            <p className="text-gray-600 leading-relaxed">{yearlyPrediction.supportivePeriods}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-gray-900 block mb-1">Caution Periods:</span>
            <p className="text-gray-600 leading-relaxed">{yearlyPrediction.cautionPeriods}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
