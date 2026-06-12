import './SearchBox.css'
import { isAddress } from "viem"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function isValidEns(value: string) {
  return value.toLowerCase().endsWith(".eth")
}

export default function SearchBox() {
  const [address, setAddress] = useState("")
  const navigate = useNavigate()

  const [isValidInput, setIsValidInput] = useState(false)
  const [hint, setHint] = useState("")
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const input = address.trim()

    if (isAddress(input)) {
      setIsValidInput(true)
      setHint("Valid Ethereum address")
    } else if (isValidEns(input)) {
      setIsValidInput(true)
      setHint("Valid ENS name")
    } else {
      setIsValidInput(false)
      setHint("Not a valid wallet address or ENS name")
    }

    setShowHint(address.length > 0)
  }, [address])

  function handleAnalyse() {
    if (!address) return
    navigate(`/portfolio/${address}`)
  }

  return (
    <div className="search-box">

      <div id="sbox" className={`sbox ${address.length == 0 ? "" : (isValidInput ? "success" : "error")}`}>

        <i className="ti ti-search search-ico" aria-hidden="true"></i>

        <input
          id="inp"
          type="text"
          value={address}
          placeholder="Ethereum address or ENS name (e.g. vitalik.eth)"
          onChange={(e) => setAddress(e.target.value)}
        />

        {showHint && (
          <div
            id="statusIcon"
            className={`status-icon ${isValidInput ? "ok" : "err"}`}
          >
            <i className={`ti ${isValidInput ? "ti-circle-check" : "ti-circle-x"} `}></i>
          </div>
        )}

        <button id="sbtn" className="sbtn" onClick={handleAnalyse} disabled={!isValidInput}>Analyse</button>

      </div>

      {showHint && (
        <div
          id="hint"
          className={`hint ${isValidInput ? "ok" : "err"}`}
        >
          <i
            className={`ti ${isValidInput ? "ti-check" : "ti-alert-circle"}`}
            style={{ fontSize: "13px", flexShrink: 0 }}
          />
          {hint}
        </div>
      )}

    </div>
  )
}
