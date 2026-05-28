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

export default function PortfolioPage() {
  const { address } = useParams()
  const [wallet, setWallet] = useState([])

  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!address) return

    async function load() {
      const wallet = await getWallet(address)
      wallet.sort((a, b) => (b.price * b.balance) - (a.price * a.balance))
      setWallet(wallet)
    }

    load()
  }, [address])

  useEffect(() => {
    if (!wallet.length) return

    async function load() {

    }

    load()
  }, [wallet])

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
            {wallet.map((t, i) => (
              <TableRow key={i}>

                <TableCell className="flex flex-col">
                  <div className="flex flex-row gap-2 items-center">
                    <img
                      src={t.icon}
                      alt={t.name}
                      className="w-6 h-6 rounded-full mb-1"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold">
                        {t.asset}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {t.name}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  ${formatBalance(t.price)}
                </TableCell>

                <TableCell className="font-mono text-right">
                  {Number(t.balance).toLocaleString(undefined, {
                    maximumFractionDigits: t.decimals
                  })}
                </TableCell>

                <TableCell className="text-right">
                  ${formatBalance(t.price * t.balance)}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

      </main>
    </>
  )
}