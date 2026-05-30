import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Asset } from "@/types/Asset"

const percentageColors = {
  green: 'var(--color-assets-green)',
  red: 'var(--color-assets-red)',
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
    <div className="included-token flex flex-row py-3 items-center hover:bg-gray-100" key={index}>

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

function makeAssetRow(asset: Asset, index: number, openAssets: Record<string, boolean>, toggle: (asset: string) => void) {
  return (
    <div id={`asset-${asset.asset}`} key={index} data-tokens-shown='false'>
      <div className="flex flex-row py-3 items-center hover:bg-gray-100" onClick={() => toggle(asset.asset)}>

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

        <div className="text-right flex-1 flex justify-end items-center">
          {asset.tokens.length > 1 ? (
            <div className="flex items-center justify-end w-full">
              {openAssets[asset.asset] ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          ) : (
            "$" + formatBalance(asset.price)
          )}
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
              className="rounded-full h-1 mt-1"
              style={{
                width: `${asset.percentage}%`,
                backgroundColor: asset.isDebt ? 'var(--color-assets-red)' : 'var(--color-assets-green)'
              }} />
          </div>
        </div>

      </div>

      {/* { > 1 && asset.tokens.map((t, i) => makeSubassetRow(t, i))} */}
      {asset.tokens.length > 1 && openAssets[asset.asset] &&
        asset.tokens.map((t, i) => makeSubassetRow(t, i))
      }
    </div>
  )
}

function PortfolioTable({ wallet }: { wallet: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [debts, setDebts] = useState<Asset[]>([])

  const [openAssets, setOpenAssets] = useState<Record<string, boolean>>({})

  function toggle(asset: string) {
    setOpenAssets(prev => ({
      ...prev,
      [asset]: !prev[asset]
    }))
  }

  useEffect(() => {
    setOpenAssets({})
  }, [wallet])

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

      {assets.map((t, i) =>
        makeAssetRow(t, i, openAssets, toggle)
      )}

      <div className="p-3 text-xs">
        <div className="flex flex-row gap-8">
          Debt
        </div>
      </div>
      {debts.map((t, i) =>
        (makeAssetRow(t, i, openAssets, toggle))
      )}

    </div>
  )
}

export default PortfolioTable
