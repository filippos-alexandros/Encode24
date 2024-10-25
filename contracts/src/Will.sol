// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
}

// Define partial NFT ownership structure
// We assume that the NFT contract is ERC721 compliant
struct PartialNFT {
    uint256 tokenId;
    uint256 shares; // Total shares
    mapping(address => uint256) ownerShares; // Each owner's share
}
contract Will {
    address public owner;
    bool public isExecuted;
    
    struct Beneficiary {
        address addr;
        uint256 ethAmount;
        uint256 tokenAmount;
        uint256 nftTokenId;
        uint256 releaseTime; // Time after which assets can be claimed
        address erc20Token;
        address nftContract;
    }

    Beneficiary[] public beneficiaries;
    mapping(uint256 => PartialNFT) public partialNFTs; // For fractionalized NFT ownership

    constructor() payable {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier notExecuted() {
        require(!isExecuted, "Assets have already been distributed");
        _;
    }

    // Add beneficiary details with a release time
    function addBeneficiary(
        address _beneficiary,
        uint256 _ethAmount,
        uint256 _tokenAmount,
        address _erc20Token,
        uint256 _nftTokenId,
        address _nftContract,
        uint256 _releaseTime
    ) public payable onlyOwner {
        // Transfer ETH to contract if specified
        if (_ethAmount > 0) {
            require(msg.value == _ethAmount, "Incorrect ETH amount sent");
        }

        // Transfer ERC20 tokens to contract if specified
        if (_tokenAmount > 0 && _erc20Token != address(0)) {
            IERC20(_erc20Token).transferFrom(msg.sender, address(this), _tokenAmount);
        }

        // Handle NFT: Partial ownership setup
        if (_nftContract != address(0) && _nftTokenId > 0) {
            if (partialNFTs[_nftTokenId].shares == 0) {
                // Initialize the NFT with 100 total shares if not already done
                partialNFTs[_nftTokenId].tokenId = _nftTokenId;
                partialNFTs[_nftTokenId].shares = 100;
                IERC721(_nftContract).transferFrom(msg.sender, address(this), _nftTokenId);
            }
            // Assign 100% ownership if no fractional amount is specified
            partialNFTs[_nftTokenId].ownerShares[_beneficiary] = 100;
        }

        // Add beneficiary details to array
        beneficiaries.push(
            Beneficiary({
                addr: _beneficiary,
                ethAmount: _ethAmount,
                tokenAmount: _tokenAmount,
                nftTokenId: _nftTokenId,
                releaseTime: _releaseTime,
                erc20Token: _erc20Token,
                nftContract: _nftContract
            })
        );
    }
    
    // Function to claim assets (replaces death trigger)
    // Beneficiaries can claim their assets after the release time
    // This function can be called by anyone
    // It will distribute assets to beneficiaries if the release time has passed
    function claim() public notExecuted {
        bool allDistributed = true;

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            Beneficiary storage beneficiary = beneficiaries[i];

            // Check release time for each beneficiary
            if (block.timestamp >= beneficiary.releaseTime) {
                // Transfer ETH
                if (beneficiary.ethAmount > 0 && address(this).balance >= beneficiary.ethAmount) {
                    payable(beneficiary.addr).transfer(beneficiary.ethAmount);
                    beneficiary.ethAmount = 0;
                }

                // Transfer ERC20 tokens
                if (beneficiary.tokenAmount > 0 && beneficiary.erc20Token != address(0)) {
                    IERC20(beneficiary.erc20Token).transfer(beneficiary.addr, beneficiary.tokenAmount);
                    beneficiary.tokenAmount = 0;
                }

                // Handle fractional NFT
                if (beneficiary.nftContract != address(0) && beneficiary.nftTokenId > 0) {
                    uint256 shares = partialNFTs[beneficiary.nftTokenId].ownerShares[beneficiary.addr];
                    if (shares > 0) {
                        // You can add custom logic for fractional NFT transfers or ownership records here
                        // For simplicity, assume full transfer if 100% ownership
                        if (shares == 100) {
                            IERC721(beneficiary.nftContract).transferFrom(address(this), beneficiary.addr, beneficiary.nftTokenId);
                        }
                        // Reset NFT shares
                        partialNFTs[beneficiary.nftTokenId].ownerShares[beneficiary.addr] = 0;
                    }
                }
            } else {
                // Not all assets have been distributed yet due to release time
                allDistributed = false;
            }
        }

        // Prevent re-execution if all assets are distributed
        if (allDistributed) {
            isExecuted = true;
        }
    }

    // Allows contract to receive ether
    receive() external payable {}
}
