const { GoogleGenAI } = require('@google/genai');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { details, startYear = 2026, endYear = 2035, topic = 'Career' } = data;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          analysis: `10-Year Golden Window Analysis (${startYear}-${endYear}) for ${topic}:\n` +
            `• Evaluated 10-year Dasha timeline for ${details?.firstName || 'User'}.\n` +
            `Configure GEMINI_API_KEY in Netlify settings to view full AI golden window report.`
        })
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze 10-year timeline (${startYear} to ${endYear}) for ${details.firstName} ${details.surname} specifically focusing on topic: ${topic}. Identify the prime golden year and top favorable windows.`;

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
