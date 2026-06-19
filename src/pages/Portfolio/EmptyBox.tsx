import './EmptyBox.css'
import { useNavigate } from 'react-router-dom'

export default function EmptyBox(
  { address, onTryAgain }: {
    address: string,
    onTryAgain: () => void
  }
) {
  const navigate = useNavigate()

  function handleSearchAnotherWallet() {
    navigate('/')
  }

  return (
    <div className="empty-box">
      <div className="empty-icon">
        <i className="ti ti-wallet-off" />
      </div>
      <div className="empty-title">
        No assets found
      </div>
      <div className="empty-sub">
        This wallet doesn't hold any tokens or open positions on the networks we support. It may be a new or unused address.
      </div>
      <div className="empty-addr">
        {address}
      </div>
      <div className="empty-actions">
        <button className="btn-primary" onClick={onTryAgain}>
          <i className="ti ti-refresh" />Try again
        </button>
        <button className="btn-secondary" onClick={handleSearchAnotherWallet}>
          <i className="ti ti-search" />Search another wallet
        </button>
      </div>
      <div className="scan-note">
        <span className="scan-dot"></span>Scanned Ethereum, Arbitrum, Base, Optimism
      </div>
    </div>
  )
}
