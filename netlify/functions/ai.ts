import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API_KEY environment variable not set' }),
    }
  }

  try {
    const { prompt } = JSON.parse(event.body || '{}')

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' }),
      }
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt }
              ],
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
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI request failed' }),
    }
  }
}
