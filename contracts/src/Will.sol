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
    bool public isConfirmedDead;
    uint256 public lastAliveTimestamp;
    uint256 public constant DEATH_INTERVAL = 5 weeks;
    function editDeathInterval(uint256 _deathInterval) public onlyOwner {
        DEATH_INTERVAL = _deathInterval;
    }
    // Update the last alive timestamp to extend the deadline
    function stillAlive() public onlyOwner {
        lastAliveTimestamp = block.timestamp;
    }

    // Check if the death interval has passed
    function checkDeath() public {
        if (block.timestamp >= lastAliveTimestamp + DEATH_INTERVAL) {
            isConfirmedDead = true;
        }
    }
    struct Beneficiary {
        address addr;
        uint256 ethAmount;
        uint256 tokenAmount;
        uint256 nftTokenId;
        uint256 releaseTime;
        address erc20Token;
        address nftContract;
    }

    Beneficiary[] public beneficiaries;
    mapping(address => uint256) public beneficiaryIndex; // Maps address to index in beneficiaries array (+1 to avoid default 0)

    constructor() payable {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyIfConfirmedDead() {
        require(isConfirmedDead, "The owner is not confirmed dead");
        _;
    }

    // Confirm owner's death, allowing claims to be triggered by anyone
    // oracle port 
    function dead() public onlyOwner {
        isConfirmedDead = true;
    }

    // Main function to add assets to a beneficiary
    function addFund(
        address _beneficiary,
        uint256 _ethAmount,
        uint256 _tokenAmount,
        address _erc20Token,
        uint256 _nftTokenId,
        address _nftContract,
        uint256 _releaseTime
    ) public payable onlyOwner {
        require(_beneficiary != address(0), "Invalid beneficiary address");

        // Check if the beneficiary already exists
        uint256 index = beneficiaryIndex[_beneficiary];

        if (index == 0) {
            // Beneficiary does not exist, so add a new one
            addBeneficiary(_beneficiary, _ethAmount, _tokenAmount, _erc20Token, _nftTokenId, _nftContract, _releaseTime);
        } else {
            // Beneficiary exists, so add more assets to their existing allocation
            addMore(index - 1, _ethAmount, _tokenAmount, _erc20Token, _nftTokenId, _nftContract, _releaseTime);
        }
    }

    // Helper function to add a new beneficiary
    function addBeneficiary(
        address _beneficiary,
        uint256 _ethAmount,
        uint256 _tokenAmount,
        address _erc20Token,
        uint256 _nftTokenId,
        address _nftContract,
        uint256 _releaseTime
    ) internal {
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

        // Map the address to the index in beneficiaries array (+1 to avoid default 0)
        beneficiaryIndex[_beneficiary] = beneficiaries.length;

        // Transfer ETH and tokens if specified
        if (_ethAmount > 0) {
            require(msg.value == _ethAmount, "Incorrect ETH amount sent");
        }
        if (_tokenAmount > 0 && _erc20Token != address(0)) {
            IERC20(_erc20Token).transferFrom(msg.sender, address(this), _tokenAmount);
        }
        if (_nftContract != address(0) && _nftTokenId > 0) {
            IERC721(_nftContract).transferFrom(msg.sender, address(this), _nftTokenId);
        }
    }

    // Helper function to add more assets to an existing beneficiary
    function addMore(
        uint256 index,
        uint256 _ethAmount,
        uint256 _tokenAmount,
        address _erc20Token,
        uint256 _nftTokenId,
        address _nftContract,
        uint256 _releaseTime
    ) internal {
        Beneficiary storage beneficiary = beneficiaries[index];

        // Add ETH to current allocation
        beneficiary.ethAmount += _ethAmount;
        if (_ethAmount > 0) {
            require(msg.value == _ethAmount, "Incorrect ETH amount sent");
        }

        // Add ERC20 tokens to current allocation if it's the same token type
        if (_tokenAmount > 0 && _erc20Token == beneficiary.erc20Token) {
            beneficiary.tokenAmount += _tokenAmount;
            IERC20(_erc20Token).transferFrom(msg.sender, address(this), _tokenAmount);
        } else if (_tokenAmount > 0 && _erc20Token != beneficiary.erc20Token) {
            // If different ERC20 token, update the allocation with new token type and amount
            beneficiary.tokenAmount = _tokenAmount;
            beneficiary.erc20Token = _erc20Token;
            IERC20(_erc20Token).transferFrom(msg.sender, address(this), _tokenAmount);
        }

        // Update NFT allocation if a new NFT is specified
        if (_nftContract != address(0) && _nftTokenId > 0 && (_nftTokenId != beneficiary.nftTokenId || _nftContract != beneficiary.nftContract)) {
            beneficiary.nftTokenId = _nftTokenId;
            beneficiary.nftContract = _nftContract;
            IERC721(_nftContract).transferFrom(msg.sender, address(this), _nftTokenId);
        }

        // Update release time if specified
        if (_releaseTime > 0) {
            beneficiary.releaseTime = _releaseTime;
        }
    }

    // Beneficiaries can claim assets if the owner is confirmed dead
    // Assets will be transferred directly to the beneficiary
    // Everyone can call this function, but assets will only be transferred to the beneficiaries
    function claim() public onlyIfConfirmedDead {
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            Beneficiary storage beneficiary = beneficiaries[i];
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

                // Transfer NFT if specified
                if (beneficiary.nftContract != address(0) && beneficiary.nftTokenId > 0) {
                    IERC721(beneficiary.nftContract).transferFrom(address(this), beneficiary.addr, beneficiary.nftTokenId);
                    beneficiary.nftTokenId = 0;
                }
            }
        }
    }

    // Allows the contract to receive ether directly
    receive() external payable {}
}

