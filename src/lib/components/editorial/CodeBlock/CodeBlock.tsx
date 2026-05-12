import { useState, type HTMLAttributes } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './CodeBlock.module.css'

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code: string
  language?: string
  filename?: string
  showCopy?: boolean
}

export function CodeBlock({ code, language, filename, showCopy = true, className, ...rest }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className={cn(styles.wrap, className)} {...rest}>
      {(filename || language) && (
        <div className={styles.head}>
          <span className={styles.filename}>{filename ?? language}</span>
          {language && filename && <span className={styles.lang}>{language}</span>}
        </div>
      )}
      {showCopy && (
        <button
          type="button"
          aria-label={copied ? 'Copied' : 'Copy code'}
          className={styles.copy}
          onClick={copy}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
      <pre className={styles.pre}>
        <code className={cn(styles.code, language && `language-${language}`)}>{code}</code>
      </pre>
    </div>
  )
}

export interface InlineCodeProps extends HTMLAttributes<HTMLElement> {}
export function InlineCode({ className, ...rest }: InlineCodeProps) {
  return <code className={cn(styles.inline, className)} {...rest} />
}
