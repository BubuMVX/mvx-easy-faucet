import {Address, AddressComputer} from "@multiversx/sdk-core/out";
import {Mnemonic} from "@multiversx/sdk-wallet/out";

export const DECIMALS = 18
export const walletRegExp = /^erd1[acdefghjklmnpqrstuvwxyz023456789]{58}$/

export const isValidWalletAddress = (address: string) => {
    return walletRegExp.test(address)
}

export const generateWalletOnShard = (shard: number) => {
    const addressComputer = new AddressComputer()
    let mnemonic = null
    let key = null
    let address = null
    let walletShard = null

    do {
        mnemonic = Mnemonic.generate()
        key = mnemonic.deriveKey(0)
        address = key.generatePublicKey().toAddress()
        walletShard = addressComputer.getShardOfAddress(new Address(address.bech32()))
    } while (walletShard != shard)

    return {
        mnemonic,
        key,
        address,
        walletShard,
    }
}
