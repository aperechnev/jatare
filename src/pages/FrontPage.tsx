import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group"

export default function FrontPage() {
  const [address, setAddress] = useState("")
  const navigate = useNavigate()

  function handleAnalyse() {
    if (!address) return
    navigate(`/portfolio/${address}`)
  }

  return (
    <div className="min-h-[calc(100vh-42vh)] flex items-center justify-center">

      <div className="flex flex-col gap-7">

        <p className="text-sm font-light text-gray-700 text-center">
          Enter your wallet address to analyse your portfolio.
        </p>

        <form onSubmit={handleAnalyse} className="flex flex-col gap-4 w-[480px]">

          <InputGroup className="bg-white">

            <InputGroupInput
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0xFca88d5d0C03Cfa090595Dc73E2dbEde32875Fe6"
              className="h-12 text-base"
            />

            <InputGroupAddon>
              <Search className="w-4 h-12" />
            </InputGroupAddon>

            <InputGroupButton
              type="submit"
              className="h-10 px-5 font-medium text-primary hover:bg-primary hover:text-white hover:font-medium"
            >
              Analyse
            </InputGroupButton>

          </InputGroup>

        </form>

      </div>

    </div>
  )
}