# NFT Collection Creator - Project Overview

## Project Description

The NFT Collection Creator is a full-stack web application that allows users to create, deploy, and manage NFT collections on the Arbitrum blockchain without requiring coding knowledge. Users can deploy their own ERC-721 NFT collections, mint new NFTs with uploaded artwork, manage ownership, and list NFTs for sale on marketplaces like OpenSea.

## Core Technologies

### Frontend

- **Next.js**: React framework with App Router for server-side rendering and client components
- **TypeScript**: For type safety and improved developer experience
- **TailwindCSS**: For responsive styling and UI components
- **shadcn/ui**: Component library built on Radix UI for accessible interface elements

### Blockchain Integration

- **Viem**: Modern Ethereum library for interacting with smart contracts
- **Wagmi**: React hooks for Ethereum, built on top of Viem
- **ConnectKit**: Wallet connection library for Web3 login/authentication

### Storage

- **Arweave**: Decentralized permanent storage for NFT metadata and images
- **Next.js Server Actions**: For server-side blockchain operations

### Smart Contracts

- **Solidity**: For the NFT contracts and factory implementation
- **Foundry**: For smart contract development, testing and deployment

## Project Structure

```
nft_collection_creator/
├── ui/                         # Frontend application
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── actions/        # Server actions (Blockchain interactions)
│   │   │   ├── create-collection/ # Collection creation flow
│   │   │   ├── collection/[address]/ # Collection details & NFT management
│   │   │   │   └── mint/       # NFT minting flow
│   │   │   └── collections/    # Collections listing
│   │   ├── components/         # Reusable UI components
│   │   │   └── ui/             # Core UI components
│   │   ├── lib/                # Utility libraries
│   │   │   ├── web3/           # Blockchain interaction logic
│   │   │   │ ├── client.ts     # Client-side Web3 configuration
│   │   │   │ └── server.ts     # Server-side Web3 utilities
│   │   │   └── arweave/        # Arweave storage utilities
│   │   └── types/              # TypeScript type definitions
│   └── public/                 # Static assets and ABI files
│   └── abis/                   # Contract ABIs
├── nft-deployer-contract/      # Smart contract code
│   ├── src/                    # Contract source files
│   │   ├── NftCollection.sol   # ERC-721 NFT implementation
│   │   └── NftFactory.sol      # Factory for deploying collections
│   └── test/                   # Contract tests
```

## Key Flows

### 1. Collection Creation Flow

1. **User connects wallet**: Using ConnectKit integration
2. **Collection configuration**:
   - User enters collection name, symbol, and max supply
   - Form validation with Zod schema
3. **Contract Deployment**:
   - Client-side signs transaction using the wallet (via Wagmi/Viem)
   - Transaction sent to the NftFactory contract to create a new NFT collection
4. **Post-deployment**:
   - Server records the collection details
   - User redirected to collection management page

### 2. NFT Minting Flow

1. **Image upload**:
   - User uploads image for NFT
   - Client-side preview and validation
2. **Metadata creation**:
   - User enters NFT name, description, and attributes
3. **Storage**:
   - Image uploaded to Arweave for permanent storage
   - Metadata JSON created and uploaded to Arweave
4. **Blockchain minting**:
   - Metadata URI passed to the NFT Collection contract
   - User signs mint transaction with connected wallet
5. **Validation**:
   - Ownership verification via server actions
   - Gas optimization for transactions

### 3. Collection Management Flow

1. **Collection details**:
   - View collection statistics (total supply, max supply, etc.)
   - See all minted NFTs in a grid view
2. **Owner actions**:
   - Manage collection settings
   - Access to mint new NFTs (restricted to collection owner)
3. **NFT details**:
   - View individual NFT metadata and attributes
   - Owner can list NFT for sale on OpenSea

### 4. Security and Authentication Flow

1. **Ownership validation**:
   - Server validates if user is collection owner
   - Permission-based UI rendering
2. **Secure transactions**:
   - Client-side signature of transactions
   - Server-side validation of permissions
3. **Environment security**:
   - Sensitive keys stored in environment variables
   - No private keys in client-side code

## Technical Implementation Details

### Smart Contract Architecture

- **NftFactory.sol**: Contract that deploys new NFT collections

  - Tracks deployed collections
  - Contains deployment logic with configurable parameters

- **NftCollection.sol**: Customized ERC-721 implementation
  - Supports metadata
  - Implements owner-based access controls
  - Maintains collection properties (name, symbol, etc.)

### Frontend Architecture

- **Hybrid rendering**: Using Next.js App Router with both server and client components
- **Server Actions**: Secure blockchain read operations and validation
- **Client-side wallet integration**: For transaction signing
- **Progressive enhancement**: Site works with or without wallet connection

### Storage Strategy

1. **NFT Metadata**: JSON files stored on Arweave for immutability
2. **NFT Images**: Stored on Arweave with content addressing
3. **Blockchain**: Only stores minimum data (owner, metadata URI)

### Web3 Integration

- **Public client**: For reading blockchain state
- **Wallet client**: For transaction signing
- **ABIs**: Stored in public directory for contract interaction
- **Custom hooks**: Abstract blockchain complexity for components

## Deployment Information

The smart contracts are deployed on Arbitrum:

- NftFactory Contract: `0xB6Cf9E3B6b6De77d9b1dB2Fb3DbcD84dC0b5ed17`
- Environment Configuration: Uses Arbitrum RPC URL for production

## Security Considerations

- **No private keys in repo**: All sensitive data stored in environment variables
- **Permission checks**: Both client and server-side verification
- **Gas optimization**: Proper estimation to prevent transaction failures
- **Input validation**: Schema validation for all user inputs
- **Secure storage**: Permanent Arweave storage for NFT assets
