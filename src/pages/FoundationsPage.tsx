import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import styles from './FoundationsPage.module.css'

const colorTokens: Array<{ token: string; light: string; dark: string; use: string; group: 'surface' | 'border' | 'text' | 'accent' | 'semantic' }> = [
  { token: 'bg-canvas', light: '#FAF9F6', dark: '#0F0F0E', use: 'Page background', group: 'surface' },
  { token: 'bg-surface', light: '#FFFFFF', dark: '#181816', use: 'Cards, elevated panels', group: 'surface' },
  { token: 'bg-subtle', light: '#F3F1EC', dark: '#1F1F1D', use: 'Inset areas, code blocks', group: 'surface' },
  { token: 'bg-muted', light: '#E8E5DE', dark: '#2A2A27', use: 'Hover states', group: 'surface' },
  { token: 'border-subtle', light: '#E8E5DE', dark: '#2A2A27', use: 'Hairlines', group: 'border' },
  { token: 'border-default', light: '#D4CFC4', dark: '#3A3A36', use: 'Standard borders', group: 'border' },
  { token: 'border-strong', light: '#9C968A', dark: '#5C5C57', use: 'Emphasis borders', group: 'border' },
  { token: 'text-primary', light: '#161513', dark: '#F2EFE8', use: 'Body, headings', group: 'text' },
  { token: 'text-secondary', light: '#5C5853', dark: '#A8A39A', use: 'Supporting copy', group: 'text' },
  { token: 'text-tertiary', light: '#8B867D', dark: '#7A756D', use: 'Captions, metadata', group: 'text' },
  { token: 'accent-ember-50', light: '#FFF4EC', dark: '#2A1810', use: 'Tinted background', group: 'accent' },
  { token: 'accent-ember-100', light: '#FFE3CC', dark: '#3D2418', use: 'Hover surface', group: 'accent' },
  { token: 'accent-ember-500', light: '#D9541A', dark: '#E86B2E', use: 'Primary accent — CTAs, links', group: 'accent' },
  { token: 'accent-ember-600', light: '#B8410D', dark: '#F58247', use: 'Hover / active', group: 'accent' },
  { token: 'accent-ember-700', light: '#8F3309', dark: '#FF9663', use: 'Pressed', group: 'accent' },
  { token: 'status-success', light: '#2F7D4F', dark: '#52C77E', use: 'Confirmations', group: 'semantic' },
  { token: 'status-warning', light: '#B5811A', dark: '#E5B547', use: 'Attention', group: 'semantic' },
  { token: 'status-danger', light: '#B53A2C', dark: '#E56657', use: 'Destructive, errors', group: 'semantic' },
  { token: 'status-info', light: '#2D6BAE', dark: '#5599DD', use: 'Neutral notices', group: 'semantic' },
]

const typeScale = [
  { name: 'text-2xs', size: 11 },
  { name: 'text-xs', size: 12 },
  { name: 'text-sm', size: 14 },
  { name: 'text-base', size: 16 },
  { name: 'text-md', size: 18 },
  { name: 'text-lg', size: 20 },
  { name: 'text-xl', size: 24 },
  { name: 'text-2xl', size: 30 },
  { name: 'text-3xl', size: 38 },
  { name: 'text-4xl', size: 48 },
  { name: 'text-5xl', size: 60 },
  { name: 'text-6xl', size: 76 },
]

const spacing = [
  ['space-0', 0],
  ['space-1', 4],
  ['space-2', 8],
  ['space-3', 12],
  ['space-4', 16],
  ['space-5', 24],
  ['space-6', 32],
  ['space-8', 48],
  ['space-10', 64],
  ['space-12', 96],
  ['space-16', 144],
] as const

const radii = [
  ['radius-none', 0],
  ['radius-sm', 4],
  ['radius-md', 6],
  ['radius-lg', 10],
  ['radius-pill', 999],
] as const

function ColorSwatch({ token, light, dark, use }: { token: string; light: string; dark: string; use: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className={styles.swatch}
      onClick={async () => {
        await navigator.clipboard.writeText(`var(--${token})`)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1200)
      }}
    >
      <span className={styles.swatchTop}>
        <span className={styles.swatchHalfL} style={{ background: light }} />
        <span className={styles.swatchHalfD} style={{ background: dark }} />
      </span>
      <span className={styles.swatchBody}>
        <span className={styles.swatchToken}>--{token}</span>
        <span className={styles.swatchUse}>{use}</span>
        <span className={styles.swatchHex}>{light} · {dark}</span>
      </span>
      <span className={styles.swatchCopy} aria-hidden>
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </span>
    </button>
  )
}

export function FoundationsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className="label-caps">Foundations</p>
        <h1 className={styles.title}>Tokens are the source of truth.</h1>
        <p className={styles.sub}>
          Mode-aware CSS custom properties exposed through a single naming convention:
          <code> {`{category}-{role}-{variant}`}</code>. Click any swatch to copy.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Color</h2>
        <p className={styles.sectionSub}>Warm neutrals + one ember accent + functional semantics.</p>
        <div className={styles.grid}>
          {colorTokens.map((t) => <ColorSwatch key={t.token} {...t} />)}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography</h2>
        <p className={styles.sectionSub}>
          Modular scale, base 16px, ratio 1.250 (Major Third). Inter for UI, Source Serif 4 for
          editorial, JetBrains Mono for code and metadata.
        </p>
        <div className={styles.typeStack}>
          {typeScale.map((t) => (
            <div key={t.name} className={styles.typeRow}>
              <span className={`mono ${styles.typeName}`}>{t.name}</span>
              <span className={`mono ${styles.typeMeta}`}>{t.size}px</span>
              <span className={styles.typeSample} style={{ fontSize: t.size }}>
                Function before flourish
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Spacing</h2>
        <p className={styles.sectionSub}>4px base. Non-linear after 24px to discourage mid-range decisions.</p>
        <div className={styles.spacingStack}>
          {spacing.map(([name, val]) => (
            <div key={name} className={styles.spacingRow}>
              <span className={`mono ${styles.spacingName}`}>--{name}</span>
              <span className={`mono ${styles.spacingValue}`}>{val}px</span>
              <span className={styles.spacingBar} style={{ width: val || 1 }} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Radius</h2>
        <p className={styles.sectionSub}>
          Capped at 10px. No xl+. Heavily rounded UI ages poorly and reads as "consumer app."
        </p>
        <div className={styles.radiiGrid}>
          {radii.map(([name, val]) => (
            <div key={name} className={styles.radiusItem}>
              <div className={styles.radiusBox} style={{ borderRadius: val }} />
              <span className={`mono ${styles.radiusName}`}>--{name}</span>
              <span className={`mono ${styles.radiusValue}`}>{val === 999 ? 'pill' : `${val}px`}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Elevation</h2>
        <p className={styles.sectionSub}>Two shadows. Borders do most of the depth work.</p>
        <div className={styles.shadowGrid}>
          <div className={styles.shadowItem} style={{ boxShadow: 'var(--shadow-sm)' }}>
            <span className={`mono ${styles.shadowName}`}>--shadow-sm</span>
          </div>
          <div className={styles.shadowItem} style={{ boxShadow: 'var(--shadow-md)' }}>
            <span className={`mono ${styles.shadowName}`}>--shadow-md</span>
          </div>
        </div>
      </section>
    </div>
  )
}
