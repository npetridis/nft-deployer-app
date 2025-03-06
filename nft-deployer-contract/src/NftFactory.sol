// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "./NftCollection.sol";

/**
 * @title NFT Factory Contract
 * @dev Factory contract that deploys customizable NFT collections
 */
contract NftFactory is Ownable {
    // Events
    event CollectionCreated(
        address indexed collectionAddress, 
        string name, 
        string symbol, 
        address indexed owner
    );

    // State variables
    mapping(address => address[]) private _userCollections;
    address[] private _allCollections;
    
    // Fee settings
    uint256 public deploymentFee = 0.01 ether;
    address public feeRecipient;
    
    /**
     * @dev Constructor that sets the fee recipient
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        feeRecipient = initialOwner;
    }
    
    /**
     * @dev Creates a new NFT collection
     * @param name Name of the NFT collection
     * @param symbol Symbol of the NFT collection
     * @param baseURI Base URI for NFT metadata
     * @param maxSupply Maximum supply for the collection (0 for unlimited)
     */
    function createCollection(
        string memory name,
        string memory symbol,
        string memory baseURI,
        uint256 maxSupply
    ) external payable returns (address) {
        // Check if deployment fee is paid
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        
        // Deploy the new NFT collection contract
        NftCollection newCollection = new NftCollection(
            name,
            symbol,
            baseURI,
            maxSupply,
            msg.sender
        );
        
        // Store the deployed contract addresses
        address collectionAddress = address(newCollection);
        _userCollections[msg.sender].push(collectionAddress);
        _allCollections.push(collectionAddress);
        
        // Forward the fee to the recipient
        (bool sent, ) = feeRecipient.call{value: msg.value}("");
        require(sent, "Failed to send deployment fee");
        
        // Emit event
        emit CollectionCreated(collectionAddress, name, symbol, msg.sender);
        
        return collectionAddress;
    }
    
    /**
     * @dev Gets all collections deployed by a specific user
     * @param user Address of the user
     * @return Array of collection addresses
     */
    function getCollectionsByUser(address user) external view returns (address[] memory) {
        return _userCollections[user];
    }
    
    /**
     * @dev Gets all deployed collections
     * @return Array of all collection addresses
     */
    function getAllCollections() external view returns (address[] memory) {
        return _allCollections;
    }
    
    /**
     * @dev Sets the deployment fee
     * @param newFee New fee amount in wei
     */
    function setDeploymentFee(uint256 newFee) external onlyOwner {
        deploymentFee = newFee;
    }
    
    /**
     * @dev Sets the fee recipient
     * @param newRecipient Address of the new fee recipient
     */
    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid fee recipient");
        feeRecipient = newRecipient;
    }
}