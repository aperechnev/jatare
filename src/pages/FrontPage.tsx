import './FrontPage.css'
import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { getStat } from "@/api/stat"
import SearchBox from '@/components/SearchBox/SearchBox'
import { shortenAddress } from '@/utils/formatting'

function RecentWalletLink({ wallet }: { wallet: string }) {
  const link = `/portfolio/${wallet}`
  return (
    <a className="recent-chip" href={link}>{shortenAddress(wallet)}</a>
  )
}

export default function FrontPage() {
  const [chains, setChains] = useState([])
  const [walletsCount, setWalletsCount] = useState(0)
  const [recentWallets, setRecentWallets] = useState([])

  useEffect(() => {
    async function loadStat() {
      const stat = await getStat()

      setChains(stat.chains)
      setWalletsCount(stat.wallets_count)
      setRecentWallets(stat.recent_wallets)
    }

    loadStat()
  }, [])

  return (
    <>
      <Helmet>
        <title>Jatare | Your DeFi portfolio tracker</title>
      </Helmet>

      <div className="min-h-[calc(100vh-42vh)] flex flex-col items-center justify-center">

        <div className="hero">
          <div className="hero-tag"><span></span> Live on-chain data · {chains.length} networks</div>
          <h1>Your <em>DeFi portfolio</em>,<br />clearly understood</h1>
          <p className="subtitle">Track assets, debt, and allocation across every wallet. Set rebalancing targets and know exactly what to buy or sell.</p>

          <SearchBox />

          <div className="recent">
            <span>Recent:</span>
            {recentWallets.map((w) => (<RecentWalletLink wallet={w} />))}
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
            <div className="stat-val">{walletsCount}</div>
            <div className="stat-lbl">Wallets analysed</div>
          </div>
          <div className="stat">
            <div className="stat-val">{chains.length}</div>
            <div className="stat-lbl">Networks supported</div>
          </div>
        </div>
      </div>
    </>
  )
}