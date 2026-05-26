import type { CSSProperties } from 'react'

/** Spacing scale keys — mirror the `--space-*` tokens in tokens.css. */
export type SpaceToken = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16

/** Resolve a spacing token to its CSS variable reference. */
export function space(token: SpaceToken): string {
  return `var(--space-${token})`
}

/** Resolve an optional spacing token, returning undefined when absent. */
export function maybeSpace(token: SpaceToken | undefined): string | undefined {
  return token === undefined ? undefined : space(token)
}

/**
 * Build a style object that assigns design-token values to CSS custom
 * properties. Skips undefined entries so callers can spread freely.
 */
export function tokenVars(vars: Record<string, string | number | undefined>): CSSProperties {
  const out: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(vars)) {
    if (value !== undefined) out[key] = value
  }
  return out as CSSProperties
}
