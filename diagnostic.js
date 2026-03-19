import fs from 'fs';

try {
  const env = fs.readFileSync('.env', 'utf8');
  const key = env.split('VITE_GEMINI_KEY=')[1].split('\n')[0].trim();
  console.log("Found key starting with:", key.substring(0, 5));

  fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
    .then(r => r.json())
    .then(d => {
       console.log("Raw models count:", d.models ? d.models.length : 'no models array');
       console.log("First 3 models:", d.models ? d.models.slice(0, 3).map(m=>m.name) : d);
    })
    .catch(e => console.log("Fetch Error:", e));
} catch(err) {
  console.log("Setup Error:", err);
}
