const express = require('express');
const Plan = require('../models/Plan');

const router = express.Router();

// GET all plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find()
      .sort({ createdAt: -1 })
      .select('subject daysLeft hoursPerDay createdAt');
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// GET single plan by ID
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json({ id: plan._id, ...plan.planData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// DELETE a plan
router.delete('/:id', async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});


// Generate AI explanation for a specific day's topics
router.post('/:id/day/:dayNumber/explain', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const dayNumber = parseInt(req.params.dayNumber);
    const dayData = plan.planData.day_wise_plan.find(d => d.day === dayNumber);
    if (!dayData) return res.status(404).json({ error: 'Day not found' });

    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
You are an expert engineering professor. A student is studying "${plan.planData.subject}" today.
Today's topics are: ${dayData.topics.join(', ')}.

For EACH topic, provide a detailed study note in the following JSON format.
Respond ONLY with valid JSON, no markdown, no explanation:

{
  "explanations": [
    {
      "topic": "Topic Name",
      "what_is_it": "2-3 sentence clear explanation of what this topic is",
      "key_concepts": ["concept 1", "concept 2", "concept 3", "concept 4"],
      "example": "A concrete real-world or code example explaining the topic",
      "common_mistakes": ["mistake 1", "mistake 2"],
      "exam_tips": "1-2 sentences on what to focus on for exams"
    }
  ]
}

Generate one explanation object for each topic: ${dayData.topics.join(', ')}.
`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 4096,
    });

    const rawText = completion.choices[0].message.content;
    const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanJson);

    return res.json(data);

  } catch (err) {
    console.error('Explain error:', err.message);
    return res.status(500).json({ error: 'Failed to generate explanation' });
  }
});









module.exports = router;