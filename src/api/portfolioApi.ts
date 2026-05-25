const WORKER_URL = import.meta.env.VITE_WORKER_URL

const API_URL = "https://api.jatare.xyz"

export async function getTokens(address: string) {
  const res = await fetch(
    `${WORKER_URL}/tokens?address=${address}`
  )

  if (!res.ok) throw new Error("Failed to fetch tokens")

  return res.json()
}

export async function getPrices(contracts: string[]) {
  const res = await fetch(
    `${API_URL}/prices/${contracts.join(",")}`
  )

  if (!res.ok) throw new Error("Failed to fetch prices")

  return res.json()
}
