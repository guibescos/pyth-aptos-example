.PHONY: build
build:
	aptos move compile --save-metadata --named-addresses mint_nft=0xb138581594ebd7763cfa3c3e455050139b7304c6d41e7094a1c78da4e6761ed8,wormhole=0x251011524cd0f76881f16e7c2d822f0c1c9510bfd2430ba24e1b3d52796df204,deployer=0x277fa055b6a73c42c0662d5236c65c864ccbf2d4abd21f174a30c8b786eab84b,pyth=0x277fa055b6a73c42c0662d5236c65c864ccbf2d4abd21f174a30c8b786eab84b

.PHONY: publish
publish:
	aptos move publish --named-addresses mint_nft=0xb138581594ebd7763cfa3c3e455050139b7304c6d41e7094a1c78da4e6761ed8,wormhole=0x251011524cd0f76881f16e7c2d822f0c1c9510bfd2430ba24e1b3d52796df204,deployer=0x277fa055b6a73c42c0662d5236c65c864ccbf2d4abd21f174a30c8b786eab84b,pyth=0x277fa055b6a73c42c0662d5236c65c864ccbf2d4abd21f174a30c8b786eab84b

.PHONY: clean
clean:
	aptos move clean --assume-yes

.PHONY: test
test:
	aptos move test


.PHONY: clean
clean:
	aptos move clean --assume-yes

.PHONY: test
test:
	aptos move test
