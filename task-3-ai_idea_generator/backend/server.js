const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Groq Client ─────────────────────────────────────
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// ── Health Check ────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'IdeaSpark API is running 🚀 (Groq)' });
});

// ── Generate Ideas ──────────────────────────────────
app.post('/api/generate', async (req, res) => {
  const { keyword, category, count = 5 } = req.body;

  if (!keyword || keyword.trim() === '') {
    return res.status(400).json({ error: 'Keyword is required.' });
  }

  const categoryLine = category && category !== 'Any'
    ? `The ideas should specifically be in the ${category} industry/domain.`
    : 'The ideas can be from any industry or domain.';

  const prompt = `You are a creative startup and project idea generator.
A user has provided the following input:
- Keyword / Domain / Problem: "${keyword.trim()}"
- ${categoryLine}

Generate exactly ${count} unique, innovative, and actionable startup or project ideas.

For each idea provide:
1. A short catchy name (max 5 words)
2. A one-sentence tagline
3. A 2-3 sentence description
4. The core technology or approach
5. Target audience
6. A starter prompt — a single actionable sentence telling the developer exactly how to start building this idea (e.g. "Build a REST API with Node.js that...")

IMPORTANT: Respond ONLY with a valid JSON array. No markdown, no code fences, no extra text before or after.

Example format:
[{"id":1,"name":"Idea Name","tagline":"One sentence tagline","description":"2-3 sentence description.","technology":"Core tech","audience":"Target audience","starterPrompt":"Build a React app that..."}]`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a JSON API. You only respond with valid JSON arrays. Never include markdown, code blocks, or any text outside the JSON array.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    let raw = completion.choices[0].message.content.trim();
    console.log('Raw Groq response:', raw.substring(0, 200));

    // Remove any markdown code fences if present
    raw = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    // Find the JSON array in the response
    const startIdx = raw.indexOf('[');
    const endIdx = raw.lastIndexOf(']');

    if (startIdx === -1 || endIdx === -1) {
      console.error('No JSON array found in response:', raw);
      return res.status(500).json({ error: 'AI returned unexpected format. Please try again.' });
    }

    const jsonStr = raw.substring(startIdx, endIdx + 1);
    const ideas = JSON.parse(jsonStr);

    res.json({
      success: true,
      keyword,
      category: category || 'Any',
      ideas,
    });

  } catch (err) {
    console.error('Error details:', err.message);
    console.error('Error status:', err.status);

    if (err.status === 401) {
      return res.status(401).json({ error: 'Invalid Groq API key. Check your .env file.' });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    }
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'AI returned invalid format. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to generate ideas. Please try again.' });
  }
});

// ── Start Server ────────────────────────────────────
app.listen(port, () => {
  console.log(`✦ IdeaSpark server running on http://localhost:${port}`);
});