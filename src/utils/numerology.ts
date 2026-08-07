import { PersonDetails, NumerologyResult, PratyantardashaPeriod, YogaItem, MissingRemedy, ProfessionInfo, MedicalIndication, YearlyPrediction } from '../types';

// Vedic 3x3 Grid Matrix standard representation:
// Row 1: 3, 1, 9 (Mind / Thought Plane)
// Row 2: 6, 7, 5 (Soul / Emotional Plane)
// Row 3: 2, 8, 4 (Practical / Body Plane)
export const VEDIC_GRID_MATRIX = [
  [3, 1, 9],
  [6, 7, 5],
  [2, 8, 4]
];

export function reduceToSingleDigit(num: number): number {
  let sum = num;
  while (sum > 9) {
    sum = sum
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}

export function calculateChaldeanNameNumber(fullName: string): number {
  const chaldeanMap: Record<string, number> = {
    a: 1, i: 1, j: 1, q: 1, y: 1,
    b: 2, k: 2, r: 2,
    c: 3, g: 3, l: 3, s: 3,
    d: 4, m: 4, t: 4,
    e: 5, h: 5, n: 5, x: 5,
    u: 6, v: 6, w: 6,
    o: 7, z: 7,
    f: 8, p: 8
  };

  const clean = fullName.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    sum += chaldeanMap[char] || 0;
  }
  return sum === 0 ? 1 : reduceToSingleDigit(sum);
}

export function calculateSingleWordChaldean(word: string) {
  if (!word || !word.trim()) return undefined;
  const chaldeanMap: Record<string, number> = {
    a: 1, i: 1, j: 1, q: 1, y: 1,
    b: 2, k: 2, r: 2,
    c: 3, g: 3, l: 3, s: 3,
    d: 4, m: 4, t: 4,
    e: 5, h: 5, n: 5, x: 5,
    u: 6, v: 6, w: 6,
    o: 7, z: 7,
    f: 8, p: 8
  };
  const clean = word.trim();
  const parts: string[] = [];
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i].toLowerCase();
    if (chaldeanMap[char]) {
      const val = chaldeanMap[char];
      sum += val;
      parts.push(`${clean[i].toUpperCase()}(${val})`);
    }
  }
  const single = sum === 0 ? 1 : reduceToSingleDigit(sum);
  return {
    name: clean,
    sum,
    singleDigit: single,
    breakdown: `${parts.join(' + ')} = ${sum} -> ${single}`
  };
}

export function analyzeNameNumerology(
  firstName: string,
  middleName: string,
  surname: string,
  basicNumber: number,
  destinyNumber: number
) {
  const firstPart = calculateSingleWordChaldean(firstName);
  const middlePart = calculateSingleWordChaldean(middleName);
  const surnamePart = calculateSingleWordChaldean(surname);

  const nameParts = [firstName, middleName, surname].filter(Boolean);
  const fullName = nameParts.join(' ');

  const totalSum = (firstPart?.sum || 0) + (middlePart?.sum || 0) + (surnamePart?.sum || 0);
  const nameNumber = totalSum === 0 ? 1 : reduceToSingleDigit(totalSum);

  const planetInfo = planetMap[nameNumber] || planetMap[1];

  const bnType = relationshipData[basicNumber]?.[nameNumber]?.type || 'neutral';
  const dnType = relationshipData[destinyNumber]?.[nameNumber]?.type || 'neutral';

  let overallStatus = 'Balanced Name Alignment';
  let recommendation = 'Your name number is generally compatible with your core birth numbers.';

  if (bnType === 'friendly' && dnType === 'friendly') {
    overallStatus = 'Highly Auspicious & Harmonious Name Vibration';
    recommendation = `Name Number ${nameNumber} (${planetInfo.planet}) forms a highly supportive, victorious alignment with both your Basic Number ${basicNumber} and Destiny Number ${destinyNumber}. No spelling changes are required.`;
  } else if (bnType === 'enemy' || dnType === 'enemy') {
    overallStatus = 'Inharmonious Name Friction (Spelling Correction Advisable)';
    const clashTarget = bnType === 'enemy' && dnType === 'enemy' ? 'both Basic and Destiny Numbers' : bnType === 'enemy' ? `Basic Number ${basicNumber}` : `Destiny Number ${destinyNumber}`;
    recommendation = `Name Number ${nameNumber} (${planetInfo.planet}) creates friction with your ${clashTarget}. Minor spelling adjustment (adding or modifying a letter) to bring the name compound to a friendly number like 1, 5, or 6 is recommended for maximum luck and effortless progress.`;
  } else {
    overallStatus = 'Neutral & Stable Name Vibration';
    recommendation = `Name Number ${nameNumber} provides steady, neutral support to your life path. It works well with your current vibration.`;
  }

  const vibrationalDescription = `Governed by ${planetInfo.planet}. Brings attributes of ${planetInfo.meaning.toLowerCase()}. Compound Sum = ${totalSum}, Single Vibration = ${nameNumber}.`;

  return {
    fullName,
    totalSum,
    nameNumber,
    firstPart,
    middlePart,
    surnamePart,
    rulingPlanet: planetInfo.planet,
    planetMeaning: planetInfo.meaning,
    bnCompatibility: bnType,
    dnCompatibility: dnType,
    overallStatus,
    vibrationalDescription,
    recommendation
  };
}

const planetMap: Record<number, { planet: string; meaning: string }> = {
  1: { planet: 'Sun (Surya)', meaning: 'Leadership, Authority, Vitality, Ego, Ambition' },
  2: { planet: 'Moon (Chandra)', meaning: 'Emotions, Mind, Intuition, Imagination, Partnerships' },
  3: { planet: 'Jupiter (Guru)', meaning: 'Wisdom, Expansion, Teaching, Spirituality, Wealth' },
  4: { planet: 'Rahu', meaning: 'Innovation, Sudden Gains, Rebellious Nature, Technical Mind' },
  5: { planet: 'Mercury (Budh)', meaning: 'Intelligence, Communication, Business, Adaptability' },
  6: { planet: 'Venus (Shukra)', meaning: 'Luxury, Romance, Art, Comfort, Charm' },
  7: { planet: 'Ketu', meaning: 'Spiritual Awakening, Research, Detachment, Intuition' },
  8: { planet: 'Saturn (Shani)', meaning: 'Karma, Discipline, Hard Work, Justice, Perseverance' },
  9: { planet: 'Mars (Mangal)', meaning: 'Energy, Courage, Passion, Action, Protection' }
};

const relationshipData: Record<number, Record<number, { title: string; description: string; type: 'friendly' | 'neutral' | 'enemy' }>> = {
  1: {
    1: { title: 'Friendly & Powerful', description: 'Strong leadership synergy, mutual respect and ambition.', type: 'friendly' },
    2: { title: 'Neutral Balance', description: 'Sun and Moon balance authority with emotional intuition.', type: 'neutral' },
    3: { title: 'Great Harmony', description: 'Sun (1) and Jupiter (3) create excellent mentoring and success.', type: 'friendly' },
    4: { title: 'Challenging Opposition', description: 'Sun (1) and Rahu (4) can cause ego clashes and sudden shifts.', type: 'enemy' },
    5: { title: 'Friendly Intellect', description: 'Sun and Mercury create brilliant administrative and business acumen.', type: 'friendly' },
    6: { title: 'Neutral Compatibility', description: 'Creative harmony with practical leadership.', type: 'neutral' },
    7: { title: 'Spiritual Clash', description: 'Sun and Ketu test ego against spiritual detachment.', type: 'enemy' },
    8: { title: 'Karmic Friction', description: 'Sun and Saturn represent authority vs discipline; needs patience.', type: 'enemy' },
    9: { title: 'High Energy & Courage', description: 'Sun and Mars combine immense drive, fame, and executive power.', type: 'friendly' }
  },
  2: {
    1: { title: 'Neutral Balance', description: 'Moon supports Sun with intuition and adaptability.', type: 'neutral' },
    2: { title: 'Emotional Amplification', description: 'Dual Moon can cause hypersensitivity or deep intuition.', type: 'neutral' },
    3: { title: 'Supportive Mentorship', description: 'Jupiter guides the emotional mind toward wisdom.', type: 'friendly' },
    4: { title: 'Unstable Fluidity', description: 'Moon and Rahu create imaginative or illusionary thoughts.', type: 'enemy' },
    5: { title: 'Quick Adaptability', description: 'Good for commerce, travel, and public relations.', type: 'friendly' },
    6: { title: 'Artistic & Loving', description: 'Moon and Venus bring aesthetic grace and emotional warmth.', type: 'friendly' },
    7: { title: 'Mystical Deep Bond', description: 'Strong intuitive and psychic connection.', type: 'friendly' },
    8: { title: 'Emotional Heavy Load', description: 'Saturn tests Moon with melancholy or perseverance.', type: 'enemy' },
    9: { title: 'Dynamic Passion', description: 'Mars energizes the emotional Moon.', type: 'friendly' }
  },
  3: {
    1: { title: 'Great Harmony', description: 'Jupiter and Sun create supreme wisdom and authority.', type: 'friendly' },
    2: { title: 'Supportive Guidance', description: 'Jupiter nurtures the Moon’s emotional depth.', type: 'friendly' },
    3: { title: 'Expansive Growth', description: 'Double Jupiter brings immense learning, teaching, and status.', type: 'friendly' },
    4: { title: 'Innovative Wisdom', description: 'Blends traditional learning with unconventional ideas.', type: 'neutral' },
    5: { title: 'Knowledge & Commerce', description: 'Excellent for consultancy, teaching, and financial advisory.', type: 'friendly' },
    6: { title: 'Creative Balance', description: 'Balances higher wisdom with material luxury.', type: 'neutral' },
    7: { title: 'Spiritual Mastery', description: 'Exceptional for occult sciences, research, and higher philosophy.', type: 'friendly' },
    8: { title: 'Disciplined Growth', description: 'Saturn grounds Jupiter’s expansion into lasting structures.', type: 'friendly' },
    9: { title: 'Passionate Wisdom', description: 'Mars drives Jupiter’s ideals into victorious execution.', type: 'friendly' }
  },
  4: {
    1: { title: 'Challenging Opposition', description: 'Rahu tests Sun’s ego and authority.', type: 'enemy' },
    2: { title: 'Unstable Fluidity', description: 'Can lead to overthinking and shifting moods.', type: 'enemy' },
    3: { title: 'Innovative Wisdom', description: 'Unconventional path leading to unique success.', type: 'neutral' },
    4: { title: 'Intense Technology', description: 'High technical acumen, coding, engineering, and research.', type: 'neutral' },
    5: { title: 'Master Trader', description: 'Brilliant for stock markets, trading, and quick strategizing.', type: 'friendly' },
    6: { title: 'Material Ambition', description: 'Desire for high comforts and unconventional luxuries.', type: 'friendly' },
    7: { title: 'Rahu-Ketu Axis', description: 'Deep karmic lessons, intense intuition, and sudden breakthroughs.', type: 'neutral' },
    8: { title: 'Hard Labor & Research', description: 'Rahu and Saturn bring heavy hard work and engineering genius.', type: 'friendly' },
    9: { title: 'Rebellious Fire', description: 'High aggression, needs calm channelization.', type: 'enemy' }
  },
  5: {
    1: { title: 'Brilliant Intellect', description: 'Mercury and Sun create top-tier leadership and business skill.', type: 'friendly' },
    2: { title: 'Adaptable & Communicative', description: 'Great for networking, writing, and media.', type: 'friendly' },
    3: { title: 'Consultancy Excellence', description: 'Wisdom combined with sharp commercial instinct.', type: 'friendly' },
    4: { title: 'Expert Strategist', description: 'Exceptional for stock markets, tech, and financial planning.', type: 'friendly' },
    5: { title: 'Dynamic Commerce', description: 'Double Mercury brings supreme agility, travel, and speech.', type: 'friendly' },
    6: { title: 'Media & Glamour', description: 'Excellent for entertainment, fashion, and public relations.', type: 'friendly' },
    7: { title: 'Analytical Depth', description: 'Combines logical Mercury with intuitive Ketu.', type: 'neutral' },
    8: { title: 'Calculated Wealth', description: 'Saturn rewards Mercury’s business planning with steady growth.', type: 'friendly' },
    9: { title: 'Fast Execution', description: 'Mars gives speed to Mercury’s plans.', type: 'friendly' }
  },
  6: {
    1: { title: 'Neutral Compatibility', description: 'Balances charm with authority.', type: 'neutral' },
    2: { title: 'Warm & Romantic', description: 'Venus and Moon foster deep emotional affection and beauty.', type: 'friendly' },
    3: { title: 'Creative Balance', description: 'Artistic flair meets philosophical wisdom.', type: 'neutral' },
    4: { title: 'Material Luxury', description: 'Attraction towards high-end comforts and style.', type: 'friendly' },
    5: { title: 'Glamour & Business', description: 'Outstanding for media, fashion, luxury retail, and arts.', type: 'friendly' },
    6: { title: 'Luxury & Relationships', description: 'Double Venus amplifies romance, arts, and comforts.', type: 'friendly' },
    7: { title: 'Detached Love', description: 'Can experience tests in relationships leading to spiritual maturity.', type: 'neutral' },
    8: { title: 'Structured Luxury', description: 'Saturn helps build lasting wealth and property assets.', type: 'friendly' },
    9: { title: 'Passionate Romance', description: 'Mars adds fiery passion to Venusian charm.', type: 'friendly' }
  },
  7: {
    1: { title: 'Spiritual Clash', description: 'Ketu challenges the ego of the Sun.', type: 'enemy' },
    2: { title: 'Deep Intuition', description: 'Strong psychic and intuitive bond.', type: 'friendly' },
    3: { title: 'Spiritual Mastery', description: 'Deep inclination towards philosophy, healing, and occult.', type: 'friendly' },
    4: { title: 'Karmic Axis', description: 'Intense transformation, research, and sudden insights.', type: 'neutral' },
    5: { title: 'Analytical Depth', description: 'Combines occult wisdom with sharp analysis.', type: 'neutral' },
    6: { title: 'Relationship Lessons', description: 'Spiritual detachment testing material bonds.', type: 'neutral' },
    7: { title: 'Mystical Insight', description: 'Double Ketu brings profound spiritual realization or isolation.', type: 'neutral' },
    8: { title: 'Karmic Hardwork', description: 'Saturn and Ketu require immense patience and spiritual endurance.', type: 'neutral' },
    9: { title: 'Healer & Fighter', description: 'Ketu and Mars create exceptional healing or surgical ability.', type: 'friendly' }
  },
  8: {
    1: { title: 'Karmic Friction', description: 'Saturn tests Sun’s authority; requires humility and service.', type: 'enemy' },
    2: { title: 'Endurance Test', description: 'Saturn tests emotional resilience.', type: 'enemy' },
    3: { title: 'Grounded Wisdom', description: 'Saturn gives discipline to Jupiter’s teachings.', type: 'friendly' },
    4: { title: 'Technical Mastery', description: 'Hard work, mechanics, engineering, and heavy industry.', type: 'friendly' },
    5: { title: 'Business Resilience', description: 'Saturn rewards Mercury’s strategies over time.', type: 'friendly' },
    6: { title: 'Property & Wealth', description: 'Building long-term real estate and assets.', type: 'friendly' },
    7: { title: 'Karmic Seeker', description: 'Deep introspection, law, research, and spiritual discipline.', type: 'neutral' },
    8: { title: 'Heavy Karma', description: 'Double Saturn requires relentless hard work and ethical living.', type: 'neutral' },
    9: { title: 'Controlled Force', description: 'Mars and Saturn create immense industry or operational power.', type: 'neutral' }
  },
  9: {
    1: { title: 'Executive Power', description: 'Mars and Sun create fame, administrative authority, and courage.', type: 'friendly' },
    2: { title: 'Action-Oriented Intuition', description: 'Mars empowers emotional decisions.', type: 'friendly' },
    3: { title: 'Victorious Wisdom', description: 'Mars executes Jupiter’s grand strategies successfully.', type: 'friendly' },
    4: { title: 'Aggressive Energy', description: 'Needs careful patience to avoid impulsive conflicts.', type: 'enemy' },
    5: { title: 'Strategic Action', description: 'Fast results in commerce, sports, and defense.', type: 'friendly' },
    6: { title: 'Passionate Drive', description: 'High energy in arts, sports, and relationships.', type: 'friendly' },
    7: { title: 'Courageous Healer', description: 'Mars and Ketu excel in surgery, martial arts, and healing.', type: 'friendly' },
    8: { title: 'Industrial Might', description: 'Mars and Saturn build factories, infrastructure, and empires.', type: 'neutral' },
    9: { title: 'Fiery Leadership', description: 'Double Mars amplifies courage, sportsmanship, and leadership.', type: 'friendly' }
  }
};

export function evaluateVedicYogas(gridCounts: Record<number, number>): YogaItem[] {
  const yogas: YogaItem[] = [];

  // Horizontal Planes in Vedic Grid (3-1-9 / 6-7-5 / 2-8-4)
  // Mind / Thought Plane: 3, 1, 9
  if (gridCounts[3] > 0 && gridCounts[1] > 0 && gridCounts[9] > 0) {
    yogas.push({
      id: 'mind_plane_319',
      name: 'Thought / Mind Plane Yoga (3-1-9)',
      category: 'Horizontal Plane',
      numbers: [3, 1, 9],
      description: 'Presence of Jupiter (3), Sun (1), and Mars (9) creates supreme mental agility, sharp memory, strategic foresight, and leadership vision.',
      effect: 'Exceptional intellectual power, academic brilliance, quick decision-making, and natural command.'
    });
  }

  // Soul / Emotional / Will Plane: 6, 7, 5
  if (gridCounts[6] > 0 && gridCounts[7] > 0 && gridCounts[5] > 0) {
    yogas.push({
      id: 'soul_plane_675',
      name: 'Soul & Emotional Will Yoga (6-7-5)',
      category: 'Horizontal Plane',
      numbers: [6, 7, 5],
      description: 'Presence of Venus (6), Ketu (7), and Mercury (5) balances deep intuition, artistic grace, and commercial intelligence.',
      effect: 'Unshakeable emotional strength, magnetic charm, deep spiritual insight, and adaptability.'
    });
  }

  // Practical / Body Plane: 2, 8, 4
  if (gridCounts[2] > 0 && gridCounts[8] > 0 && gridCounts[4] > 0) {
    yogas.push({
      id: 'body_plane_284',
      name: 'Practical & Body Plane Yoga (2-8-4)',
      category: 'Horizontal Plane',
      numbers: [2, 8, 4],
      description: 'Presence of Moon (2), Saturn (8), and Rahu (4) provides practical execution, engineering skill, and real estate acumen.',
      effect: 'Grounded execution, technical genius, ability to turn ideas into physical assets and real estate.'
    });
  }

  // Vertical Planes in Vedic Grid
  // Vision & Knowledge Plane: 3, 6, 2
  if (gridCounts[3] > 0 && gridCounts[6] > 0 && gridCounts[2] > 0) {
    yogas.push({
      id: 'vision_plane_362',
      name: 'Knowledge & Memory Vision Yoga (3-6-2)',
      category: 'Vertical Plane',
      numbers: [3, 6, 2],
      description: 'Presence of Jupiter (3), Venus (6), and Moon (2) brings aesthetic wisdom, deep imagination, and peace of mind.',
      effect: 'High creativity, gentle character, financial stability, and respected social standing.'
    });
  }

  // Action & Success Plane: 1, 7, 8
  if (gridCounts[1] > 0 && gridCounts[7] > 0 && gridCounts[8] > 0) {
    yogas.push({
      id: 'action_plane_178',
      name: 'Government & Action Success Yoga (1-7-8)',
      category: 'Vertical Plane',
      numbers: [1, 7, 8],
      description: 'Presence of Sun (1), Ketu (7), and Saturn (8) builds unstoppable determination, perseverance, and administrative authority.',
      effect: 'Government connections, success after hard work, legal authority, and high career resilience.'
    });
  }

  // Intellect & Business Plane: 9, 5, 4
  if (gridCounts[9] > 0 && gridCounts[5] > 0 && gridCounts[4] > 0) {
    yogas.push({
      id: 'intellect_plane_954',
      name: 'Intellect & Trade Financial Yoga (9-5-4)',
      category: 'Vertical Plane',
      numbers: [9, 5, 4],
      description: 'Presence of Mars (9), Mercury (5), and Rahu (4) creates a master business strategist, technical expert, and stock trader.',
      effect: 'Rapid business expansion, technical innovations, high financial acumen, and competitive victory.'
    });
  }

  // Diagonal Yogas in Vedic Grid
  // Spiritual & Knowledge Raj Yoga: 3, 7, 4
  if (gridCounts[3] > 0 && gridCounts[7] > 0 && gridCounts[4] > 0) {
    yogas.push({
      id: 'spiritual_yoga_374',
      name: 'Spiritual Knowledge Raj Yoga (3-7-4)',
      category: 'Trine',
      numbers: [3, 7, 4],
      description: 'The sacred combination of Jupiter (3), Ketu (7), and Rahu (4).',
      effect: 'Profound spiritual realization, mastery in occult/astrology, deep research capacity, and inner awakening.'
    });
  }

  // Leadership & Property Raj Yoga: 2, 7, 9
  if (gridCounts[2] > 0 && gridCounts[7] > 0 && gridCounts[9] > 0) {
    yogas.push({
      id: 'property_yoga_279',
      name: 'Leadership & Property Raj Yoga (2-7-9)',
      category: 'Trine',
      numbers: [2, 7, 9],
      description: 'Combination of Moon (2), Ketu (7), and Mars (9).',
      effect: 'Commanding leadership, foreign travels, surgical/medical acumen, and land ownership.'
    });
  }

  // Golden Trine / Raj Yogas
  if (gridCounts[2] > 0 && gridCounts[5] > 0 && gridCounts[8] > 0) {
    yogas.push({
      id: 'raja_yoga_258',
      name: 'Earth & Land Empire Raj Yoga (2-5-8)',
      category: 'Trine',
      numbers: [2, 5, 8],
      description: 'Harmonious alignment of Moon (2), Mercury (5), and Saturn (8).',
      effect: 'Massive wealth accumulation through land, real estate, structural business, and emotional balance.'
    });
  }

  if (gridCounts[4] > 0 && gridCounts[5] > 0 && gridCounts[6] > 0) {
    yogas.push({
      id: 'raj_yoga_456',
      name: 'Luxurious Golden Raj Yoga (4-5-6)',
      category: 'Trine',
      numbers: [4, 5, 6],
      description: 'Synergy of Rahu (4), Mercury (5), and Venus (6).',
      effect: 'High material comforts, luxury vehicles, international exposure, and celebrity-like appeal.'
    });
  }

  // Pair Yogas
  if (gridCounts[1] > 0 && gridCounts[6] > 0) {
    yogas.push({
      id: 'pair_1_6',
      name: '1 & 6 Present (Speaker & Noble Heart Yoga)',
      category: 'Combination',
      numbers: [1, 6],
      description: 'Sun (1) and Venus (6) create attractive speech, public fame, and government or corporate connections.',
      effect: 'Excellent communication skills, artistic flair; exercise patience in personal marital dynamics to avoid minor misunderstandings.'
    });
  }

  if (gridCounts[1] > 0 && gridCounts[7] > 0) {
    yogas.push({
      id: 'pair_1_7',
      name: '1 & 7 Present (Speakers & Noble Heart Yoga)',
      category: 'Combination',
      numbers: [1, 7],
      description: 'Sun (1) and Ketu (7) foster early career placement, public speaking prowess, and deep devotion.',
      effect: 'Early job or business establishment, government favor, travel enthusiast, and noble character.'
    });
  }

  if (gridCounts[2] > 0 && gridCounts[5] > 0 && (gridCounts[8] === 0 || gridCounts[4] === 0)) {
    yogas.push({
      id: 'pair_2_5',
      name: '2 & 5 Present (Memory & International Tour Yoga)',
      category: 'Combination',
      numbers: [2, 5],
      description: 'Moon (2) and Mercury (5) sharpen mental memory and business adaptability.',
      effect: 'Photographic memory, sharp trade instinct, frequent international tours, and quick learning.'
    });
  }

  if (gridCounts[3] > 0 && gridCounts[9] > 0) {
    yogas.push({
      id: 'pair_3_9',
      name: '3 & 9 Present (Intellectual Courage Yoga)',
      category: 'Combination',
      numbers: [3, 9],
      description: 'Jupiter (3) and Mars (9) combine wisdom with courageous execution.',
      effect: 'High academic success, respect in society, victorious competitive spirit, and teaching mastery.'
    });
  }

  if (gridCounts[6] > 0 && gridCounts[7] > 0) {
    yogas.push({
      id: 'pair_6_7',
      name: '6 & 7 Present (Artistic Healer Yoga)',
      category: 'Combination',
      numbers: [6, 7],
      description: 'Venus (6) and Ketu (7) blend material grace with spiritual intuition.',
      effect: 'Talent in arts, music, healing, occult research, and deep aesthetic sensitivity.'
    });
  }

  if (gridCounts[2] > 0 && gridCounts[8] > 0) {
    yogas.push({
      id: 'pair_2_8',
      name: '2 & 8 Present (Property & Endurance Yoga)',
      category: 'Combination',
      numbers: [2, 8],
      description: 'Moon (2) and Saturn (8) bring perseverance and tangible asset creation.',
      effect: 'Patience in building wealth, real estate holdings, and steady emotional maturity.'
    });
  }

  // Multiple Numbers Repetition
  for (let num = 1; num <= 9; num++) {
    const count = gridCounts[num] || 0;
    if (count >= 2) {
      yogas.push({
        id: `multiple_${num}`,
        name: `Number ${num} (${planetMap[num].planet}) Repeated ${count}x`,
        category: 'General',
        numbers: [num],
        description: `Number ${num} (${planetMap[num].planet}) appears ${count} times in the grid.`,
        effect: count >= 3
          ? `High magnification of ${planetMap[num].planet}. Direct this intense energy into focused creative or professional goals.`
          : `Enhanced qualities of ${planetMap[num].planet} in personality and decision making.`
      });
    }
  }

  return yogas;
}

export function getRawDobDigits(day: number, month: number, year: number): number[] {
  const specialDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30];
  const digits: number[] = [];

  // Rule 2: If day is NOT in 1..10, 20, 30, fill day digits separately into grid
  if (!specialDays.includes(day)) {
    const dayStr = day.toString();
    for (let i = 0; i < dayStr.length; i++) {
      const d = parseInt(dayStr[i], 10);
      if (d >= 1 && d <= 9) digits.push(d);
    }
  }

  // Fill Month digits
  const monthStr = (month < 10 ? '0' + month : month.toString());
  for (let i = 0; i < monthStr.length; i++) {
    const d = parseInt(monthStr[i], 10);
    if (d >= 1 && d <= 9) digits.push(d);
  }

  // Rule 1: Fill Year digits WITHOUT century (last 2 digits)
  const last2YearStr = (year % 100).toString().padStart(2, '0');
  for (let i = 0; i < last2YearStr.length; i++) {
    const d = parseInt(last2YearStr[i], 10);
    if (d >= 1 && d <= 9) digits.push(d);
  }

  return digits;
}

export function getVedicBaseDigits(day: number, month: number, year: number): number[] {
  const digits: number[] = getRawDobDigits(day, month, year);

  const basicNumber = reduceToSingleDigit(day);

  // Destiny Number (DN) = reduce sum of all digits of full DOB
  const dobString = `${day}${month}${year}`;
  const destinyNumber = reduceToSingleDigit(
    dobString.split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
  );

  // Always fill BN
  if (basicNumber >= 1 && basicNumber <= 9) {
    digits.push(basicNumber);
  }

  // Always fill DN
  if (destinyNumber >= 1 && destinyNumber <= 9) {
    digits.push(destinyNumber);
  }

  return digits;
}

export function calculateNumerology(details: PersonDetails): NumerologyResult {
  const { day, month, year, targetYear, firstName, middleName, surname } = details;

  // Basic Number (Birth Number - BN) = reduce sum of birth day digits
  const basicNumber = reduceToSingleDigit(day);

  // Destiny Number (DN) = reduce sum of all digits of full DOB
  const dobString = `${day}${month}${year}`;
  const destinyNumber = reduceToSingleDigit(
    dobString.split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
  );

  // Name Number
  const fullName = [firstName, middleName, surname].filter(Boolean).join(' ');
  const nameNumber = calculateChaldeanNameNumber(fullName);

  // Relationship between BN & DN
  const relGroup = relationshipData[basicNumber]?.[destinyNumber] || {
    title: 'Balanced Synergy',
    description: 'A unique blend of personal drive and destiny path.',
    type: 'neutral'
  };

  // Lucky / Unlucky / Neutral numbers based on basic number
  let luckyNumbers: number[] = [];
  let unluckyNumbers: number[] = [];
  let neutralNumbers: number[] = [];

  switch (basicNumber) {
    case 1: luckyNumbers = [1, 2, 3, 9]; unluckyNumbers = [8]; neutralNumbers = [4, 5, 6, 7]; break;
    case 2: luckyNumbers = [1, 2, 3, 5, 6]; unluckyNumbers = [4, 8]; neutralNumbers = [7, 9]; break;
    case 3: luckyNumbers = [1, 3, 6, 9]; unluckyNumbers = [5]; neutralNumbers = [2, 4, 7, 8]; break;
    case 4: luckyNumbers = [1, 5, 6, 7, 8]; unluckyNumbers = [2, 9]; neutralNumbers = [3]; break;
    case 5: luckyNumbers = [1, 5, 6]; unluckyNumbers = [2, 9]; neutralNumbers = [3, 4, 7, 8]; break;
    case 6: luckyNumbers = [1, 5, 6, 8]; unluckyNumbers = [3, 7]; neutralNumbers = [2, 4, 9]; break;
    case 7: luckyNumbers = [1, 2, 3, 5, 7]; unluckyNumbers = [6, 8, 9]; neutralNumbers = [4]; break;
    case 8: luckyNumbers = [3, 5, 6, 8]; unluckyNumbers = [1, 2, 4]; neutralNumbers = [7, 9]; break;
    case 9: luckyNumbers = [1, 2, 3, 6, 9]; unluckyNumbers = [4, 7]; neutralNumbers = [5, 8]; break;
    default: luckyNumbers = [1, 3, 5]; unluckyNumbers = [4]; neutralNumbers = [2, 6, 7, 8, 9];
  }

  // Grid counts calculation for Vedic Grid (1 to 9)
  const birthGridCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const baseDigits = getVedicBaseDigits(day, month, year);
  for (const digit of baseDigits) {
    if (digit >= 1 && digit <= 9) {
      birthGridCounts[digit] = (birthGridCounts[digit] || 0) + 1;
    }
  }

  // Target Grid Counts initially initialized to birthGridCounts
  const targetGridCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (let d = 1; d <= 9; d++) {
    targetGridCounts[d] = birthGridCounts[d];
  }

  // Age in target year
  let age = targetYear - year;
  if (age < 0) age = 0;

  // --- 1. Mahadasha Calculation ---
  // Starts from birth year with Basic Number (BN) for BN years, then BN+1 for BN+1 years...
  // 1-9 complete cycle = 45 years.
  const cycleAge = age % 45;
  let dashaNumber = basicNumber;
  let mahadashaDuration = basicNumber;
  let accumulatedYears = 0;
  let currMD = basicNumber;

  for (let step = 0; step < 9; step++) {
    const duration = currMD;
    if (cycleAge >= accumulatedYears && cycleAge < accumulatedYears + duration) {
      dashaNumber = currMD;
      mahadashaDuration = duration;
      break;
    }
    accumulatedYears += duration;
    currMD = (currMD % 9) + 1;
  }

  const mahadasha = {
    number: dashaNumber,
    planet: planetMap[dashaNumber].planet,
    meaning: `${planetMap[dashaNumber].meaning} (${mahadashaDuration}-Year Period)`
  };

  // --- 2. Antardasha (Personal Year Number) Calculation ---
  // Formula: DD + MM + YY + Day Lord Number
  // DD: sum of digits of birth day
  // MM: sum of digits of birth month
  // YY: sum of last 2 digits of target year
  // Day Lord Number: weekday of birth day in target year (Mon:2, Tue:9, Wed:5, Thu:3, Fri:6, Sat:8, Sun:1)
  const dayDigitSum = reduceToSingleDigit(day);
  const monthDigitSum = reduceToSingleDigit(month);
  const targetYearLast2Str = (targetYear % 100).toString().padStart(2, '0');
  const year2DigitSum = parseInt(targetYearLast2Str[0], 10) + parseInt(targetYearLast2Str[1], 10);

  const anniversaryDate = new Date(targetYear, month - 1, day);
  const dayOfWeek = anniversaryDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const dayLordMap: Record<number, number> = {
    0: 1, // Sunday -> Sun (1)
    1: 2, // Monday -> Moon (2)
    2: 9, // Tuesday -> Mars (9)
    3: 5, // Wednesday -> Mercury (5)
    4: 3, // Thursday -> Jupiter (3)
    5: 6, // Friday -> Venus (6)
    6: 8  // Saturday -> Saturn (8)
  };
  const dayLordNumber = dayLordMap[dayOfWeek] || 1;

  const adRawSum = dayDigitSum + monthDigitSum + year2DigitSum + dayLordNumber;
  const antaraNum = reduceToSingleDigit(adRawSum);

  const antardasha = {
    number: antaraNum,
    planet: planetMap[antaraNum].planet,
    meaning: `${planetMap[antaraNum].meaning} (Personal Year Vibration)`
  };

  const personalYearNumber = antaraNum;

  // RULE 3 & RULE 4:
  // At Age > 0 (targetYear > year), fill MD (Mahadasha) and AD (Antardasha) into targetGridCounts!
  // At Age === 0 (targetYear === year), DO NOT fill MD or AD into targetGridCounts!
  if (age > 0) {
    targetGridCounts[mahadasha.number] = (targetGridCounts[mahadasha.number] || 0) + 1;
    targetGridCounts[antardasha.number] = (targetGridCounts[antardasha.number] || 0) + 1;
  }

  // --- 3. Pratyantardasha (9 Sub-Periods with Fixed Day Durations) ---
  // Duration table per planet/number:
  // 1: 8 days, 2: 16 days, 3: 24 days, 4: 32 days, 5: 41 days, 6: 49 days, 7: 57 days, 8: 65 days, 9: 73 days (Total = 365 days)
  const pdDaysMap: Record<number, number> = {
    1: 8,
    2: 16,
    3: 24,
    4: 32,
    5: 41,
    6: 49,
    7: 57,
    8: 65,
    9: 73
  };

  const pratyantardashaList: PratyantardashaPeriod[] = [];
  let currentStart = new Date(targetYear, month - 1, day);
  let currPDNum = antaraNum;

  const formatDateStr = (dateObj: Date): string => {
    const d = dateObj.getDate().toString().padStart(2, '0');
    const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}/${m}/${y}`;
  };

  for (let idx = 1; idx <= 9; idx++) {
    const num = currPDNum;
    const durationDays = pdDaysMap[num] || 40;

    const currentEnd = new Date(currentStart.getTime());
    currentEnd.setDate(currentEnd.getDate() + durationDays - 1);

    pratyantardashaList.push({
      index: idx,
      number: num,
      planet: planetMap[num].planet,
      startDate: formatDateStr(currentStart),
      endDate: formatDateStr(currentEnd),
      durationDays,
      description: `PD #${idx} (No. ${num} - ${planetMap[num].planet}) lasts for ${durationDays} days (${formatDateStr(currentStart)} to ${formatDateStr(currentEnd)}). Focusses on ${planetMap[num].meaning.toLowerCase()}.`
    });

    currentStart = new Date(currentEnd.getTime());
    currentStart.setDate(currentStart.getDate() + 1);

    currPDNum = (currPDNum % 9) + 1;
  }

  // Yogas based on targetGridCounts
  const yogas = evaluateVedicYogas(targetGridCounts);

  // Missing numbers & remedies
  const missingNumbers: number[] = [];
  const missingRemedies: MissingRemedy[] = [];

  const remedyDatabase: Record<number, { element: string; color: string; crystal: string; mantra: string; charity: string }> = {
    1: { element: 'Sun / Fire', color: 'Gold / Orange', crystal: 'Sunstone / Ruby', mantra: 'Om Suryaya Namaha', charity: 'Donate wheat or jaggery on Sundays' },
    2: { element: 'Moon / Water', color: 'White / Silver', crystal: 'Pearl / Moonstone', mantra: 'Om Chandraya Namaha', charity: 'Donate milk or rice on Mondays' },
    3: { element: 'Jupiter / Ether', color: 'Yellow / Saffron', crystal: 'Yellow Sapphire / Citrine', mantra: 'Om Gurave Namaha', charity: 'Donate turmeric or yellow dal on Thursdays' },
    4: { element: 'Rahu / Air', color: 'Blue / Smoke', crystal: 'Hessonite (Gomed)', mantra: 'Om Rahave Namaha', charity: 'Feed stray dogs or birds' },
    5: { element: 'Mercury / Earth', color: 'Green', crystal: 'Emerald / Jade', mantra: 'Om Budhaya Namaha', charity: 'Donate green fodder to cows on Wednesdays' },
    6: { element: 'Venus / Water', color: 'Pink / White', crystal: 'Diamond / Opal', mantra: 'Om Shukraya Namaha', charity: 'Support underprivileged women or white sweets on Fridays' },
    7: { element: 'Ketu / Fire', color: 'Grey / Multi', crystal: 'Cat’s Eye', mantra: 'Om Ketave Namaha', charity: 'Feed stray dogs or blanket donation on Thursdays' },
    8: { element: 'Saturn / Air', color: 'Dark Blue / Black', crystal: 'Blue Sapphire / Amethyst', mantra: 'Om Shanishcharaya Namaha', charity: 'Serve disabled or elderly people on Saturdays' },
    9: { element: 'Mars / Fire', color: 'Red / Maroon', crystal: 'Red Coral', mantra: 'Om Mangalaya Namaha', charity: 'Donate blood or sweets on Tuesdays' }
  };

  for (let n = 1; n <= 9; n++) {
    if ((targetGridCounts[n] || 0) === 0) {
      missingNumbers.push(n);
      missingRemedies.push({
        number: n,
        ...remedyDatabase[n]
      });
    }
  }

  // Profession Guidance based on Destiny Number
  const professionMap: Record<number, ProfessionInfo> = {
    1: {
      primaryFields: ['Government Services', 'Administration', 'Leadership & Management', 'Politics'],
      secondaryFields: ['Gold & Jewelry', 'Medicine', 'Corporate Executive', 'Public Speaking'],
      suitableBusiness: ['Independent Enterprise', 'Consultancy', 'Manufacturing'],
      auspiciousColors: ['Gold', 'Orange', 'Yellow'],
      auspiciousDirections: ['East'],
      guidanceText: 'Destiny Number 1 naturally suits authoritative roles where you can lead, inspire, and take charge of large projects.'
    },
    2: {
      primaryFields: ['Hospitality & Tourism', 'Counseling & Psychology', 'Art & Creative Arts', 'Nursing & Caregiving'],
      secondaryFields: ['Liquid Products', 'Dairy Industry', 'Public Relations', 'Diplomacy'],
      suitableBusiness: ['Partnerships', 'Event Management', 'Import/Export'],
      auspiciousColors: ['White', 'Silver', 'Light Green'],
      auspiciousDirections: ['North-West'],
      guidanceText: 'Destiny Number 2 excels in collaborative environments, counseling, hospitality, and creative fields requiring deep emotional intelligence.'
    },
    3: {
      primaryFields: ['Education & Teaching', 'Law & Judiciary', 'Astrology & Occult Sciences', 'Banking & Finance'],
      secondaryFields: ['Publishing & Writing', 'Advisory Roles', 'Public Administration', 'Training'],
      suitableBusiness: ['Consultancy Firm', 'Educational Institution', 'Financial Advisory'],
      auspiciousColors: ['Yellow', 'Saffron', 'Purple'],
      auspiciousDirections: ['North-East'],
      guidanceText: 'Destiny Number 3 thrives in knowledge sharing, spiritual guidance, financial planning, and advisory positions.'
    },
    4: {
      primaryFields: ['Information Technology & Coding', 'Engineering & Architecture', 'Scientific Research', 'Data Analysis'],
      secondaryFields: ['Stock Market & Trading', 'Mechanics', 'Auditing', 'Inventions'],
      suitableBusiness: ['Tech Startup', 'Logistics', 'Construction'],
      auspiciousColors: ['Electric Blue', 'Grey', 'Khaki'],
      auspiciousDirections: ['South-West'],
      guidanceText: 'Destiny Number 4 is exceptionally suited for technology, structural engineering, rigorous research, and analytical problem-solving.'
    },
    5: {
      primaryFields: ['Media & Journalism', 'Sales & Marketing', 'Stock Market & Commodities', 'Travel & Aviation'],
      secondaryFields: ['Public Speaking', 'E-commerce', 'Import-Export', 'Communication Services'],
      suitableBusiness: ['Trading Agency', 'Digital Marketing Firm', 'Global Business'],
      auspiciousColors: ['Green', 'Light Grey', 'White'],
      auspiciousDirections: ['North'],
      guidanceText: 'Destiny Number 5 is the master of commerce, communication, marketing, and dynamic business ventures.'
    },
    6: {
      primaryFields: ['Fashion & Luxury Goods', 'Interior Design', 'Entertainment & Cinema', 'Hospitality & Restaurants'],
      secondaryFields: ['Cosmetics', 'Healing & Wellness', 'Jewelry', 'Fine Arts'],
      suitableBusiness: ['Luxury Brand', 'Spa & Wellness', 'Event Decor'],
      auspiciousColors: ['Pink', 'White', 'Light Blue'],
      auspiciousDirections: ['South-East'],
      guidanceText: 'Destiny Number 6 shines in luxury, arts, entertainment, fashion, and aesthetic industries.'
    },
    7: {
      primaryFields: ['Occult Sciences & Astrology', 'Scientific Research', 'Psychology & Healing', 'Writing & Philosophy'],
      secondaryFields: ['Data Science', 'Audit & Inspection', 'Detective Services', 'Spiritual Mentoring'],
      suitableBusiness: ['Research Lab', 'Healing Center', 'Specialized Publishing'],
      auspiciousColors: ['Smoke Grey', 'White', 'Light Yellow'],
      auspiciousDirections: ['North-East'],
      guidanceText: 'Destiny Number 7 is designed for deep research, occult wisdom, psychology, and investigative analysis.'
    },
    8: {
      primaryFields: ['Real Estate & Infrastructure', 'Corporate Management', 'Law & Judiciary', 'Heavy Industry & Manufacturing'],
      secondaryFields: ['Oil & Petroleum', 'Mining', 'Finance & Banking', 'Labor Management'],
      suitableBusiness: ['Real Estate Firm', 'Industrial Contracting', 'Large Enterprise'],
      auspiciousColors: ['Dark Blue', 'Black', 'Grey'],
      auspiciousDirections: ['West'],
      guidanceText: 'Destiny Number 8 excels in heavy industries, corporate leadership, real estate development, and large-scale project management.'
    },
    9: {
      primaryFields: ['Armed Forces & Police', 'Surgery & Medicine', 'Sports & Athletics', 'Social Work & NGO'],
      secondaryFields: ['Real Estate', 'Fire Safety', 'Engineering Execution', 'Administration'],
      suitableBusiness: ['Security Agency', 'Construction', 'Fitness Center'],
      auspiciousColors: ['Red', 'Maroon', 'Coral'],
      auspiciousDirections: ['South'],
      guidanceText: 'Destiny Number 9 thrives in high-energy fields, defense, sports, surgical medicine, and courageous leadership.'
    }
  };

  const professionGuidance = professionMap[destinyNumber] || professionMap[1];

  // Medical Numerology & Neuro-Developmental Indications
  const medicalIndications: MedicalIndication[] = [];

  // Mercury (5) - Nerve signaling, mind communication, cognitive adaptability & speech
  if ((targetGridCounts[5] || 0) === 0) {
    medicalIndications.push({
      title: 'Cognitive & Nervous Signal Balance (Mercury 5)',
      associatedNumbers: 'Missing 5 (Mercury Vibration)',
      indication: 'Vibrational influence on the nervous system, speech articulation, sensory signaling, or cognitive adaptability.',
      preventiveCare: 'Incorporate structured routine, speech/occupational therapy, green chromotherapy (green jade crystal, green surroundings), and gentle sensory grounding exercises.'
    });
  }

  // Moon (2) - Emotional Mind (Manas), Mental Tranquility, Sleep & Mood Stability
  if ((targetGridCounts[2] || 0) === 0) {
    medicalIndications.push({
      title: 'Emotional Mind & Sleep Harmony (Moon 2)',
      associatedNumbers: 'Missing 2 (Moon Vibration)',
      indication: 'Sensitivity to sensory environments, mood fluctuations, sleep pattern variations, or emotional restlessness.',
      preventiveCare: 'Maintain calm bedtime routines, offer water in a silver tumbler, keep soothing music playing, and practice calming breathing or sensory massage.'
    });
  }

  // Rahu (4) / Ketu (7) / Saturn (8) - Neurodivergent Perception & Milestone Pace
  if ((targetGridCounts[4] || 0) >= 2 || (targetGridCounts[7] || 0) >= 2 || (targetGridCounts[8] || 0) >= 2) {
    medicalIndications.push({
      title: 'Sensory Processing & Milestone Pace (Rahu/Ketu/Saturn)',
      associatedNumbers: 'Prominent 4, 7, or 8 in Grid',
      indication: 'Unconventional perception style, high internal focus, intense sensory sensitivity, or methodical milestone progression requiring extra time.',
      preventiveCare: 'Provide quiet low-sensory sanctuary spaces, consistent step-by-step behavioral encouragement, and patient long-term therapy without comparative pressure.'
    });
  }

  // Joint & Skeletal Health
  if ((targetGridCounts[4] || 0) >= 3 || (targetGridCounts[8] || 0) >= 3) {
    medicalIndications.push({
      title: 'Joint & Skeletal Balance',
      associatedNumbers: 'Repeated 4 or 8',
      indication: 'Tendency towards physical stiffness, posture stress, or muscle tension.',
      preventiveCare: 'Incorporate regular stretching, gentle physical therapy, calcium/vitamin D nutrition, and warm compress remedies.'
    });
  }

  // Fiery Temper & Circulation
  if ((targetGridCounts[9] || 0) >= 3) {
    medicalIndications.push({
      title: 'Fiery Vitality & Nervous Energy',
      associatedNumbers: 'Repeated 9',
      indication: 'High internal energy that may manifest as quick frustration, restlessness, or heat sensitivity.',
      preventiveCare: 'Practice cooling pranayama (Sheetali/Anulom Vilom), maintain a hydrating diet, and engage in calming outdoor walks in nature.'
    });
  }

  // Default if no specific indication triggered
  if (medicalIndications.length === 0) {
    medicalIndications.push({
      title: 'General Vitality & Nervous Balance',
      associatedNumbers: 'Balanced Grid Matrix',
      indication: 'Balanced numerical alignment supporting steady physical stamina and neurological harmony.',
      preventiveCare: 'Maintain wholesome nutrition, daily physical exercise, adequate rest, and positive mental stimulation.'
    });
  }

  // Yearly Prediction
  const yearlyPrediction: YearlyPrediction = {
    year: targetYear,
    personalYearNumber,
    title: `Year ${targetYear} Analysis (Personal Year ${personalYearNumber})`,
    opportunities: [
      `Favorable window for personal growth and career alignment governed by Personal Year ${personalYearNumber}.`,
      `Opportunities to network with supportive individuals, launch strategic ventures, and consolidate previous efforts.`
    ],
    challenges: [
      `Potential moments of impatience or administrative delays; maintain consistent focus and structured routines.`,
      `Avoid impulsive financial commitments or emotional reactions during seasonal transitions.`
    ],
    supportivePeriods: `Months corresponding to numbers ${basicNumber}, ${destinyNumber}, and 5 (e.g. May, September, October).`,
    cautionPeriods: `Exercise caution during months when hostile numbers or heavy work pressure peaks.`,
    numericalGuidance: `Leverage the energy of Personal Year ${personalYearNumber} by staying organized, focusing on core strengths, and applying the recommended remedies for missing numbers.`
  };

  return {
    basicNumber,
    destinyNumber,
    nameNumber,
    relationship: relGroup,
    luckyNumbers,
    unluckyNumbers,
    neutralNumbers,
    gridCounts: targetGridCounts,
    birthGridCounts,
    targetGridCounts,
    ageInTargetYear: age,
    mahadasha,
    antardasha,
    pratyantardashaList,
    yogas,
    missingNumbers,
    missingRemedies,
    professionGuidance,
    medicalIndications,
    yearlyPrediction
  };
}

