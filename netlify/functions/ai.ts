import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    }
  }

  try {
    const { vo2max, bmi, age, gender } = JSON.parse(event.body || '{}')

    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key tidak tersedia' }),
      }
    }

    const prompt = `
Anda adalah pelatih kebugaran profesional.
Data atlet:
- VO₂max: ${vo2max}
- BMI: ${bmi}
- Usia: ${age}
- Jenis kelamin: ${gender}

Berikan analisis singkat dan rekomendasi latihan yang aman.
Gunakan bahasa Indonesia.
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )

    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify({
        text:
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          'Rekomendasi tidak tersedia',
      }),
    }
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gagal memproses AI' }),
    }
  }
}
