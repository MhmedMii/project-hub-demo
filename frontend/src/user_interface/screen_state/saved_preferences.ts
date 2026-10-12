export function readPreference(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback; }
  catch { return fallback; }
}

export function savePreference(key: string, value: string): void {
  try { localStorage.setItem(key, value); }
  catch { /* نخلي الإعداد شغال حتى لو المتصفح ما يسمح بالتخزين */ }
}
