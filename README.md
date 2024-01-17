# GHOLink PWA

GHOLink leverages the power of the GHO token and Lens Protocol to offer a seamless blend of financial transactions and social interactions, redefining the way we connect and transact in the digital world.

## Project Workflow:

1. **NFT-Gated Publication Creation**:
   - Users create posts on the Lens Protocol platform, which are NFT-gated. This means the content of these posts is exclusive and can only be accessed by owning a specific NFT.

2. **GHO Token Payment on Ethereum**:
   - To view the content, interested users initiate a transaction on the Ethereum network.
   - They call a mint function which requires payment in GHO tokens.

3. **CCIP Integration for Cross-Chain Minting**:
   - Upon payment confirmation, the CCIP-enabled contract triggers the minting of a corresponding NFT on the Polygon network.
   - This cross-chain interaction is seamless, leveraging the capabilities of CCIP for secure and reliable communication between chains.

4. **NFT Delivery and Content Access**:
   - The minted NFT is sent to the user's wallet on Polygon.
   - Ownership of this NFT grants the user access to the gated content on Lens.

5. **User Experience**:
   - From the user's perspective, the process is straightforward: pay with GHO, receive an NFT, and gain access to exclusive content.
   - The technical complexities of cross-chain interactions are abstracted away, ensuring a smooth user experience.

## Getting started

1. Clone repo

```sh
git clone git@github.com:dabit3/lens-pwa.git
```

2. Install dependencies

```sh
npm install # or yarn, etc..
```

3. Configure environment variables for WalletConnect

```sh
# rename .example.env.local to .env.local 
NEXT_PUBLIC_WC_ID=
```

4. Run the app

```sh
npm run dev
```