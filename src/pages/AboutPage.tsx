import { ExternalLink, Github } from 'lucide-react'
import { Button } from '../lib/components/primitives/Button'
import { Badge } from '../lib/components/primitives/Badge'
import { resolveEnvUrl } from '../lib/utils/url'
import styles from './AboutPage.module.css'

export function AboutPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className="label-caps">About</p>
        <h1 className={styles.title}>The system, in a paragraph.</h1>
        <p className={styles.sub}>
          Ember is a tight, opinionated design system for personal brand and product UI in
          parallel. Two surfaces — editorial and product — share tokens and a voice, not
          layouts. Designers and developers using it should feel constrained in a productive way.
        </p>
      </header>

      <section className={styles.specs}>
        <dl className={styles.dl}>
          <div><dt>Author</dt><dd>Piyush Pradhan</dd></div>
          <div><dt>Status</dt><dd><Badge tone="accent" variant="outline">Draft v0.1</Badge></dd></div>
          <div><dt>Last updated</dt><dd className="mono">2026-05-12</dd></div>
          <div><dt>Components</dt><dd className="mono">36 · all states</dd></div>
          <div><dt>Modes</dt><dd>Light + dark, equal priority</dd></div>
          <div><dt>Accent</dt><dd>Ember <span className={styles.swatch} aria-hidden /></dd></div>
        </dl>
      </section>

      <section className={styles.principles}>
        <p className="label-caps">Out of scope (intentionally)</p>
        <ul className={styles.outList}>
          <li>Gradients in UI, except one mesh on the personal site landing.</li>
          <li>Generic SaaS hero copy. No "supercharge", no "delight".</li>
          <li>Filled icon sets. Outline only, 1.5px stroke.</li>
          <li>Pure <code>#000</code> and <code>#FFF</code>. Always use the token.</li>
          <li>Heavily rounded UI. <code>--radius-lg</code> caps at 10px for a reason.</li>
          <li>Scroll-jacked storytelling and entrance animations.</li>
        </ul>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Take a look around.</h2>
        <p className={styles.ctaBody}>
          The full brief and source are public. The Storybook has every variant for every component.
        </p>
        <div className={styles.ctaActions}>
          <Button
            size="lg"
            leadingIcon={<Github size={16} />}
            onClick={() => window.open(resolveEnvUrl(import.meta.env.VITE_REPO_URL, 'https://github.com/piyushpradhan/ember-design-system'), '_blank', 'noopener')}
          >
            View on GitHub
          </Button>
          <Button
            variant="secondary"
            size="lg"
            trailingIcon={<ExternalLink size={16} />}
            onClick={() => window.open(resolveEnvUrl(import.meta.env.VITE_STORYBOOK_URL, '/storybook/'), '_blank', 'noopener')}
          >
            Open Storybook
          </Button>
        </div>
      </section>
    </div>
  )
}
