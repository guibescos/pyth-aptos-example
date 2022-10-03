.PHONY: build
build:
	aptos move compile --save-metadata --named-addresses mint_nft="0xcedab8c158d82b4ecd50aae4bf2177285e7707009a0e08d77f528c21ffa93d41"

.PHONY: publish
publish:
	aptos move publish --named-addresses mint_nft="0xcedab8c158d82b4ecd50aae4bf2177285e7707009a0e08d77f528c21ffa93d41"

.PHONY: clean
clean:
	aptos move clean --assume-yes

.PHONY: test
test:
	aptos move test
