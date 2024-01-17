# Commands

1. `npm i`
2. `npm hardhat compile`
3. `npx hardhat deploy-destination-minter --network polygonMumbai`

   * ✅ MyNFT contract deployed at address `0x70C789D0F04E328cd6bAe3791c9EEB02fFbf54C4` on the polygonMumbai
   * ✅ DestinationMinter contract deployed at address `0x121F3851D572021EC84048eb1De6BAE2f587dDfF` on the polygonMumbai
   * ✅ DestinationMinter can now mint MyNFTs. tx hash: `0x3a1c500218a3babf72f4693eac5a3406cbff799a28f4df5250454ad7cbff786c`

4. `npx hardhat deploy-source-minter --network ethereumSepolia`

   * ✅ SourceMinter contract deployed at address 0x9dE98289DB7Ad17F808E9465fbb2625194eF9D17 on the ethereumSepolia

5. `npx hardhat fill-sender --sender-address 0x9dE98289DB7Ad17F808E9465fbb2625194eF9D17 --blockchain ethereumSepolia --amount 10000000000000000 --pay-fees-in Native`

   * ✅ Coins sent, transaction hash: `0xc6b043404894e6760957d3a29beec13ec46a002016aabcd4b98d074a03275b43`

6. `npx hardhat cross-chain-mint --source-minter 0x9dE98289DB7Ad17F808E9465fbb2625194eF9D17 --source-blockchain ethereumSepolia --destination-blockchain polygonMumbai --destination-minter 0x121F3851D572021EC84048eb1De6BAE2f587dDfF --pay-fees-in Native`

   * ✅ Cross-chain minting successful, transaction hash: `0x00`

## Verify contracts on Etherscan and Polygonscan

* Router address `0xd0daae2231e9cb96b94c8512223533293c3693bf`
* LINK address `0x779877A7B0D9E8603169DdbD7836e478b4624789`

1. `npx hardhat verify 0x70C789D0F04E328cd6bAe3791c9EEB02fFbf54C4 --network polygonMumbai` - Verify MyNFT.sol
2. Verify DestinationMinter.sol
3. `npx hardhat verify 0x9dE98289DB7Ad17F808E9465fbb2625194eF9D17 --network ethereumSepolia 0xd0daae2231e9cb96b94c8512223533293c3693bf 0x779877A7B0D9E8603169DdbD7836e478b4624789`

   * ✅ Successfully verified contract SourceMinter on the block explorer.
    <https://sepolia.etherscan.io/address/0x9dE98289DB7Ad17F808E9465fbb2625194eF9D17#code>
