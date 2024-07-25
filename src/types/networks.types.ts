export type NetworksType = {
    devnet: NetworksSettingsType,
    testnet: NetworksSettingsType,
    [key: string]: NetworksSettingsType,
}

export type NetworksSettingsType = {
    name: string,
    api: string,
    apiExtras: string,
    recaptchaKey: string,
    faucetAmount: number,
    transferGasFees: number,
}
