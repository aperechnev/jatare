import "./PortfolioTable.css"
import { useEffect, useState } from "react";
import type { Asset } from "@/types/Asset"
import type { DebtInfo } from "@/types/DebtInfo";
import { makeDebtInfo } from "@/types/DebtInfo";
import { formatBalance, capitalize } from "@/utils/formatting";
import groupTokens from "@/utils/grouping";

type AssetList = {
  items: Asset[]
  total: number
}

function makeSubassetRow(token: Asset, index: number, cls: string) {
  return (
    <tr
      className={`sub-row sub-row-hidden ${cls}`}
    >
      <td>
        <div className="tc">
          <div className="token-wrap">
            <img src={token.icon} alt={`${token.name} token icon`} className="sub-tok-icon w-8 h-8" />
            <img src={`https://cdn.jatare.xyz/chains/${token.chain}.svg`} alt={`${token.chain} chain icon`} className="sub-chain-icon" />
          </div>
          <div>
            <div className="tn">{token.name}</div>
            <div className="ts2">
              {token.symbol} · {capitalize(token.chain)}
              {/* <button className="copy-btn" title="Copy contract address"><i class="ti ti-copy"></i></button> */}
            </div>
          </div>
        </div>
      </td>
      <td className="muted">
        ${formatBalance(token.price)}
      </td>
      <td className="muted font-mono">
        {Number(token.balance).toLocaleString(undefined, {
          maximumFractionDigits: Math.min(token.decimals, 7)
        })}
      </td>
      <td>${formatBalance(token.value)}</td>
      <td>
        <div className="bw">
          <span className="muted">{token.percentage.toFixed(2)}%</span>
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

        if (htmlEl.classList.contains("sub-row-hidden")) {
          htmlEl.classList.remove("sub-row-hidden")
        } else {
          htmlEl.classList.add("sub-row-hidden")
        }
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
            <div className="token-wrap">
              <img
                src={asset.icon}
                alt={`${asset.name} token icon`}
                className="tok-icon"
              />
              {hasSubassets ? '' : <img src={`https://cdn.jatare.xyz/chains/${asset.chain}.svg`} alt={`${asset.chain} chain icon`} className="chain-icon" />}
            </div>
            <div>
              <div className="tn">{asset.asset}</div>
              <div className="ts2">
                {hasSubassets ? `${asset.tokens.length} tokens` : `${asset.tokens[0].symbol} · ${capitalize(asset.chain)}`}
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
            maximumFractionDigits: Math.min(asset.decimals, 7)
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
  const [assets, setAssets] = useState<AssetList>({ items: [], total: 0})
  const [debts, setDebts] = useState<AssetList>({ items: [], total: 0})

  const [debtInfo, setDebtInfo] = useState<DebtInfo>()

  useEffect(() => {
    if (!wallet.length) return

    const sorted = [...wallet].sort((a, b) => b.value - a.value)

    // Set assets

    const assetsList = sorted.filter(t => t.value > 0)

    const assetsTotal = assetsList.reduce((acc, t) => acc + t.value, 0)

    const assetsWithPercent = assetsList.map(t => ({
      ...t,
      percentage: (t.value / assetsTotal) * 100
    }))

    setAssets({
      items: groupTokens(assetsWithPercent),
      total: assetsTotal
    })

    // Set debts

    const debtList = sorted
      .filter(t => t.value < 0)
      .map(t => ({
        ...t,
        price: -t.price,
        value: -t.value,
        isDebt: true,
      }))

    const debtTotal = debtList.reduce((acc, t) => acc + t.value, 0)

    const debtWithPercent = debtList.map(t => ({
      ...t,
      percentage: (t.value / debtTotal) * 100
    }))

    setDebts({
      items: groupTokens(debtWithPercent),
      total: debtTotal
    })
  }, [wallet])

  useEffect(() => {
    setDebtInfo(makeDebtInfo(assets.total, debts.total))
  }, [assets, debts])

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
              {assets.items.map((t, i) => <AssetRow asset={t} />)}
            </tbody>
          </table>

          <div className="sec">
            <span>Debt ${debts.total.toFixed(2)}</span>
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
              {debts.items.map((t, i) => (<AssetRow asset={t} />))}
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
