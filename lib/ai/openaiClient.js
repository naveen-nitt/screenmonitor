import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeScreenContent(extractedText, userQuestion = "") {
  const prompt = `You are an assistant. Explain or solve the following content: ${extractedText}\n\nUser question: ${
    userQuestion || "(none)"
  }`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  return completion.choices?.[0]?.message?.content || "I could not generate a response.";
}

export async function transcribeAudio(audioBuffer) {
  const file = new File([audioBuffer], "voice.webm", { type: "audio/webm" });

  const transcript = await openai.audio.transcriptions.create({
    model: process.env.WHISPER_MODEL || "gpt-4o-mini-transcribe",
    file
  });

  return transcript.text;
}
