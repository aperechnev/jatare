import type { PortfolioAsset } from "@/providers/portfolio"
import { capitalize, formatBalance } from "@/utils/formatting"

export default function SubassetRow({token, index, cls} : {token: PortfolioAsset, index: number, cls: string}) {
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
