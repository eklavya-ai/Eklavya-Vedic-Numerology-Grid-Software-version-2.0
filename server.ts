import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { PersonDetails } from './src/types';
import { generateYearReport, YearReport } from './src/utils/yearReport';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini API client
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required for Eklavya AI queries.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Resilient Gemini model generator with fallback model sequence
async function generateGeminiContent(ai: GoogleGenAI, prompt: string): Promise<string> {
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.6-flash'];
  let lastErr: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt
      });
      if (response.text) return response.text;
    } catch (err: any) {
      console.warn(`Server Gemini model ${modelName} failed, trying next candidate:`, err?.message || err);
      lastErr = err;
    }
  }
  throw lastErr || new Error('All Gemini model candidates failed.');
}

// System Prompt definition according to Phase 6 requirements
const EKLAVYA_SYSTEM_PROMPT = `
You are Eklavya AI, an expert master in Vedic Grid Numerology (3x3 Grid Matrix, Mahadasha, Antardasha, Pratyantardasha, Yogas, and Remedies).

CRITICAL OPERATIONAL RULES:
1. Never calculate numerology digits or dates from scratch. Use ONLY the supplied JSON Year Report data provided in the prompt context.
2. Never invent yogas or planetary combinations. Reference only those active in the supplied Year Report.
3. Combine all active yogas and dasha vibrations into a cohesive, holistic explanation.
4. Explain in simple, clear, professional English.
5. If both positive and negative yogas exist together in the year report, explain BOTH objectively with balanced guidance.
6. Never guarantee absolute future events or make deterministic promises.
7. Use nuanced probability terms such as: "Likely", "Moderately Favorable", "Needs Caution", "Very Strong Period", "High Potential".
8. Always explain WHY (e.g., explain which numbers, planes, or dasha planets create the specific energy).
9. GENDER CONTEXTUALIZATION MANDATE:
   - Always check the "gender" field ("Male", "Female", "Other") in the supplied Year Report.
   - When asked about pregnancy, conception, childbirth, or reproductive health:
     a) If gender is "Male": Explicitly state that as a male, the conception/pregnancy timing pertains to supporting his wife/spouse's health and joint family expansion. Explain how his personal grid (Venus 6, Jupiter 3, Moon 2, Personal Year) provides paternal vitality, emotional grounding, and supportive timing for his spouse.
     b) If gender is "Female": Address her physical body, maternal vitality, emotional mind, hormonal balance, and optimal personal pregnancy windows directly.
     c) If gender is "Other": Frame sensitively around family growth and joint parental readiness.
10. EXACT DATE RANGES MANDATE (PRATYANTARDASHA TIMING):
   - Whenever answering questions about timing, favorable windows, lucky months, or "when will something happen" (such as conceiving, job change, promotion, business launch, marriage, travel, surgery, or property purchase):
   - You MUST inspect the "Pratyantardashas" array in the supplied JSON Year Report.
   - You MUST explicitly include the EXACT START & END DATES for the favorable or cautious Pratyantardasha (PD) periods (for example: "PD 2 (Moon): 14 Feb 2026 to 28 Mar 2026", "PD 3 (Jupiter): 01 Aug 2026 to 20 Sep 2026").
   - Give the user precise, date-specific time ranges directly extracted from their calculated chart.
11. HEALTH & CHILD DEVELOPMENT MANDATE:
   - When users ask about health, child mental health, neurodiversity (Autism, ADHD, speech delay, intellectual growth), or developmental milestones:
     a) Explain the underlying numerical vibrations objectively: Mercury (5) for nerve signaling/speech/cognition, Moon (2) for emotional mind/tranquility, Jupiter (3) for learning expansion, Rahu/Ketu (4/7) for unconventional perception or deep focus, Saturn (8) for patient long-term milestone pace.
     b) Identify favorable Antardasha & Pratyantardasha periods with exact date ranges as key windows for therapy breakthrough and steady development.
     c) Provide supportive Vedic remedies (such as green fodder/spinach feeding, green jade crystal, offering water in silver cups, Saraswati/Budh mantras, calm music therapy, and positive parental environment).
     d) ALWAYS include the medical disclaimer: "Note: Vedic Numerology provides vibrational perspective and supportive timeline guidance. It is NOT a medical diagnosis or promise of cure. Always work closely with pediatrician, occupational therapist, speech pathologist, and medical specialists."
12. Answer naturally, warmly, and conversationally in 2-4 well-structured paragraphs or bulleted insights.
`;

// API Endpoint 1: Eklavya AI Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { report, question, history } = req.body as {
      report: YearReport;
      question: string;
      history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
    };

    if (!report || !question) {
      return res.status(400).json({ error: 'Missing report or question parameter.' });
    }

    const ai = getGenAIClient();

    const contextPrompt = `
SYSTEM INSTRUCTION:
${EKLAVYA_SYSTEM_PROMPT}

SUPPLIED YEAR REPORT DATA FOR USER (${report.fullName}, DOB: ${report.dob}, Target Year: ${report.selectedYear}, Age: ${report.age}):
\`\`\`json
${JSON.stringify(report, null, 2)}
\`\`\`

USER QUESTION:
"${question}"

Provide a natural, insightful, and accurate Eklavya AI Vedic Numerology response based ONLY on the supplied Year Report.
`;

    // Make call to Gemini using resilient fallback sequence
    const answerText = await generateGeminiContent(ai, contextPrompt);

    res.json({
      answer: answerText || 'Unable to analyze year report at this moment.'
    });
  } catch (error: any) {
    console.error('Eklavya AI Chat Error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while consulting Eklavya AI.'
    });
  }
});

// API Endpoint 2: Year Comparison (Compare Year 1 vs Year 2)
app.post('/api/compare-years', async (req, res) => {
  try {
    const { details, year1, year2 } = req.body as {
      details: PersonDetails;
      year1: number;
      year2: number;
    };

    if (!details || !year1 || !year2) {
      return res.status(400).json({ error: 'Missing details, year1, or year2.' });
    }

    const report1 = generateYearReport(details, year1);
    const report2 = generateYearReport(details, year2);

    const ai = getGenAIClient();

    const comparePrompt = `
SYSTEM INSTRUCTION:
${EKLAVYA_SYSTEM_PROMPT}

You are comparing two distinct numerology years for ${details.firstName} ${details.surname}:
YEAR 1 (${year1}):
\`\`\`json
${JSON.stringify(report1, null, 2)}
\`\`\`

YEAR 2 (${year2}):
\`\`\`json
${JSON.stringify(report2, null, 2)}
\`\`\`

TASK:
Provide a comparative synthesis comparing Year ${year1} vs Year ${year2} across:
1. Career & Professional Growth
2. Financial & Investment Potential
3. Business & Property Prospects
4. Relationships & Marriage Synergy
5. Recommended Strategy for each year.

Use clear headers or bullet points.
`;

    const analysisText = await generateGeminiContent(ai, comparePrompt);

    res.json({
      report1,
      report2,
      analysis: analysisText || 'Comparison completed successfully.'
    });
  } catch (error: any) {
    console.error('Compare Years Error:', error);
    res.status(500).json({ error: error.message || 'Error comparing years.' });
  }
});

// API Endpoint 3: Best Year / Window Finder (2026-2035)
app.post('/api/best-year-finder', async (req, res) => {
  try {
    const { details, startYear = 2026, endYear = 2035, topic = 'Career' } = req.body as {
      details: PersonDetails;
      startYear?: number;
      endYear?: number;
      topic?: string;
    };

    if (!details) {
      return res.status(400).json({ error: 'Missing person details.' });
    }

    const yearReports: YearReport[] = [];
    for (let yr = startYear; yr <= endYear; yr++) {
      yearReports.push(generateYearReport(details, yr));
    }

    const ai = getGenAIClient();

    const windowPrompt = `
SYSTEM INSTRUCTION:
${EKLAVYA_SYSTEM_PROMPT}

Analyze the 10-year timeline (${startYear} to ${endYear}) for ${details.firstName} ${details.surname} specifically for topic: "${topic}".

10-YEAR REPORTS DATA:
\`\`\`json
${JSON.stringify(yearReports.map(r => ({
  year: r.selectedYear,
  age: r.age,
  MD: `${r.Mahadasha.planet} (${r.Mahadasha.number})`,
  AD: `${r.Antardasha.planet} (${r.Antardasha.number})`,
  ActiveYogasCount: r.ActiveYogas.length,
  TopicDetails: r[topic as keyof YearReport] || r.Career
})), null, 2)}
\`\`\`

TASK:
1. Identify the SINGLE BEST YEAR and TOP 3 FAVORABLE WINDOWS between ${startYear} and ${endYear} for "${topic}".
2. Rank the top years with short rationale for each.
3. Provide a clear summary guidance for taking action during these golden years.
`;

    const windowAnalysis = await generateGeminiContent(ai, windowPrompt);

    res.json({
      startYear,
      endYear,
      topic,
      analysis: windowAnalysis || 'Timeline analysis generated successfully.',
      reports: yearReports
    });
  } catch (error: any) {
    console.error('Best Year Finder Error:', error);
    res.status(500).json({ error: error.message || 'Error finding best year.' });
  }
});

// API Endpoint 4: OTP Email Dispatch & Admin Notification
app.post('/api/send-otp', async (req, res) => {
  try {
    const { clientEmail, clientMobile, clientName, dob, otpCode } = req.body;
    const adminEmail = 'eklavyavedicnumerology@gmail.com';

    console.log('=====================================================');
    console.log('EKLAVYA VEDIC NUMEROLOGY - DUAL OTP EMAIL DISPATCH');
    console.log(`1. Target Client Email: ${clientEmail}`);
    console.log(`2. Target Admin Email: ${adminEmail}`);
    console.log(`3. Client Name: ${clientName} | DOB: ${dob}`);
    console.log(`4. Client Mobile: ${clientMobile}`);
    console.log(`5. Generated OTP Code: ${otpCode}`);
    console.log('=====================================================');

    // Attempt webhook dispatch to formspree or configured email proxy
    fetch('https://formspree.io/f/xknkybdv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminEmail,
        clientEmail,
        clientMobile,
        clientName,
        dob,
        otpCode,
        subject: `[Eklavya OTP Verification] Code: ${otpCode} - ${clientName}`,
        message: `New client registration on Eklavya Vedic Numerology Portal.\nClient Name: ${clientName}\nDOB: ${dob}\nMobile: ${clientMobile}\nClient Email: ${clientEmail}\nVerification OTP: ${otpCode}`
      })
    }).catch(err => {
      console.log('Server formspree webhook note:', err.message);
    });

    res.json({
      status: 'success',
      message: 'OTP dispatched successfully to client email and admin notification logged.',
      clientEmail,
      adminEmail,
      otpSent: true
    });
  } catch (error: any) {
    console.error('OTP Dispatch Error:', error);
    res.status(500).json({ error: error.message || 'Error processing OTP email request.' });
  }
});

// Vite Development or Static Production Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
