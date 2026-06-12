import './SearchBox.css'
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function SearchBox() {
  const [address, setAddress] = useState("")
  const navigate = useNavigate()

  function handleAnalyse() {
    if (!address) return
    navigate(`/portfolio/${address}`)
  }

  return (
    <div className="search-box">
      <i className="ti ti-search" aria-hidden="true"></i>
      <input type="text"
        placeholder="Wallet address or ENS name (e.g. vitalik.eth)"
        value={address}
        onChange={(e) => setAddress(e.target.value)} />
      <button className="search-btn" onClick={handleAnalyse}>Analyse</button>
    </div>
  )
}
