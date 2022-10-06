How to deploy the smart contract :

- Use `aptos init` with rest_url : `https://testnet.aptoslabs.com/` and faucet `https://faucet.testnet.aptoslabs.com`  to generate a new keypair.
- Use a faucet to airdrop testnet APT to your newly created account by calling `aptos account fund-with-faucet --account default`. If this doesn't work, I have had success importing my private key from `.aptos/config.yaml` into Petra and clicking the airdrop button.
- Get your account address from `.aptos/config.yaml` and replace `mint_nft="_"` by `mint_nft="<ADDRESS>"` in `Move.toml`
- `aptos move compile`
- `aptos move publish` 