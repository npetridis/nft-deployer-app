// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title NFT Collection Contract
 * @dev ERC721 contract for NFT collections created by the factory
 */
contract NftCollection is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    // Events
    event BaseURIChanged(string newBaseURI);
    event TokenMinted(address indexed to, uint256 tokenId, string tokenURI);
    event BatchMinted(address indexed to, uint256 startTokenId, uint256 endTokenId);
    
    // State variables
    string private _baseTokenURI;
    uint256 private _tokenIdCounter;
    uint256 private _maxSupply;
    
    /**
     * @dev Constructor for new NFT collection
     * @param name Name of the NFT collection
     * @param symbol Symbol of the NFT collection
     * @param baseURI Base URI for NFT metadata
     * @param maxSupply Maximum supply (0 for unlimited)
     * @param initialOwner Owner of the NFT collection
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        uint256 maxSupply,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        _baseTokenURI = baseURI;
        _maxSupply = maxSupply;
    }
    
    /**
     * @dev Mint a new NFT
     * @param to Address to receive the NFT
     * @param tokenURI URI for token metadata
     * @return tokenId The ID of the newly minted token
     */
    function mint(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        // Check max supply if set
        if (_maxSupply > 0) {
            require(totalSupply() < _maxSupply, "Max supply reached");
        }
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit TokenMinted(to, tokenId, tokenURI);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint multiple NFTs with sequential IDs
     * @param to Address to receive the NFTs
     * @param amount Number of NFTs to mint
     * @return firstTokenId The ID of the first minted token
     */
    function mintBatch(address to, uint256 amount) external onlyOwner returns (uint256) {
        require(amount > 0, "Must mint at least one token");
        
        // Check max supply if set
        if (_maxSupply > 0) {
            require(totalSupply() + amount <= _maxSupply, "Would exceed max supply");
        }
        
        uint256 firstTokenId = _tokenIdCounter;
        uint256 lastTokenId = firstTokenId + amount - 1;
        
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;
            
            _safeMint(to, tokenId);
            // For batch minting, we rely on the baseURI + tokenId pattern
        }
        
        emit BatchMinted(to, firstTokenId, lastTokenId);
        
        return firstTokenId;
    }
    
    /**
     * @dev Set the base URI for all token metadata
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIChanged(newBaseURI);
    }
    
    /**
     * @dev Return maximum supply
     * @return The maximum token supply (0 means unlimited)
     */
    function maxSupply() external view returns (uint256) {
        return _maxSupply;
    }
    
    /**
     * @dev Override the base URI function
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view  returns (bool) {
        address owner = ownerOf(tokenId);
       return owner == msg.sender || 
        getApproved(tokenId) == msg.sender || 
        isApprovedForAll(owner, msg.sender);
    }
    
    /**
     * @dev Burn a token - only callable by token owner or approved address
     * @param tokenId ID of token to burn
     */
    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not approved to burn");
        _burn(tokenId);
    }
    
    /**
     * @dev Override for ERC721Enumerable
     */
    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 tokenId,
    //     uint256 batchSize
    // ) internal override(ERC721, ERC721Enumerable) {
    //     super._beforeTokenTransfer(from, to, tokenId, batchSize);
    // }
    
    // Required overrides for the inherited contracts
    
    // function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    //     super._burn(tokenId);
    // }

    // function _update(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
    //     super._update(from, to, tokenId);
    // }

    function _update(address to, uint256 tokenId, address auth)
    internal
    override(ERC721, ERC721Enumerable)
    returns (address)
{
    address from = _ownerOf(tokenId);
    if (from != address(0) && to != address(0)) {
        revert("Soulbound: Transfer failed");
    }

    return super._update(to, tokenId, auth);
}

function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}