import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function FrontPage() {
  const [address, setAddress] = useState("")
  const navigate = useNavigate()

  function handleAnalyse() {
    if (!address) return
    navigate(`/portfolio/${address}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">

        <div className="flex w-[480px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0xFca88d5d0C03Cfa090595Dc73E2dbEde32875Fe6"
              className="pl-9 rounded-r-none"
            />
          </div>

          <Button
            onClick={handleAnalyse}
            className="rounded-l-none"
          >
            Analyse
          </Button>
        </div>

      </div>
    </main>
  )
}