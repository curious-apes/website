import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './Navbar'
import Footer from './Footer'
import PopupForm from './PopupForm'
import FloatingCTA from './FloatingCTA'
import ScrollToTop from './ScrollToTop'
import Cursor from './Cursor'
import perf1 from '../assets/performace-1.webp'
import perf2 from '../assets/performace-2.webp'
import perf3 from '../assets/performace-3.webp'
import growth2 from '../assets/growth_2.webp'
import tech2 from '../assets/tech_2.webp'
import visual2 from '../assets/visual_2.webp'
import './EcommercePerformanceMarketingPage.css'

gsap.registerPlugin(ScrollTrigger)

/* ---------- Content data (from the provided brief) ---------- */

const proofHighlights = [
  '₹80+ Crore Revenue Generated',
  '₹20+ Crore Ad Spend Managed',
  '50+ Successful Brand Partnerships',
  '4X Average Return on Ad Spend (ROAS)',
  '500+ High-Performing Marketing Campaigns',
  'Dedicated Experts in Marketing, Development & Creative',
]

const servicesList = [
  'Paid Media Management',
  'Meta Ads Management',
  'Google Ads Management',
  'SEO for Ecommerce (AI-Ready & Local SEO)',
  'Content Marketing & Digital PR',
  'Social Media Marketing',
  'Conversion Rate Optimization (CRO)',
  'Analytics, Tracking & Reporting',
  'WhatsApp, Email & CRM Marketing',
  'Marketplace Management',
  'UGC Content Marketing',
  'Retention Marketing',
]

const whyPillars = [
  {
    title: 'Customer Acquisition',
    desc: 'Reach the right audience through Meta Ads, Google Ads, SEO, and marketplace advertising.',
    image: perf1,
  },
  {
    title: 'Customer Engagement',
    desc: 'Build meaningful relationships with creative content, social media marketing, and personalized campaigns.',
    image: visual2,
  },
  {
    title: 'Conversion Optimization',
    desc: 'Improve landing pages, website experience, and checkout processes to increase sales.',
    image: tech2,
  },
  {
    title: 'Customer Retention',
    desc: 'Drive repeat purchases with WhatsApp marketing, email automation, CRM campaigns, and loyalty strategies.',
    image: growth2,
  },
  {
    title: 'Analytics & Reporting',
    desc: 'Track every click, conversion, and customer interaction with advanced analytics and performance dashboards.',
    image: perf2,
  },
]

const whyChoosePoints = [
  'Dedicated eCommerce growth specialists',
  'Data-driven campaign management',
  'ROI-focused marketing strategies',
  'Transparent reporting and analytics',
  'Creative campaigns built for conversions',
  'Continuous campaign optimization',
  'Full-funnel marketing approach',
  'One team for marketing, creative, and technology',
]

const industries = [
  'Fashion & Apparel',
  'Jewellery & Luxury Brands',
  'Beauty & Skincare',
  'Health & Wellness',
  'Electronics & Gadgets',
  'Home Decor & Furniture',
  'FMCG & Grocery',
  'Food & Beverage',
  'Sports & Fitness',
  'Baby & Kids Products',
  'Lifestyle Brands',
  'D2C Startups',
]

const marketplaces = [
  'Amazon',
  'Flipkart',
  'Myntra',
  'Ajio',
  'Meesho',
  'Nykaa',
  'Shopify',
  'WooCommerce',
  'Magento',
  'Custom E-Commerce Stores',
]

const processSteps = [
  { n: '01', title: 'Business Discovery', desc: 'Understanding your brand, products, competitors, and goals.' },
  { n: '02', title: 'Market & Audience Research', desc: 'Identify customer behavior, buying intent, and growth opportunities.' },
  { n: '03', title: 'Strategy Development', desc: 'Create a customized performance marketing roadmap.' },
  { n: '04', title: 'Campaign Launch', desc: 'Execute campaigns across Meta, Google, SEO, email, marketplaces, and social platforms.' },
  { n: '05', title: 'Continuous Optimization', desc: 'Improve performance through A/B testing, audience refinement, and creative optimization.' },
  { n: '06', title: 'Reporting & Scaling', desc: 'Track KPIs, measure ROI, and scale winning campaigns for long-term growth.' },
]

const toolGroups = [
  { group: 'Advertising Platforms', items: ['Google Ads', 'Meta Ads', 'Microsoft Ads'] },
  { group: 'Analytics & Tracking', items: ['Google Analytics 4 (GA4)', 'Google Tag Manager (GTM)', 'Google Search Console', 'Looker Studio'] },
  { group: 'SEO & Research', items: ['Ahrefs', 'SEMrush', 'Google Keyword Planner'] },
  { group: 'E-Commerce Platforms', items: ['Shopify', 'WooCommerce', 'Magento'] },
  { group: 'CRM & Automation', items: ['Klaviyo', 'Mailchimp', 'HubSpot', 'WhatsApp Business'] },
]

const successStories = [
  { brand: 'Fashion Brand', stats: ['4.5X ROAS', '180% Increase in Revenue', '55% Lower Customer Acquisition Cost'] },
  { brand: 'Beauty Brand', stats: ['3X Growth in Monthly Sales', '210% Increase in Website Traffic', 'Higher Conversion Rates through CRO'] },
  { brand: 'Jewellery Brand', stats: ['5X Return on Ad Spend', 'Increased Qualified Leads', 'Improved Repeat Purchase Rate'] },
]

const certifications = [
  'Google Ads',
  'Google Analytics 4 (GA4)',
  'Google Tag Manager',
  'Meta Ads',
  'Shopify',
  'Search Engine Optimization (SEO)',
  'Conversion Rate Optimization (CRO)',
]

const testimonials = [
  { quote: 'Curious Apes helped us improve our ROAS and scale our online sales with a clear performance marketing strategy.' },
  { quote: 'Their team understands ecommerce better than traditional marketing agencies. Every campaign is backed by data and delivers measurable results.' },
  { quote: 'From paid ads to retention marketing, Curious Apes became our long-term growth partner.' },
]

const relatedServices = [
  { title: 'Shopify Development Services', desc: 'Build fast, scalable, and conversion-focused Shopify stores for modern eCommerce brands.', cta: 'Explore Shopify Development', href: '/services/tech-cro' },
  { title: 'E-Commerce Website Development', desc: 'Launch secure, SEO-friendly online stores designed to grow with your business.', cta: 'Learn More', href: '/services/tech-cro' },
  { title: 'Conversion Rate Optimization (CRO)', desc: 'Improve user experience, reduce cart abandonment, and increase conversions.', cta: 'Discover CRO Services', href: '/services/tech-cro' },
  { title: 'Analytics & Tracking', desc: 'Make smarter marketing decisions with accurate tracking, GA4 setup, and real-time reporting.', cta: 'View Analytics Services', href: '/services/tech-cro' },
  { title: 'Growth Marketing Services', desc: 'Scale your brand through customer acquisition, retention, and lifecycle marketing.', cta: 'Explore Growth Marketing', href: '/services/growth-marketing' },
  { title: 'Creative Production Services', desc: 'Create high-performing creatives, videos, product visuals, and UGC content that converts.', cta: 'View Creative Services', href: '/services/visuals-creative' },
]

export const faqs = [
  { q: 'What is ecommerce performance marketing?', a: 'Ecommerce performance marketing is a results-driven approach where campaigns are optimized based on measurable outcomes such as sales, leads, conversions, and return on ad spend (ROAS).' },
  { q: 'Why should I hire an ecommerce performance marketing agency?', a: 'An experienced agency helps improve customer acquisition, optimize advertising budgets, increase conversions, and deliver long-term business growth through data-driven strategies.' },
  { q: 'Which marketing channels do you manage?', a: 'We manage Meta Ads, Google Ads, SEO, content marketing, social media marketing, email marketing, WhatsApp marketing, marketplace advertising, and retention campaigns.' },
  { q: 'Do you work with Shopify stores?', a: 'Yes. We specialize in Shopify marketing, optimization, analytics, and performance campaigns for D2C and ecommerce brands.' },
  { q: 'How do you measure campaign success?', a: 'We track KPIs such as ROAS, conversions, revenue, customer acquisition cost (CAC), average order value (AOV), click-through rate (CTR), and customer lifetime value (CLV).' },
  { q: 'Do you provide monthly performance reports?', a: 'Yes. Every client receives detailed reports with campaign insights, analytics, recommendations, and growth opportunities.' },
  { q: 'Can you help improve my website conversions?', a: 'Absolutely. Our CRO specialists optimize landing pages, checkout flows, user experience, and website performance to increase conversions.' },
  { q: 'Do you offer custom marketing strategies?', a: 'Yes. Every strategy is tailored to your business goals, target audience, competition, and growth stage.' },
  { q: 'Which industries do you work with?', a: 'We work with fashion, beauty, jewellery, electronics, lifestyle, home décor, health & wellness, FMCG, and other D2C and ecommerce brands.' },
  { q: 'Why choose Curious Apes?', a: 'Curious Apes combines performance marketing, ecommerce expertise, creative production, analytics, CRO, and technology under one roof, making us a trusted growth partner for ambitious ecommerce brands.' },
]

const arrowIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const checkIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function EcommercePerformanceMarketingPage() {
  const [popupOpen, setPopupOpen] = useState(false)
  const openPopup = useCallback(() => setPopupOpen(true), [])
  const closePopup = useCallback(() => setPopupOpen(false), [])
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activePillar, setActivePillar] = useState(0)

  const rootRef = useRef<HTMLElement>(null)
  const pillarRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Full-Funnel sticky scroll-stack: reveal each pillar card as it enters and
  // track the active one to light up the progress dots beside the pinned heading.
  useEffect(() => {
    const ctx = gsap.context(() => {
      pillarRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(
          el,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => { if (self.isActive) setActivePillar(i) },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Scroll-reveal: every [data-reveal] fades/slides up as it enters the viewport.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      els.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          },
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <Cursor />
      <Navbar />
      <main ref={rootRef} className="epm">
        {/* ============ SECTION 1 — HERO ============ */}
        <section className="epm-hero">
          <div className="epm-hero__orb epm-hero__orb--1" />
          <div className="epm-hero__orb epm-hero__orb--2" />
          <div className="epm-hero__grid-bg" />
          <div className="container epm-hero__inner">
            <div className="section-label epm-hero__eyebrow" data-reveal>Ecommerce Performance Marketing</div>
            <h1 className="epm-hero__title" data-reveal>
              Ecommerce Performance Marketing Agency<br />
              <span className="epm-hero__title--grad">That Delivers Measurable Growth</span>
            </h1>
            <p className="epm-hero__lead" data-reveal>
              Scale Your Online Store with Data-Driven Ecommerce Performance Marketing Services
            </p>
            <p className="epm-hero__sub" data-reveal>
              At <strong>Curious Apes</strong>, we help eCommerce and D2C brands grow faster through
              performance-driven marketing strategies that generate measurable results. As a trusted
              <strong> ecommerce performance marketing agency</strong>, we combine paid media, SEO, content
              marketing, CRO, analytics, and retention strategies to increase traffic, improve conversions,
              and maximize your return on investment.
            </p>
            <div className="epm-hero__actions" data-reveal>
              <a href="#contact" className="btn btn-primary epm-btn" onClick={(e) => { e.preventDefault(); openPopup() }}>
                Book Free Strategy Call {arrowIcon}
              </a>
              <a href="#contact" className="btn btn-outline epm-btn--outline" onClick={(e) => { e.preventDefault(); openPopup() }}>
                Get Free Marketing Audit
              </a>
            </div>
          </div>
        </section>

        {/* ============ SECTION 2 — PROOF / RESULTS ============ */}
        <section className="epm-proof">
          <div className="container">
            <div className="epm-proof__head" data-reveal>
              <h2 className="epm-section-title">
                A Proven Ecommerce Performance Marketing Agency<br />
                <span className="epm-grad">That Delivers Results</span>
              </h2>
              <p className="epm-section-sub">
                Successful eCommerce marketing is more than running ads — it's about building a profitable
                growth engine. Our team uses data, customer insights, and continuous optimization to help
                brands achieve sustainable business growth.
              </p>
            </div>
            <div className="epm-proof__grid">
              {proofHighlights.map((h, i) => (
                <div className="epm-proof__card" key={h} data-reveal style={{ transitionDelay: `${i * 40}ms` }}>
                  <span className="epm-proof__spark" />
                  <p className="epm-proof__text">{h}</p>
                </div>
              ))}
            </div>
            <p className="epm-proof__foot" data-reveal>
              We focus on improving customer acquisition, increasing sales, and maximizing every marketing investment.
            </p>
          </div>
        </section>

        {/* ============ SECTION 3 — SERVICES ============ */}
        <section className="epm-services">
          <div className="epm-services__orb" />
          <div className="container">
            <div className="epm-services__head" data-reveal>
              <div className="section-label">Ecommerce Performance Marketing Services</div>
              <h2 className="epm-section-title">
                Complete Performance Marketing Solutions<br />
                <span className="epm-grad">for Ecommerce Brands</span>
              </h2>
              <p className="epm-section-sub">
                As a full-service <strong>ecommerce performance marketing company</strong>, we provide everything
                your brand needs to attract, convert, and retain customers.
              </p>
            </div>
            <div className="epm-services__grid">
              {servicesList.map((s, i) => (
                <div className="epm-service-chip" key={s} data-reveal style={{ transitionDelay: `${i * 30}ms` }}>
                  <span className="epm-service-chip__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="epm-service-chip__label">{s}</span>
                </div>
              ))}
            </div>
            <p className="epm-services__foot" data-reveal>
              Every strategy is tailored to your business goals, audience, and growth stage to ensure maximum performance.
            </p>
          </div>
        </section>

        {/* ============ SECTION 5 — WHY YOU NEED IT (funnel pillars) ============ */}
        {/* Vertical sticky scroll-stack: heading pins on the left while the five
            pillar cards scroll through one-by-one on the right. */}
        <section className="epm-why">
          <div className="container epm-why__inner">
            <div className="epm-why__aside">
              <div className="epm-why__head" data-reveal>
                <div className="section-label">The Full-Funnel Advantage</div>
                <h2 className="epm-section-title">
                  Why Your Ecommerce Business Needs<br />
                  <span className="epm-grad">Performance Marketing Services</span>
                </h2>
                <p className="epm-section-sub">
                  Our integrated marketing approach ensures every stage of your customer journey is optimized for
                  better performance.
                </p>
                <div className="epm-why__progress" aria-hidden="true">
                  {whyPillars.map((p, i) => (
                    <span
                      key={p.title}
                      className={`epm-why__dot ${i === activePillar ? 'is-active' : ''}`}
                    />
                  ))}
                </div>
                <p className="epm-why__foot">
                  At Curious Apes, we combine strategy, creativity, and technology to help eCommerce brands grow faster,
                  spend smarter, and achieve long-term success.
                </p>
              </div>
            </div>

            <div className="epm-why__stack">
              {whyPillars.map((p, i) => (
                <article
                  className="epm-why__card"
                  key={p.title}
                  ref={(el) => { pillarRefs.current[i] = el }}
                >
                  <div className="epm-why__media">
                    <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                    <span className="epm-why__badge">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="epm-why__body">
                    <h3 className="epm-why__title">{p.title}</h3>
                    <p className="epm-why__desc">{p.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SECTION 7 — WHY CHOOSE US ============ */}
        <section className="epm-choose">
          <div className="epm-choose__orb" />
          <div className="container epm-choose__inner">
            <div className="epm-choose__copy" data-reveal>
              <div className="section-label">Why Choose Curious Apes</div>
              <h2 className="epm-section-title">
                Why Choose Curious Apes for<br />
                <span className="epm-grad">Ecommerce Performance Marketing?</span>
              </h2>
              <p className="epm-section-sub">
                Growing an online business requires more than traffic — it requires the right strategy to convert
                visitors into loyal customers.
              </p>
              <p className="epm-choose__note">
                We don't just generate clicks — we help your business achieve sustainable growth and measurable revenue.
              </p>
            </div>
            <ul className="epm-choose__list">
              {whyChoosePoints.map((pt, i) => (
                <li className="epm-choose__item" key={pt} data-reveal style={{ transitionDelay: `${i * 40}ms` }}>
                  <span className="epm-check">{checkIcon}</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ SECTION 8 — INDUSTRIES ============ */}
        <section className="epm-industries">
          <div className="container">
            <div className="epm-industries__head" data-reveal>
              <div className="section-label">Industries We Serve</div>
              <h2 className="epm-section-title">
                Performance Marketing Solutions for<br />
                <span className="epm-grad">Every E-Commerce Industry</span>
              </h2>
              <p className="epm-section-sub">
                Every industry has different customers, buying journeys, and marketing challenges. Our team creates
                customized performance marketing strategies that drive measurable growth across multiple sectors.
              </p>
            </div>
            <div className="epm-tag-grid">
              {industries.map((ind, i) => (
                <span className="epm-tag" key={ind} data-reveal style={{ transitionDelay: `${i * 25}ms` }}>{ind}</span>
              ))}
            </div>
            <p className="epm-industries__foot" data-reveal>
              No matter your industry, we build campaigns that attract the right audience and turn visitors into loyal customers.
            </p>
          </div>
        </section>

        {/* ============ SECTION 9 — MARKETPLACES ============ */}
        <section className="epm-market">
          <div className="epm-market__orb" />
          <div className="container">
            <div className="epm-market__head" data-reveal>
              <div className="section-label">Sell Where Your Customers Shop</div>
              <h2 className="epm-section-title">
                Boost Your Presence Across<br />
                <span className="epm-grad">Every Marketplace</span>
              </h2>
              <p className="epm-section-sub">
                Expand your reach and increase sales across leading marketplaces with our marketplace management services.
              </p>
            </div>
            <div className="epm-tag-grid epm-tag-grid--market">
              {marketplaces.map((m, i) => (
                <span className="epm-tag epm-tag--market" key={m} data-reveal style={{ transitionDelay: `${i * 25}ms` }}>{m}</span>
              ))}
            </div>
            <p className="epm-market__foot" data-reveal>
              From product listings to advertising campaigns, we help you maximize visibility and conversions across every platform.
            </p>
          </div>
        </section>

        {/* ============ SECTION 10 — PROCESS ============ */}
        <section className="epm-process">
          <div className="container">
            <div className="epm-process__head" data-reveal>
              <div className="section-label">Our Performance Marketing Process</div>
              <h2 className="epm-section-title">
                A Data-Driven Approach to<br />
                <span className="epm-grad">Sustainable Growth</span>
              </h2>
            </div>
            <div className="epm-process__grid">
              {processSteps.map((step, i) => (
                <div className="epm-step" key={step.n} data-reveal style={{ transitionDelay: `${i * 50}ms` }}>
                  <span className="epm-step__n">{step.n}</span>
                  <h3 className="epm-step__title">{step.title}</h3>
                  <p className="epm-step__desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SECTION 11 — TOOLS ============ */}
        <section className="epm-tools">
          <div className="epm-tools__orb" />
          <div className="container">
            <div className="epm-tools__head" data-reveal>
              <div className="section-label">Marketing Tools & Platforms We Use</div>
              <h2 className="epm-section-title">
                Powered by<br /><span className="epm-grad">Industry-Leading Tools</span>
              </h2>
              <p className="epm-section-sub">
                We use trusted marketing and analytics platforms to plan, execute, and optimize every campaign.
              </p>
            </div>
            <div className="epm-tools__grid">
              {toolGroups.map((tg, i) => (
                <div className="epm-tool-card" key={tg.group} data-reveal style={{ transitionDelay: `${i * 50}ms` }}>
                  <h3 className="epm-tool-card__title">{tg.group}</h3>
                  <ul className="epm-tool-card__list">
                    {tg.items.map((it) => (
                      <li key={it}><span className="epm-dot" />{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="epm-tools__foot" data-reveal>
              Using the right tools helps us make informed decisions, improve campaign performance, and deliver measurable results.
            </p>
          </div>
        </section>

        {/* ============ SECTION 12 — SUCCESS STORIES ============ */}
        <section className="epm-success">
          <div className="container">
            <div className="epm-success__head" data-reveal>
              <div className="section-label">Success Stories</div>
              <h2 className="epm-section-title">Real Growth. <span className="epm-grad">Real Results.</span></h2>
              <p className="epm-section-sub">
                We believe every campaign should deliver measurable business outcomes. Here are a few examples of what
                we've helped brands achieve.
              </p>
            </div>
            <div className="epm-success__grid">
              {successStories.map((s, i) => (
                <div className="epm-case" key={s.brand} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
                  <span className="epm-case__spark" />
                  <h3 className="epm-case__brand">{s.brand}</h3>
                  <ul className="epm-case__stats">
                    {s.stats.map((st) => (
                      <li key={st}>{st}</li>
                    ))}
                  </ul>
                  <button className="epm-case__link" onClick={openPopup}>
                    View Case Study {arrowIcon}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SECTION 13 — CERTIFICATIONS ============ */}
        <section className="epm-certs">
          <div className="epm-certs__orb" />
          <div className="container">
            <div className="epm-certs__head" data-reveal>
              <div className="section-label">Certifications & Industry Recognition</div>
              <h2 className="epm-section-title">Trusted Expertise <span className="epm-grad">You Can Rely On</span></h2>
              <p className="epm-section-sub">
                Our team follows industry best practices and works with leading digital marketing platforms.
              </p>
            </div>
            <div className="epm-tag-grid">
              {certifications.map((c, i) => (
                <span className="epm-tag epm-tag--cert" key={c} data-reveal style={{ transitionDelay: `${i * 30}ms` }}>
                  <span className="epm-check epm-check--sm">{checkIcon}</span>{c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SECTION 14 — TESTIMONIALS ============ */}
        <section className="epm-quotes">
          <div className="container">
            <div className="epm-quotes__head" data-reveal>
              <div className="section-label">What Our Clients Say</div>
              <h2 className="epm-section-title">Real Results. <span className="epm-grad">Real Relationships.</span></h2>
            </div>
            <div className="epm-quotes__grid">
              {testimonials.map((t, i) => (
                <figure className="epm-quote" key={i} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="epm-quote__stars" aria-label="5 out of 5 stars">
                    {'★★★★★'}
                  </div>
                  <blockquote>{t.quote}</blockquote>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SECTION 15 — RELATED SERVICES ============ */}
        <section className="epm-related">
          <div className="epm-related__orb" />
          <div className="container">
            <div className="epm-related__head" data-reveal>
              <div className="section-label">Explore Related Services</div>
              <h2 className="epm-section-title">
                Everything You Need to Grow<br />
                <span className="epm-grad">Your E-Commerce Business</span>
              </h2>
              <p className="epm-section-sub">
                Performance marketing works best when supported by the right technology, creative assets, and optimization strategies.
              </p>
            </div>
            <div className="epm-related__grid">
              {relatedServices.map((r, i) => (
                <a className="epm-related__card" href={r.href} key={r.title} data-reveal style={{ transitionDelay: `${i * 50}ms` }}>
                  <h3 className="epm-related__title">{r.title}</h3>
                  <p className="epm-related__desc">{r.desc}</p>
                  <span className="epm-related__cta">{r.cta} {arrowIcon}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SECTION 16 — FAQ ============ */}
        <section className="epm-faq">
          <div className="container epm-faq__inner">
            <aside className="epm-faq__aside">
              <div className="epm-faq__head" data-reveal>
                <div className="section-label">Frequently Asked Questions</div>
                <h2 className="epm-section-title">
                  Questions About <span className="epm-grad">Ecommerce Performance Marketing</span>
                </h2>
                <p className="epm-section-sub">
                  Still deciding if performance marketing is right for your brand? Here are the answers
                  brands ask us most — and if yours isn't here, let's talk.
                </p>
                <div className="epm-faq__cta" data-reveal>
                  <h3 className="epm-faq__cta-title">Still have questions?</h3>
                  <p className="epm-faq__cta-text">Book a free strategy call and we'll answer everything specific to your store.</p>
                  <a href="#contact" className="btn btn-primary epm-btn" onClick={(e) => { e.preventDefault(); openPopup() }}>
                    Book Free Strategy Call {arrowIcon}
                  </a>
                </div>
              </div>
            </aside>
            <div className="epm-faq__list">
              {faqs.map((f, i) => {
                const isOpen = openFaq === i
                return (
                  <div className={`epm-faq__item ${isOpen ? 'is-open' : ''}`} key={f.q} data-reveal>
                    <button
                      className="epm-faq__q"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                    >
                      <span>{f.q}</span>
                      <span className="epm-faq__icon" aria-hidden="true" />
                    </button>
                    <div className="epm-faq__a" style={{ maxHeight: isOpen ? '320px' : '0' }}>
                      <p>{f.a}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============ SECTION 17 — FINAL CTA ============ */}
        <section className="epm-final">
          <div className="epm-final__orb" />
          <div className="container epm-final__inner">
            <p className="section-label epm-final__eyebrow" data-reveal>Ready to Grow Your Ecommerce Business?</p>
            <h2 className="epm-final__heading" data-reveal>
              Let's Build a Performance Marketing Strategy<br />
              <span className="epm-grad">That Delivers Results</span>
            </h2>
            <p className="epm-final__sub" data-reveal>
              Whether you're looking to increase traffic, improve conversions, or scale your online store, our experts are ready to help.
            </p>
            <ul className="epm-final__perks" data-reveal>
              <li>{checkIcon} Free Growth Consultation</li>
              <li>{checkIcon} Performance Marketing Audit</li>
              <li>{checkIcon} Custom Growth Strategy</li>
              <li>{checkIcon} Transparent Pricing</li>
              <li>{checkIcon} Dedicated Ecommerce Experts</li>
            </ul>
            <div className="epm-final__actions" data-reveal>
              <a href="#contact" className="btn btn-primary epm-btn" onClick={(e) => { e.preventDefault(); openPopup() }}>
                Book Free Consultation {arrowIcon}
              </a>
              <a href="#contact" className="btn btn-outline epm-btn--outline" onClick={(e) => { e.preventDefault(); openPopup() }}>
                Request a Free Marketing Audit
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA onEnquiry={openPopup} />
      <ScrollToTop />
      <PopupForm open={popupOpen} onClose={closePopup} />
    </>
  )
}
