// const BASE = 'http://localhost:3001/api';

const BASE = `${import.meta.env.VITE_API_URL}/api`;

export async function generatePlan(data: {
  subject: string;
  days: string;
  hours: string;
  level: string;
  syllabus: string;
}) {
  const res = await fetch(`${BASE}/generate-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to generate plan');
  return res.json();
}

export async function getPlans() {
  const res = await fetch(`${BASE}/plans`);
  const plans = await res.json();
  return plans.map((p: any) => ({ ...p, id: p._id }));
}

export async function getPlan(id: string) {
  const res = await fetch(`${BASE}/plans/${id}`);
  return res.json();
}

export async function deletePlan(id: string) {
  await fetch(`${BASE}/plans/${id}`, { method: 'DELETE' });
}

export async function getDayPlan(planId: string, dayNumber: string) {
  const res = await fetch(`${BASE}/plans/${planId}/day/${dayNumber}`);
  if (!res.ok) throw new Error('Failed to fetch day plan');
  return res.json();
}

export async function getDayExplanation(planId: string, dayNumber: string) {
  const res = await fetch(`${BASE}/plans/${planId}/day/${dayNumber}/explain`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to fetch explanation');
  return res.json();
}