<a id="readme-top"></a>
# Based Legacy
## Encode 24
## Best project built on Base.
## Best real world Blockchain use case
## Summary
<!-- TABLE OF CONTENTS -->
<h2>Table of Contents</h2>
<details>
    <summary>Table of Contents</summary>
    <ol>
        <li><a href="## Project Overview">Project Overview</a></li>
        <li><a href="## Tech-stack">Tech Stack</a></li>
        <li><a href="## Features">Features</a></li>
        <li><a href="## Demo">Demo</a></li>
        <li><a href="## Getting-started">Getting Started</a></li>
        <li><a href="## Smart-contract">Smart Contract</a></li>
        <li><a href="## Frontend-application">Frontend Application</a></li>
        <li><a href="## Future-improvements">Future Improvements</a></li>
        <li><a href="## License">License</a></li>
    </ol>
</details>

## Project Overview
The Will smart contract manages the inheritance of assets, including ETH, ERC20 tokens, and NFTs. The contract allows the owner to allocate assets to beneficiaries with specific release times and restriction categories. Beneficiaries can claim their inheritance after the owner's death is confirmed. Additionally, beneficiaries can transfer part of their allocated assets to another address, subject to certain restrictions.

## Tech-stack
### Smart Contract
- **Solidity**: Language used to write the smart contracts.

### Frontend
- **React**: JavaScript library for building the user interface.
- **Ethers.js**: To interact with the Ethereum blockchain.

### Tools
- **Hardhat / Truffle**: For smart contract development and testing.
- **Coin Smart Wallet**: For Ethereum wallet integration.


## Features
- **Coinbase Smart wallet**: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
- **Add Funds**: The owner can allocate ETH, ERC20 tokens, and NFTs to beneficiaries with specified release times and restriction categories.
- **Confirm Death**: The owner's death can be confirmed either by inactivity or directly by an demo oracle.
- **Claim Inheritance**: Users can claim their allocated assets to predefined Beneficiaries after the owner's death is confirmed.
- **Transfer Assets**: Beneficiaries can transfer part of their allocated assets to another address, subject to restriction checks.

## Demo
## Getting-started
1. Get a free Coin Base Smart Wallet at [https://wallet.coinbase.com/](https://wallet.coinbase.com/)
2. Clone the repo
   ```sh
   git clone https://github.com/filippos-alexandros/Encode24
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. 
   ```js
   const xxxxxxxxxxxxxxxxxx;
   ```

## smart-contract
### Contracts Overview
The smart contracts in this project manage the inheritance of digital assets, including ETH, ERC20 tokens, and NFTs. The main contract, the "Will" contract, enables the owner to allocate assets to beneficiaries with specified release times and restrictions. Beneficiaries can claim assets only after the owner's death is confirmed, either through inactivity or an external trigger.

### Contracts

1. **Will Contract**: Handles the allocation and distribution of assets to beneficiaries.
    - **Functions**:
      - `addFund`: Allows the owner to allocate assets (ETH, ERC20, and NFTs) to a beneficiary, with optional release times and restrictions.
      - `editDeathInterval`: Updates the interval after which inactivity confirms the owner's death.
      - `stillAlive`: Updates the timestamp to confirm the owner is still alive, preventing auto-confirmation of death.
      - `checkDeath`: Checks if the owner’s inactivity has surpassed the set interval to confirm death.
      - `dead`: Manually confirms the owner's death.
      - `addBeneficiary`: Adds a new beneficiary to the contract.
      - `addMore`: Adds additional assets to an existing beneficiary.
      - `updateRestrictionCategory`: Updates the restriction category for a beneficiary.
      - `claimInheritance`: Allows a beneficiary to claim allocated assets if release time conditions are met.
      - `transferAssets`: Lets beneficiaries transfer part of their allocated assets to another address if restrictions are met.
      
      ```solidity
      function addFund(
            address beneficiaryAddress,
            uint256 ethAmount,
            uint256 ethReleaseTime,
            uint256 tokenAmount,
            uint256 tokenReleaseTime,
            address erc20TokenAddress,
            uint256 nftTokenId,
            uint256 nftReleaseTime,
            address nftContractAddress,
            string memory restrictionCategory
      ) public {
            // Function logic to add funds
      }
      ```

2. **Deployer Contract**: Deploys new instances of the Will contract.
    - **Functions**:
      - `deployWillContract`: Creates a new instance of the Will contract and returns its address. Emits an event with the new contract's address.

      ```solidity
      function deployWillContract() external returns (address) {
            Will newContract = new Will();
            emit ContractDeployed(address(newContract));
            return address(newContract);
      }
      ```

## Frontend-application
## Future-improvements
## License
This project is licensed under the MIT License. See the LICENSE file for details.
