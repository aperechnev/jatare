import './Header.css'
import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { Link } from "react-router-dom"


export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const justConnected = useRef(false)

  function handleConnect() {
    justConnected.current = true
    connect({ connector: injected() })
  }

  function handleDisconnect() {
    setIsOpen(false)
    disconnect()
  }

  function handleCopy() {
    setIsOpen(false)
    navigator.clipboard.writeText(`${address}`)
  }

  function handlePortfolio() {
    setIsOpen(false)
    navigate(`/portfolio/${address}`)
  }

  useEffect(() => {
    if (!isConnected || !address) return

    if (location.pathname.startsWith("/portfolio")) return

    if (!justConnected.current) return

    justConnected.current = false

    setTimeout(() => {
      navigate(`/portfolio/${address}`)
    }, 300)
  }, [isConnected, address, navigate, location.pathname])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>

      <div className="h-16 px-6 flex items-center justify-between">

        <Link to="/">
          <h1 className="logo nav-logo">
            Jatare
          </h1>
        </Link>

        <div className="relative">

          {isConnected && (
            <div className="wallet-button" onClick={() => setIsOpen(!isOpen)}>
              <i className="ti ti-wallet" aria-hidden="true"></i>
              {address?.slice(0, 6)}...{address?.slice(-4)}
              <i id="disclose-chevron" className={(isOpen ? "ti ti-chevron-up" : "ti ti-chevron-down")} aria-hidden="true"></i>
            </div>
          )}
          {!isConnected && (
            <div className="wallet-button" onClick={handleConnect}>
              <i className="ti ti-wallet" aria-hidden="true"></i>
              Connect Wallet
            </div>
          )}

          <div
            ref={menuRef}
            className="wallet-menu absolute top-full right-0 w-120 transition-all duration-200 overflow-hidden opacity-100"
            style={{
              display: isOpen ? "" : "none"
            }}>

            <div className="header">
              Connected Wallet
            </div>

            <div className="info">
              <span className="address">
                0xFca88d5d0C03Cfa090595Dc73E2dbEde32875Fe6
              </span>
              <button className="copy" title=" Copy address" onClick={handleCopy}>
                <i className="ti ti-copy" aria-hidden="true"></i>
              </button>
            </div>

            <div className="divider"></div>

            <button onClick={handlePortfolio}>
              <i className="ti ti-wallet" aria-hidden="true"></i> Portfolio
            </button>

            <div className="divider"></div>

            <button className="menu-button destructive" onClick={handleDisconnect}>
              <i className="ti ti-logout" aria-hidden="true"></i> Disconnect
            </button>

          </div>

        </div>

      </div>

    </header>
  )
}
