import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { extractTextFromImageBuffer } from "../lib/ocr/extractText.js";
import { analyzeScreenContent, transcribeAudio } from "../lib/ai/openaiClient.js";
import { buildVoicePrompt } from "../lib/voice/voicePipeline.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.SERVER_PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.get("/health", (_, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze-screen", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const raw = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(raw, "base64");
    const extractedText = await extractTextFromImageBuffer(imageBuffer);
    const answer = await analyzeScreenContent(extractedText);

    return res.json({ extractedText, answer });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Analysis failed" });
  }
});

app.post("/api/voice-query", upload.single("audio"), async (req, res) => {
  try {
    const textInput = req.body.text || "";
    const screenContext = req.body.screenContext || "";
    let transcript = textInput;

    if (!transcript && req.file?.buffer) {
      transcript = await transcribeAudio(req.file.buffer);
    }

    if (!transcript) {
      return res.status(400).json({ error: "No voice text or audio provided" });
    }

    const answer = await analyzeScreenContent(screenContext, buildVoicePrompt(screenContext, transcript));
    return res.json({ transcript, answer });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Voice query failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
