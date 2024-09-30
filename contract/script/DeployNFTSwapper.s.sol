// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {NFTSwapper} from "../src/NFTSwapper.sol";

contract DeployNFTSwapper is Script {
    function run() external {
        uint256 deployerPrivateKey = 0xa204996d053cf1e9abb3bd6001158a91e736c3fce1ab278765f676fce0c07f23;

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the NFTSwapper contract
        NFTSwapper nftSwapper = new NFTSwapper();

        // Log the address of the deployed contract
        console.log("NFTSwapper deployed at:", address(nftSwapper));

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
}
