// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MyToken} from "../src/MyToken.sol";

contract CounterScript is Script {
    MyToken public token;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        token = new MyToken(
            vm.envAddress("OWNER"),
            vm.envString("NAME"),
            vm.envString("TICKER")
        );

        vm.stopBroadcast();
    }
}
