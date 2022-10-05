.PHONY: build
build:
	aptos move compile --save-metadata --named-addresses mint_nft=0x9de353175d88daee8ccfcc665bb4f5abd177e68b6f7cec0651313d2492878faf,wormhole=0x1b1752e26b65fc24971ee5ec9718d2ccdd36bf20486a10b2973ea6dedc6cd197,deployer=0xb138581594ebd7763cfa3c3e455050139b7304c6d41e7094a1c78da4e6761ed8,pyth=0xaa706d631cde8c634fe1876b0c93e4dec69d0c6ccac30a734e9e257042e81541
.PHONY: publish
publish:
	aptos move publish --named-addresses mint_nft=0x9de353175d88daee8ccfcc665bb4f5abd177e68b6f7cec0651313d2492878faf,wormhole=0x1b1752e26b65fc24971ee5ec9718d2ccdd36bf20486a10b2973ea6dedc6cd197,deployer=0xb138581594ebd7763cfa3c3e455050139b7304c6d41e7094a1c78da4e6761ed8,pyth=0xaa706d631cde8c634fe1876b0c93e4dec69d0c6ccac30a734e9e257042e81541 --profile testnet

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
