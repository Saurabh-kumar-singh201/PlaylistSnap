export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { base64Data, mimeType } = req.body
  const apiKey = process.env.GEMINI_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_KEY in Vercel environment variables' })
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: "You are a tracklist extraction assistant. Look at the provided image and extract a list of all songs visible. Return ONLY a valid JSON array of objects with 'title' (string) and 'artist' (string) properties. Do not include markdown formatting, backticks, or any other conversational text. Just the JSON array."
            },
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      return res.status(response.status).json({ error: errorData.error?.message || 'Failed to fetch from Gemini' })
    }

    const data = await response.json()
    return res.status(200).json(data)

  } catch (error) {
    console.error("Vercel Serverless Error:", error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
