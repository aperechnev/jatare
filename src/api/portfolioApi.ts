const API_URL = "https://api.jatare.xyz"

export async function getWallet(address: string) {
  const res = await fetch(
    `${API_URL}/wallet/${address}`
  )

  if (!res.ok) throw new Error("Failed to fetch wallet")

  return res.json()
}
