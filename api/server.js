import express from "express";
import admin from "firebase-admin";
import cors from "cors";

admin.initializeApp(); // Uses Cloud Run's service account

const db = admin.firestore();
const app = express();
app.use(cors({ origin: true })); // we’ll tighten to your Hosting domain later
app.use(express.json());

// Verify Firebase ID token from Authorization: Bearer <token>
async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).json({ error: "Missing token" });
    try {
        req.user = await admin.auth().verifyIdToken(match[1]);
        next();
    } catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

app.get("/health", (req, res) => {
    res.json({ ok: true, service: "notes-api", time: new Date().toISOString() });
});

// Read notes for current user
app.get("/notes", verifyToken, async (req, res) => {
    const snap = await db.collection("notes")
        .where("userId", "==", req.user.uid)
        .get();
    const notes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(notes);
});

// Create a note
app.post("/notes", verifyToken, async (req, res) => {
    const text = String(req.body?.text ?? "").trim();
    if (!text) return res.status(400).json({ error: "text is required" });

    const data = {
        userId: req.user.uid,
        text,
        createdAt: new Date().toISOString(),
    };
    const ref = await db.collection("notes").add(data);
    res.status(201).json({ id: ref.id, ...data });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API running on ${port}`));
