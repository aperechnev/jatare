import "./PortfolioTable.css"
import { useEffect, useState } from "react";
import type { Asset } from "@/types/Asset"
import type { DebtInfo } from "@/types/DebtInfo";
import { makeDebtInfo } from "@/types/DebtInfo";

function formatBalance(balance: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);
}

function groupTokens(tokens: Asset[]): Asset[] {
  const groupedAssets: Asset[] = []

  tokens.forEach((t: Asset) => {
    const existing = groupedAssets.find((a: { asset: string }) => a.asset === t.asset)
    if (existing) {
      existing.value += t.value
      existing.balance += t.balance
      existing.percentage += t.percentage
      existing.tokens.push(t)
    } else {
      const newAsset = { ...t }
      newAsset.tokens = [t]
      groupedAssets.push(newAsset)
    }
  })

  return groupedAssets
}

function makeSubassetRow(token: Asset, index: number, cls: string) {
  return (
    <tr
      className={`sub-row ${cls}`}
      style={{ display: "none" }}
    >
      <td>
        <div className="tc">
          <div className="sub-label">{token.symbol}</div>
        </div>
      </td>
      <td className="muted" style={{ fontSize: "12px" }}>
        ${formatBalance(token.price)}
      </td>
      <td className="muted font-mono" style={{ fontSize: "12px" }}>
        {Number(token.balance).toLocaleString(undefined, {
          maximumFractionDigits: token.decimals
        })}
      </td>
      <td style={{ fontSize: "12px" }}>${formatBalance(token.value)}</td>
      <td>
        <div className="bw">
          <span className="muted" style={{ fontSize: "11px" }}>{token.percentage.toFixed(2)}%</span>
          <div className="bt">
            <div className="bf" style={{
              width: `${token.percentage}%`,
              background: token.isDebt ? 'var(--color-assets-red)' : 'var(--color-assets-green)',
              opacity: .5
            }}></div>
          </div>
        </div>
      </td>
    </tr>
  )
}

function AssetRow({ asset }: { asset: Asset }) {
  const [subassetsOpened, setSubassetsOpened] = useState(false)

  const hasSubassets = asset.tokens.length > 1
  const subassetClass = `subasset-${asset.asset.toLowerCase().replaceAll(" ", "_")}`

  const toggleRows = (cls: string) => {
    document
      .querySelectorAll(`.${cls}`)
      .forEach((el) => {
        const htmlEl = el as HTMLElement;

        htmlEl.style.display =
          htmlEl.style.display === 'none'
            ? 'table-row'
            : 'none';
      });

    setSubassetsOpened(!subassetsOpened)
  };

  return (
    <>
      <tr
        style={(hasSubassets ? { cursor: "pointer" } : {})}
        onClick={() => {
          toggleRows(subassetClass)
        }}
      >
        <td>
          <div className="tc">
            <div className="ti2">
              <img
                src={asset.icon}
                alt={asset.name}
                className="w-8 h-8"
              />
            </div>
            <div>
              <div className="tn">{asset.asset}</div>
              <div className="ts2">
                {hasSubassets ? `${asset.tokens.length} positions` : asset.tokens[0].symbol}
              </div>
            </div>
            {hasSubassets && (
              <button className="expand-btn" id="ethBtn" aria-label="Expand {asset.asset} positions">
                <i
                  className={`ti ti-chevron-${subassetsOpened ? 'up' : 'down'}`}
                  aria-hidden="true"></i>
              </button>
            )}
          </div>
        </td>
        <td className="muted">{hasSubassets ? "—" : ("$" + formatBalance(asset.price))}</td>
        <td className="muted font-mono">
          {Number(asset.balance).toLocaleString(undefined, {
            maximumFractionDigits: asset.decimals
          })}
        </td>
        <td>
          ${formatBalance(asset.value)}
        </td>
        <td>
          <div className="bw">
            <span className="muted">{asset.percentage.toFixed(2)}%</span>
            <div className="bt">
              <div className="bf" style={{
                width: `${asset.percentage}%`,
                backgroundColor: asset.isDebt ? 'var(--color-assets-red)' : 'var(--color-assets-green)'
              }}></div>
            </div>
          </div>
        </td>
      </tr >

      {
        asset.tokens.length > 1 &&
        asset.tokens.map((t, i) => makeSubassetRow(t, i, subassetClass))
      }
    </>
  )
}

function PortfolioTable({ wallet }: { wallet: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [debts, setDebts] = useState<Asset[]>([])
  const [assetsTotal, setAssetsTotal] = useState<number>(0)
  const [debtTotal, setDebtTotal] = useState<number>(0)
  const [debtInfo, setDebtInfo] = useState<DebtInfo>()

  useEffect(() => {
    if (!wallet.length) return

    const sorted = [...wallet].sort((a, b) => b.value - a.value)

    const assetsList = sorted.filter(t => t.value > 0)

    const assetsTotal = assetsList.reduce((acc, t) => acc + t.value, 0)
    setAssetsTotal(assetsTotal)

    const assetsWithPercent = assetsList.map(t => ({
      ...t,
      percentage: (t.value / assetsTotal) * 100
    }))

    setAssets(groupTokens(assetsWithPercent))

    const debtList = sorted
      .filter(t => t.value < 0)
      .map(t => ({
        ...t,
        price: -t.price,
        value: -t.value,
        isDebt: true,
      }))

    const debtTotal = debtList.reduce((acc, t) => acc + t.value, 0)
    setDebtTotal(debtTotal)

    const debtWithPercent = debtList.map(t => ({
      ...t,
      percentage: (t.value / debtTotal) * 100
    }))

    setDebts(groupTokens(debtWithPercent))
  }, [wallet])

  useEffect(() => {
    setDebtInfo(makeDebtInfo(assetsTotal, debtTotal))
  }, [assetsTotal, debtTotal])

  return (
    <>
      <div className="grid2">
        <div>
          <table>
            <thead>
              <tr>
                <th style={{ width: "18%", textAlign: "left" }}>Token</th>
                <th style={{ width: "20%" }}>Price</th>
                <th style={{ width: "27%" }}>Amount</th>
                <th style={{ width: "15%" }}>Value</th>
                <th style={{ width: "20%" }}>Allocation</th>
              </tr>
            </thead>
            <tbody id="assetBody">
              {assets.map((t, i) => <AssetRow asset={t} />)}
            </tbody>
          </table>

          <div className="sec">
            <span>Debt ${debtTotal.toFixed(2)}</span>
            <span>·</span>
            <span>LTV {debtInfo?.percent.toFixed(2) ?? 0}%</span>
            <span className="dbadge">{debtInfo?.label ?? "Unknown"}</span>
          </div>
          <table style={{ marginTop: "6px" }}>
            <thead>
              <tr>
                <th style={{ width: "18%", textAlign: "left" }}></th>
                <th style={{ width: "20%" }}></th>
                <th style={{ width: "27%" }}></th>
                <th style={{ width: "15%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            </thead>
            <tbody>
              {debts.map((t, i) => (<AssetRow asset={t} />))}
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

export default PortfolioTable
