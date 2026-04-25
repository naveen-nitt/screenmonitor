"use client";

type ScreenPreviewProps = {
  extractedText: string;
};

export default function ScreenPreview({ extractedText }: ScreenPreviewProps) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Captured text</h3>
      <div className="max-h-32 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        {extractedText || "No capture yet. Press Ctrl+Shift+S to capture your screen."}
      </div>
    </section>
  );
}
