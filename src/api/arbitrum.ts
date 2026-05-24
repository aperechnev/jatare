const API_KEY = "59FDMZZ7WWFSAQJ7U1I6B5VDI98I3HQ1K7"

const BASE_URL = "https://api.etherscan.io/v2/api"

export async function getArbitrumTokenTransfers(address: string) {
  const url =
    `${BASE_URL}?chainid=42161&module=account&action=tokentx` +
    `&address=${address}` +
    `&startblock=0&endblock=999999999&sort=desc&apikey=${API_KEY}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== "1") {
    throw new Error(data.result || data.message)
  }

  return data.result
}
