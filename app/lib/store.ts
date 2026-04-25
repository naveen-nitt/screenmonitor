"use client";

import { create } from "zustand";

type AssistantState = {
  extractedText: string;
  response: string;
  loading: boolean;
  localOnlyMode: boolean;
  collapsed: boolean;
  error: string;
  setCollapsed: (collapsed: boolean) => void;
  setLocalOnlyMode: (value: boolean) => void;
  setResult: (extractedText: string, response: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
};

export const useAssistantStore = create<AssistantState>((set) => ({
  extractedText: "",
  response: "Waiting for your first capture…",
  loading: false,
  localOnlyMode: false,
  collapsed: false,
  error: "",
  setCollapsed: (collapsed) => set({ collapsed }),
  setLocalOnlyMode: (localOnlyMode) => set({ localOnlyMode }),
  setResult: (extractedText, response) => set({ extractedText, response, error: "" }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));
