import './Rebalancing.css'
import RangeBar from '@/components/RangeBar/RangeBar'
import type { Asset } from '@/types/Asset'
import { formatBalance } from '@/utils/formatting'
import { useEffect, useState } from 'react'

export default function RebalancingRow(
  { total, asset, onTargetChange }: {
    total: number,
    asset: Asset,
    onTargetChange: (percentage: number) => void
  }
) {
  const targetKey = `${asset.symbol}-target`

  const [target, setTarget] = useState<number>(
    Number(
      localStorage.getItem(targetKey) ?? "50"
    )
  )
  const [targetDelta, setTargetDelta] = useState<number>(
    asset.percentage - target
  )
  const [deltaClass, setDeltaClass] = useState<string>("")
  const [hint, setHint] = useState<string>("")
  const [hintClass, setHintClass] = useState<string>("")

  useEffect(() => {
    localStorage.setItem(targetKey, target.toFixed(2))
    onTargetChange(target)
    setTargetDelta(asset.percentage - target)
  }, [target])

  useEffect(() => {
    const valueDelta: string = formatBalance(
      Math.abs(
        asset.value - (total / 100) * target
      )
    )

    if (targetDelta > 0.5) {
      setDeltaClass("delta-over")
      setHint(`Sell $${valueDelta} to reach target`)
      setHintClass("sell")
    } else if (targetDelta < -0.5) {
      setDeltaClass("delta-under")
      setHint(`Buy $${valueDelta} to reach target`)
      setHintClass("buy")
    } else {
      setDeltaClass("delta-ok")
      setHint("No trade needed")
      setHintClass("")
    }
  }, [targetDelta])

  return (
    <div className="asset-row">
      <div className="ar-top">
        <img className="tok-icon" src={asset.icon} />
        <div>
          <div className="tn">{asset.asset}</div>
          <div className="ts2">
            {asset.tokens.length > 1 ? `${asset.tokens.length} tokens` : asset.symbol} · ${formatBalance(asset.value)}
          </div>
        </div>
        <span className={`delta ${deltaClass}`}>
          {targetDelta <= 0.5 && targetDelta >= -0.5 ? "On target" : (
            `${(0 - targetDelta) > 0 ? '+' : ''}${(0 - targetDelta).toFixed(2)}%`
          )}
        </span>
      </div>

      <RangeBar
        accentColor={asset.accent_color}
        target={target}
        value={asset.percentage}
        onTargetChange={t => setTarget(t)}
      />

      <div id="trade_eth" className={`trade-hint ${hintClass}`}>{hint}</div>
    </div>
  )
}
