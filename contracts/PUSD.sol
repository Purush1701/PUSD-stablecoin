// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PUSD is ERC20, Ownable {
    constructor() ERC20("Pegged USD", "PUSD") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // 1M PUSD
    }

    // Optional: Allow owner to mint more
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // 6 decimals like USDT
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}