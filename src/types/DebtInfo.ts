export type DebtInfo = {
    percent: number
    label: string
    shortDescription: string
    longDescription: string
    color: string
}

function makeLabel(percent: number): string {
    if (percent < 20) return "Conservative"
    if (percent < 35) return "Moderate"
    if (percent < 60) return "Aggressive"
    return "Extreme"
}

function makeShortDescription(percent: number): string {
    if (percent < 20) return "Strong equity cushion"
    if (percent < 35) return "Balanced use of debt"
    if (percent < 60) return "Meaningful leverage exposure"
    return "Highly leveraged position"
}

function makeLongDescription(percent: number): string {
    if (percent < 20) return "Debt is used primarily for liquidity while the portfolio remains largely self-funded."
    if (percent < 35) return "Borrowing supports portfolio growth without significantly increasing overall risk."
    if (percent < 60) return "Debt becomes a meaningful part of the strategy and amplifies portfolio volatility."
    return "Most exposure is debt-financed, making portfolio outcomes highly sensitive to market movements."
}

function makeColor(percent: number): string {
    if (percent < 20) return "var(--color-assets-green)"
    if (percent < 35) return "var(--color-assets-blue)"
    if (percent < 60) return "var(--color-assets-yellow)"
    return "var(--color-assets-red)"
}

export function makeDebtInfo(assets: number, debt: number): DebtInfo {
    if (debt == 0) {
        return {
            percent: 0,
            label: "No debt",
            shortDescription: "No debt",
            longDescription: "No debt",
            color: "--color-text-primary"
        }
    }
    if (assets == 0) {
        return {
            percent: 0,
            label: "No assets",
            shortDescription: "No assets",
            longDescription: "No assets",
            color: "var(--color-assets-red)"
        }
    }

    var value = ((debt / assets) * 100)

    return {
        percent: value,
        label: makeLabel(value),
        shortDescription: makeShortDescription(value),
        longDescription: makeLongDescription(value),
        color: makeColor(value)
    }
}
