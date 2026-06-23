export function hasBrowserAiSupport(): boolean {
  return 'LanguageModel' in globalThis;
}
