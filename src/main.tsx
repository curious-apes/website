import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'

// Route-level code splitting: each page ships as its own chunk fetched only on
// navigation. Keeps the homepage (App) bundle small and keeps admin-only weight
// (BlogManager, turndown) off the public first load.
const AdminApp = lazy(() => import('./admin/AdminApp'))
const BlogPostPage = lazy(() => import('./components/BlogPostPage'))
const AboutPage = lazy(() => import('./components/AboutPage'))
const BlogPage = lazy(() => import('./components/BlogPage'))
const ContactPage = lazy(() => import('./components/ContactPage'))
const PaidMediaPage = lazy(() => import('./components/PaidMediaPage'))
const TechCROPage = lazy(() => import('./components/TechCROPage'))
const VisualsPage = lazy(() => import('./components/VisualsPage'))
const GrowthPage = lazy(() => import('./components/GrowthPage'))
const ThankYouPage = lazy(() => import('./components/ThankYouPage'))

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services/paid-media" element={<PaidMediaPage />} />
          <Route path="/services/tech-cro" element={<TechCROPage />} />
          <Route path="/services/visuals-creative" element={<VisualsPage />} />
          <Route path="/services/growth-marketing" element={<GrowthPage />} />
          <Route path="/thankyou" element={<ThankYouPage />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
