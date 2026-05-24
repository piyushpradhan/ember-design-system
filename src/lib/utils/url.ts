export function resolveEnvUrl(envUrl: string | undefined, fallback: string): string {
  if (!envUrl) return fallback
  const sanitized = envUrl.replace(/^\uFEFF/, '').trim()
  return sanitized || fallback
}
