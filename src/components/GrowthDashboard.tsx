import './GrowthDashboard.css'

const BARS = [30, 38, 32, 46, 40, 52, 58, 50, 68, 72, 70, 84]

export default function GrowthDashboard() {
  // Polyline points based on the top of each bar — used for the trend line overlay
  const linePoints = BARS.map((h, i) => {
    const x = ((i + 0.5) / BARS.length) * 100
    const y = 100 - h
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="growth-dash">
      <div className="growth-dash__panel">
        {/* Header */}
        <div className="growth-dash__header">
          <div>
            <span className="growth-dash__title">Performance Dashboard</span>
            <span className="growth-dash__sub">D2C Growth · Last 30 days</span>
          </div>
          <div className="growth-dash__live">
            <span className="growth-dash__live-dot" />
            LIVE
          </div>
        </div>

        {/* KPI tiles */}
        <div className="growth-dash__kpis">
          <div className="growth-dash__kpi">
            <span className="growth-dash__kpi-label">ROAS</span>
            <div className="growth-dash__kpi-row">
              <span className="growth-dash__kpi-value">4.2×</span>
              <span className="growth-dash__kpi-delta">↑ 12%</span>
            </div>
          </div>
          <div className="growth-dash__kpi">
            <span className="growth-dash__kpi-label">Conv Rate</span>
            <div className="growth-dash__kpi-row">
              <span className="growth-dash__kpi-value">3.8%</span>
              <span className="growth-dash__kpi-delta">↑ 8%</span>
            </div>
          </div>
        </div>

        {/* Chart — bars (DOM) + trend line (SVG overlay) */}
        <div className="growth-dash__chart">
          <div className="growth-dash__grid" aria-hidden="true">
            <span /><span /><span /><span />
          </div>

          <div className="growth-dash__bars">
            {BARS.map((h, i) => (
              <div
                key={i}
                className="growth-dash__bar"
                style={{
                  height: `${h}%`,
                  animationDelay: `${0.2 + i * 0.05}s`,
                }}
              />
            ))}
          </div>

          <svg
            className="growth-dash__line-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="trendGrad" x1="0" x2="100%" y1="0" y2="0">
                <stop offset="0%" stopColor="#00c4d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="1" />
              </linearGradient>
            </defs>
            <polyline
              points={linePoints}
              className="growth-dash__line"
              fill="none"
              stroke="url(#trendGrad)"
            />
          </svg>
        </div>

        {/* Footer */}
        <div className="growth-dash__footer">
          <span className="growth-dash__footer-label">Revenue scaled</span>
          <span className="growth-dash__footer-value">↑ +47% this quarter</span>
        </div>
      </div>
    </div>
  )
}
