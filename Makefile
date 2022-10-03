.PHONY: build
build:
	aptos move compile --save-metadata --named-addresses mint_nft="0xb138581594ebd7763cfa3c3e455050139b7304c6d41e7094a1c78da4e6761ed8"

.PHONY: publish
publish:
	aptos move publish --named-addresses mint_nft="0xb138581594ebd7763cfa3c3e455050139b7304c6d41e7094a1c78da4e6761ed8"

.PHONY: clean
clean:
	aptos move clean --assume-yes

.PHONY: test
test:
	aptos move test
