// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Will.sol";

contract Deployer {
    event ContractDeployed(address indexed contractAddress);

    function deployWillContract() external returns (address) {
        Will newContract = new Will();
        emit ContractDeployed(address(newContract));
        return address(newContract);
    }
}