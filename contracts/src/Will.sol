// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract Will {
    address public owner;
    bool public isExecuted;
    struct Beneficiary {
        address addr;
        uint256 ethAmount;
        uint256 tokenAmount;
        uint256 nftTokenId;
        address erc20Token;
        address nftContract;
    }

    Beneficiary[] public beneficiaries;

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

    // Add beneficiary details and deposit assets simultaneously
    function addBeneficiary(
        address _beneficiary,
        uint256 _ethAmount,
        uint256 _tokenAmount,
        address _erc20Token,
        uint256 _nftTokenId,
        address _nftContract
    ) public payable onlyOwner {
        // Transfer ETH to contract if specified
        if (_ethAmount > 0) {
            require(msg.value == _ethAmount, "Incorrect ETH amount sent");
        }

        // Transfer ERC20 tokens to contract if specified
        if (_tokenAmount > 0 && _erc20Token != address(0)) {
            IERC20(_erc20Token).transferFrom(msg.sender, address(this), _tokenAmount);
        }

        // Transfer NFT to contract if specified
        if (_nftContract != address(0)) {
            IERC721(_nftContract).transferFrom(msg.sender, address(this), _nftTokenId);
        }

        // Add beneficiary details to array
        beneficiaries.push(
            Beneficiary({
                addr: _beneficiary,
                ethAmount: _ethAmount,
                tokenAmount: _tokenAmount,
                nftTokenId: _nftTokenId,
                erc20Token: _erc20Token,
                nftContract: _nftContract
            })
        );
    }
    // Trigger to release assets
    function death() public onlyOwner notExecuted {
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            Beneficiary memory beneficiary = beneficiaries[i];

            // Transfer ETH
            if (beneficiary.ethAmount > 0 && address(this).balance >= beneficiary.ethAmount) {
                payable(beneficiary.addr).transfer(beneficiary.ethAmount);
            }

            // Transfer ERC20 tokens
            if (beneficiary.tokenAmount > 0 && beneficiary.erc20Token != address(0)) {
                IERC20(beneficiary.erc20Token).transfer(beneficiary.addr, beneficiary.tokenAmount);
            }

            // Transfer ERC721 NFT
            if (beneficiary.nftContract != address(0)) {
                IERC721(beneficiary.nftContract).transferFrom(address(this), beneficiary.addr, beneficiary.nftTokenId);
            }
        }

        isExecuted = true;  // Prevents re-execution of asset transfers
    }
    // Allows contract to receive ether
    receive() external payable {}
}
