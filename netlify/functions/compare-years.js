const { GoogleGenAI } = require('@google/genai');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { details, year1, year2 } = data;

    if (!details || !year1 || !year2) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing details, year1, or year2' }) };
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          analysis: `Year ${year1} vs Year ${year2} Comparative Synthesis for ${details.firstName}:\n` +
            `• Year ${year1} brings specific Dasha planetary influences.\n` +
            `• Year ${year2} transitions into the next Antardasha cycle.\n` +
            `Configure GEMINI_API_KEY in Netlify settings to view full comparative AI breakdown.`
        })
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Compare Year ${year1} vs Year ${year2} for ${details.firstName} ${details.surname} (DOB: ${details.day}/${details.month}/${details.year}). Provide comparative analysis across Career, Finance, Health, and Strategy.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ analysis: response.text })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
