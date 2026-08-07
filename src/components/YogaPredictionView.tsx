import { useState } from 'react';
import { NumerologyResult } from '../types';
import { Layers, ShieldCheck, Compass, Sparkles, Gem, HeartHandshake, ChevronRight, ChevronDown } from 'lucide-react';

interface YogaPredictionViewProps {
  result: NumerologyResult;
}

export function YogaPredictionView({ result }: YogaPredictionViewProps) {
  const { yogas, missingRemedies } = result;
  
  // State to track expanded yoga IDs
  const [expandedYogas, setExpandedYogas] = useState<Record<string, boolean>>(() => {
    // Expand first 3 by default
    const initial: Record<string, boolean> = {};
    yogas.slice(0, 3).forEach((y) => {
      initial[y.id] = true;
    });
    return initial;
  });

  const [allExpanded, setAllExpanded] = useState(false);

  const toggleYoga = (id: string) => {
    setExpandedYogas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const updated: Record<string, boolean> = {};
    yogas.forEach((y) => {
      updated[y.id] = nextState;
    });
    setExpandedYogas(updated);
  };

  // Group Yogas by Category
  const categories = Array.from(new Set(yogas.map((y) => y.category)));

  return (
    <div className="space-y-8">
      {/* Yoga Prediction Block with Accordions */}
      <div className="bg-white border border-[#3d2b1f] shadow-[6px_6px_0px_#3d2b1f] p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b-2 border-[#3d2b1f]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#3d2b1f] font-serif flex items-center gap-2 uppercase tracking-wide">
                <Layers className="w-5 h-5 text-[#d97706]" />
                Step 7 – Active Yogas & Combination Analysis
              </h3>
              <span className="bg-[#d97706] text-white text-xs font-bold px-2.5 py-0.5 uppercase tracking-widest">
                {yogas.length} Active Yogas
              </span>
            </div>
            <p className="text-xs font-medium text-gray-600 mt-1 uppercase tracking-wider">
              Automatic evaluation of planetary combinations, planes, trines, and karmic influences in the 3x3 Vedic Grid.
            </p>
          </div>

          <button
            onClick={toggleAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fffcf5] border border-[#3d2b1f] text-xs font-bold text-[#3d2b1f] uppercase tracking-wider hover:bg-[#3d2b1f] hover:text-white transition cursor-pointer"
          >
            {allExpanded ? <ChevronDown className="w-4 h-4 text-[#d97706]" /> : <ChevronRight className="w-4 h-4 text-[#d97706]" />}
            <span>{allExpanded ? 'Collapse All Yogas' : 'Expand All Yogas'}</span>
          </button>
        </div>

        {yogas.length === 0 ? (
          <div className="text-center py-8 bg-[#fffcf5] border border-[#3d2b1f]/30">
            <p className="text-sm text-[#3d2b1f] font-medium">No major plane or trine yogas detected in this specific grid view.</p>
            <p className="text-xs text-gray-500 mt-1">Explore other target years or check missing number remedies below.</p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {categories.map((category) => {
              const categoryYogas = yogas.filter((y) => y.category === category);
              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2 bg-[#3d2b1f] text-white px-4 py-2 border border-[#3d2b1f]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#d97706]">● Category:</span>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white">{category}</h4>
                    <span className="ml-auto text-[10px] font-bold bg-[#d97706] text-white px-2 py-0.5 rounded">
                      {categoryYogas.length} Yogas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {categoryYogas.map((yoga) => {
                      const isExpanded = !!expandedYogas[yoga.id];
                      return (
                        <div
                          key={yoga.id}
                          className="bg-[#fffcf5] border border-[#3d2b1f] shadow-[2px_2px_0px_#3d2b1f] transition duration-200"
                        >
                          {/* Accordion Header / Clickable Bar */}
                          <div
                            onClick={() => toggleYoga(yoga.id)}
                            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#f0e8d5] transition select-none"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[#d97706] transition-transform duration-200">
                                {isExpanded ? (
                                  <ChevronDown className="w-5 h-5" />
                                ) : (
                                  <ChevronRight className="w-5 h-5" />
                                )}
                              </span>
                              <div>
                                <h5 className="text-sm font-bold text-[#3d2b1f] font-serif">{yoga.name}</h5>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-bold text-gray-600 uppercase">Numbers:</span>
                                  <span className="text-[10px] font-extrabold bg-[#3d2b1f] text-[#d97706] px-2 py-0.2 tracking-wider">
                                    {yoga.numbers.join(', ')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <span className="text-[11px] font-bold text-[#d97706] uppercase tracking-wider hidden sm:inline-block">
                              {isExpanded ? 'Click to Collapse ▲' : 'Click to Expand ▼'}
                            </span>
                          </div>

                          {/* Accordion Expanded Content */}
                          {isExpanded && (
                            <div className="p-4 pt-1 border-t border-[#3d2b1f]/20 bg-white space-y-3 text-xs text-[#3d2b1f]">
                              <div>
                                <span className="font-bold uppercase tracking-wider text-gray-500 text-[10px] block mb-1">
                                  Description & Origin:
                                </span>
                                <p className="leading-relaxed font-medium">{yoga.description}</p>
                              </div>

                              <div className="bg-[#fffcf5] p-3 border border-[#3d2b1f]/30">
                                <span className="font-bold uppercase tracking-wider text-[#d97706] text-[10px] block mb-1">
                                  Vedic Effect & Characteristics:
                                </span>
                                <p className="leading-relaxed font-bold text-[#3d2b1f]">{yoga.effect}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Missing Numbers & Practical Remedies */}
      <div className="bg-white border border-[#3d2b1f] shadow-[6px_6px_0px_#3d2b1f] p-6 md:p-8">
        <div className="mb-6 pb-4 border-b-2 border-[#3d2b1f]">
          <h3 className="text-xl font-bold text-[#3d2b1f] font-serif flex items-center gap-2 uppercase tracking-wide">
            <Gem className="w-5 h-5 text-[#d97706]" />
            Missing Numbers & Practical Vedic Remedies
          </h3>
          <p className="text-xs font-medium text-gray-600 mt-1 uppercase tracking-wider">
            Practical remedial numerology including colors, gemstones, mantras, and charitable acts for missing numbers.
          </p>
        </div>

        {missingRemedies.length === 0 ? (
          <div className="text-center py-8 bg-[#fffcf5] border border-[#3d2b1f] text-[#3d2b1f]">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-[#d97706]" />
            <p className="font-bold text-sm">Incredible! Your grid has no missing numbers (Complete Grid).</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missingRemedies.map((remedy) => (
              <div
                key={remedy.number}
                className="bg-[#fffcf5] border border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f] space-y-3"
              >
                <div className="flex justify-between items-center border-b border-[#3d2b1f]/20 pb-2">
                  <span className="px-2.5 py-1 text-xs font-bold bg-[#3d2b1f] text-white uppercase tracking-wider">
                    Missing No. {remedy.number}
                  </span>
                  <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">{remedy.element}</span>
                </div>

                <div className="space-y-2 text-xs text-[#3d2b1f]">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase text-[10px] text-gray-500 block">Color:</span>
                      <span className="font-medium">{remedy.color}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Gem className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase text-[10px] text-gray-500 block">Crystal / Stone:</span>
                      <span className="font-medium">{remedy.crystal}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Compass className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase text-[10px] text-gray-500 block">Mantra:</span>
                      <span className="font-medium">{remedy.mantra}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase text-[10px] text-gray-500 block">Charity / Service:</span>
                      <span className="font-medium">{remedy.charity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

