import './Portfolio.css'
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import PortfolioTable from "@/pages/Portfolio/PortfolioTable"
import { makeDebtInfo } from '@/types/DebtInfo'
import { formatBalance } from '@/utils/formatting'
import type { Portfolio } from '@/providers/portfolio'
import { portfolioProvider, defaultPortfolio } from '@/providers/portfolio'
import LoaderBox from '@/components/LoaderBox/LoaderBox'
import EmptyBox from './EmptyBox'

export default function PortfolioPage() {
  const navigate = useNavigate()
  const params = useParams<{ address: string }>()
  const address = params.address ?? ""

  const [isLoading, setIsLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [portfolio, setPortfolio] = useState<Portfolio>(defaultPortfolio)

  const [ltv, setLtv] = useState<{ value: number, hint: string, color: string }>({
    value: 0,
    hint: "",
    color: "transparent"
  })

  async function load() {
    setIsLoading(true)
    const response = await portfolioProvider(address)
    setPortfolio(response)
    setIsEmpty(response.assetList.length + response.debtList.length == 0)
    setIsLoading(false)
  }

  useEffect(() => {
    load()
  }, [address])

  useEffect(() => {
    const debtInfo = makeDebtInfo(portfolio.assetsTotal, portfolio.debtTotal)

    setLtv({
      value: debtInfo.percent,
      hint: debtInfo.shortDescription,
      color: debtInfo.color
    })
  }, [portfolio])

  return (
    <>
      <Helmet>
        <title>{address ? `Portfolio of ${address}` : "Loading portfolio"}</title>
      </Helmet>

      <main className="min-h-screen p-10">

        <div className="phead-wrapper">
          <div className="phead">
            <div className="plabel">Portfolio</div>
            <div className="pvalue">
              {isLoading ? "—" : `$${formatBalance(portfolio.total)}`}
            </div>
            <div className="pbreakdown">
              {isLoading || isEmpty ? (<>&nbsp;</>) :
                <>
                  <span>${formatBalance(portfolio.assetsTotal)}</span> assets
                  &nbsp;·&nbsp;
                  <span className="bad">−${formatBalance(portfolio.debtTotal)}</span> debt
                </>
              }
            </div>
          </div>
          {
            !(isLoading || isEmpty) &&
            <button className="rebal-btn" onClick={() => navigate(
              `/portfolio/${address}/rebalancing`
            )}>
              <i className="ti ti-adjustments-horizontal" aria-hidden="true" style={{ fontSize: "13px" }}></i>Rebalance
            </button>
          }
        </div>

        <div className="metrics">

          <div className="mc">
            <div className="ml">Assets</div>
            <div className="mv">
              {isLoading ? "—" : `$${formatBalance(portfolio.assetsTotal)}`}
            </div>
            <div className="ms">
              {isLoading || isEmpty
                ? (<>&nbsp;</>) : (portfolio.assetsCount == 1 ? `1 position`
                  : `${portfolio.assetsCount} positions`)}
            </div>
          </div>

          <div className="mc">
            <div className="ml">Debt</div>
            <div className="mv"
              style={{
                color: isLoading || isEmpty ? "" : portfolio.debtTotal > 0 ? 'var(--color-assets-red)' : 'var(--color-assets-green)'
              }}
            >
              {isLoading || isEmpty ? '—' : `$${formatBalance(portfolio.debtTotal)}`}
            </div>
            <div className="ms">{isLoading || isEmpty ? (<>&nbsp;</>) : "Aave Protocol"}</div>
          </div>

          <div className="mc">
            <div className="ml">LTV ratio</div>
            <div className="mv">{isLoading || isEmpty ? "—" : `${ltv.value.toFixed(2)}%`}</div>
            <div className="ms" style={{ color: ltv.color }}>{ltv.hint}</div>
          </div>

          <div className="mc">
            <div className="ml">24h change</div>
            <div className={`mv ${!(isLoading || isEmpty) && "ok"}`}>
              {isLoading || isEmpty ? "—" : "+$0.00"}
            </div>
            <div className="ms ok">
              {isLoading || isEmpty ? (<>&nbsp;</>) : "+0.00%"}
            </div>
          </div>

        </div>

        {
          isLoading
            ? <LoaderBox
              title='Fetching portfolio…'
              description='Scanning Ethereum and 3 more networks'
            />
            : isEmpty
              ? <EmptyBox address={address} onTryAgain={load} />
              : <PortfolioTable portfolio={portfolio} />
        }

      </main>
    </>
  )
}
