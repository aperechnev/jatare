import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getArbitrumTokenTransfers } from "@/api/arbitrum"

export function groupTokens(address: string, transfers: any[]) {
  const map = new Map()

  const addr = address.toLowerCase()

  for (const tx of transfers) {
    const key = tx.contractAddress

    if (!map.has(key)) {
      map.set(key, {
        symbol: tx.tokenSymbol,
        name: tx.tokenName,
        contract: tx.contractAddress,
        balance: 0,
        decimals: Number(tx.tokenDecimal),
      })
    }

    const token = map.get(key)

    const value =
      Number(tx.value) / Math.pow(10, token.decimals)

    const from = tx.from.toLowerCase()
    const to = tx.to.toLowerCase()

    // incoming
    if (to === addr) {
      token.balance += value
    }

    // outgoing
    if (from === addr) {
      token.balance -= value
    }
  }

  return Array.from(map.values()).filter(t => t.balance > 0)
}

export default function PortfolioPage() {
  const { address } = useParams()
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) return

    async function load() {
      setLoading(true)

      const data = await getArbitrumTokenTransfers(address)

      const grouped = groupTokens(address, data)

      setTokens(grouped)
      setLoading(false)
    }

    load()
  }, [address])

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-2xl font-bold mb-6">
        Arbitrum Portfolio
      </h1>

      <p className="text-sm text-zinc-500 mb-6">
        {address}
      </p>

      {loading && (
        <p>Loading...</p>
      )}

      <div className="space-y-3">
        {tokens.map((t, i) => (
          <div key={i} className="border rounded p-3 flex justify-between">
            <div>
              <div className="font-bold">
                {t.symbol}
              </div>
              <div className="text-xs text-zinc-500">
                {t.name}
              </div>
            </div>

            <div className="font-mono">
              {t.balance.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}