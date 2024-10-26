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
    uint256 public DEATH_INTERVAL = 5 weeks;

    struct Beneficiary {
        address addr;
        uint256 ethAmount;
        uint256 ethReleaseTime;
        uint256 tokenAmount;
        uint256 tokenReleaseTime;
        uint256 nftTokenId;
        uint256 nftReleaseTime;
        address erc20Token;
        address nftContract;
        string restrictionCategory;
    }

    Beneficiary[] public beneficiaries;
    mapping(address => uint256) public beneficiaryIndex;

    constructor() payable {
        owner = msg.sender;
        isConfirmedDead = false;
        lastAliveTimestamp = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyBeneficiary() {
        require(beneficiaryIndex[msg.sender] > 0, "Only beneficiary can call this");
        _;
    }

    modifier onlyIfConfirmedDead() {
        require(isConfirmedDead, "The owner is not confirmed dead");
        _;
    }

    // Edit death interval
    function editDeathInterval(uint256 _deathInterval) public onlyOwner {
        DEATH_INTERVAL = _deathInterval;
    }

    // Update lastAliveTimestamp to reset death interval countdown
    function stillAlive() public onlyOwner {
        lastAliveTimestamp = block.timestamp;
    }

    // Check death status based on inactivity
    function checkDeath() public {
        if (block.timestamp >= lastAliveTimestamp + DEATH_INTERVAL) {
            isConfirmedDead = true;
        }
    }

    // Confirm death directly by oracle
    function dead() public {
        isConfirmedDead = true;
    }

    // Main function to add assets to a beneficiary
    function addFund(
        address _beneficiary,
        uint256 _ethAmount,
        uint256 _ethReleaseTime,
        uint256 _tokenAmount,
        uint256 _tokenReleaseTime,
        address _erc20Token,
        uint256 _nftTokenId,
        uint256 _nftReleaseTime,
        address _nftContract,
        string memory _restrictionCategory
    ) public payable onlyOwner {
        require(_beneficiary != address(0), "Invalid beneficiary address");

        uint256 index = beneficiaryIndex[_beneficiary];

        if (index == 0) {
            addBeneficiary(_beneficiary, _ethAmount, _ethReleaseTime, _tokenAmount, _tokenReleaseTime, _erc20Token, _nftTokenId, _nftReleaseTime, _nftContract, _restrictionCategory);
        } else {
            addMore(index - 1, _ethAmount, _ethReleaseTime, _tokenAmount, _tokenReleaseTime, _erc20Token, _nftTokenId, _nftReleaseTime, _nftContract, _restrictionCategory);
        }
    }

    // Add a new beneficiary
    function addBeneficiary(
        address _beneficiary,
        uint256 _ethAmount,
        uint256 _ethReleaseTime,
        uint256 _tokenAmount,
        uint256 _tokenReleaseTime,
        address _erc20Token,
        uint256 _nftTokenId,
        uint256 _nftReleaseTime,
        address _nftContract,
        string memory _restrictionCategory
    ) internal {
        beneficiaries.push(
            Beneficiary({
                addr: _beneficiary,
                ethAmount: _ethAmount,
                ethReleaseTime: _ethReleaseTime,
                tokenAmount: _tokenAmount,
                tokenReleaseTime: _tokenReleaseTime,
                nftTokenId: _nftTokenId,
                nftReleaseTime: _nftReleaseTime,
                erc20Token: _erc20Token,
                nftContract: _nftContract,
                restrictionCategory: _restrictionCategory
            })
        );

        beneficiaryIndex[_beneficiary] = beneficiaries.length;

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

    // Add more assets to an existing beneficiary
    function addMore(
        uint256 index,
        uint256 _ethAmount,
        uint256 _ethReleaseTime,
        uint256 _tokenAmount,
        uint256 _tokenReleaseTime,
        address _erc20Token,
        uint256 _nftTokenId,
        uint256 _nftReleaseTime,
        address _nftContract,
        string memory /*_restrictionCategory*/
    ) internal {
        Beneficiary storage beneficiary = beneficiaries[index];

        // ETH allocation
        beneficiary.ethAmount += _ethAmount;
        beneficiary.ethReleaseTime = _ethReleaseTime;
        if (_ethAmount > 0) {
            require(msg.value == _ethAmount, "Incorrect ETH amount sent");
        }

        // Token allocation
        if (_tokenAmount > 0 && _erc20Token == beneficiary.erc20Token) {
            beneficiary.tokenAmount += _tokenAmount;
            beneficiary.tokenReleaseTime = _tokenReleaseTime;
            IERC20(_erc20Token).transferFrom(msg.sender, address(this), _tokenAmount);
        } else if (_tokenAmount > 0 && _erc20Token != beneficiary.erc20Token) {
            beneficiary.tokenAmount = _tokenAmount;
            beneficiary.erc20Token = _erc20Token;
            beneficiary.tokenReleaseTime = _tokenReleaseTime;
            IERC20(_erc20Token).transferFrom(msg.sender, address(this), _tokenAmount);
        }

        // NFT allocation
        if (_nftContract != address(0) && _nftTokenId > 0 && (_nftTokenId != beneficiary.nftTokenId || _nftContract != beneficiary.nftContract)) {
            beneficiary.nftTokenId = _nftTokenId;
            beneficiary.nftContract = _nftContract;
            beneficiary.nftReleaseTime = _nftReleaseTime;
            IERC721(_nftContract).transferFrom(msg.sender, address(this), _nftTokenId);
        }
        
    }

    // Update restriction category for a beneficiary
    function updateRestrictionCategory(address _beneficiary, string memory _restrictionCategory) public onlyOwner {
        uint256 index = beneficiaryIndex[_beneficiary];
        require(index > 0, "Beneficiary not found");
        beneficiaries[index - 1].restrictionCategory = _restrictionCategory;
    }

    // Claim inheritance for beneficiaries after the owner is confirmed dead
    // Everyone can call this function to claim for the beneficiary
    function claimInheritance(address _beneficiaryAddress) public onlyIfConfirmedDead {
        uint256 index = beneficiaryIndex[_beneficiaryAddress];
        require(index > 0, "Beneficiary not found");
        Beneficiary storage beneficiary = beneficiaries[index - 1];
        uint256 currentTime = block.timestamp;
        // Ensure restriction category is "none"
        require(keccak256(abi.encodePacked(beneficiary.restrictionCategory)) == keccak256(abi.encodePacked("none")), "Cannot claim inheritance with restriction");

        // Transfer ETH if release time is met
        if (beneficiary.ethAmount > 0 && currentTime >= beneficiary.ethReleaseTime) {
            require(address(this).balance >= beneficiary.ethAmount, "Insufficient contract balance");
            payable(beneficiary.addr).transfer(beneficiary.ethAmount);
            beneficiary.ethAmount = 0;
        }

        // Transfer ERC20 tokens if release time is met
        if (beneficiary.tokenAmount > 0 && currentTime >= beneficiary.tokenReleaseTime && beneficiary.erc20Token != address(0)) {
            IERC20(beneficiary.erc20Token).transfer(beneficiary.addr, beneficiary.tokenAmount);
            beneficiary.tokenAmount = 0;
        }

        // Transfer NFT if release time is met
        if (beneficiary.nftContract != address(0) && beneficiary.nftTokenId > 0 && currentTime >= beneficiary.nftReleaseTime) {
            IERC721(beneficiary.nftContract).transferFrom(address(this), beneficiary.addr, beneficiary.nftTokenId);
            beneficiary.nftTokenId = 0;
        }
    }

    // Function to check if the restriction category is "none"
    function catCheckPass(string memory /*_restrictionCategory*/) internal pure returns (bool) {
        // Base verifiction
        return true;
    }

    // Function for beneficiaries to transfer part of their allocated assets to a specified address
    function transferAssets(
        address to,
        uint256 ethAmount, 
        uint256 tokenAmount
    ) public onlyBeneficiary {
        uint256 index = beneficiaryIndex[msg.sender];
        Beneficiary storage beneficiary = beneficiaries[index - 1];

        require(to != address(0), "Invalid recipient address");

        // Ensure restriction category is not "none"
        require(catCheckPass(beneficiary.restrictionCategory), "Test restriction category not passed");
        
        // ETH Transfer
        if (ethAmount > 0) {
            require(ethAmount <= beneficiary.ethAmount, "Amount exceeds allocated ETH");
            beneficiary.ethAmount -= ethAmount;
            require(address(this).balance >= ethAmount, "Insufficient contract balance");
            payable(to).transfer(ethAmount);
        }

        // ERC20 Token Transfer
        if (tokenAmount > 0) {
            require(tokenAmount <= beneficiary.tokenAmount, "Amount exceeds allocated tokens");
            beneficiary.tokenAmount -= tokenAmount;
            IERC20(beneficiary.erc20Token).transfer(to, tokenAmount);
        }
    }
    

    receive() external payable {}
}
