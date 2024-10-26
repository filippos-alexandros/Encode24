# Will Smart Contract
# Encode 24
# Reward: Best Real World Blockchain Use Case (with mock-up demo)

## Overview
The Will smart contract manages the inheritance of assets, including ETH, ERC20 tokens, and NFTs. The contract allows the owner to allocate assets to beneficiaries with specific release times and restriction categories. Beneficiaries can claim their inheritance after the owner's death is confirmed. Additionally, beneficiaries can transfer part of their allocated assets to another address, subject to certain restrictions.

## Features
- **Add Funds**: The owner can allocate ETH, ERC20 tokens, and NFTs to beneficiaries with specified release times and restriction categories.
- **Confirm Death**: The owner's death can be confirmed either by inactivity or directly by an oracle.
- **Claim Inheritance**: Beneficiaries can claim their allocated assets after the owner's death is confirmed.
- **Transfer Assets**: Beneficiaries can transfer part of their allocated assets to another address, subject to restriction checks.

## Contract Details

### State Variables
- `owner`: The address of the contract owner.
- `isConfirmedDead`: A boolean indicating whether the owner's death is confirmed.
- `lastAliveTimestamp`: The timestamp of the last activity by the owner.
- `DEATH_INTERVAL`: The interval after which the owner is considered dead if inactive.
- `beneficiaries`: An array of Beneficiary structs storing beneficiary details.
- `beneficiaryIndex`: A mapping from beneficiary addresses to their index in the beneficiaries array.

### Structs
- **Beneficiary**
```
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
```
### Functions

#### Constructor
Initializes the contract, setting the owner and the initial lastAliveTimestamp.

#### Modifiers
- **onlyOwner**: Ensures that only the owner can call the function.
- **onlyBeneficiary**: Ensures that only a beneficiary can call the function.
- **onlyIfConfirmedDead**: Ensures that the owner's death is confirmed before calling the function.

#### Public Functions

- `editDeathInterval(uint256 _deathInterval)`: Allows the owner to edit the death interval.
- `stillAlive()`: Updates the lastAliveTimestamp to reset the death interval countdown.
- `checkDeath()`: Checks the death status based on inactivity.
- `dead()`: Confirms the owner's death directly by an oracle.
- `addFund(...)`: Adds assets to a beneficiary.
- `updateRestrictionCategory(address _beneficiary, string memory _restrictionCategory)`: Updates the restriction category for a beneficiary.
- `claimInheritance(address _beneficiaryAddress)`: Allows beneficiaries to claim their inheritance after the owner's death is confirmed.
- `transferAssets(address to, uint256 ethAmount, uint256 tokenAmount)`: Allows beneficiaries to transfer part of their allocated assets to another address.

#### Internal Functions
- `addBeneficiary(...)`: Adds a new beneficiary.
- `addMore(...)`: Adds more assets to an existing beneficiary.
- `catCheckPass(string memory restrictionCategory)`: Checks if the restriction category is "none".

## Example Usage
- **Adding Funds**
- ```
will.addFund(
    beneficiaryAddress,
    ethAmount,
    ethReleaseTime,
    tokenAmount,
    tokenReleaseTime,
    erc20TokenAddress,
    nftTokenId,
    nftReleaseTime,
    nftContractAddress,
    restrictionCategory

);```
- **Claiming Inheritance**
- ```
will.claimInheritance(beneficiaryAddress);
- ```
- **Transferring Assets**
- ```
will.transferAssets(recipientAddress, ethAmount, tokenAmount);
- ```

## Deployment
To deploy the contract, use the following steps:
1. Compile the contract using a Solidity compiler.
2. Deploy the contract to the desired Ethereum network.
3. Interact with the contract using a web3 provider or a frontend interface.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

