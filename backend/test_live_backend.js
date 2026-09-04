async function testLiveBackend() {
  try {
    console.log('Sending POST to http://localhost:3001/api/generate-plan...');
    const res = await fetch('http://localhost:3001/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: "Operating Systems",
        days: "3",
        hours: "4",
        level: "Starting from scratch (Crash Course)",
        syllabus: "CPU Scheduling, Deadlocks, Memory Management"
      }),
    });

    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Response Body:', text);
  } catch (err) {
    console.error('Fetch Error:', err.message);
  }
}

testLiveBackend();
