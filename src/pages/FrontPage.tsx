import './FrontPage.css'

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"

export default function FrontPage() {
  const [address, setAddress] = useState("")
  const navigate = useNavigate()

  function handleAnalyse() {
    if (!address) return
    navigate(`/portfolio/${address}`)
  }

  return (
    <>
      <Helmet>
        <title>Jatare | Your DeFi portfolio tracker</title>
      </Helmet>

      <div className="min-h-[calc(100vh-42vh)] flex flex-col items-center justify-center">

        <div className="hero">
          <div className="hero-tag"><span></span> Live on-chain data · 12 networks</div>
          <h1>Your <em>DeFi portfolio</em>,<br />clearly understood</h1>
          <p className="subtitle">Track assets, debt, and allocation across every wallet. Set rebalancing targets and know exactly what to buy or sell.</p>

          <div className="search-box">
            <i className="ti ti-search" aria-hidden="true"></i>
            <input type="text"
              placeholder="Wallet address or ENS name (e.g. vitalik.eth)"
              value={address}
              onChange={(e) => setAddress(e.target.value)} />
            <button className="search-btn" onClick={handleAnalyse}>Analyse</button>
          </div>

          <div className="recent">
            <span>Recent:</span>
            <span className="recent-chip">0xFca8…Fe6</span>
            <span className="recent-chip">vitalik.eth</span>
            <span className="recent-chip">0xd8dA…6045</span>
          </div>
        </div>

        <div className="features">
          <div className="feat">
            <div className="feat-icon" style={{ background: "#ecf0fe" }}>
              <i className="ti ti-chart-donut" aria-hidden="true" style={{ color: "#534AB7" }}></i>
            </div>
            <div className="feat-title">Portfolio breakdown</div>
            <div className="feat-desc">See every asset, protocol position, and debt in one place — with live USD values.</div>
          </div>
          <div className="feat">
            <div className="feat-icon" style={{ background: "#e1f5ee" }}>
              <i className="ti ti-adjustments-horizontal" aria-hidden="true" style={{ color: "#0f6e56" }}></i>
            </div>
            <div className="feat-title">Rebalancing targets</div>
            <div className="feat-desc">Set your ideal allocation per asset and see exactly what trades will bring you back on track.</div>
          </div>
          <div className="feat">
            <div className="feat-icon" style={{ background: "#faeeda" }}>
              <i className="ti ti-shield-check" aria-hidden="true" style={{ color: "#854F0B" }}></i>
            </div>
            <div className="feat-title">Risk monitoring</div>
            <div className="feat-desc">Track your LTV ratio across Aave and other lending protocols so you stay safe from liquidation.</div>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat">
            <div className="stat-val">$2.4B+</div>
            <div className="stat-lbl">Portfolio value tracked</div>
          </div>
          <div className="stat">
            <div className="stat-val">140K+</div>
            <div className="stat-lbl">Wallets analysed</div>
          </div>
          <div className="stat">
            <div className="stat-val">12</div>
            <div className="stat-lbl">Networks supported</div>
          </div>
        </div>
      </div>
    </>
  )
}