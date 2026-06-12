const API_URL = "https://api.jatare.xyz"

async function fetchAPI(url: string) {
  const res = await fetch(url)

  if (!res.ok)
    throw new Error("Failed to fetch API data.")

  return res.json()
}

export async function fetchStat() {
  return await fetchAPI(`${API_URL}/stat`)
}

export async function fetchTokens(address: string) {
  return await fetchAPI(`${API_URL}/wallet/${address}`)
}
