import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: 'GEMINI_API_KEY TIDAK TERBACA DI FUNCTION',
    }),
  }
}

  try {
    const body = JSON.parse(event.body || '{}')
    const prompt = body.prompt

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    )

    const data = await res.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI request failed' }),
    }
  }
}
