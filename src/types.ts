export interface NamePartBreakdown {
  name: string;
  sum: number;
  singleDigit: number;
  breakdown: string;
}

export interface NameNumerologyAnalysis {
  fullName: string;
  totalSum: number;
  nameNumber: number;
  firstPart?: NamePartBreakdown;
  middlePart?: NamePartBreakdown;
  surnamePart?: NamePartBreakdown;
  rulingPlanet: string;
  planetMeaning: string;
  bnCompatibility: 'friendly' | 'neutral' | 'enemy';
  dnCompatibility: 'friendly' | 'neutral' | 'enemy';
  overallStatus: string;
  vibrationalDescription: string;
  recommendation: string;
}

export interface PersonDetails {
  firstName: string;
  middleName: string;
  surname: string;
  gender?: 'male' | 'female' | 'other';
  day: number;
  month: number;
  year: number;
  targetYear: number;
  countryCode?: string;
  mobileNumber?: string;
  email?: string;
}

export interface NumerologyResult {
  basicNumber: number; // Basic Number - BN (1-9)
  destinyNumber: number; // Destiny Number - DN (1-9)
  nameNumber: number; // Chaldean name number
  relationship: {
    title: string;
    description: string;
    type: 'friendly' | 'neutral' | 'enemy';
  };
  luckyNumbers: number[];
  unluckyNumbers: number[];
  neutralNumbers: number[];
  gridCounts: Record<number, number>; 
  birthGridCounts: Record<number, number>; 
  targetGridCounts: Record<number, number>; 
  ageInTargetYear: number;
  mahadasha: { number: number; planet: string; meaning: string };
  antardasha: { number: number; planet: string; meaning: string };
  pratyantardashaList: PratyantardashaPeriod[];
  yogas: YogaItem[];
  missingNumbers: number[];
  missingRemedies: MissingRemedy[];
  professionGuidance: ProfessionInfo;
  medicalIndications: MedicalIndication[];
  yearlyPrediction: YearlyPrediction;
}

export interface PratyantardashaPeriod {
  index: number;
  number: number;
  planet: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  description: string;
}

export interface YogaItem {
  id: string;
  name: string;
  category: 'Combination' | 'Horizontal Plane' | 'Vertical Plane' | 'Trine' | 'Hostile' | 'L-Shape' | 'General';
  numbers: number[];
  description: string;
  effect: string;
  remedy?: string;
}

export interface MissingRemedy {
  number: number;
  element: string;
  color: string;
  crystal: string;
  mantra: string;
  charity: string;
}

export interface ProfessionInfo {
  primaryFields: string[];
  secondaryFields: string[];
  suitableBusiness: string[];
  auspiciousColors: string[];
  auspiciousDirections: string[];
  guidanceText: string;
}

export interface MedicalIndication {
  title: string;
  associatedNumbers: string;
  indication: string;
  preventiveCare: string;
}

export interface YearlyPrediction {
  year: number;
  personalYearNumber: number;
  title: string;
  opportunities: string[];
  challenges: string[];
  supportivePeriods: string;
  cautionPeriods: string;
  numericalGuidance: string;
}
