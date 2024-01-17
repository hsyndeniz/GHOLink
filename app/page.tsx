'use client'
import { useState } from 'react'
import {
  useExploreProfiles,
  useExplorePublications,
  ExploreProfilesOrderByType,
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType
} from '@lens-protocol/react-web'
import { development, ISigner, LensClient, production } from '@lens-protocol/client/gated';

import {
  Loader2, ListMusic, Newspaper,
  PersonStanding, Shapes,
  MessageSquare, Repeat2, Heart, Grab, ArrowRight
} from "lucide-react"
import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReactMarkdown from 'react-markdown'
import { article, erc721OwnershipCondition, profileOwnershipCondition } from '@lens-protocol/metadata';
import { useAccount, useSignMessage, useWalletClient } from 'wagmi';
import { Wallet, ethers } from 'ethers';

enum PublicationMetadataMainFocusType {
  Article = "ARTICLE",
  Audio = "AUDIO",
  CheckingIn = "CHECKING_IN",
  Embed = "EMBED",
  Event = "EVENT",
  Image = "IMAGE",
  Link = "LINK",
  Livestream = "LIVESTREAM",
  Mint = "MINT",
  ShortVideo = "SHORT_VIDEO",
  Space = "SPACE",
  Story = "STORY",
  TextOnly = "TEXT_ONLY",
  ThreeD = "THREE_D",
  Transaction = "TRANSACTION",
  Video = "VIDEO"
}

export default function Home() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [view, setView] = useState('profiles')
  const [dashboardType, setDashboardType] = useState('dashboard')
  let { data: profiles, error: profileError, loading: loadingProfiles } = useExploreProfiles({
    limit: LimitType.TwentyFive,
    orderBy: ExploreProfilesOrderByType.MostFollowers
  }) as any

  let { data: musicPubs, loading: loadingMusicPubs } = useExplorePublications({
    limit: LimitType.TwentyFive,
    orderBy: ExplorePublicationsOrderByType.TopCommented,
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Audio]
      }
    }
  }) as any

  let { data: publications, loading: loadingPubs } = useExplorePublications({
    limit: LimitType.TwentyFive,
    orderBy: ExplorePublicationsOrderByType.LensCurated,
    where: {
      publicationTypes: [ExplorePublicationType.Post],
    }
  }) as any


  profiles = profiles?.filter(p => p.metadata?.picture?.optimized?.uri)

  publications = publications?.filter(p => {
    if (p.metadata && p.metadata.asset) {
      if (p.metadata.asset.image) return true
      return false
    }
    return true
  })

  const createPost = async () => {
    const signer: ISigner = {
      getAddress: async () => { return `${address?.toLowerCase()}` },
      signMessage: (message) => {
        return walletClient?.signMessage({ account: address, message }) as Promise<string>
      }
    }

    console.log(signer)

    const client = new LensClient({
      environment: production,
      authentication: {
        domain: 'localhost',
        uri: 'http://localhost:3000',
      },
      storage: localStorage,
      signer
    })
    console.log(client)

    const profile = await client.profile.fetchAll({ where: { ownedBy: [address as string] } })
    console.log(profile)

    const defaultProfile = await client.profile.fetchDefault({ for: address as string })
    console.log(defaultProfile)

    const { id, text } = await client.authentication.generateChallenge({ signedBy: address as string, for: profile.items[0].id })
    console.log({ id, text })
    const signature = await walletClient?.signMessage({ account: address, message: text }) as string
    console.log(signature)
    const res = await client.authentication.authenticate({ id, signature })
    console.log(res)

    const isAuthenticated = await client.authentication.isAuthenticated();
    console.log(isAuthenticated)
    const accessTokenResult = await client.authentication.getAccessToken();
    const accessToken = accessTokenResult.unwrap();
    console.log(accessToken)
    const profileId = await client.authentication.getProfileId();
    console.log(profileId)

    const _profile = await client.profile.fetch({ forProfileId: profileId });
    console.log(_profile)

    // create metadata via '@lens-protocol/metadata' helpers
    const metadata = article({ content: 'My super secret article' })

    // encrypt the metadata specifying the access condition
    const result = await client.gated.encryptPublicationMetadata(
      metadata,
      profileOwnershipCondition({
        profileId: profileId as string,
      })
      // erc721OwnershipCondition({
      //   contract: {
      //     address: '0x9E8Ea82e76262E957D4cC24e04857A34B0D8f062',
      //     chainId: 137,
      //   }
      // })
    )

    console.log(result)
  }

  const approveGHOSpender = async () => {
    const ABI = [
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_spender",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_account",
            "type": "address"
          }
        ],
        "name": "unBlacklist",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_from",
            "type": "address"
          },
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_symbol",
            "type": "string"
          },
          {
            "name": "_currency",
            "type": "string"
          },
          {
            "name": "_decimals",
            "type": "uint8"
          },
          {
            "name": "_masterMinter",
            "type": "address"
          },
          {
            "name": "_pauser",
            "type": "address"
          },
          {
            "name": "_blacklister",
            "type": "address"
          },
          {
            "name": "_owner",
            "type": "address"
          },
          {
            "name": "_gsnFee",
            "type": "uint256"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "minter",
            "type": "address"
          }
        ],
        "name": "removeMinter",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "masterMinter",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_spender",
            "type": "address"
          },
          {
            "name": "_addedValue",
            "type": "uint256"
          }
        ],
        "name": "increaseAllowance",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newGsnFee",
            "type": "uint256"
          }
        ],
        "name": "updateGsnFee",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "mint",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "burn",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "minter",
            "type": "address"
          },
          {
            "name": "minterAllowedAmount",
            "type": "uint256"
          }
        ],
        "name": "configureMinter",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newPauser",
            "type": "address"
          }
        ],
        "name": "updatePauser",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "paused",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getHubAddr",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "context",
            "type": "bytes"
          }
        ],
        "name": "preRelayedCall",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "initialize",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "relay",
            "type": "address"
          },
          {
            "name": "from",
            "type": "address"
          },
          {
            "name": "encodedFunction",
            "type": "bytes"
          },
          {
            "name": "transactionFee",
            "type": "uint256"
          },
          {
            "name": "gasPrice",
            "type": "uint256"
          },
          {
            "name": "gasLimit",
            "type": "uint256"
          },
          {
            "name": "nonce",
            "type": "uint256"
          },
          {
            "name": "approvalData",
            "type": "bytes"
          },
          {
            "name": "maxPossibleCharge",
            "type": "uint256"
          }
        ],
        "name": "acceptRelayedCall",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "bytes"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "minter",
            "type": "address"
          }
        ],
        "name": "minterAllowance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "gsnFee",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "pauser",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_spender",
            "type": "address"
          },
          {
            "name": "_subtractedValue",
            "type": "uint256"
          }
        ],
        "name": "decreaseAllowance",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newMasterMinter",
            "type": "address"
          }
        ],
        "name": "updateMasterMinter",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "account",
            "type": "address"
          }
        ],
        "name": "isMinter",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newBlacklister",
            "type": "address"
          }
        ],
        "name": "updateBlacklister",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "relayHubVersion",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "blacklister",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "owner",
            "type": "address"
          },
          {
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "context",
            "type": "bytes"
          },
          {
            "name": "success",
            "type": "bool"
          },
          {
            "name": "actualCharge",
            "type": "uint256"
          },
          {
            "name": "preRetVal",
            "type": "bytes32"
          }
        ],
        "name": "postRelayedCall",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "currency",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_account",
            "type": "address"
          }
        ],
        "name": "blacklist",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_account",
            "type": "address"
          }
        ],
        "name": "isBlacklisted",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "minter",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "Mint",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "burner",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "Burn",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "oldFee",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "newFee",
            "type": "uint256"
          }
        ],
        "name": "GSNFeeUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "fee",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "user",
            "type": "address"
          }
        ],
        "name": "GSNFeeCharged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "minter",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "minterAllowedAmount",
            "type": "uint256"
          }
        ],
        "name": "MinterConfigured",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "oldMinter",
            "type": "address"
          }
        ],
        "name": "MinterRemoved",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "newMasterMinter",
            "type": "address"
          }
        ],
        "name": "MasterMinterChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_account",
            "type": "address"
          }
        ],
        "name": "Blacklisted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_account",
            "type": "address"
          }
        ],
        "name": "UnBlacklisted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "newBlacklister",
            "type": "address"
          }
        ],
        "name": "BlacklisterChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [],
        "name": "Pause",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [],
        "name": "Unpause",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "newAddress",
            "type": "address"
          }
        ],
        "name": "PauserChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "oldRelayHub",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "newRelayHub",
            "type": "address"
          }
        ],
        "name": "RelayHubChanged",
        "type": "event"
      }
    ]
    const sourceMinter = '0x9dE98289DB7Ad17F808E9465fbb2625194eF9D17'
    const contract = new ethers.Contract('0xc4bF5CbDaBE595361438F8c6a187bDc330539c60', ABI, new ethers.providers.Web3Provider(window.ethereum as any).getSigner())
    console.log(contract)
    const tx = await contract.approve(sourceMinter, ethers.utils.parseUnits('10', 18))
    console.log(tx)
  }

  return (
    <main className="
      px-6 py-14
      sm:px-10
    ">
      <div>
        <a target="_blank" rel="no-opener" href="https://lens.xyz">
          <div className="cursor-pointer flex items-center bg-secondary text-foreground rounded-lg py-1 px-3 mb-2 max-w-[288px]">
            <p className='mr-2'>📚</p>
            <p className="text-sm">
              Learn more about Lens Protocol.
            </p>
            <ArrowRight className='ml-2' size={14} />
          </div>
        </a>
        <h1 className="text-5xl font-bold mt-3">
          Social Explorer
        </h1>
        <p className="mt-4 max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          An application boilerplate built with a modern stack. Simple to get started building your first social app. Leveraging ShadCN, Lens Protocol, Next.js, and WalletConnect.
        </p>
      </div>
      <Button variant={'outline'} onClick={approveGHOSpender} className="mt-4">
        Approve GHOSpender
      </Button>
      <Button variant={'outline'} onClick={createPost} className="mt-4">
        Create Post
      </Button>
      <div className="mt-[70px] flex ml-2">
        <div>
          <Button
            variant="ghost"
            onClick={() => setDashboardType('dashboard')}
            className={
              `${dashboardType !== 'dashboard' ? 'opacity-60' : ''}`
            }>My dashboard</Button>
        </div>
        <div className="ml-4">
          <Button
            variant="ghost"
            onClick={() => setDashboardType('algorithms')}
            className={
              `${dashboardType !== 'recommendation algorithms' ? 'opacity-50' : ''}`
            }>Choose your algorithm</Button>
        </div>
      </div>

      {
        dashboardType === 'algorithms' && (
          <div className='md:flex min-h-[300px] mt-3 px-6'>
            <p>Choose your algorithm coming soon...</p>
          </div>
        )
      }
      {
        dashboardType === 'dashboard' && (<div className='md:flex min-h-[300px] mt-3'>
          <div className="border border rounded-tl rounded-bl md:w-[230px] pt-3 px-2 pb-8 flex-col flex">
            <p className='font-medium ml-4 mb-2 mt-1'>Social Views</p>
            <Button
              onClick={() => setView('profiles')}
              variant={view === 'profiles' ? 'secondary' : 'ghost'} className="justify-start mb-1">
              <PersonStanding size={16} />
              <p className="text-sm ml-2">Profiles</p>
            </Button>
            <Button
              onClick={() => setView('publications')}
              variant={view === 'publications' ? 'secondary' : 'ghost'} className="justify-start mb-1">
              <Newspaper size={16} />
              <p className="text-sm ml-2">Publications</p>
            </Button>
            <Button
              onClick={() => setView('music')}
              variant={view === 'music' ? 'secondary' : 'ghost'}
              className="justify-start mb-1">
              <ListMusic size={16} />
              <p className="text-sm ml-2">Music</p>
            </Button>
            <Button
              onClick={() => setView('collect')}
              variant={view === 'collect' ? 'secondary' : 'ghost'}
              className="justify-start mb-1">
              <Shapes size={16} />
              <p className="text-sm ml-2">Collect</p>
            </Button>
          </div>
          <div
            className="
          sm:border-t sm:border-r sm:border-b
          rounded-tr rounded-br flex flex-1 pb-4">
            {
              view === 'profiles' && (
                <div className="flex flex-1 flex-wrap p-4">
                  {
                    loadingProfiles && (
                      <div className="
                      flex flex-1 justify-center items-center
                    ">
                        <Loader2 className="h-12 w-12 animate-spin" />
                      </div>
                    )
                  }
                  {
                    profiles?.map(profile => (
                      <a
                        key={profile.id}
                        className="
                      lg:w-1/4 sm:w-1/2 p-4 cursor-pointer"
                        rel="no-opener"
                        target="_blank"
                        href={`https://share.lens.xyz/u/${profile.handle.namespace}/${profile.handle.localName}`}>
                        <div className="space-y-3">
                          <div className="overflow-hidden rounded-md">
                            <img
                              className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                              src={profile.metadata?.picture?.optimized?.uri
                              } />
                          </div>
                          <div className="space-y-1 text-sm">
                            <h3 className="font-medium leading-none">{profile.handle.localName}.{profile.handle.namespace}</h3>
                            <p className="text-xs text-muted-foreground">{profile.metadata?.displayName}</p>
                          </div>
                        </div>
                      </a>
                    ))
                  }
                </div>
              )
            }
            {
              view === 'publications' && (
                <div className="flex flex-1 flex-wrap flex-col">
                  {
                    loadingPubs && (
                      <div className="
                      flex flex-1 justify-center items-center
                    ">
                        <Loader2 className="h-12 w-12 animate-spin" />
                      </div>
                    )
                  }
                  {
                    publications?.map(publication => (
                      <div
                        className="border-b"
                        key={publication.id}
                        onClick={() => window.open(`https://share.lens.xyz/p/${publication.id}`, '_blank')}
                      >
                        <div
                          className="
                      space-y-3 mb-4 pt-6 pb-2
                      sm:px-6 px-2
                      ">
                          <div className="flex">
                            <Avatar>
                              <AvatarImage src={publication.by?.metadata?.picture?.optimized?.uri} />
                              <AvatarFallback>{publication.by.handle.localName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <h3 className="mb-1 font-medium leading-none">{publication.by.handle.localName}.{publication.by.handle.namespace}</h3>
                              <p className="text-xs text-muted-foreground">{publication.by.metadata?.displayName}</p>
                            </div>
                          </div>
                          <div>
                            <img
                              className={cn(`
                            max-w-full sm:max-w-[500px]
                            rounded-2xl h-auto object-cover transition-all hover:scale-105
                            `)}
                              src={publication.__typename === 'Post' ? publication.metadata?.asset?.image?.optimized.uri : ''}
                            />
                            <ReactMarkdown className="
                          mt-4 break-words
                          ">
                              {publication.metadata.content.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '[LINK]($1)')}
                            </ReactMarkdown>
                          </div>
                          <div>
                            <Button className="rounded-full mr-1" variant="secondary" >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              {publication.stats.comments}
                            </Button>
                            <Button className="rounded-full mr-1" variant="secondary">
                              <Repeat2 className="mr-2 h-4 w-4" />
                              {publication.stats.mirrors}
                            </Button>
                            <Button className="rounded-full mr-1" variant="secondary">
                              <Heart className="mr-2 h-4 w-4" />
                              {publication.stats.upvotes}
                            </Button>
                            <Button className="rounded-full mr-1" variant="secondary">
                              <Grab className="mr-2 h-4 w-4" />
                              {publication.stats.collects}
                            </Button>
                            <Button className="rounded-full mr-1" variant="secondary">
                              <Grab className="mr-2 h-4 w-4" />
                              Tip
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )
            }
            {
              view === 'music' && (
                <div className="flex flex-1 flex-wrap flex-col">
                  {
                    loadingMusicPubs && (
                      <div className="
                      flex flex-1 justify-center items-center
                    ">
                        <Loader2 className="h-12 w-12 animate-spin" />
                      </div>
                    )
                  }
                  {
                    musicPubs?.map(publication => (
                      <div
                        className="border-b"
                        key={publication.id}
                        onClick={() => window.open(`https://share.lens.xyz/p/${publication.id}`, '_blank')}
                      >
                        <div className="space-y-3 mb-4 p-4">
                          <div className="flex">
                            <Avatar>
                              <AvatarImage src={publication.by?.metadata?.picture?.optimized?.uri} />
                              <AvatarFallback>{publication.by.handle.fullHandle.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <h3 className="mb-1 font-medium leading-none">{publication.by.handle.localName}.{publication.by.handle.namespace}</h3>
                              <p className="text-xs text-muted-foreground">{publication.by.handle.fullName}</p>
                            </div>
                          </div>
                          <div>
                            <img
                              className={cn(`
                             max-w-full sm:max-w-[500px] mb-3
                             rounded-2xl h-auto object-cover transition-all hover:scale-105
                             `)}
                              src={publication.__typename === 'Post' ?
                                publication.metadata?.asset?.cover?.optimized?.uri ?
                                  publication.metadata?.asset?.cover?.optimized?.uri :
                                  publication.metadata?.asset?.cover?.optimized?.raw?.uri : ''}
                            />
                            <audio controls>
                              <source
                                type={publication.metadata?.asset?.audio?.optimized?.mimeType}
                                src={publication.metadata?.asset?.audio?.optimized?.uri}
                              />
                            </audio>
                            <ReactMarkdown className="
                          mt-4 break-words
                          ">
                              {publication.metadata.content.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '[LINK]($1)')}
                            </ReactMarkdown>
                          </div>
                          <div>
                            <Button className="rounded-full mr-1" variant="secondary" >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              {publication.stats.comments}
                            </Button>
                            <Button className="rounded-full mr-1" variant="secondary">
                              <Repeat2 className="mr-2 h-4 w-4" />
                              {publication.stats.mirrors}
                            </Button>
                            <Button className="rounded-full mr-1" variant="secondary">
                              <Heart className="mr-2 h-4 w-4" />
                              {publication.stats.upvotes}
                            </Button>
                            <Button className="rounded-full mr-1" variant="secondary">
                              <Grab className="mr-2 h-4 w-4" />
                              {publication.stats.collects}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )
            }
          </div>
        </div>)
      }
    </main>
  )
}
