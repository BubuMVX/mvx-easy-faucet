import {NetworksType} from "./types/networks.types.ts";

export const networks: NetworksType = {
    devnet: {
        name: "devnet",
        api: "https://devnet-api.multiversx.com",
        apiExtras: "https://devnet-extras-api.multiversx.com",
        recaptchaKey: "6LeOnY0fAAAAABCn_KfmqldzSsOEOP1JHvdfyYGd",
        faucetAmount: 5,
        transferGasFees: 0.00005,
    },
    testnet: {
        name: "testnet",
        api: "https://testnet-api.multiversx.com",
        apiExtras: "https://testnet-extras-api.multiversx.com",
        recaptchaKey: "6LeOnY0fAAAAABCn_KfmqldzSsOEOP1JHvdfyYGd",
        faucetAmount: 5,
        transferGasFees: 0.00005,
    },
}
