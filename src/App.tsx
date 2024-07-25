import {
    Address,
    Message,
    MessageComputer,
    TransactionsFactoryConfig,
    TransferTransactionsFactory
} from "@multiversx/sdk-core/out";
import {NativeAuthClient} from "@multiversx/sdk-native-auth-client";
import {ApiNetworkProvider} from "@multiversx/sdk-network-providers/out";
import {Mnemonic, UserSigner} from "@multiversx/sdk-wallet/out";
import useLocalStorage from "@reactutils/use-local-storage";
import axios from "axios";
import BigNumber from "bignumber.js";
import {useEffect, useRef, useState} from "react";
import {Card, Col, Container, FloatingLabel, Form, Image, Row} from "react-bootstrap";
import mvxLogo from "./assets/images/multiversx-logo.svg";
import {Captcha} from "./components/Captcha.tsx";
import {networks} from "./config.tsx";
import {DECIMALS, isValidWalletAddress} from "./utils/multiversx.tsx";
import {sleep} from "./utils/sleep.tsx";

export const App = () => {
    const [network, setNetwork] = useLocalStorage('network', 'devnet')
    const [wallet, setWallet] = useLocalStorage('wallet', '')
    const inputNetwork = useRef<HTMLSelectElement>(null)
    const inputReceiver = useRef<HTMLInputElement>(null)
    const [collected, setCollected] = useState(0)
    const [networkConfig, setNetworkConfig] = useState(networks.devnet)
    const [claiming, setClaiming] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (networks[network]) {
            setNetworkConfig(networks[network])
        }
    }, [network])

    const claimFaucet = async (token: string) => {
        setClaiming(true)
        setMessage('Generating a temporary wallet...')

        const provider = new ApiNetworkProvider(networkConfig.api)
        const apiConfig = await provider.getNetworkConfig()
        const factoryConfig = new TransactionsFactoryConfig({
            chainID: apiConfig.ChainID,
        })
        const factory = new TransferTransactionsFactory({
            config: factoryConfig,
        })

        const mnemonic = Mnemonic.generate()
        const key = mnemonic.deriveKey(0)
        const address = key.generatePublicKey().toAddress()
        const walletSigner = new UserSigner(key)
        console.log('Temp wallet', address.bech32())

        setMessage('Asking the faucet...')
        const client = new NativeAuthClient({
            apiUrl: networkConfig.api,
            expirySeconds: 300,
        })
        const authInit = await client.initialize()
        //const authSign = authInit.substring(authInit.indexOf('.') + 1, authInit.length)
        const authMessage = new Message({
            data: Buffer.from(`${address.bech32()}${authInit}`),
        })
        const messageComputer = new MessageComputer()
        const serializedMessage = messageComputer.computeBytesForSigning(authMessage)
        const authSignature = await walletSigner.sign(serializedMessage)
        const accessToken = client.getToken(address.bech32(), authInit, authSignature.toString('hex'))

        const response = await axios.post(`${networkConfig.apiExtras}/faucet`,
            {
                captcha: token,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        setMessage('Waiting for funds to be delivered...')
        let loadingFunds = true

        do {
            const tempWallet = await provider.getAccount(address)
            loadingFunds = tempWallet.balance.isZero()

            if (loadingFunds) {
                await sleep(1000)
            }
        } while (loadingFunds)

        setMessage('Sending funds to your wallet...')
        const amount = new BigNumber(networkConfig.faucetAmount)
            .minus(networkConfig.transferGasFees)
            .shiftedBy(DECIMALS)
        const transaction = factory.createTransactionForNativeTokenTransfer({
            sender: address,
            receiver: new Address(wallet),
            nativeAmount: BigInt(amount.toFixed()),
        })
        transaction.nonce = 0n
        const serializedTx = transaction.serializeForSigning()
        transaction.signature = await walletSigner.sign(serializedTx)

        if (response.data.status == 'success') {
            await provider.sendTransaction(transaction)
            setCollected(collected + networkConfig.faucetAmount)
            await sleep(1000)
            setMessage('Done!')
            await sleep(1000)
        } else {
            setMessage('An error occured :(')
            await sleep(3000)
        }

        setClaiming(false)
    }

    const contentCard = () => {
        if (!isValidWalletAddress(wallet)) {
            return (
                <i>
                    Set the wallet address that will receive xEGLD
                </i>
            )
        }

        if (claiming) {
            return <>{message}</>
        }

        return (
            <Captcha
                recaptchaKey={networkConfig.recaptchaKey}
                onSubmitedCaptcha={claimFaucet}
            />
        )
    }

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col xs={12} sm={11} md={10} lg={8} xl={8} xxl={6} className="min-vh-100 d-flex flex-column">
                    <h1 className="mt-2">
                        Multivers<Image src={mvxLogo} fluid alt="X" className="align-super"/> Easy Faucet
                    </h1>
                    <div className="mb-2 flex-grow-1 d-flex align-items-center">
                        <div className="w-100">
                            <Row className="mb-2">
                                <Col sm={3}>
                                    <FloatingLabel
                                        label="Network"
                                        controlId="input.network"
                                        className="mb-3"
                                    >
                                        <Form.Select
                                            ref={inputNetwork}
                                            onChange={(e) => setNetwork(e.currentTarget.value)}
                                            value={network}
                                        >
                                            <option value="devnet">devnet</option>
                                            <option value="testnet">testnet</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel
                                        label="Receiver wallet"
                                        controlId="input.receiver"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            ref={inputReceiver}
                                            type="text"
                                            value={wallet}
                                            maxLength={62}
                                            onChange={(e) => setWallet(e.currentTarget.value.toLowerCase())}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Row className="g-4">
                                <Col sm={12} md={4}>
                                    <Card className="h-100">
                                        <Card.Header>
                                            Claimed
                                        </Card.Header>
                                        <Card.Body className="text-center fs-1 py-4">
                                            {collected} <span className="fs-3">xEGLD</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card className="h-100">
                                        <Card.Header>
                                            Claim xEGLD
                                        </Card.Header>
                                        <Card.Body
                                            className="text-center d-flex align-items-center justify-content-center">
                                            {contentCard()}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="pb-2 small text-muted text-end">
                        Made by <a href="https://x.com/grobux" target="_blank">Bubu</a>
                        &nbsp;|&nbsp;
                        <a href="https://x.com/ProjectX_DAO">#FollowTheX</a>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default App
