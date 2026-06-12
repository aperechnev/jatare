import type { PortfolioAsset } from "@/providers/portfolio"
import { formatBalance } from "@/utils/formatting"

export default function TradeRow(
  { asset, target, total }: {
    asset: PortfolioAsset,
    target: number,
    total: number
  }
) {
  const delta = asset.percentage - target
  var diffClass = ""
  var action = ""
  var actionClass = ""

  if (delta > 0)
    diffClass = "ok"
  else if (delta < 0)
    diffClass = "sell"

  const valueDelta: string = formatBalance(
    Math.abs(
      asset.value - (total / 100) * target
    )
  )

  if (delta > 0.5) {
    action = `Sell $${valueDelta}`
    actionClass = "sell"
  } else if (delta < -0.5) {
    action = `Buy $${valueDelta}`
    actionClass = "buy"
  } else {
    action = "—"
  }

  return (
    <tr>
      <td style={{ fontWeight: 500 }}>{asset.asset}</td>
      <td>{asset.percentage.toFixed(2)}%</td>
      <td>{target.toFixed(1)}%</td>
      <td className={diffClass}>
        {delta > 0 ? '+' : ''}
        {delta.toFixed(2)}%
      </td>
      <td className={actionClass}>{action}</td>
    </tr>
  )
}
