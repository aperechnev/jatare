import "./PortfolioTable.css"
import { useEffect, useState } from "react";
import type { Portfolio } from "@/providers/portfolio";
import type { DebtInfo } from "@/types/DebtInfo";
import { makeDebtInfo } from "@/types/DebtInfo";
import AssetRow from "./AssetRow";

export default function PortfolioTable({ portfolio }: { portfolio: Portfolio }) {
  const [debtInfo, setDebtInfo] = useState<DebtInfo>()

  useEffect(() => {
    setDebtInfo(makeDebtInfo(portfolio.assetsTotal, portfolio.debtTotal))
  }, [portfolio])

  return (
    <>
      <div className="grid2">
        <div>
          <table>
            <thead>
              <tr>
                <th className="token">Token</th>
                <th className="price">Price</th>
                <th className="amount">Amount</th>
                <th className="value">Value</th>
                <th className="allocation">Allocation</th>
              </tr>
            </thead>
            <tbody id="assetBody">
              {portfolio.assetList.map((t, i) => <AssetRow asset={t} />)}
            </tbody>
          </table>

          <div className="sec">
            <span>Debt ${portfolio.debtTotal.toFixed(2)}</span>
            <span>·</span>
            <span>LTV {debtInfo?.percent.toFixed(2) ?? 0}%</span>
            <span className="dbadge">{debtInfo?.label ?? "Unknown"}</span>
          </div>
          <table style={{ marginTop: "6px" }}>
            <thead>
              <tr>
                <th className="token"></th>
                <th className="price"></th>
                <th className="amount"></th>
                <th className="value"></th>
                <th className="allocation"></th>
              </tr>
            </thead>
            <tbody>
              {portfolio.debtList.map((t, i) => (<AssetRow asset={t} />))}
            </tbody>
          </table>
        </div>

        {/* <div>
          <div className="alloc-title">Allocation</div>
          <div style={{ position: "relative", height: "130px", marginBottom: "14px" }}>
            <canvas
              id="dc"
              role="img"
              aria-label="Portfolio allocation: ETH 40%, BTC 39%, USDC 10%, XAUT 10%"
              width="180"
              height="130"
              style={{ display: "block", boxSizing: "border-box", height: "130px", width: "180px" }}>
              ETH 40%, BTC 39%, USDC 10%, XAUT 10%
            </canvas>
          </div>
          {assets.map((t, i) => {
            return (
              <div className="leg">
                <div className="ld" style={{ background: "#534AB7" }}>
                </div>{t.asset}<span className="lp">${t.percentage.toFixed(2)}%</span>
              </div>
            )
          })}
        </div> */}
      </div >
    </>
  )
}
