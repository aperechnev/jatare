const WORKER_URL = import.meta.env.VITE_WORKER_URL

export async function getTokens(address: string) {
  const res = await fetch(
    `${WORKER_URL}/tokens?address=${address}`
  )

  if (!res.ok) throw new Error("Failed to fetch tokens")

  return res.json()
}

export async function getPrices(contracts: string[]) {
  const res = await fetch(
    `${WORKER_URL}/prices?contracts=${contracts.join(",")}`
  )

  if (!res.ok) throw new Error("Failed to fetch prices")

  return res.json()
}
