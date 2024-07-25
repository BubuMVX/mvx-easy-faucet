# MultiversX Easy Faucet

A web app to easily claim xEGLD multiple times on MultiversX test and dev networks.

## Prerequisites

NodeJS must be installed on your system.

To use MultiversX's ReCaptcha, you need to run it on the localhost domain.

## How it works?

- Generate a temporary wallet on shard 1
- Claim xEGLD for it from the faucet API
- Transfer the funds to your wallet

## Usage

```
git clone https://github.com/grobux/mvx-easy-faucet
cd mvx-easy-faucet
npm install
npm run dev
```

- Open the app in your web browser
- Select the network you work on
- Type the wallet address that will receive the funds
- Solve the captcha
- Wait and restart
