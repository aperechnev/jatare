import './Portfolio.css'
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import PortfolioTable from "@/components/PortfolioTable"
import { getWallet } from "@/api/portfolioApi"
import type { Asset } from '@/types/Asset'

export default function PortfolioPage() {
  const params = useParams<{ address: string }>()

  const [total, setTotal] = useState(0)
  const [assetsTotal, setAssetsTotal] = useState(0)
  const [assetsCount, setAssetsCount] = useState(0)
  const [debtTotal, setDebtTotal] = useState(0)

  const [wallet, setWallet] = useState([])
  const address = params.address ?? ""

  useEffect(() => {
    async function load() {
      const tokens = await getWallet(address)

      tokens.forEach((t: { price: number; balance: number; value?: number }) => {
        t.value = t.price * t.balance
      })

      const total = tokens.reduce((acc: number, t: { value: number }) => acc + t.value, 0)
      setTotal(total)

      const assets = tokens.filter(t => t.value > 0)
      setAssetsTotal(
        assets.reduce((acc: number, t: Asset) => acc + t.value, 0)
      )
      setAssetsCount(
        (new Set(assets.map(t => t.asset))).size
      )

      const debtTotal = -1 * tokens.filter(t => t.value < 0).reduce((acc, t) => acc + t.value, 0)
      setDebtTotal(debtTotal)

      setWallet(tokens)
    }

    load()
  }, [])

  return (
    <>
      <Helmet>
        <title>
          {address
            ? `Portfolio of ${address}`
            : "Loading portfolio"}
        </title>
      </Helmet>

      <main className="min-h-screen p-10">

        <div className="phead">
          <div>
            <div className="plabel">Portfolio</div>
            <div className="pvalue">${total.toFixed(2)}</div>
            <div className="pbreakdown">
              <span>${assetsTotal.toFixed(2)}</span> assets &nbsp;·&nbsp; <span className="bad">−${debtTotal.toFixed(2)}</span> debt
            </div>
          </div>
          <button className="rebal-btn">
            <i className="ti ti-adjustments-horizontal" aria-hidden="true" style={{ fontSize: "13px" }}></i>Rebalance
          </button>
        </div>

        <div className="metrics">
          <div className="mc">
            <div className="ml">Assets</div>
            <div className="mv">${assetsTotal.toFixed(2)}</div>
            <div className="ms">{(assetsCount == 1 ? `1 position` : `${assetsCount} positions`)}</div>
          </div>
          <div className="mc">
            <div className="ml">Debt</div>
            <div className="mv bad">${debtTotal.toFixed(2)}</div>
            <div className="ms">Unknown protocol</div>
          </div>
          <div className="mc">
            <div className="ml">LTV ratio</div>
            <div className="mv">{((debtTotal / assetsTotal) * 100).toFixed(2)}%</div>
            <div className="ms">Unknown risk</div>
          </div>
          <div className="mc">
            <div className="ml">24h change</div>
            <div className="mv ok">+$0.00</div>
            <div className="ms ok">+0.00%</div>
          </div>
        </div>

        <PortfolioTable wallet={wallet} />

      </main>
    </>
  )
}
