const { GoogleGenAI } = require('@google/genai');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { report, question } = data;

    if (!report || !question) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing report or question' })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          answer: `Namaste! I have reviewed the Year ${report.selectedYear} Vedic Grid Report for ${report.fullName} (DOB: ${report.dob}).\n\n` +
            `• Driver (Basic Number): ${report.BN} | Conductor (Destiny Number): ${report.DN}\n` +
            `• Current Mahadasha: ${report.Mahadasha.planet} (${report.Mahadasha.number})\n` +
            `• Current Antardasha: ${report.Antardasha.planet} (${report.Antardasha.number})\n\n` +
            `Regarding your query "${question}":\n` +
            `Your active Dasha vibrations and Pratyantardasha cycles for ${report.selectedYear} provide specific energy windows. ` +
            `Please ensure GEMINI_API_KEY is configured in Netlify environment variables for dynamic AI synthesis.`
        })
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are Eklavya AI, an expert master in Vedic Grid Numerology.

USER YEAR REPORT DATA (${report.fullName}, DOB: ${report.dob}, Selected Year: ${report.selectedYear}, Age: ${report.age}):
${JSON.stringify(report, null, 2)}

USER QUESTION:
"${question}"

OPERATIONAL RULES:
1. Use ONLY the supplied JSON Year Report data.
2. Combine active yogas, Mahadasha, Antardasha, and Pratyantardasha (PD) cycles.
3. For timing/favorable window questions, ALWAYS provide EXACT START & END DATES from the Pratyantardashas array in the report!
4. For health questions, provide vibrational guidance and ALWAYS include medical disclaimer.
5. Answer in 2-4 clear, professional paragraphs.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ answer: response.text || 'Analysis generated.' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: err.message || 'Error processing AI chat query' })
    };
  }
};
