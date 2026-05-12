import { ArticleHeader } from '../lib/components/editorial/ArticleHeader'
import { PullQuote } from '../lib/components/editorial/PullQuote'
import { MarginNote } from '../lib/components/editorial/MarginNote'
import { Footnote } from '../lib/components/editorial/Footnote'
import { CodeBlock, InlineCode } from '../lib/components/editorial/CodeBlock'
import { AuthorByline } from '../lib/components/editorial/AuthorByline'
import { TagCloud } from '../lib/components/editorial/TagCloud'
import { ReadingProgress } from '../lib/components/editorial/ReadingProgress'
import { Tag } from '../lib/components/primitives/Tag'
import { Divider } from '../lib/components/primitives/Divider'
import styles from './EditorialPage.module.css'

const sample = `import { Button } from 'ember'

export function CTA() {
  return (
    <Button size="lg" variant="primary">
      Read the brief
    </Button>
  )
}`

export function EditorialPage() {
  return (
    <div>
      <ReadingProgress />
      <article className={styles.article}>
        <ArticleHeader
          eyebrow="Recurse log 042"
          title="On reading 80,000 emails so you don't have to"
          subtitle="A year of triaging inbound for one founder, distilled into the patterns that actually mattered."
          date="2026-05-10"
          readTime="12 min read"
          tags={
            <>
              <Tag>email</Tag>
              <Tag>automation</Tag>
              <Tag>writing</Tag>
            </>
          }
        />

        <AuthorByline name="Piyush Pradhan" role="Author" date="2026-05-10" />

        <div className={`prose ${styles.body}`}>
          <p>
            For a year I read every email that hit a friend's inbox. Eighty thousand of them
            <Footnote number={1}>
              Ranges from 200/day weekdays to 50/day weekends, sustained over twelve months.
            </Footnote>
            . Most days, more than half had nothing to do with the work that paid the rent. The
            interesting question wasn't "how do you filter?" but "what does triage tell you about
            the shape of the business?"
          </p>

          <p>
            <MarginNote label="Aside" side="right">
              Triage as proxy for product-market fit: when 70% of inbound stops being relevant,
              your audience has shifted under you.
            </MarginNote>
            The first thing the queue does is sort by sender. Once you've seen a hundred emails
            from someone, you stop reading the content and start reading the cadence. Same hour,
            same day, same opener — that's a bot, even if a human signed it. Same person every
            quarter checking in — that's a relationship, even if the words are stale.
          </p>

          <PullQuote attribution="A maxim that survived contact with reality">
            Craft is visible in restraint. A well-set paragraph beats a clever animation.
          </PullQuote>

          <h2>The shape of inbox debt</h2>

          <p>
            Here's the thing nobody tells you about email at scale: it has a half-life. Three days
            in, a message has lost 60% of its value to the recipient. Seven days in, it's
            indistinguishable from spam. The lossy compression of attention is exponential, not
            linear.
          </p>

          <p>
            The tooling I built for this ended up using <InlineCode>react</InlineCode>,{' '}
            <InlineCode>postgres</InlineCode>, and a vibes-based classifier that's been quietly
            running for a year now. Nothing fancy.
          </p>

          <CodeBlock
            filename="triage.tsx"
            language="tsx"
            code={sample}
          />

          <h3>What I'd do differently</h3>

          <p>
            Build the cadence detector first. Skip the content classifier for the first six months.
            Pattern of arrival {'>'} content of message, almost always.
          </p>

          <p>
            More on this in the next post — there's a calendar problem hiding inside the email
            problem, and it's the real reason most "AI assistant" startups die in beta.
          </p>

          <Divider variant="dashed" label="end" />

          <p className={styles.tags}>
            <TagCloud
              items={[
                { label: 'design-system', count: 12 },
                { label: 'email', count: 8 },
                { label: 'tauri', count: 5 },
                { label: 'workflow', count: 4 },
              ]}
            />
          </p>
        </div>
      </article>
    </div>
  )
}
