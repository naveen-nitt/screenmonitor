"use client";

import { useEffect, useState } from "react";
import { useAssistantStore } from "../app/lib/store";
import VoiceButton from "../../components/VoiceButton";
import ScreenPreview from "../../components/ScreenPreview";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function FloatingWidget() {
  const {
    extractedText,
    response,
    loading,
    localOnlyMode,
    collapsed,
    error,
    setCollapsed,
    setLocalOnlyMode,
    setLoading,
    setResult,
    setError
  } = useAssistantStore();
  const [position, setPosition] = useState({ x: 24, y: 24 });

  const handleAnalyze = async (imageBase64: string) => {
    if (localOnlyMode) {
      setResult("", "Local-only mode is ON. AI calls are blocked.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/analyze-screen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze screenshot");
      }
      setResult(data.extractedText || "", data.answer || "No response received.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = async () => {
      if (!(window as any).electronAPI) return;
      const imageBase64 = await (window as any).electronAPI.captureScreen();
      if (imageBase64) {
        await handleAnalyze(imageBase64);
      }
    };

    (window as any).electronAPI?.onHotkeyTriggered(handler);

    return () => {
      (window as any).electronAPI?.removeHotkeyHandler();
    };
  }, [localOnlyMode]);

  const onVoiceQuery = async (transcript: string, audioBlob?: Blob) => {
    if (localOnlyMode) {
      setResult(extractedText, "Local-only mode is ON. Voice-to-AI is blocked.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (transcript) formData.append("text", transcript);
      if (audioBlob) formData.append("audio", audioBlob, "voice.webm");
      formData.append("screenContext", extractedText);

      const res = await fetch(`${BACKEND_URL}/api/voice-query`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Voice query failed");
      setResult(extractedText, data.answer || "No response");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed z-50 w-[360px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur"
      style={{ left: position.x, top: position.y }}
      draggable
      onDragEnd={(e) => setPosition({ x: e.clientX - 150, y: e.clientY - 20 })}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Local AI Screen Assistant</h2>
        <button
          type="button"
          className="text-xs text-slate-500"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>

      {!collapsed && (
        <>
          <label className="mb-3 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={localOnlyMode}
              onChange={(e) => setLocalOnlyMode(e.target.checked)}
            />
            Local-only mode (block API calls)
          </label>

          <ScreenPreview extractedText={extractedText} />

          <section className="mt-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">AI response</h3>
            <div className="max-h-44 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800">
              {loading ? "Thinking…" : response}
            </div>
          </section>

          <div className="mt-3 flex justify-end">
            <VoiceButton onTranscript={onVoiceQuery} />
          </div>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </>
      )}
    </div>
  );
}
