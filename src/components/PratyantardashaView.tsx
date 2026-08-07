import { NumerologyResult } from '../types';
import { Clock, Calendar, Sparkles } from 'lucide-react';

interface PratyantardashaViewProps {
  result: NumerologyResult;
}

export function PratyantardashaView({ result }: PratyantardashaViewProps) {
  const { pratyantardashaList, mahadasha, antardasha } = result;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Step 6 – Deep Pratyantardasha Analysis (9 Sub-Periods)
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Timing-based prediction breakdown showing all 9 sub-sub periods (Pratyantardasha) for precise forecasting.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-xs">
          <div>
            <span className="text-gray-500 font-medium">Mahadasha:</span>{' '}
            <span className="font-bold text-amber-900">{mahadasha.planet}</span>
          </div>
          <span className="text-amber-300">|</span>
          <div>
            <span className="text-gray-500 font-medium">Antardasha:</span>{' '}
            <span className="font-bold text-amber-900">{antardasha.planet}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pratyantardashaList.map((p) => (
          <div
            key={p.index}
            className="bg-gradient-to-br from-gray-50 to-amber-50/40 rounded-2xl p-5 border border-amber-200/60 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-200/80 text-amber-900 border border-amber-300">
                    Sub-Period #{p.index}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-[#3d2b1f] text-white">
                    {p.durationDays} Days
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-600" /> Number {p.number}
                </span>
              </div>

              <h4 className="text-base font-bold text-gray-900 font-serif mb-1">{p.planet}</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{p.description}</p>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>{p.startDate}</span>
              </div>
              <span>to</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>{p.endDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
