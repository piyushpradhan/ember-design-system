import { ArrowRight, BookOpen, Palette, Sparkles, Type } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../lib/components/primitives/Badge'
import { Button } from '../lib/components/primitives/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/components/patterns/Card'
import { resolveEnvUrl } from '../lib/utils/url'
import styles from './HomePage.module.css'

const principles = [
  { n: '01', title: 'Function before flourish.', body: 'Every visual element earns its place by serving comprehension, hierarchy, or action. Decoration without purpose gets removed.' },
  { n: '02', title: 'Craft is visible in restraint.', body: 'Quality signals through typographic precision, spacing rhythm, and consistent micro-detail — not gradients or generative ornament.' },
  { n: '03', title: 'Warm, not sterile.', body: 'Off-whites over pure white. Near-blacks over pure black. One disciplined accent color. Swiss-precise but inhabited.' },
  { n: '04', title: 'One weird thing.', body: 'Every surface gets exactly one element that breaks the grid. The anti-template clause.' },
  { n: '05', title: 'Both modes first-class.', body: 'Light and dark are designed in parallel, not as inversions. Tokens are mode-aware from the ground up.' },
  { n: '06', title: 'Respect the medium.', body: 'Editorial surfaces read like editorial. Product surfaces respond like products. Shared tokens, different layouts.' },
]

export function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Badge tone="accent" variant="subtle" size="md">Draft v0.1 · May 2026</Badge>
        <h1 className={`${styles.heroTitle} display`}>
          A tight, opinionated <span className={styles.accent}>design system</span> — warm neutrals, ember accent, dual-mode.
        </h1>
        <p className={styles.heroSub}>
          Built for personal brand and product UI in parallel. Designers feel constrained in
          a productive way — most decisions are already made. The escape hatches are few and
          deliberate.
        </p>
        <div className={styles.heroActions}>
          <Button size="lg" trailingIcon={<ArrowRight size={16} />}>
            <Link to="/components" style={{ color: 'inherit', textDecoration: 'none' }}>Browse components</Link>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            leadingIcon={<BookOpen size={16} />}
            onClick={() => window.open(resolveEnvUrl(import.meta.env.VITE_STORYBOOK_URL, '/storybook/'), '_blank', 'noopener')}
          >
            Open Storybook
          </Button>
        </div>
        <div className={styles.heroMeta} aria-hidden>
          <span>36 components</span>
          <span>·</span>
          <span>118 tokens</span>
          <span>·</span>
          <span>AA verified</span>
        </div>
      </section>

      <section className={styles.cards}>
        <Card interactive>
          <CardHeader>
            <CardTitle><Palette size={18} style={{ verticalAlign: '-3px', marginRight: 8, color: 'var(--accent-ember-500)' }} />Foundations</CardTitle>
            <CardDescription>Tokens, color, spacing, motion, radius. The opinions that everything else rides on.</CardDescription>
          </CardHeader>
          <CardContent><Link to="/foundations">Explore foundations →</Link></CardContent>
        </Card>
        <Card interactive>
          <CardHeader>
            <CardTitle><Sparkles size={18} style={{ verticalAlign: '-3px', marginRight: 8, color: 'var(--accent-ember-500)' }} />Components</CardTitle>
            <CardDescription>Primitives, patterns, editorial. All states, both modes, accessible by default.</CardDescription>
          </CardHeader>
          <CardContent><Link to="/components">Browse components →</Link></CardContent>
        </Card>
        <Card interactive>
          <CardHeader>
            <CardTitle><Type size={18} style={{ verticalAlign: '-3px', marginRight: 8, color: 'var(--accent-ember-500)' }} />Editorial</CardTitle>
            <CardDescription>For Recurse posts and long-form. Serif body, sans headings, margin notes, pull quotes.</CardDescription>
          </CardHeader>
          <CardContent><Link to="/editorial">Read a sample →</Link></CardContent>
        </Card>
      </section>

      <section className={styles.principles}>
        <p className="label-caps">Design principles</p>
        <h2 className={styles.principlesTitle}>Six rules every decision is measured against.</h2>
        <p className={styles.principlesSub}>When in doubt, the earlier principle wins.</p>
        <ol className={styles.principlesGrid}>
          {principles.map((p) => (
            <li key={p.n} className={styles.principle}>
              <span className={`mono ${styles.principleN}`}>{p.n}</span>
              <h3 className={styles.principleTitle}>{p.title}</h3>
              <p className={styles.principleBody}>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
