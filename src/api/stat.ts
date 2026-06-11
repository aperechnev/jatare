const API_URL = "https://api.jatare.xyz"

export async function getStat() {
  const res = await fetch(
    `${API_URL}/stat`
  )

  if (!res.ok) throw new Error("Failed to fetch statistic.")

  return res.json()
}
