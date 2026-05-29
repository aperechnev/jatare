import { useEffect, useState } from "react";
import type { Asset } from "@/types/Asset"

const percentageColors = {
  green: 'bg-green-200',
  red: 'bg-red-200',
}

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

function makeSubassetRow(token: Asset, index: number) {
  return (
    <div className="flex flex-row py-3 items-center hover:bg-gray-100" key={index}>

      <div className="flex-1 pl-3">
          <span className="font-normal pl-9">
            {token.name}
          </span>
      </div>

      <div className="text-right flex-1">
        ${formatBalance(token.price)}
      </div>

      <div className="font-mono text-right flex-1">
        {Number(token.balance).toLocaleString(undefined, {
          maximumFractionDigits: token.decimals
        })}
      </div>

      <div className="text-right font-medium flex-1">
        ${formatBalance(token.value)}
      </div>

      <div className="text-right flex-1 pr-3">
        {token.percentage.toFixed(2)}%
        <div className="bg-gray-100 rounded-full h-1 mt-1 ml-12">
          <div
            className={`${token.isDebt ? percentageColors.red : percentageColors.green} rounded-full h-1 mt-1`}
            style={{ width: `${token.percentage}%` }} />
        </div>
      </div>

    </div>
  )
}

function makeAssetRow(asset: Asset, index: number) {
  return (
    <div>
      <div className="flex flex-row py-3 items-center hover:bg-gray-100" key={index}>

        <div className="flex flex-col flex-1 pl-3">
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
        </div>

        <div className="text-right flex-1">
          {asset.tokens.length > 1 ? `` : formatBalance(asset.price)}
        </div>

        <div className="font-mono text-right flex-1">
          {Number(asset.balance).toLocaleString(undefined, {
            maximumFractionDigits: asset.decimals
          })}
        </div>

        <div className="text-right font-medium flex-1">
          ${formatBalance(asset.value)}
        </div>

        <div className="text-right flex-1 pr-3">
          {asset.percentage.toFixed(2)}%
          <div className="bg-gray-100 rounded-full h-1 mt-1 ml-12">
            <div
              className={`${asset.isDebt ? percentageColors.red : percentageColors.green} rounded-full h-1 mt-1`}
              style={{ width: `${asset.percentage}%` }} />
          </div>
        </div>

      </div>

      {asset.tokens.length > 1 && asset.tokens.map((t, i) => makeSubassetRow(t, i))}
    </div>
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
    <div className="flex flex-col text-sm gap-2">

      <div className="flex flex-row font-medium pt-4 pb-2">
        <div className="flex-1 pl-3">Token</div>
        <div className="flex-1 text-right">Price</div>
        <div className="flex-1 text-right">Amount</div>
        <div className="flex-1 text-right">USD Value</div>
        <div className="flex-1 text-right pe-3">Percent</div>
      </div>

      <div className="bg-zinc-100 p-3">
        Assets <span className="text-sm font-medium">${`${formatBalance(assetsTotal)}`}</span>
      </div>
      {assets.map((t, i) => (makeAssetRow(t, i)))}

      <div className="bg-zinc-100 p-3">
        Debt <span className="text-sm font-medium">${`${formatBalance(debtTotal)}`}</span>&nbsp;&nbsp;&nbsp;&nbsp;Ratio: <span className="text-sm font-medium">{((debtTotal / assetsTotal) * 100).toFixed(2)}%</span>
      </div>
      {debts.map((t, i) => (makeAssetRow(t, i)))}

    </div>
  )
}

export default PortfolioTable
