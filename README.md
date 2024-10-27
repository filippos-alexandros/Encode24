<a  id="readme-top"></a>

# BASED Legacy

## Encode 24

### Best project built on Base

### Best real world Blockchain use case
<!-- TABLE OF CONTENTS -->

<h2>Table of Contents</h2>

<details>

<summary>Table of Contents</summary>

<ol>

<li>Project Overview</a></li>

<li>Tech Stack</a></li>

<li>Features</a></li>

<li>Demo</a></li>

<li>Getting Started</a></li>

<li>Smart Contract</a></li>

<li>Frontend Application</a></li>

<li>Future Improvements</a></li>

<li>License</a></li>

</ol>

</details>



## Project Overview

We created a BASED solution allowing users to automatically distribute assets upon their passing. Users are further able to create rules for this process (ex. restricting a kid to spend certain funds on education after reaching university age). This easy to create legacy plan allows users’ families to bypass the traditional path of lengthy familial arguments and costly hearings in probate court during their time of mourning.



Abstracted out, our idea framework can be used in many situations. A user can create a recovery mechanism by employing the activity monitor to send all their assets to another one of their wallets if no activity has occurred in the last X days. In addition, users could set aside funds for their ex-spouse to take the children on a trip without worrying if the funds will be spent on the trip or elsewhere.



BASED Legacy will get more money into the hands of loved ones and reduce stress in bereavement.



## Tech Stack

### Smart Contracts

-  **Solidity**



### Frontend

-  **React**: JavaScript library for building the user interface

-  **Ethers.js**: To interact with the Ethereum network



### Tools

-  **Hardhat / Truffle**: Smart contract development and testing

-  **Coinbase Smart Wallet**: Wallet integration

- **OnchainKit**: Initiate transactions and ingest receipts




## Features

-  **Coinbase Smart Wallet**: Seamlessly connect your wallet to begin creating a legacy plan.

-  **Add Funds**: The owner can allocate ETH, ERC20 tokens, and NFTs to beneficiaries with specified release times and restriction categories.

-  **Confirm Death**: The owner's death can be confirmed either by inactivity or directly by a demo oracle.

-  **Claim Inheritance**: Users can claim their allocated assets to predefined beneficiaries after the owner's death is confirmed.

-  **Transfer Assets**: Beneficiaries can transfer part of their allocated assets to another address, subject to restriction checks.



## Demo
[Video Demonstration](https://m.youtube.com/watch?v=lXw58sJfwng)
## Getting Started

1. Get a free Coinbase Smart Wallet at [https://wallet.coinbase.com/](https://wallet.coinbase.com/)

2. Clone the repo

```sh

git clone https://github.com/filippos-alexandros/Encode24

```

3. see [README](https://github.com/filippos-alexandros/Encode24/tree/main/contracts/README.md) in the contracts folder to build and test the contracts

```
cd contracts
```

4. see [README](https://github.com/filippos-alexandros/Encode24/blob/main/interface/README.md) in the interface folder to start the frontend

```
cd interface
```



## Smart Contract

### Contracts Overview

The smart contracts in this project manage the inheritance of digital assets, including ETH, ERC20 tokens, and NFTs. The main contract, Will.sol, enables the owner to allocate assets to beneficiaries with specified release times and restrictions. Beneficiaries can claim assets only after the owner's death is confirmed, either through inactivity or an external trigger.



### Contracts



1.  **Will Contract**: Handles the allocation and distribution of assets to beneficiaries.

-  **Key Functions**:

	-  `addFund`: Allows the owner to allocate assets (ETH, ERC20, and NFTs) to a beneficiary, with optional release times and restrictions.

	-  `stillAlive`: Updates the timestamp to confirm the owner is still alive, preventing auto-confirmation of death.

	-  `checkDeath`: Checks if the owner’s inactivity has surpassed the set interval to confirm death.

	-  `addBeneficiary`: Adds a new beneficiary to the contract.

	-  `claimInheritance`: Allows a beneficiary to claim allocated assets if release time conditions are met.

	-  `transferAssets`: Lets beneficiaries transfer part of their allocated assets to another address if restrictions are met.


**Sample Code for Fund/Asset Allocation**:
```solidity

function  addFund(

address  beneficiaryAddress,

uint256  ethAmount,

uint256  ethReleaseTime,
// Additional parameters...
string  memory  restrictionCategory

) public {

// Function logic to add funds
// Either add funds to an existing beneficiary or create and allocate to a new beneficiary

}

```



2.  **Deployer Contract**: Deploys new instances of the Will contract.

-  **Functions**:

	-  `deployWillContract`: Creates a new instance of the Will contract and returns its address. Emits an event with the new contract's address.


**Sample Code for Deployment**:

```solidity

function  deployWillContract() external  returns (address) {

Will newContract = new  Will();

emit  ContractDeployed(address(newContract));

return  address(newContract);

}

```


## Frontend Application
For more details, please check the README inside the `interface` folder: [Frontend Specification](https://github.com/filippos-alexandros/Encode24/blob/main/interface/README.md)


## Future Improvements
1. Expand to be a generic recovery mechanism
2. Allow for Base names to be inputted as recipients
3. Create oracle to scrape publicly available death records
4. Integrate ZK proofs into oracle
5. Add in considerations for estate taxes

## License

This project is licensed under the MIT License. See the LICENSE file for details.
