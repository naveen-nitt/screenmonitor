export function buildVoicePrompt(screenContext, question) {
  return `Screen context:\n${screenContext || "No screen text captured."}\n\nUser voice question:\n${
    question || "No voice question provided."
  }`;
}
