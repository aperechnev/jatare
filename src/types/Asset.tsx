export type Asset = {
  icon: string
  name: string
  asset: string
  price: number
  balance: number
  decimals: number
  value: number
  percentage: number
  isDebt: boolean
  tokens: Asset[]
}
