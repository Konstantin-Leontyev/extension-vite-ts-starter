// TODO: ручное ревью — services/browser-ai/capability.ts

export function hasBrowserAiSupport(): boolean {
  return 'LanguageModel' in globalThis;
}
