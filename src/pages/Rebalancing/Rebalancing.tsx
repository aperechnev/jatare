import './Rebalancing.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import RebalancingRow from './RebalancingRow'
import TradeRow from './TradeRow'
import { portfolioProvider, defaultPortfolio } from '@/providers/portfolio'
import type { Portfolio, PortfolioAsset } from '@/providers/portfolio'

export default function RebalancingPage() {
  const navigate = useNavigate()
  const params = useParams<{ address: string }>()
  const address = params.address ?? ""
  const [portfolio, setPortfolio] = useState<Portfolio>(defaultPortfolio)

  const [targetList, setTargetList] = useState<Record<string, number>>(
    Object.fromEntries(
      portfolio.assetList.map(a => [a.symbol, 0])
    )
  )
  const [targetsSummary, setTargetsSummary] = useState(0)

  useEffect(() => {
    async function load() {
      const portfolio = await portfolioProvider(address)
      setPortfolio(portfolio)
    }

    load()
  }, [])

  useEffect(() => {
    setTargetsSummary(
      Object.values(targetList)
        .reduce((sum, value) => sum + value, 0)
    )
  }, [targetList])

  return (
    <main className="min-h-screen p-10">
      <div
        className="back"
        onClick={() => navigate(`/portfolio/${address}`)}
      >
        <i className="ti ti-arrow-left" aria-hidden="true"></i> Back to portfolio
      </div>

      <div className="phead-wrapper">
        <div className="phead">
          <div className="plabel">Portfolio settings</div>
          <div className="ptitle">Rebalancing targets</div>
          <div className="psub">Drag to set your target allocation. Trades update automatically.</div>
        </div>
      </div>

      <div
        id="warnBox"
        className="warn"
        style={{
          display: (targetsSummary == 100 ? 'none' : '')
        }}
      >
        Allocations total <span id="warnSum">{targetsSummary}</span>% — adjust to reach 100%
      </div>

      <div id="rows">
        {portfolio.assetList.map((a: PortfolioAsset) => (
          <RebalancingRow
            total={portfolio.assetsTotal}
            asset={a}
            onTargetChange={t => {
              setTargetList(prev => ({
                ...prev,
                [a.symbol]: t
              }))
            }}
          />
        ))}
      </div>

      <div className="summary">
        <div className="sum-hd">
          <span className="sum-title">Trade summary</span>
          <span className="sum-total">Total: <strong id="totalPct">{targetsSummary.toFixed(1)}%</strong></span>
        </div>
        <table>
          <thead><tr>
            <th style={{ width: "26%", textAlign: "left" }}>Asset</th>
            <th style={{ width: "16%" }}>Current</th>
            <th style={{ width: "16%" }}>Target</th>
            <th style={{ width: "16%" }}>Diff</th>
            <th style={{ width: "26%" }}>Action</th>
          </tr></thead>
          <tbody id="tbl">
            {portfolio.assetList.map((a: PortfolioAsset) => (
              <TradeRow
                asset={a}
                target={targetList[a.symbol] ?? 0}
                total={portfolio.assetsTotal}
              />
            ))}
          </tbody>
        </table>
      </div>

    </main>
  )
}
