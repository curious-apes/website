import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import AdminApp from './admin/AdminApp'
import BlogPostPage from './components/BlogPostPage'
import AboutPage from './components/AboutPage'
import BlogPage from './components/BlogPage'
import ContactPage from './components/ContactPage'
import PaidMediaPage from './components/PaidMediaPage'
import TechCROPage from './components/TechCROPage'
import VisualsPage from './components/VisualsPage'
import GrowthPage from './components/GrowthPage'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services/paid-media" element={<PaidMediaPage />} />
        <Route path="/services/tech-cro" element={<TechCROPage />} />
        <Route path="/services/visuals-creative" element={<VisualsPage />} />
        <Route path="/services/growth-marketing" element={<GrowthPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
