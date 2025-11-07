// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PUSDv2 is ERC20, Ownable {
    constructor() ERC20("Pegged USDv2", "PUSDv2") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // REDEEM: Burn PUSD + emit event (off-chain USD trigger)
    event Redeemed(address indexed user, uint256 amount, string currency);

    function redeem(uint256 amount, string memory currency) public {
        _burn(msg.sender, amount);
        emit Redeemed(msg.sender, amount, currency);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}