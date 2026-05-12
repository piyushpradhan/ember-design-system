import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Card.module.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { elevated, interactive, padding = 'md', className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        styles.card,
        elevated && styles.elevated,
        interactive && styles.interactive,
        styles[`pad-${padding}`],
        className
      )}
      {...rest}
    />
  )
})

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.header, className)} {...rest} />
}

export function CardTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return <h3 className={cn(styles.title, className)} {...rest}>{children}</h3>
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(styles.description, className)} {...rest} />
}

export function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.content, className)} {...rest} />
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.footer, className)} {...rest} />
}
