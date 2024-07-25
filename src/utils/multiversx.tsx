export const DECIMALS = 18
export const walletRegExp = /^erd1[acdefghjklmnpqrstuvwxyz023456789]{58}$/

export const isValidWalletAddress = (address: string) => {
    return walletRegExp.test(address)
}
