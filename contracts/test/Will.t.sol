// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Will} from "../src/Will.sol";
import "./MockERC20.sol";
import "./MockERC721.sol";

contract WillTest is Test {
    Will public will;

    address owner;
    address beneficiary;

    MockERC20 mockToken;
    MockERC721 mockNFT;

    function setUp() public {
        owner = address(0x1);
        vm.deal(owner, 10 ether);

        mockToken = new MockERC20();
        mockNFT = new MockERC721();

        mockNFT.mint(owner); // Mint NFT to the owner

        beneficiary = address(0x2);
        vm.prank(owner);
        will = new Will();
    }

    function test_checkOwner() public view {
        assertEq(will.owner(), owner);
    }

    function test_CheckDeath() public {
        vm.prank(owner);
        will.stillAlive();
        vm.warp(block.timestamp + 6 weeks);
        will.checkDeath();
        assertTrue(will.isConfirmedDead(), "Owner should be confirmed dead");
    }

    function test_AddBeneficiary() public {
        uint256 ethAmount = 1 ether;
        uint256 ethReleaseTime = block.timestamp + 1 days;
        uint256 tokenAmount = 0;
        uint256 tokenReleaseTime = block.timestamp + 7 days;
        address erc20Token = address(mockToken); // Use the mock token address
        uint256 nftTokenId = 0; // Assuming you have a valid NFT ID
        uint256 nftReleaseTime = block.timestamp + 30 days;
        address nftContract = address(mockNFT); // Use the mock NFT address

        // Approve the Will contract to spend tokens
        vm.prank(owner);
        mockToken.approve(address(will), tokenAmount);

        // Add the fund (beneficiary) to the Will
        vm.prank(owner);
        will.addFund{value: ethAmount}(
            beneficiary,
            ethAmount,
            ethReleaseTime,
            tokenAmount,
            tokenReleaseTime,
            erc20Token,
            nftTokenId,
            nftReleaseTime,
            nftContract,
            "none"
        );

        // Simulate the owner's death
        vm.prank(owner);
        will.stillAlive();
        vm.warp(block.timestamp + 6 weeks);
        will.checkDeath();

        // Claim inheritance as the beneficiary
        vm.prank(beneficiary);
        will.claimInheritance(beneficiary);

        // Check the beneficiary's balance
        assertEq(beneficiary.balance, ethAmount, "Beneficiary should have received the inheritance");
    }
}
