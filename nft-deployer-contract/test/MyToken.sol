// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {NftFactory} from "../src/NftFactory.sol";

contract TestContract is Test {
    NftFactory c;
    address owner = address(0x123);

    function setUp() public {
        c = new NftFactory(owner);
    }

    function testBar() public {
        assertEq(uint256(1), uint256(1), "ok");
    }

    function testFoo(uint256 x) public {
        vm.assume(x < type(uint128).max);
        assertEq(x + x, x * 2);
    }
}
