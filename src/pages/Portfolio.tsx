import { useState, useEffect } from "react"
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
import { CopyButton } from "@/components/CopyButton"
import { getWallet } from "@/api/portfolioApi"
import type { Asset } from "@/types/Asset"


function formatBalance(balance: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);
}

function makeCell(asset: Asset, index: number, total: number) {
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
        {(asset.percentage ?? 0).toFixed(2)}%
      </TableCell>

    </TableRow>
  )
}

export default function PortfolioPage() {
  const params = useParams<{ address: string }>()

  const [assets, setAssets] = useState([])
  const [debts, setDebts] = useState([])
  const [total, setTotal] = useState(0)
  const [assetsTotal, setAssetsTotal] = useState(0)
  const [debtTotal, setDebtTotal] = useState(0)

  const address = params.address ?? ""

  async function load() {
    const wallet = await getWallet(address)

    wallet.forEach((t: { price: number; balance: number; value?: number }) => {
      t.value = t.price * t.balance
    })

    const total = wallet.reduce((acc: number, t: { value: number }) => acc + t.value, 0)
    setTotal(total)

    wallet.sort((a: { value: number }, b: { value: number }) => b.value - a.value)

    const assets = wallet.filter((t: { value: number }) => t.value > 0)
    const assetsTotal = assets.reduce((acc: number, t: { value: number }) => acc + t.value, 0)
    assets.forEach((t: { value: number, percentage?: number }) => { t.percentage = (t.value / assetsTotal) * 100 })
    setAssets(assets)
    setAssetsTotal(assetsTotal)

    const debts = wallet
      .filter((t: { value: number }) => t.value < 0)
      .map((t: { value: number, price: number }) => ({ ...t, price: -t.price, value: -t.value }))
    const debtTotal = debts.reduce((acc: number, t: { value: number }) => acc + t.value, 0)
    debts.forEach((t: { value: number, percentage?: number }) => { t.percentage = (t.value / debtTotal) * 100 })
    setDebts(debts)
    setDebtTotal(debtTotal)
  }

  useEffect(() => {
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
        <div className="flex flex-row">

          <div>
            <h1 className="text-2xl font-bold mb-1">
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">USD Value</TableHead>
              <TableHead className="text-right">Percent</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="bg-zinc-100">
                Assets <span className="font-medium">${`${formatBalance(assetsTotal)}`}</span>
              </TableCell>
            </TableRow>
            {assets.map((t, i) => (
              makeCell(t, i, assetsTotal)
            ))}
            <TableRow>
              <TableCell colSpan={5} className="bg-zinc-100">
                Debt <span className="font-medium">${`${formatBalance(debtTotal)}`}</span>
              </TableCell>
            </TableRow>
            {debts.map((t, i) => (
              makeCell(t, i, debtTotal)
            ))}
          </TableBody>
        </Table>

      </main>
    </>
  )
}