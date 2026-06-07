import { useState } from 'react'
import './RangeBar.css'

export default function RangeBar(
  { accentColor, target, value, onTargetChange }: {
    accentColor: string,
    target: number,
    value: number,
    onTargetChange: (target: number) => void
  }
) {
  const color = accentColor ?? "black"
  const [targetPercentage, setTargetPercentage] = useState(target)

  return (
    <div className="bar-wrap">

      <div className="bar-track">

        {/* current fill */}
        <div
          className="bar-current"
          style={{
            width: `${value}%`,
            background: `${color}`,
            opacity: .4
          }}
        ></div>

        {/* target marker */}
        <div
          className="bar-target-marker"
          style={{
            left: `${targetPercentage}%`,
            background: `${color}`
          }}
        ></div>

        {/* invisible range input for dragging */}
        <input
          type="range"
          className="range-overlay"
          min="0"
          max="100"
          step="0.5"
          value={targetPercentage}
          onInput={e => {
            const value = Number((e.target as HTMLInputElement).value)
            setTargetPercentage(value)
            onTargetChange(value)
          }}
        />

      </div>

      <div className="bar-labels">

        <span>
          <div
            className="lbl-dot"
            style={{
              background: `${color}`,
              opacity: .4
            }}
          ></div>Current {value.toFixed(2)}%
        </span>

        <span>
          <div className="lbl-dot" style={{ background: `${color}` }}></div>
          <span id="tgtlbl_eth">Target {targetPercentage}%</span>
        </span>

      </div>
    </div>
  )
}
