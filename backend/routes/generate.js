const express = require('express');
const Groq = require('groq-sdk');
const Plan = require('../models/plan');

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { subject, days, hours, level, syllabus } = req.body;

  if (!subject || !days || !hours || !syllabus) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `
You are an expert study planner for engineering students.

Subject: ${subject}
Days until exam: ${days}
Hours per day: ${hours}
Understanding level: ${level}
Syllabus: ${syllabus}

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "subject": "string",
  "strategy": "2-3 sentence strategy",
  "study_method": "string",
  "priority_topics": ["topic1", "topic2"],
  "day_wise_plan": [
    {
      "day": 1,
      "date": "Today",
      "topics": ["Topic A"],
      "hours": ${hours},
      "tasks": ["Task with time e.g. Review arrays (1.5h)"]
    }
  ],
  "youtube_recs": [
    { "title": "Video title", "channel": "Channel", "duration": "MM:SS" }
  ]
}
Generate exactly ${days} days.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const rawText = completion.choices[0].message.content;
    const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const planData = JSON.parse(cleanJson);

    const savedPlan = await Plan.create({
      subject,
      daysLeft: parseInt(days),
      hoursPerDay: parseInt(hours),
      planData,
    });

    return res.json({ id: savedPlan._id, ...planData });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: 'Failed to generate plan' });
  }
});

module.exports = router;