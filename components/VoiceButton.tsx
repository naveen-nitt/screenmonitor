"use client";

import { useRef, useState } from "react";

type VoiceButtonProps = {
  onTranscript: (text: string, audioBlob?: Blob) => Promise<void>;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export default function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const [listening, setListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toggleListening = async () => {
    if (listening) {
      mediaRecorderRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
    recorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      stream.getTracks().forEach((track) => track.stop());
      await onTranscript("", audioBlob);
    };

    recorder.start();

    if (!SpeechRecognition) {
      setListening(true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      await onTranscript(transcript);
    };

    recognition.onerror = () => {
      // rely on Whisper fallback through audio blob
    };

    recognition.start();
    setListening(true);
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        listening ? "bg-red-500 text-white" : "bg-brand-500 text-white"
      }`}
    >
      {listening ? "Stop mic" : "Ask by voice"}
    </button>
  );
}
