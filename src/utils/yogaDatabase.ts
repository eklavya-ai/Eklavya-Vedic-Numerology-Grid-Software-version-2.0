export interface CategorizedEffects {
  career: string[];
  finance: string[];
  relationship: string[];
  health: string[];
  travel: string[];
  business: string[];
  marriage: string[];
  children: string[];
  property: string[];
  litigation: string[];
  remedies: string[];
}

export interface StructuredYoga {
  id: string;
  name: string;
  category: 
    | 'Career Yogas'
    | 'Finance Yogas'
    | 'Marriage Yogas'
    | 'Relationship Yogas'
    | 'Health Yogas'
    | 'Travel Yogas'
    | 'Foreign Settlement Yogas'
    | 'Education Yogas'
    | 'Business Yogas'
    | 'Children Yogas'
    | 'Property Yogas'
    | 'Litigation Yogas'
    | 'Remedies'
    | 'Plane Yogas'
    | 'General';
  numbers: number[];
  description: string;
  effects: CategorizedEffects;
}

export const STRUCTURED_YOGAS_DATABASE: StructuredYoga[] = [
  {
    id: 'MIND_PLANE_319',
    name: 'Thought / Mind Plane (3-1-9)',
    category: 'Education Yogas',
    numbers: [3, 1, 9],
    description: 'Brings together Jupiter (3), Sun (1), and Mars (9) across the top horizontal row.',
    effects: {
      career: ['Strategic leadership', 'Executive decision making', 'Government favor', 'High visibility'],
      finance: ['Financial planning', 'Asset acquisition', 'Income through authority'],
      relationship: ['Respectful social standing', 'Inspiring leadership in family'],
      health: ['High mental vitality', 'Potential for stress if overworking'],
      travel: ['Official delegations', 'Educational travels'],
      business: ['Corporate strategy', 'Policy making', 'Consultancy'],
      marriage: ['Strong protective instinct toward spouse'],
      children: ['Focus on children education and discipline'],
      property: ['Institutional and office property acquisition'],
      litigation: ['Favorable outcome in legal and administrative matters'],
      remedies: ['Offer water to Sun daily', 'Chant Om Gurave Namaha']
    }
  },
  {
    id: 'SOUL_PLANE_675',
    name: 'Soul & Will Plane (6-7-5)',
    category: 'Plane Yogas',
    numbers: [6, 7, 5],
    description: 'Combines Venus (6), Ketu (7), and Mercury (5) across the middle horizontal row.',
    effects: {
      career: ['Artistic brilliance', 'Diplomacy', 'Consultancy', 'High emotional intelligence'],
      finance: ['Wealth through luxury goods', 'Foreign earnings', 'Consistent cash flow'],
      relationship: ['Deep empathy', 'Charismatic charm', 'Strong intuitive bond'],
      health: ['Good emotional resilience', 'Balanced nervous system'],
      travel: ['Frequent international tours', 'Cultural travel'],
      business: ['Luxury retail', 'Media agency', 'Trade and export'],
      marriage: ['Harmonious partner chemistry and aesthetic lifestyle'],
      children: ['Creative talent in offspring'],
      property: ['Luxurious residential homes and vehicles'],
      litigation: ['Diplomatic resolution of disputes'],
      remedies: ['Maintain neat attire', 'Support women or artists']
    }
  },
  {
    id: 'PRACTICAL_PLANE_284',
    name: 'Practical & Body Plane (2-8-4)',
    category: 'Property Yogas',
    numbers: [2, 8, 4],
    description: 'Combines Moon (2), Saturn (8), and Rahu (4) across the bottom horizontal row.',
    effects: {
      career: ['Engineering genius', 'Operations management', 'Construction & architecture'],
      finance: ['Real estate gains', 'Long-term investments', 'Heavy assets'],
      relationship: ['Grounded, stable commitment', 'Pragmatic family ties'],
      health: ['Need to monitor joints, legs, and bone health'],
      travel: ['Work-related site visits', 'Long distance relocation'],
      business: ['Real estate firm', 'Heavy manufacturing', 'IT infrastructure'],
      marriage: ['Solid, practical marriage built on mutual security'],
      children: ['Disciplined upbringing'],
      property: ['Multiple lands, plots, and constructed properties'],
      litigation: ['Requires thorough documentation for property disputes'],
      remedies: ['Serve elderly or needy people on Saturdays', 'Chant Om Shanishcharaya Namaha']
    }
  },
  {
    id: 'VISION_PLANE_362',
    name: 'Knowledge & Memory Vision Plane (3-6-2)',
    category: 'Education Yogas',
    numbers: [3, 6, 2],
    description: 'Left vertical column combining Jupiter (3), Venus (6), and Moon (2).',
    effects: {
      career: ['Teaching', 'Higher education', 'Creative arts', 'Spiritual counseling'],
      finance: ['Prosperity through knowledge', 'Passive creative income'],
      relationship: ['Loving family atmosphere', 'Generous nature'],
      health: ['Peaceful mind', 'Good digestion'],
      travel: ['Pilgrimages and aesthetic retreats'],
      business: ['Educational institution', 'Wellness sanctuary', 'Design studio'],
      marriage: ['Highly compassionate spouse and peaceful domestic life'],
      children: ['Inquisitive, well-mannered children'],
      property: ['Beautifully decorated ancestral home'],
      litigation: ['Peaceful out-of-court settlements'],
      remedies: ['Donate yellow sweets on Thursdays']
    }
  },
  {
    id: 'ACTION_PLANE_178',
    name: 'Action & Success Plane (1-7-8)',
    category: 'Career Yogas',
    numbers: [1, 7, 8],
    description: 'Middle vertical column combining Sun (1), Ketu (7), and Saturn (8).',
    effects: {
      career: ['Unstoppable drive', 'Government authority', 'Judicial & legal careers'],
      finance: ['Steady accumulated wealth', 'Pension or long-term growth'],
      relationship: ['Duty-bound relationship', 'Loyalty under pressure'],
      health: ['Spinal and bone endurance'],
      travel: ['Official travel for government or corporate duty'],
      business: ['Legal practice', 'Mining', 'Government contracting'],
      marriage: ['Loyal partner; requires patience in early years'],
      children: ['Disciplined, responsible children'],
      property: ['Government housing or commercial complexes'],
      litigation: ['Victorious in legitimate court cases'],
      remedies: ['Feed birds or dogs', 'Chant Om Suryaya Namaha']
    }
  },
  {
    id: 'INTELLECT_PLANE_954',
    name: 'Intellect & Trade Financial Plane (9-5-4)',
    category: 'Business Yogas',
    numbers: [9, 5, 4],
    description: 'Right vertical column combining Mars (9), Mercury (5), and Rahu (4).',
    effects: {
      career: ['Master business strategist', 'Tech innovator', 'Stock trader', 'Data analyst'],
      finance: ['Rapid wealth expansion', 'High-return investments', 'Tech trading profits'],
      relationship: ['Dynamic, fast-paced lifestyle'],
      health: ['High energy; needs calm mental breaks'],
      travel: ['Frequent international business trips'],
      business: ['Tech startup', 'Stock trading', 'Global commerce'],
      marriage: ['Partner who shares sharp intellect and ambition'],
      children: ['Tech-savvy offspring'],
      property: ['Commercial hubs and urban real estate'],
      litigation: ['Sharp legal strategy to overcome competitors'],
      remedies: ['Water green plants on Wednesdays', 'Donate to sports causes']
    }
  },
  {
    id: 'SPIRITUAL_YOGA_374',
    name: 'Spiritual Knowledge Raj Yoga (3-7-4)',
    category: 'Foreign Settlement Yogas',
    numbers: [3, 7, 4],
    description: 'Diagonal combination of Jupiter (3), Ketu (7), and Rahu (4).',
    effects: {
      career: ['Astrology', 'Occult sciences', 'Deep research', 'Global philosophy'],
      finance: ['Earnings through research, advisory, or foreign grants'],
      relationship: ['Spiritual, soulmate level connection'],
      health: ['Strong intuitive self-healing capacity'],
      travel: ['Spiritual pilgrimages and overseas research assignments'],
      business: ['Research labs', 'Occult consulting', 'Global online platforms'],
      marriage: ['Spouse interested in spirituality or research'],
      children: ['Intuitive, deeply thoughtful children'],
      property: ['Serene, quiet properties in nature'],
      litigation: ['Spiritual protection against legal troubles'],
      remedies: ['Donate books to needy students', 'Chant Om Ketave Namaha']
    }
  },
  {
    id: 'PROPERTY_YOGA_279',
    name: 'Leadership & Property Raj Yoga (2-7-9)',
    category: 'Property Yogas',
    numbers: [2, 7, 9],
    description: 'Diagonal combination of Moon (2), Ketu (7), and Mars (9).',
    effects: {
      career: ['Surgery', 'Defense forces', 'Real estate leadership', 'Sports management'],
      finance: ['Land appreciation', 'Gains through agriculture or real estate'],
      relationship: ['Passionate, protective bond'],
      health: ['High blood vitality and muscular recovery'],
      travel: ['Adventures and sea/land journeys'],
      business: ['Real estate developer', 'Surgical clinic', 'Security services'],
      marriage: ['Strong, brave partner who stands by you'],
      children: ['Athletic or courageous children'],
      property: ['Agricultural land, houses, and plots'],
      litigation: ['Fast resolution in land disputes'],
      remedies: ['Donate red lentils or blood on Tuesdays']
    }
  },
  {
    id: 'EARTH_YOGA_258',
    name: 'Earth & Empire Raj Yoga (2-5-8)',
    category: 'Finance Yogas',
    numbers: [2, 5, 8],
    description: 'The Golden Earth diagonal combining Moon (2), Mercury (5), and Saturn (8).',
    effects: {
      career: ['Land tycoon', 'Corporate builder', 'Chief Financial Officer', 'Real estate mogul'],
      finance: ['Massive wealth accumulation', 'Multi-generational assets'],
      relationship: ['Grounded, stable, enduring domestic life'],
      health: ['Stamina and steady digestion'],
      travel: ['Travel for land inspection and corporate expansion'],
      business: ['Real estate empire', 'Construction firm', 'Infrastructure conglomerate'],
      marriage: ['Enduring marriage built on financial stability and mutual respect'],
      children: ['Wealthy, successful heirs'],
      property: ['Extensive land holdings, commercial towers, and ancestral property'],
      litigation: ['Strong legal title over properties'],
      remedies: ['Keep a green Jade or Citrine stone', 'Chant Om Budhaya Namaha']
    }
  },
  {
    id: 'LUXURY_YOGA_456',
    name: 'Luxurious Golden Raj Yoga (4-5-6)',
    category: 'Finance Yogas',
    numbers: [4, 5, 6],
    description: 'The Silver & Gold diagonal combining Rahu (4), Mercury (5), and Venus (6).',
    effects: {
      career: ['Celebrity status', 'Media stardom', 'Luxury brand director', 'Global trade'],
      finance: ['High cash flow', 'Luxury vehicles', 'Foreign currency earnings'],
      relationship: ['Magnetic attractiveness and high social prestige'],
      health: ['Radiant skin and youthful aura'],
      travel: ['International luxury vacations and international residence'],
      business: ['Luxury fashion', 'Entertainment studio', 'Global export'],
      marriage: ['Attractive, high-status spouse'],
      children: ['Talented in performing arts or media'],
      property: ['Posh villas, luxury apartments, and premium cars'],
      litigation: ['Diplomatic immunity and elite legal defense'],
      remedies: ['Wear clean white or pastel clothing', 'Donate white sweets on Fridays']
    }
  },
  {
    id: 'ROYAL_BUSINESS_61',
    name: 'Royal Business (1-6 Pair)',
    category: 'Business Yogas',
    numbers: [1, 6],
    description: 'Sun (1) and Venus (6) combination forming high charisma and authority.',
    effects: {
      career: ['Leadership', 'Corporate branding', 'High visibility', 'Government relations'],
      finance: ['Cash flow', 'High status investments', 'Luxury assets'],
      relationship: ['Charismatic presence', 'High admiration from peers'],
      health: ['Good physical radiance'],
      travel: ['High-class business travel'],
      business: ['Royal business', 'Luxury retail', 'Public relations firm'],
      marriage: ['High status partner; maintain gentle mutual communication'],
      children: ['Charming children'],
      property: ['High-end prime residential property'],
      litigation: ['Strong influence in settlement negotiations'],
      remedies: ['Respect women and elders', 'Offer rose water in prayers']
    }
  },
  {
    id: 'NOBLE_SPEAKER_17',
    name: 'Noble Heart & Speaker (1-7 Pair)',
    category: 'Career Yogas',
    numbers: [1, 7],
    description: 'Sun (1) and Ketu (7) combination fostering early career stability and noble speech.',
    effects: {
      career: ['Early job settlement', 'Keynote speaker', 'Government advisor'],
      finance: ['Steady salary and research honorariums'],
      relationship: ['Loyal and noble nature'],
      health: ['Good immunity'],
      travel: ['Frequent purposeful travel'],
      business: ['Consultancy', 'Research publication'],
      marriage: ['Supportive and spiritual partner'],
      children: ['Dutiful children'],
      property: ['Peaceful residential house'],
      litigation: ['Favorable reputation protects from legal harm'],
      remedies: ['Offer water to Sun daily']
    }
  },
  {
    id: 'TRADE_MEMO_25',
    name: 'International Trade & Memory (2-5 Pair)',
    category: 'Foreign Settlement Yogas',
    numbers: [2, 5],
    description: 'Moon (2) and Mercury (5) pairing bringing sharp memory and overseas tours.',
    effects: {
      career: ['Import/export manager', 'PR executive', 'Journalist', 'Frequent traveler'],
      finance: ['Gains from international clients and trading'],
      relationship: ['Adaptable and cheerful partner'],
      health: ['Sharp mental acuity'],
      travel: ['Frequent foreign tours and work trips'],
      business: ['Global trading', 'E-commerce', 'Language agency'],
      marriage: ['Partner who loves travel and social gatherings'],
      children: ['Multilingual, smart kids'],
      property: ['Property near water bodies or overseas'],
      litigation: ['Swift settlements'],
      remedies: ['Donate green fodder to cows on Wednesdays']
    }
  },
  {
    id: 'COURAGE_39',
    name: 'Intellectual Courage (3-9 Pair)',
    category: 'Education Yogas',
    numbers: [3, 9],
    description: 'Jupiter (3) and Mars (9) pairing combining wisdom with fearless execution.',
    effects: {
      career: ['Academic scholar', 'High court advocate', 'Surgeon', 'Defense leader'],
      finance: ['High earning power through expertise'],
      relationship: ['Protective and honorable partner'],
      health: ['High stamina and muscular strength'],
      travel: ['Educational and professional conferences'],
      business: ['Law firm', 'Medical practice', 'Coaching institute'],
      marriage: ['Strong-willed, highly educated partner'],
      children: ['Academic achievers'],
      property: ['Institutional land and spacious homes'],
      litigation: ['Victorious in legal battles'],
      remedies: ['Donate yellow dal or red sweets on Tuesdays/Thursdays']
    }
  },
  {
    id: 'ARTISTIC_HEALER_67',
    name: 'Artistic Healer (6-7 Pair)',
    category: 'Health Yogas',
    numbers: [6, 7],
    description: 'Venus (6) and Ketu (7) blending artistic flair with spiritual healing instincts.',
    effects: {
      career: ['Aroma therapist', 'Reiki master', 'Designer', 'Musician', 'Interior stylist'],
      finance: ['Gains through healing arts and creative works'],
      relationship: ['Deep, soul-level romantic connection'],
      health: ['Calm aura and natural healing ability'],
      travel: ['Retreats and artistic exposure'],
      business: ['Holistic wellness clinic', 'Art gallery', 'Boutique store'],
      marriage: ['Spiritual, artistic spouse'],
      children: ['Creatively gifted children'],
      property: ['Artistically designed home'],
      litigation: ['Resolution through peaceful mediation'],
      remedies: ['Feed stray animals', 'Light incense on Fridays']
    }
  },
  {
    id: 'COGNITIVE_NEURO_YOGA_357',
    name: 'Mental Clarity & Neuro-Plasticity Yoga (3-5-7)',
    category: 'Health Yogas',
    numbers: [3, 5, 7],
    description: 'Harmonious interplay between Jupiter (3), Mercury (5), and Ketu (7) fostering cognitive absorption and neural adaptability.',
    effects: {
      career: ['Special education', 'Neuroscience research', 'Speech therapy', 'Psychology'],
      finance: ['Steady growth through specialized advisory'],
      relationship: ['Empathetic understanding of neurodiversity'],
      health: ['Supports neural connectivity, speech development, cognitive therapy responsiveness, and mental calm'],
      travel: ['Travel for health retreats or therapy centers'],
      business: ['Therapy clinic', 'Specialized learning center'],
      marriage: ['Deeply understanding and compassionate partner'],
      children: ['Gradual, steady breakthrough in cognitive milestones and speech expression'],
      property: ['Quiet, serene home environment'],
      litigation: ['Peaceful resolution'],
      remedies: ['Offer green fodder to cows on Wednesdays', 'Chant Om Budhaya Namaha', 'Use silver tumbler for water']
    }
  },
  {
    id: 'SPEECH_EXPRESSION_YOGA_25',
    name: 'Speech & Emotional Mind Yoga (2-5)',
    category: 'Health Yogas',
    numbers: [2, 5],
    description: 'Moon (2) and Mercury (5) pairing directly governing the emotional mind, speech organs, and nervous signal pathways.',
    effects: {
      career: ['Communication specialist', 'Psychotherapist', 'Counselor'],
      finance: ['Flow of resources for specialized child care'],
      relationship: ['Deep emotional expression'],
      health: ['Aids nervous system balance, reduces sensory overload, improves speech clarity and emotional grounding'],
      travel: ['Soothing nature visits'],
      business: ['Speech and occupational therapy center'],
      marriage: ['Gentle, communicative spouse'],
      children: ['Favorable window for speech milestones and social interaction'],
      property: ['Peaceful living space'],
      litigation: ['Amicable resolution'],
      remedies: ['Keep a green Jade crystal in child room', 'Offer cow milk on Mondays']
    }
  },
  {
    id: 'NEURO_PATIENCE_YOGA_38',
    name: 'Developmental Endurance & Milestone Yoga (3-8)',
    category: 'Health Yogas',
    numbers: [3, 8],
    description: 'Jupiter (3) and Saturn (8) combination reflecting slow, methodical, but permanent long-term developmental progress.',
    effects: {
      career: ['Long-term research', 'Chronic care management'],
      finance: ['Sustained investment in therapy and development'],
      relationship: ['Deep parental patience and unconditional love'],
      health: ['Indicates steady, cumulative improvement over time; requires patience as milestones unfold in stages'],
      travel: ['Structured routine travel'],
      business: ['Rehabilitation facility'],
      marriage: ['Supportive spouse during challenging parental phases'],
      children: ['Solid long-term progress with disciplined occupational and behavioral therapies'],
      property: ['Stable ancestral home'],
      litigation: ['Long-term legal safety'],
      remedies: ['Light a mustard oil lamp on Saturdays', 'Chant Om Gurave Namaha']
    }
  },
  {
    id: 'PROPERTY_ENDURANCE_28',
    name: 'Property & Endurance (2-8 Pair)',
    category: 'Property Yogas',
    numbers: [2, 8],
    description: 'Moon (2) and Saturn (8) creating patience, endurance, and real estate assets.',
    effects: {
      career: ['Civil engineer', 'Property manager', 'Patience under heavy pressure'],
      finance: ['Steady growth through brick-and-mortar assets'],
      relationship: ['Deeply committed, mature bond'],
      health: ['Need to stay active to avoid bone/joint stiffness'],
      travel: ['Travel for property acquisitions'],
      business: ['Real estate agency', 'Construction supply'],
      marriage: ['Mature, responsible spouse'],
      children: ['Grounded, hard-working children'],
      property: ['Land plots, commercial spaces, rental units'],
      litigation: ['Solid documentation leads to success'],
      remedies: ['Serve mustard oil lamp near Peepal tree on Saturdays']
    }
  }
];
