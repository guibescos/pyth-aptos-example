/// This module is an example of how one can create a NFT collection from a resource account
/// and allow users to mint from the NFT collection.
/// Check aptos/move-e2e-tests/src/tests /mint.nft.rs for an e2e example.
///
/// - Initialization of this module
/// Let's say we have an original account at address `0xcafe`. We can use it to call
/// `create_resource_account_and_publish_package(origin, vector::empty<>(), ...)` - this will create a resource address at
/// `0b6beee9bc1ad3177403a04efeefb1901c12b7b575ac5124c0205efc0dd2e32a`. The module `mint_nft` will be published under the
/// resource account's address.
///
/// - When using this module, we expect the flow to look like:
/// (1) call create_resource_account_and_publish_package() to publish this module under the resource account's address.
/// init_module() will be called as part of publishing the package. In init_module(), we set up the NFT collection to mint.
/// (2) call mint_nft(): this will check if this token minting is still valid, verify the `MintProofChallenge` struct against
/// the resource signer's public key, and mint a token to the `receiver` upon successful verification. We will also emit an event
/// and mutate the token property (update the token version) upon successful token transfer.
/// (3) (optional) update `expiration_timestamp` or `minting_enabled` of this CollectionTokenMinter by calling
/// `set_timestamp()` or `set_minting_enabled()` from the resource signer.
module mint_nft::minting {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;

    use aptos_framework::account;
    use aptos_framework::event::EventHandle;
    use aptos_token::token::{Self, TokenDataId};
    use aptos_framework::resource_account;


    // This struct stores the token receiver's address and token_data_id in the event of token minting
    struct TokenMintingEvent has drop, store {
        token_receiver_address: address,
        token_data_id: TokenDataId,
    }

    // This struct stores an NFT collection's relevant information
    struct CollectionTokenMinter has key {
        token_data_id: TokenDataId,
        token_minting_events: EventHandle<TokenMintingEvent>,
        signer_cap: account::SignerCapability
    }

    /// Action not authorized because the signer is not the owner of this module
    const ENOT_AUTHORIZED: u64 = 1;
    /// The collection minting is expired
    const ECOLLECTION_EXPIRED: u64 = 2;
    /// The collection minting is disabled
    const EMINTING_DISABLED: u64 = 3;
    /// Specified public key is not the same as the collection token minter's public key
    const EWRONG_PUBLIC_KEY: u64 = 4;
    /// Specified scheme required to proceed with the smart contract operation - can only be ED25519_SCHEME(0) OR MULTI_ED25519_SCHEME(1)
    const EINVALID_SCHEME: u64 = 5;
    /// Specified proof of knowledge required to prove ownership of a public key is invalid
    const EINVALID_PROOF_OF_KNOWLEDGE: u64 = 6;

    /// Initialize this module: create a resource account, a collection, and a token data id
    fun init_module(resource_account: &signer) {
        let collection_name = string::utf8(b"Pythians");
        let description = string::utf8(b"Pythians");
        let collection_uri = string::utf8(b"https://pyth.network/");
        let token_name = string::utf8(b"Pythian #1");
        let token_uri = string::utf8(b"https://aptos.dev/img/nyan.jpeg");

        // create the resource account that we'll use to create tokens
        let (resource_signer, resource_signer_cap) = account::create_resource_account(resource_account, b"hello");

        // create the nft collection
        let maximum_supply = 0;
        let mutate_setting = vector<bool>[ false, false, false ];
        let resource_account_address = signer::address_of(&resource_signer);
        token::create_collection(&resource_signer, collection_name, description, collection_uri, maximum_supply, mutate_setting);

        // create a token data id to specify which token will be minted
        let token_data_id = token::create_tokendata(
            &resource_signer,
            collection_name,
            token_name,
            string::utf8(b""),
            0,
            token_uri,
            resource_account_address,
            0,
            0,
            // we don't allow any mutation to the token
            token::create_token_mutability_config(
                &vector<bool>[ false, false, false, false, true ]
            ),
            vector::empty<String>(),
            vector::empty<vector<u8>>(),
            vector::empty<String>(),
        );


        move_to(resource_account, CollectionTokenMinter {
            token_data_id,
            token_minting_events: account::new_event_handle<TokenMintingEvent>(resource_account),
            signer_cap : resource_signer_cap
        });
    }

    public entry fun mint_nft(receiver : &signer) acquires CollectionTokenMinter{
        let collection_token_minter = borrow_global_mut<CollectionTokenMinter>(@mint_nft);

        let resource_signer = account::create_signer_with_capability(&collection_token_minter.signer_cap);
        let token_id = token::mint_token(&resource_signer, collection_token_minter.token_data_id, 1);
        token::direct_transfer(&resource_signer, receiver, token_id, 1);
    }
}
