import { Route, Routes } from 'react-router-dom'
import { ToastProvider } from './lib/components/patterns/Toast'
import { AppShell } from './showcase/AppShell'
import { HomePage } from './pages/HomePage'
import { FoundationsPage } from './pages/FoundationsPage'
import { ComponentsPage } from './pages/ComponentsPage'
import { EditorialPage } from './pages/EditorialPage'
import { AboutPage } from './pages/AboutPage'

export default function App() {
  return (
    <ToastProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/foundations" element={<FoundationsPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/editorial" element={<EditorialPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AppShell>
    </ToastProvider>
  )
}
