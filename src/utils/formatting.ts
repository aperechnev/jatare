export function formatBalance(balance: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);
}

export function capitalize(s: string) {
  if (!s) return s
  return s[0].toUpperCase() + s.substr(1).toLowerCase();
}
