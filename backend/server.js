

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./lib/db');

const generateRoute = require('./routes/generate');
const plansRoute = require('./routes/plans');

const app = express();

connectDB();

app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.use('/api/generate-plan', generateRoute);
app.use('/api/plans', plansRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});