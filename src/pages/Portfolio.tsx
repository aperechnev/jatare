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
import { getWallet } from "@/api/portfolioApi"


function formatBalance(balance: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);
}

function makeCell(asset, index, total) {
  return (
    <TableRow key={index}>

      <TableCell className="flex flex-col">
        <div className="flex flex-row gap-3 items-center">
          <img
            src={asset.icon}
            alt={asset.name}
            className="w-6 h-6 rounded-full mb-1"
          />
          <div className="flex flex-col">
            <span className="font-bold">
              {asset.asset}
            </span>
            <span className="text-xs text-zinc-500">
              {asset.name}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-right">
        ${formatBalance(asset.price)}
      </TableCell>

      <TableCell className="font-mono text-right">
        {Number(asset.balance).toLocaleString(undefined, {
          maximumFractionDigits: asset.decimals
        })}
      </TableCell>

      <TableCell className="text-right font-medium">
        ${formatBalance(asset.value)}
      </TableCell>

      <TableCell className="text-right">
        {total > 0 ? `${((asset.value / total) * 100).toFixed(2)}%` : '-'}
      </TableCell>

    </TableRow>
  )
}

export default function PortfolioPage() {
  const { address } = useParams()
  const [assets, setAssets] = useState([])
  const [debts, setDebts] = useState([])

  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!address) return

    async function load() {
      const wallet = await getWallet(address)

      wallet.forEach((t: { price: number; balance: number; value?: number }) => {
        t.value = t.price * t.balance
      })

      setTotal(wallet.reduce((acc: number, t: { value: number }) => acc + t.value, 0))

      wallet.sort((a, b) => b.value - a.value)

      setAssets(
        wallet
          .filter((t: { value: number }) => t.value > 0)
      )
      setDebts(
        wallet
          .filter((t: { value: number }) => t.value < 0)
          .map((t: { value: number }) => ({ ...t, price: -t.price, value: -t.value }))
      )
    }

    load()
  }, [address])

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
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="bg-zinc-100">
                Assets <span className="font-medium">${`${formatBalance(assets.reduce((acc, t) => acc + t.value, 0))}`}</span>
              </TableCell>
            </TableRow>
            {assets.map((t, i) => (
              makeCell(t, i, total)
            ))}
            <TableRow>
              <TableCell colSpan={5} className="bg-zinc-100">
                Debt <span className="font-medium">${`${formatBalance(debts.reduce((acc, t) => acc + t.value, 0))}`}</span>
              </TableCell>
            </TableRow>
            {debts.map((t, i) => (
              makeCell(t, i, total)
            ))}
          </TableBody>
        </Table>

      </main>
    </>
  )
}