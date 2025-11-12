// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PUSDv3 is ERC20, Pausable, Ownable {
    mapping(address => bool) public blacklisted;
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 6; // 100M cap

    event Blacklisted(address indexed account);
    event Unblacklisted(address indexed account);
    event Redeemed(address indexed user, uint256 amount, string currency);

    constructor() ERC20("Pegged USDv3", "PUSDv3") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(!blacklisted[to], "Recipient blacklisted");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    // redeem() now checks blacklist + pause
    function redeem(
        uint256 amount,
        string memory currency
    ) public whenNotPaused {
        require(!blacklisted[msg.sender], "Sender blacklisted");
        _burn(msg.sender, amount);
        emit Redeemed(msg.sender, amount, currency);
    }

    // Owner controls
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function blacklist(address account) public onlyOwner {
        require(account != address(0), "Zero address");
        blacklisted[account] = true;
        emit Blacklisted(account);
    }

    function unblacklist(address account) public onlyOwner {
        blacklisted[account] = false;
        emit Unblacklisted(account);
    }

    // FINAL OVERRIDE — BLOCKS transfer + transferFrom + mint + burn
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override whenNotPaused {
        require(!blacklisted[from], "Sender blacklisted");
        require(!blacklisted[to], "Recipient blacklisted");
        super._update(from, to, value);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
