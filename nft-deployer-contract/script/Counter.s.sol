// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {NftFactory} from "../src/NftFactory.sol";

contract CounterScript is Script {
    NftFactory public token;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        token = new NftFactory(0x853A350eB68F23C95E2F7DCf79F16Cdb4059Df8e);
        vm.stopBroadcast();
    }
}
