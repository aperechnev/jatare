import './Portfolio.css'
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import PortfolioTable from "@/components/PortfolioTable"
import { fetchTokens } from '@/providers/api'
import type { Asset } from '@/types/Asset'
import { makeDebtInfo } from '@/types/DebtInfo'
import { formatBalance } from '@/utils/formatting'

export default function PortfolioPage() {
  const navigate = useNavigate()
  const params = useParams<{ address: string }>()

  const [total, setTotal] = useState(0)
  const [assetsTotal, setAssetsTotal] = useState(0)
  const [assetsCount, setAssetsCount] = useState(0)
  const [debtTotal, setDebtTotal] = useState(0)
  const [ltv, setLtv] = useState<{ value: number, hint: string, color: string }>({
    value: 0,
    hint: "",
    color: "transparent"
  })

  const [wallet, setWallet] = useState([])
  const address = params.address ?? ""

  useEffect(() => {
    async function load() {
      const tokens = await fetchTokens(address)

      tokens.forEach((t: { price: number; balance: number; value?: number }) => {
        t.value = t.price * t.balance
      })

      const total = tokens.reduce((acc: number, t: { value: number }) => acc + t.value, 0)
      setTotal(total)

      const assets = tokens.filter((t: Asset) => t.value > 0)
      setAssetsTotal(
        assets.reduce((acc: number, t: Asset) => acc + t.value, 0)
      )
      setAssetsCount(
        (new Set(assets.map((t: Asset) => t.asset))).size
      )

      const debtTotal = -1 * tokens.filter((t: Asset) => t.value < 0).reduce((acc: number, t: Asset) => acc + t.value, 0)
      setDebtTotal(debtTotal)

      setWallet(tokens)
    }

    load()
  }, [])

  useEffect(() => {
    const debtInfo = makeDebtInfo(assetsTotal, debtTotal)

    setLtv({
      value: debtInfo.percent,
      hint: debtInfo.shortDescription,
      color: debtInfo.color
    })
  }, [assetsTotal, debtTotal])

  return (
    <>
      <Helmet>
        <title>{address ? `Portfolio of ${address}` : "Loading portfolio"}</title>
      </Helmet>

      <main className="min-h-screen p-10">

        <div className="phead-wrapper">
          <div className="phead">
            <div className="plabel">Portfolio</div>
            <div className="pvalue">${formatBalance(total)}</div>
            <div className="pbreakdown">
              <span>${formatBalance(assetsTotal)}</span> assets &nbsp;·&nbsp; <span className="bad">−${formatBalance(debtTotal)}</span> debt
            </div>
          </div>
          <button className="rebal-btn" onClick={() => navigate(
            `/portfolio/${address}/rebalancing`
          )}>
            <i className="ti ti-adjustments-horizontal" aria-hidden="true" style={{ fontSize: "13px" }}></i>Rebalance
          </button>
        </div>

        <div className="metrics">
          <div className="mc">
            <div className="ml">Assets</div>
            <div className="mv">${formatBalance(assetsTotal)}</div>
            <div className="ms">{(assetsCount == 1 ? `1 position` : `${assetsCount} positions`)}</div>
          </div>
          <div className="mc">
            <div className="ml">Debt</div>
            <div className="mv"
              style={{
                color: debtTotal > 0 ? 'var(--color-assets-red)' : 'var(--color-assets-green)'
              }}
            >${formatBalance(debtTotal)}</div>
            <div className="ms">Aave Protocol</div>
          </div>
          <div className="mc">
            <div className="ml">LTV ratio</div>
            <div className="mv">{ltv.value.toFixed(2)}%</div>
            <div className="ms" style={{ color: ltv.color }}>{ltv.hint}</div>
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
