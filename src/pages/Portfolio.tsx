import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getTokens, getPrices } from "@/api/portfolioApi"

export function groupTokens(address: string, transfers: any[]) {
  const map = new Map()

  const addr = address.toLowerCase()

  for (const tx of transfers) {
    const key = tx.contractAddress?.toLowerCase()

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

    const from = (tx.from || "").toLowerCase()
    const to = (tx.to || "").toLowerCase()

    if (!from || !to) continue

    // incoming
    if (to === addr) {
      token.balance += value
    }

    // outgoing
    if (from === addr) {
      token.balance -= value
    }
  }

  return Array.from(map.values())
    .filter(t => t.balance > 0)
    .sort((a, b) => b.balance - a.balance)
}

export default function PortfolioPage() {
  const { address } = useParams()
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [prices, setPrices] = useState({})
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!address) return

    async function load() {
      setLoading(true)

      const data = await getTokens(address)

      const grouped = groupTokens(address, data)

      setTokens(grouped)
      setLoading(false)
    }

    load()
  }, [address])

  useEffect(() => {
    if (!tokens.length) return

    async function loadPrices() {
      const contracts = tokens.map(t => `arbitrum:${t.contract}`)

      const data = await getPrices(contracts)

      setPrices(data)
    }

    loadPrices()
  }, [tokens])

  useEffect(() => {
    let sum = 0

    for (const t of tokens) {
      const price = prices[`arbitrum:${t.contract}`] || 0
      sum += t.balance * price
    }

    setTotal(sum)
  }, [prices, tokens])

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
        <h1 className="text-2xl font-bold mb-6">
          Arbitrum Portfolio
        </h1>

        <p className="text-sm text-zinc-500 mb-6">
          {address}
        </p>

        <div className="mb-6 p-4 border rounded-xl">
          <div className="text-sm text-zinc-500">
            Total Portfolio Value
          </div>

          <div className="text-2xl font-bold">
            ${total.toFixed(2)}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">USD Value</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tokens.map((t, i) => (
              <TableRow key={i}>

                <TableCell className="flex flex-col">
                  <span className="font-bold">
                    {t.symbol}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {t.name}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  ${(
                    prices[`arbitrum:${t.contract}`] || 0
                  ).toFixed(2)}
                </TableCell>

                <TableCell className="font-mono text-right">
                  {Number(t.balance).toLocaleString(undefined, {
                    maximumFractionDigits: 4
                  })}
                </TableCell>

                <TableCell className="text-right">
                  ${(
                    t.balance *
                    (prices[`arbitrum:${t.contract}`] || 0)
                  ).toFixed(2)}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

      </main>
    </>
  )
}