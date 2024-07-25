import {Mnemonic, UserSecretKey} from "@multiversx/sdk-wallet/out";

export type WalletType = {
    mnemonic: Mnemonic,
    key: UserSecretKey,
    address: string,
}
