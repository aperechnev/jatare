import type { Asset } from "@/types/Asset"

export default function groupTokens(tokens: Asset[]): Asset[] {
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
