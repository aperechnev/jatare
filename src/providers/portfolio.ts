import { fetchTokens } from "./api"

export type PortfolioAsset = {
  chain: string
  name: string
  icon: string
  accent_color: string
  symbol: string
  asset: string
  price: number
  balance: number
  decimals: number
  value: number
  percentage: number
  isDebt: boolean
  tokens: PortfolioAsset[]
}

export type Portfolio = {
  total: number
  assetsTotal: number
  assetsCount: number
  debtTotal: number
  assetList: PortfolioAsset[]
  debtList: PortfolioAsset[]
}

export const defaultPortfolio: Portfolio = {
  total: 0,
  assetsTotal: 0,
  assetsCount: 0,
  debtTotal: 0,
  assetList: [],
  debtList: []
}

function groupTokens(tokens: PortfolioAsset[]): PortfolioAsset[] {
  const groupedAssets: PortfolioAsset[] = []

  tokens.forEach((t: PortfolioAsset) => {
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

export async function portfolioProvider(wallet: string): Promise<Portfolio> {
  var tokens: PortfolioAsset[] = await fetchTokens(wallet)
  tokens.forEach(t => { t.value = t.price * t.balance })
  tokens = tokens.filter((t) => Math.abs(t.value) > 0.01)

  const total: number = tokens.reduce((acc: number, t: PortfolioAsset) => acc + t.value, 0)

  const assetList = tokens.filter((t: PortfolioAsset) => t.price >= 0)
  const assetsTotal = assetList.reduce((acc: number, t: PortfolioAsset) => acc + t.value, 0)
  const assetsCount = (new Set(assetList.map((t: PortfolioAsset) => t.asset))).size
  assetList.forEach((a: PortfolioAsset) => { a.percentage = (a.value / assetsTotal) * 100 })

  const debtList = tokens.filter((t: PortfolioAsset) => t.price < 0)
  const debtTotal = -1 * tokens
    .filter((t: PortfolioAsset) => t.value < 0)
    .reduce((acc: number, t: PortfolioAsset) => acc + t.value, 0)
  debtList.forEach((a: PortfolioAsset) => { a.price = -a.price, a.value = -a.value, a.isDebt = true })
  debtList.forEach((a: PortfolioAsset) => { a.percentage = (a.value / debtTotal) * 100 })

  return {
    total: total,
    assetsTotal: assetsTotal,
    assetsCount: assetsCount,
    debtTotal: debtTotal,
    assetList: groupTokens(
      assetList.sort((a, b) => b.value - a.value)
    ),
    debtList: groupTokens(
      debtList.sort((a, b) => b.value - a.value)
    )
  }
}
