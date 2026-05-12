import { useState } from 'react'
import { Bell, Mail, Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '../lib/components/primitives/Button'
import { IconButton } from '../lib/components/primitives/IconButton'
import { Input } from '../lib/components/primitives/Input'
import { Textarea } from '../lib/components/primitives/Textarea'
import { Select } from '../lib/components/primitives/Select'
import { Checkbox } from '../lib/components/primitives/Checkbox'
import { Radio, RadioGroup } from '../lib/components/primitives/Radio'
import { Switch } from '../lib/components/primitives/Switch'
import { Badge } from '../lib/components/primitives/Badge'
import { Tag } from '../lib/components/primitives/Tag'
import { Avatar, AvatarGroup } from '../lib/components/primitives/Avatar'
import { Divider } from '../lib/components/primitives/Divider'
import { Spinner } from '../lib/components/primitives/Spinner'
import { Tooltip } from '../lib/components/primitives/Tooltip'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../lib/components/patterns/Card'
import { Modal } from '../lib/components/patterns/Modal'
import { Drawer } from '../lib/components/patterns/Drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../lib/components/patterns/Tabs'
import { Accordion, AccordionItem } from '../lib/components/patterns/Accordion'
import { Breadcrumb } from '../lib/components/patterns/Breadcrumb'
import { Pagination } from '../lib/components/patterns/Pagination'
import { Table, TBody, Td, Th, THead, Tr } from '../lib/components/patterns/Table'
import { EmptyState } from '../lib/components/patterns/EmptyState'
import { FormField } from '../lib/components/patterns/FormField'
import { useToast } from '../lib/components/patterns/Toast'
import styles from './ComponentsPage.module.css'

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description && <p className={styles.sectionDescription}>{description}</p>}
      </header>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  )
}

function Demo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.demo}>
      <div className={styles.demoBody}>{children}</div>
      <div className={styles.demoLabel}>{label}</div>
    </div>
  )
}

export function ComponentsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [page, setPage] = useState(3)
  const { toast } = useToast()

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <p className="label-caps">Components</p>
        <h1 className={styles.pageTitle}>Primitives, patterns, editorial.</h1>
        <p className={styles.pageSub}>
          36 components with all states defined, accessible by default, and theme-aware out
          of the box. Open the Storybook for every variant.
        </p>
      </header>

      <Section id="buttons" title="Buttons" description="Canonical component. Get this right; the rest follows.">
        <Demo label="Variants">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
        </Demo>
        <Demo label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Demo>
        <Demo label="With icons">
          <Button leadingIcon={<Plus size={14} />}>Add item</Button>
          <Button variant="danger" leadingIcon={<Trash2 size={14} />}>Delete</Button>
          <Button variant="secondary" loading>Saving…</Button>
          <Button disabled>Disabled</Button>
        </Demo>
      </Section>

      <Section id="form-controls" title="Form controls" description="Inputs, selects, toggles. All with focus, disabled, invalid.">
        <Demo label="Inputs">
          <div style={{ display: 'grid', gap: 8, width: 320 }}>
            <Input placeholder="Standard input" />
            <Input leadingIcon={<Search size={14} />} placeholder="Search…" />
            <Input trailingIcon={<Mail size={14} />} defaultValue="hello@example.com" />
            <Input invalid defaultValue="bad value" />
            <Input disabled defaultValue="disabled" />
          </div>
        </Demo>
        <Demo label="Textarea, select">
          <div style={{ display: 'grid', gap: 12, width: 320 }}>
            <Textarea placeholder="Write a long description…" rows={3} />
            <Select>
              <option>Pick one…</option>
              <option>Hobby</option>
              <option>Pro</option>
              <option>Team</option>
            </Select>
          </div>
        </Demo>
        <Demo label="Toggles">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Checkbox label="Accept terms" />
            <Checkbox label="Subscribed" defaultChecked />
            <Checkbox label="Some selected" indeterminate defaultChecked />
            <Switch label="Notifications" defaultChecked />
            <RadioGroup name="plan">
              <Radio name="plan" value="hobby" label="Hobby" defaultChecked />
              <Radio name="plan" value="pro" label="Pro" />
              <Radio name="plan" value="team" label="Team" />
            </RadioGroup>
          </div>
        </Demo>
        <Demo label="FormField with error">
          <div style={{ width: 320 }}>
            <FormField
              label="Email address"
              required
              hint="We will only use this to confirm your account."
            >
              <Input type="email" placeholder="you@example.com" />
            </FormField>
            <div style={{ height: 16 }} />
            <FormField label="Password" required error="Must be at least 12 characters.">
              <Input type="password" defaultValue="short" />
            </FormField>
          </div>
        </Demo>
      </Section>

      <Section id="display" title="Display" description="Badges, tags, avatars, dividers, spinners, tooltips.">
        <Demo label="Badges">
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Live</Badge>
          <Badge tone="warning">Beta</Badge>
          <Badge tone="danger">Broken</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="accent" variant="solid">Solid</Badge>
          <Badge tone="neutral" variant="outline">v0.1</Badge>
        </Demo>
        <Demo label="Tags">
          <Tag interactive>typography</Tag>
          <Tag interactive>tokens</Tag>
          <Tag removable>draft</Tag>
          <Tag>v0.1</Tag>
        </Demo>
        <Demo label="Avatars">
          <Avatar name="Ada Lovelace" size="sm" />
          <Avatar name="Alan Turing" />
          <Avatar name="Grace Hopper" size="lg" status="online" />
          <AvatarGroup max={2}>
            <Avatar name="Ada Lovelace" />
            <Avatar name="Alan Turing" />
            <Avatar name="Grace Hopper" />
          </AvatarGroup>
        </Demo>
        <Demo label="Dividers, spinners, tooltips">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
            <Tooltip content="Notifications"><IconButton aria-label="Notifications" icon={<Bell size={16} />} /></Tooltip>
            <Divider orientation="vertical" />
            <Spinner />
            <Divider orientation="vertical" />
            <Tooltip content="Email" side="right"><Button variant="ghost" size="sm">Hover me</Button></Tooltip>
          </div>
        </Demo>
      </Section>

      <Section id="overlays" title="Overlays" description="Modal, drawer, toast — all focus-trapped, ESC-dismissable, scroll-locked.">
        <Demo label="Modal">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Delete migration plan?"
            description="This action will permanently remove the schema migration draft."
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="danger" onClick={() => setModalOpen(false)}>Delete</Button>
              </>
            }
          >
            <p>You're about to delete the draft migration <code>0042_user_schema.sql</code>.</p>
          </Modal>
        </Demo>
        <Demo label="Drawer">
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Quick settings"
            footer={<Button onClick={() => setDrawerOpen(false)}>Done</Button>}
          >
            <p>Drawer content goes here. Use for secondary forms, filters, or contextual editing.</p>
          </Drawer>
        </Demo>
        <Demo label="Toast">
          <Button onClick={() => toast({ title: 'Saved', description: 'Draft saved 5s ago.', tone: 'success' })}>
            Trigger toast
          </Button>
        </Demo>
      </Section>

      <Section id="layout" title="Layout" description="Tabs, accordion, cards, breadcrumbs, pagination, tables, empty states.">
        <Demo label="Tabs">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">A condensed summary of what this thing does and why.</TabsContent>
            <TabsContent value="usage">How to install, import and render.</TabsContent>
            <TabsContent value="api">Props, types, refs. Reference grade.</TabsContent>
          </Tabs>
        </Demo>
        <Demo label="Accordion">
          <Accordion defaultValue="why">
            <AccordionItem value="why" title="Why warm neutrals?">
              Pure gray ramps feel clinical and read as "default". A slight warm shift makes the
              system feel inhabited.
            </AccordionItem>
            <AccordionItem value="modes" title="Are both modes first-class?">
              Yes. Tokens are mode-aware from the ground up.
            </AccordionItem>
            <AccordionItem value="weird" title="What is the 'one weird thing' clause?">
              Every surface gets exactly one element that breaks the system.
            </AccordionItem>
          </Accordion>
        </Demo>
        <Demo label="Card">
          <Card>
            <CardHeader>
              <CardTitle>Daily Output Tracker</CardTitle>
              <CardDescription>Small Tauri app for tracking shipping cadence.</CardDescription>
            </CardHeader>
            <CardContent>12 day streak, ahead of last month's average.</CardContent>
            <CardFooter>
              <Button variant="ghost">Dismiss</Button>
              <Button>Open</Button>
            </CardFooter>
          </Card>
        </Demo>
        <Demo label="Breadcrumb, pagination">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Breadcrumb
              items={[
                { label: 'Recurse', href: '#' },
                { label: '2026', href: '#' },
                { label: 'On reading 80,000 emails' },
              ]}
            />
            <Pagination page={page} total={12} onPageChange={setPage} />
          </div>
        </Demo>
        <Demo label="Table">
          <Table>
            <THead>
              <Tr>
                <Th>Project</Th>
                <Th>Status</Th>
                <Th style={{ textAlign: 'right' }}>Builds</Th>
              </Tr>
            </THead>
            <TBody>
              <Tr>
                <Td>Daily Output Tracker</Td>
                <Td><Badge tone="success">Shipping</Badge></Td>
                <Td className="mono" style={{ textAlign: 'right' }}>312</Td>
              </Tr>
              <Tr>
                <Td>Smart clipboard</Td>
                <Td><Badge tone="warning">Draft</Badge></Td>
                <Td className="mono" style={{ textAlign: 'right' }}>47</Td>
              </Tr>
              <Tr>
                <Td>Financial planner</Td>
                <Td><Badge tone="neutral">Idea</Badge></Td>
                <Td className="mono" style={{ textAlign: 'right' }}>0</Td>
              </Tr>
            </TBody>
          </Table>
        </Demo>
        <Demo label="Empty state">
          <EmptyState
            icon={<Search size={20} />}
            title="No results"
            description="Try a broader query or check your filters."
            actions={<Button>Clear filters</Button>}
          />
        </Demo>
      </Section>
    </div>
  )
}
