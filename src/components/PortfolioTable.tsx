import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Asset } from "@/types/Asset"

function formatBalance(balance: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);
}

function groupTokens(tokens: Asset[]): Asset[] {
  const groupedAssets: Asset[] = []

  tokens.forEach((t: Asset) => {
    const existing = groupedAssets.find((a: { asset: string }) => a.asset === t.asset)
    if (existing) {
      existing.value += t.value
      existing.balance += t.balance
      existing.percentage += t.percentage
      existing.tokens.push(t)
    } else {
      const newAsset = { ...t }
      newAsset.tokens = [t]
      groupedAssets.push(newAsset)
    }
  })

  return groupedAssets
}

function makeCell(asset: Asset, index: number) {
  const percentageColors = {
    green: 'bg-green-200',
    red: 'bg-red-200',
  }

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
              {asset.tokens.length > 1 ? `${asset.tokens.length} positions` : asset.tokens[0].name}
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

      <TableCell className="text-right pl-10">
        {asset.percentage.toFixed(2)}%
        <div className="bg-gray-100 rounded-full h-1 mt-1" style={{ width: '100%' }}>
          <div
            className={`${asset.isDebt ? percentageColors.red : percentageColors.green} rounded-full h-1 mt-1`}
            style={{ width: `${asset.percentage}%` }} />
        </div>
      </TableCell>

    </TableRow>
  )
}

function PortfolioTable({ wallet }: { wallet: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [debts, setDebts] = useState<Asset[]>([])
  const [assetsTotal, setAssetsTotal] = useState(0)
  const [debtTotal, setDebtTotal] = useState(0)

  useEffect(() => {
    if (!wallet.length) return

    const sorted = [...wallet].sort((a, b) => b.value - a.value)

    const assetsList = sorted.filter(t => t.value > 0)
    const assetsTotal = assetsList.reduce((acc, t) => acc + t.value, 0)

    const assetsWithPercent = assetsList.map(t => ({
      ...t,
      percentage: (t.value / assetsTotal) * 100
    }))

    setAssets(groupTokens(assetsWithPercent))
    setAssetsTotal(assetsTotal)

    const debtList = sorted
      .filter(t => t.value < 0)
      .map(t => ({
        ...t,
        price: -t.price,
        value: -t.value,
        isDebt: true,
      }))

    const debtTotal = debtList.reduce((acc, t) => acc + t.value, 0)

    const debtWithPercent = debtList.map(t => ({
      ...t,
      percentage: (t.value / debtTotal) * 100
    }))

    setDebts(groupTokens(debtWithPercent))
    setDebtTotal(debtTotal)

  }, [wallet])

  return (
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
          makeCell(t, i)
        ))}
        <TableRow>
          <TableCell colSpan={5} className="bg-zinc-100">
            Debt <span className="font-medium">${`${formatBalance(debtTotal)}`}</span>&nbsp;&nbsp;&nbsp;&nbsp;Ratio: <span className="font-medium">{((debtTotal / assetsTotal) * 100).toFixed(2)}%</span>
          </TableCell>
        </TableRow>
        {debts.map((t, i) => (
          makeCell(t, i)
        ))}
      </TableBody>
    </Table>
  )
}

export default PortfolioTable
