import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { CopyButton } from "@/components/CopyButton"
import PortfolioTable from "@/components/PortfolioTable"
import { getWallet } from "@/api/portfolioApi"

export default function PortfolioPage() {
  const params = useParams<{ address: string }>()

  const [total, setTotal] = useState(0)
  const [wallet, setWallet] = useState([])
  const address = params.address ?? ""

  useEffect(() => {
    async function load() {
      const tokens = await getWallet(address)

      tokens.forEach((t: { price: number; balance: number; value?: number }) => {
        t.value = t.price * t.balance
      })

      const total = tokens.reduce((acc: number, t: { value: number }) => acc + t.value, 0)
      setTotal(total)

      setWallet(tokens)
    }
    
    load()
  }, [])

  return (
    <>
      <Helmet>
        <title>
          {address
            ? `Portfolio of ${address}`
            : "Loading portfolio"}
        </title>
      </Helmet>

      <main className="min-h-screen p-10">
        <div className="flex flex-row mb-6">

          <div>
            <h1 className="text-2xl font-bold mb-2">
              Portfolio
            </h1>

            <p className="text-md text-zinc-500 mb-6">
              {address} <CopyButton text={address} />
            </p>
          </div>

          <div className="text-right ml-auto">
            <div className="text-sm text-zinc-500">
              Total value
            </div>
            <div className="text-3xl font-bold">
              ${total.toFixed(2)}
            </div>
          </div>

        </div>

        <PortfolioTable wallet={wallet} />

      </main>
    </>
  )
}
