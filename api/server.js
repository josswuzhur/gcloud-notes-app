import express from 'express';

const app = express();
app.use(express.json());

// Health check (for uptime + Cloud Run revision checks)
app.get('/health', (req, res) => {
    res.status(200).json({ ok: true, service: 'notes-api', time: new Date().toISOString() });
});

// Placeholer notes routes (implement real logic later)
app.get('/notes', (req, res) => {
    res.json([{ id: 'demo-1', text: 'Hello from Cloud Run!'}]);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});