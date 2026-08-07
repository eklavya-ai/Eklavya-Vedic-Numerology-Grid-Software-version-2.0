import { PersonDetails, NumerologyResult } from '../types';
import { calculateNumerology } from './numerology';
import { STRUCTURED_YOGAS_DATABASE, StructuredYoga } from './yogaDatabase';

export interface YearReport {
  dob: string;
  fullName: string;
  gender: string;
  selectedYear: number;
  age: number;
  BN: number;
  DN: number;
  Mahadasha: {
    number: number;
    planet: string;
    meaning: string;
  };
  Antardasha: {
    number: number;
    planet: string;
    meaning: string;
  };
  Missing: number[];
  Repeated: { number: number; count: number }[];
  GridCounts: Record<number, number>;
  Career: string[];
  Finance: string[];
  Health: string[];
  Marriage: string[];
  Travel: string[];
  Business: string[];
  Children: string[];
  Property: string[];
  Remedies: string[];
  ActiveYogas: {
    id: string;
    name: string;
    category: string;
    description: string;
    keyEffects: string[];
  }[];
  Pratyantardashas: {
    index: number;
    number: number;
    planet: string;
    startDate: string;
    endDate: string;
    durationDays: number;
  }[];
  YearSummaryTitle: string;
}

export function generateYearReport(details: PersonDetails, yearToAnalyze?: number): YearReport {
  const selectedYear = yearToAnalyze ?? details.targetYear ?? new Date().getFullYear();
  const updatedDetails: PersonDetails = { ...details, targetYear: selectedYear };
  const numResult: NumerologyResult = calculateNumerology(updatedDetails);

  const dobFormatted = `${details.day.toString().padStart(2, '0')}-${details.month.toString().padStart(2, '0')}-${details.year}`;
  const fullName = [details.firstName, details.middleName, details.surname].filter(Boolean).join(' ');

  // Collect active Yogas and map from structured database
  const activeGrid = numResult.targetGridCounts;
  const activeYogasList: YearReport['ActiveYogas'] = [];

  const careerEffects: Set<string> = new Set();
  const financeEffects: Set<string> = new Set();
  const healthEffects: Set<string> = new Set();
  const marriageEffects: Set<string> = new Set();
  const travelEffects: Set<string> = new Set();
  const businessEffects: Set<string> = new Set();
  const childrenEffects: Set<string> = new Set();
  const propertyEffects: Set<string> = new Set();
  const remediesList: Set<string> = new Set();

  // Populate from active yogas evaluated in numerology engine
  for (const yoga of numResult.yogas) {
    const matchedStructured = STRUCTURED_YOGAS_DATABASE.find(
      sy => sy.id.toLowerCase() === yoga.id.toLowerCase() || sy.name.toLowerCase().includes(yoga.name.toLowerCase())
    );

    if (matchedStructured) {
      activeYogasList.push({
        id: matchedStructured.id,
        name: matchedStructured.name,
        category: matchedStructured.category,
        description: matchedStructured.description,
        keyEffects: [
          ...matchedStructured.effects.career.slice(0, 2),
          ...matchedStructured.effects.finance.slice(0, 2)
        ]
      });

      matchedStructured.effects.career.forEach(e => careerEffects.add(e));
      matchedStructured.effects.finance.forEach(e => financeEffects.add(e));
      matchedStructured.effects.health.forEach(e => healthEffects.add(e));
      matchedStructured.effects.marriage.forEach(e => marriageEffects.add(e));
      matchedStructured.effects.travel.forEach(e => travelEffects.add(e));
      matchedStructured.effects.business.forEach(e => businessEffects.add(e));
      matchedStructured.effects.children.forEach(e => childrenEffects.add(e));
      matchedStructured.effects.property.forEach(e => propertyEffects.add(e));
      matchedStructured.effects.remedies.forEach(e => remediesList.add(e));
    } else {
      activeYogasList.push({
        id: yoga.id,
        name: yoga.name,
        category: yoga.category,
        description: yoga.description,
        keyEffects: [yoga.effect]
      });
      careerEffects.add(yoga.effect);
    }
  }

  // Populate from missing remedies
  for (const rem of numResult.missingRemedies) {
    remediesList.add(`Digit ${rem.number} (${rem.element}): Mantras '${rem.mantra}', Wear ${rem.color} / ${rem.crystal}, ${rem.charity}`);
  }

  // Repeated numbers
  const repeated: { number: number; count: number }[] = [];
  for (let n = 1; n <= 9; n++) {
    const count = activeGrid[n] || 0;
    if (count >= 2) {
      repeated.push({ number: n, count });
    }
  }

  // Basic defaults if empty
  if (careerEffects.size === 0) careerEffects.add(`Governed by Personal Year ${numResult.antardasha.number} (${numResult.antardasha.planet}). Steady career growth with disciplined effort.`);
  if (financeEffects.size === 0) financeEffects.add(`Controlled cash flow under ${numResult.mahadasha.planet} Mahadasha. Focus on structured savings.`);
  if (healthEffects.size === 0) healthEffects.add('Maintain balanced hydration, regular exercise, and standard preventive care.');
  if (marriageEffects.size === 0) marriageEffects.add('Favorable period for mutual understanding and peaceful home life.');
  if (travelEffects.size === 0) travelEffects.add('Short personal or work-related trips throughout the year.');
  if (businessEffects.size === 0) businessEffects.add('Good window for consolidation and building long-term business relationships.');
  if (childrenEffects.size === 0) childrenEffects.add('Supportive period for family growth and children guidance.');
  if (propertyEffects.size === 0) propertyEffects.add('Evaluation phase for long-term land or home investments.');

  return {
    dob: dobFormatted,
    fullName: fullName || 'Valued User',
    gender: details.gender ? (details.gender.charAt(0).toUpperCase() + details.gender.slice(1)) : 'Male',
    selectedYear,
    age: numResult.ageInTargetYear,
    BN: numResult.basicNumber,
    DN: numResult.destinyNumber,
    Mahadasha: numResult.mahadasha,
    Antardasha: numResult.antardasha,
    Missing: numResult.missingNumbers,
    Repeated: repeated,
    GridCounts: activeGrid,
    Career: Array.from(careerEffects),
    Finance: Array.from(financeEffects),
    Health: Array.from(healthEffects),
    Marriage: Array.from(marriageEffects),
    Travel: Array.from(travelEffects),
    Business: Array.from(businessEffects),
    Children: Array.from(childrenEffects),
    Property: Array.from(propertyEffects),
    Remedies: Array.from(remediesList),
    ActiveYogas: activeYogasList,
    Pratyantardashas: numResult.pratyantardashaList.map(pd => ({
      index: pd.index,
      number: pd.number,
      planet: pd.planet,
      startDate: pd.startDate,
      endDate: pd.endDate,
      durationDays: pd.durationDays
    })),
    YearSummaryTitle: numResult.yearlyPrediction.title
  };
}
