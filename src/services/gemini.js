export async function extractSongsFromImage(base64Image, mimeType = 'image/jpeg') {
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image
  
  let data
  
  try {
    // 1. First, try to hit our secure Vercel Serverless function (Production)
    const backendResponse = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Data, mimeType })
    })

    if (backendResponse.ok) {
      data = await backendResponse.json()
    } else if (backendResponse.status === 404) {
      // 2. If it 404s, it means we are developing locally using `npm run dev` instead of `vercel dev`
      // Fallback to the insecure direct API call using the .env file locally
      console.warn("Local dev mode detected: falling back to direct API call...")
      const apiKey = import.meta.env.VITE_GEMINI_KEY
      if (!apiKey) throw new Error("Missing VITE_GEMINI_KEY locally!")
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
      const payload = {
        contents: [{
          parts: [
            { text: "You are a tracklist extraction assistant. Look at the provided image and extract a list of all songs visible. Return ONLY a valid JSON array of objects with 'title' (string) and 'artist' (string) properties. Do not include markdown formatting, backticks, or any other conversational text. Just the JSON array." },
            { inlineData: { mimeType, data: base64Data } }
          ]
        }],
        generationConfig: { temperature: 0.1 }
      }
      
      const directResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!directResponse.ok) throw new Error("Local Gemini fetch failed")
      data = await directResponse.json()
    } else {
      const errorBody = await backendResponse.json()
      throw new Error(errorBody.error || "Server validation failed")
    }

    // 3. Process the AI response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!textResponse) throw new Error("No response text received from Gemini")

    const cleanedText = textResponse.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const songs = JSON.parse(cleanedText)
    
    if (!Array.isArray(songs)) throw new Error("Expected an array of songs")
    
    return songs.map((s, idx) => ({
      id: `extracted-${idx}-${Date.now()}`,
      title: s.title || "Unknown Title",
      artist: s.artist || "Unknown Artist",
      selected: true
    }))
  } catch (err) {
    console.error("Extraction failed:", err)
    throw new Error(err.message || "AI returned an invalid response format.")
  }
}
