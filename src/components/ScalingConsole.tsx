import { useEffect, useRef, useState } from 'react'
import './ScalingConsole.css'

/**
 * "Before Curious Apes / After Curious Apes" console.
 *
 * The single most relatable thing to a D2C founder is watching their own
 * dashboard go from bleeding to profitable. This component toggles between a
 * BEFORE state (red, CAC up, ROAS down, flat revenue) and an AFTER state
 * (green, scaling) on a slow loop — so the value prop is *shown*, not claimed.
 *
 * Everything animates via transform/opacity only, on a promoted layer, so it
 * costs nothing on scroll. The loop pauses when off-screen.
 */

type Metric = {
  label: string
  before: string
  after: string
  beforeDelta: string
  afterDelta: string
}

const METRICS: Metric[] = [
  { label: 'ROAS',      before: '1.4×',   after: '4.6×',    beforeDelta: '↓ 38%', afterDelta: '↑ 228%' },
  { label: 'CAC',       before: '₹1,240', after: '₹410',    beforeDelta: '↑ 61%', afterDelta: '↓ 67%' },
  { label: 'Conv. Rate',before: '0.9%',   after: '3.8%',    beforeDelta: '↓ 12%', afterDelta: '↑ 322%' },
  { label: 'Revenue/mo',before: '₹6.2L',  after: '₹41L',    beforeDelta: 'flat',  afterDelta: '↑ 561%' },
]

// Bar heights for the revenue chart in each state
const BEFORE_BARS = [34, 30, 36, 31, 29, 34, 30, 33, 28, 32, 30, 29]
const AFTER_BARS  = [22, 28, 26, 38, 42, 40, 55, 62, 58, 74, 82, 96]

export default function ScalingConsole() {
  const [scaled, setScaled] = useState(false)
  const [inView, setInView] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Only run the loop while the console is actually on screen.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setScaled(true); return }
    // Sit longer on the "after" state — that's the one worth looking at.
    const delay = scaled ? 4200 : 2600
    const t = setTimeout(() => setScaled((s) => !s), delay)
    return () => clearTimeout(t)
  }, [scaled, inView])

  const bars = scaled ? AFTER_BARS : BEFORE_BARS

  return (
    <div
      ref={rootRef}
      className={`scon${scaled ? ' scon--scaled' : ''}`}
      aria-label="Before and after growth metrics"
    >
      <div className="scon__panel">
        {/* ---- Header: the toggle that tells the whole story ---- */}
        <div className="scon__head">
          <div className="scon__head-left">
            <span className="scon__brand">
              <span className="scon__brand-dot" />
              {scaled ? 'With Curious Apes' : 'Before Curious Apes'}
            </span>
            <span className="scon__sub">Live account view · last 90 days</span>
          </div>
          <div className="scon__state">
            <span className="scon__state-pill scon__state-pill--bad">Bleeding</span>
            <span className="scon__state-pill scon__state-pill--good">Scaling</span>
          </div>
        </div>

        {/* ---- Metric grid ---- */}
        <div className="scon__metrics">
          {METRICS.map((m) => (
            <div className="scon__metric" key={m.label}>
              <span className="scon__metric-label">{m.label}</span>
              <div className="scon__metric-flip">
                <span className="scon__metric-val scon__metric-val--before">{m.before}</span>
                <span className="scon__metric-val scon__metric-val--after">{m.after}</span>
              </div>
              <div className="scon__metric-flip scon__metric-flip--delta">
                <span className="scon__delta scon__delta--before">{m.beforeDelta}</span>
                <span className="scon__delta scon__delta--after">{m.afterDelta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ---- Revenue chart ---- */}
        <div className="scon__chart">
          <div className="scon__chart-head">
            <span className="scon__chart-title">Monthly revenue</span>
            <span className="scon__chart-value">
              {scaled ? '₹41,00,000' : '₹6,20,000'}
            </span>
          </div>
          <div className="scon__bars">
            {bars.map((h, i) => (
              <span
                key={i}
                className="scon__bar"
                style={{
                  height: `${h}%`,
                  transitionDelay: `${i * 38}ms`,
                }}
              />
            ))}
          </div>
          <div className="scon__baseline" />
        </div>

        {/* ---- Footer ticker ---- */}
        <div className="scon__foot">
          <span className="scon__foot-dot" />
          <span className="scon__foot-text">
            {scaled
              ? 'Profitable at scale — 6 months in'
              : 'Spending more, earning less'}
          </span>
        </div>
      </div>
    </div>
  )
}
