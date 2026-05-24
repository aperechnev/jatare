import { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { Link } from "react-router-dom"
import { Wallet, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const justConnected = useRef(false)

  function handleConnect() {
    justConnected.current = true
    connect({ connector: injected() })
  }

  function handleDisconnect() {
    disconnect()
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

  return (
    <header className="bg-white">

      <div className="h-16 px-6 flex items-center justify-between">

        <Link to="/">
          <h1 className="font-merriweather text-2xl font-bold tracking-tight text-primary">
            Jatare
          </h1>
        </Link>

        {isConnected && (
          <DropdownMenu>
            <DropdownMenuTrigger >
              <Button variant="outline" className="gap-2 bg-transparent border-none">
                <Wallet className="w-4 h-4" />
                {address?.slice(0, 6)}...{address?.slice(-4)}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border">
              <DropdownMenuItem onSelect={() => navigate(`/portfolio/${address}`)}>
                Portfolio
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleDisconnect} variant="destructive">
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!isConnected && (
          <Button onClick={handleConnect} variant="outline" className="gap-2 bg-transparent border-none">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        )}

      </div>

    </header>
  )
}
