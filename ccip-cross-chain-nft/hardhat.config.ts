import * as dotenvenc from '@chainlink/env-enc';
dotenvenc.config();

import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import './tasks';

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHEREUM_SEPOLIA_RPC_URL = process.env.ETHEREUM_SEPOLIA_RPC_URL;
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL;
const OPTIMISM_GOERLI_RPC_URL = process.env.OPTIMISM_GOERLI_RPC_URL;
const ARBITRUM_TESTNET_RPC_URL = process.env.ARBITRUM_TESTNET_RPC_URL;
const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

const config: HardhatUserConfig = {
	solidity: '0.8.19',
	networks: {
		hardhat: {
			chainId: 31337,
		},
		ethereumSepolia: {
			url: ETHEREUM_SEPOLIA_RPC_URL !== undefined ? ETHEREUM_SEPOLIA_RPC_URL : '',
			accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
			chainId: 11155111,
		},
		polygonMumbai: {
			url: POLYGON_MUMBAI_RPC_URL !== undefined ? POLYGON_MUMBAI_RPC_URL : '',
			accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
			chainId: 80001,
		},
		optimismGoerli: {
			url: OPTIMISM_GOERLI_RPC_URL !== undefined ? OPTIMISM_GOERLI_RPC_URL : '',
			accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
			chainId: 420,
		},
		arbitrumTestnet: {
			url: ARBITRUM_TESTNET_RPC_URL !== undefined ? ARBITRUM_TESTNET_RPC_URL : '',
			accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
			chainId: 421613,
		},
		avalancheFuji: {
			url: AVALANCHE_FUJI_RPC_URL !== undefined ? AVALANCHE_FUJI_RPC_URL : '',
			accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
			chainId: 43113,
		},
	},
	etherscan: {
		apiKey: {
			sepolia: ETHERSCAN_API_KEY !== undefined ? ETHERSCAN_API_KEY : 'IXCS5ETY44G6FFJUUKZ3J26B613RCV2R1R',
			polygonMumbai:
				POLYGONSCAN_API_KEY !== undefined ? POLYGONSCAN_API_KEY : 'CCQ3IR9EK2KXQT2ECRPIVTM6XXWSTCUN5R',
		},
	},
};

export default config;
