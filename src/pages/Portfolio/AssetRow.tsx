import { useState } from "react";
import type { PortfolioAsset } from "@/providers/portfolio";
import { formatBalance, capitalize } from "@/utils/formatting";
import SubassetRow from "./SubAssetRow";

export default function AssetRow({ asset }: { asset: PortfolioAsset }) {
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
                backgroundColor: asset.accent_color
              }}></div>
            </div>
          </div>
        </td>
      </tr >

      {
        asset.tokens.length > 1 &&
        asset.tokens.map((t, i) => <SubassetRow token={t} index={i} cls={subassetClass} />)
      }
    </>
  )
}
