import { Link } from "react-router-dom"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white">

      <div className="h-16 px-6 flex items-center justify-between">

        <Link to="/">
          <h1 className="font-merriweather text-2xl font-bold tracking-tight text-primary">
            Jatare
          </h1>
        </Link>

        <Button variant="outline" className="gap-2 rounded-xl disabled">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>

      </div>
      
    </header>
  )
}
