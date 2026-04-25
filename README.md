# Local AI Screen Assistant (MVP)

A privacy-first desktop + browser assistant that captures your screen **only when you trigger it**, extracts text with OCR, and answers questions with OpenAI.

## ✅ MVP Features

- Electron global hotkey (`Ctrl+Shift+S` / `Cmd+Shift+S`) for on-demand screen capture
- OCR pipeline with `tesseract.js`
- AI reasoning pipeline with OpenAI GPT
- Voice input via Web Speech API + Whisper fallback
- Floating draggable overlay widget (Next.js + Tailwind)
- Local-first privacy controls:
  - no automatic background recording
  - no persistent screenshot storage
  - Local-only mode toggle blocks API calls

## Project Structure

```
root/
 ├── app/ (Next.js frontend)
 ├── server/ (Express backend)
 ├── electron/ (desktop wrapper)
 ├── lib/
 │    ├── ocr/
 │    ├── ai/
 │    └── voice/
 ├── components/
 │    ├── FloatingWidget.tsx
 │    ├── VoiceButton.tsx
 │    └── ScreenPreview.tsx
```

## Environment Setup

1. Copy env template:

```bash
cp .env.example .env
```

2. Fill in your `OPENAI_API_KEY`.

## Install

Run installs for all packages:

```bash
npm install
npm --prefix app install
npm --prefix server install
npm --prefix electron install
```

## Run (3 terminals)

### 1) Frontend (Next.js)
```bash
npm run dev
```

### 2) Backend (Express)
```bash
npm run server
```

### 3) Electron desktop wrapper
```bash
npm run electron
```

## API Endpoints

### `POST /api/analyze-screen`
- Input: `{ imageBase64 }`
- Flow: OCR → AI
- Output: `{ extractedText, answer }`

### `POST /api/voice-query`
- Input: multipart form data (`audio` or `text`, plus optional `screenContext`)
- Flow: Speech-to-text (if needed) → AI
- Output: `{ transcript, answer }`

## How the User Flow Works

1. Launch frontend + server + electron.
2. Press `Ctrl+Shift+S` (or `Cmd+Shift+S`) to capture screen.
3. Electron grabs a screenshot and sends it to frontend.
4. Frontend calls backend `/api/analyze-screen`.
5. Backend runs OCR and GPT reasoning.
6. Result appears in floating widget.
7. Press voice button to ask follow-up question with screen context.

## Privacy & Safety Guarantees

- Screen capture is **manual and user-triggered only**.
- No automatic periodic captures.
- Screenshots are processed in-memory and not persisted.
- Local-only mode disables external AI calls.
- This project is designed explicitly to avoid spyware-like behavior.

## Notes

- Region selection can be added later (current MVP captures full primary display).
- Optional future enhancements: text-to-speech, multi-language OCR/transcription, annotations, code-aware prompting.
