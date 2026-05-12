import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Github, Moon, Sun, BookOpen } from 'lucide-react'
import { useTheme } from '../lib/hooks/useTheme'
import { IconButton } from '../lib/components/primitives/IconButton'
import { Button } from '../lib/components/primitives/Button'
import styles from './AppShell.module.css'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/foundations', label: 'Foundations' },
  { to: '/components', label: 'Components' },
  { to: '/editorial', label: 'Editorial' },
  { to: '/about', label: 'About' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.mark} aria-hidden />
            <span>Ember</span>
            <span className={styles.version}>v0.1</span>
          </Link>
          <nav className={styles.nav}>
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                {it.label}
              </NavLink>
            ))}
          </nav>
          <div className={styles.actions}>
            <Button
              variant="ghost"
              size="sm"
              leadingIcon={<BookOpen size={14} />}
              onClick={() => window.open(import.meta.env.VITE_STORYBOOK_URL || '/storybook/', '_blank', 'noopener')}
            >
              Storybook
            </Button>
            <IconButton
              aria-label="Open repository"
              variant="ghost"
              size="sm"
              icon={<Github size={16} />}
              onClick={() => window.open(import.meta.env.VITE_REPO_URL || 'https://github.com/piyushpradhan/ember-design-system', '_blank', 'noopener')}
            />
            <IconButton
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              variant="ghost"
              size="sm"
              icon={theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              onClick={toggle}
            />
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className="mono">
            Built with <a href="https://react.dev" target="_blank" rel="noreferrer">React</a>,{' '}
            <a href="https://vite.dev" target="_blank" rel="noreferrer">Vite</a> &{' '}
            <a href="https://storybook.js.org" target="_blank" rel="noreferrer">Storybook</a>
          </p>
          {/* "One weird thing": a handwritten signature in the footer. */}
          <svg className={styles.signature} viewBox="0 0 240 60" aria-hidden>
            <path
              d="M8 38 C 18 14, 30 14, 36 34 C 42 50, 50 12, 60 28 C 68 40, 76 18, 84 30 M 100 22 L 100 44 M 100 18 L 100 16 M 116 30 C 122 22, 134 22, 138 32 C 140 40, 130 44, 124 40 M 158 38 C 168 14, 180 14, 186 34 C 192 50, 200 12, 210 30 M 222 22 L 222 44"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </footer>
    </div>
  )
}
