// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20PresetMinterPauser
import '@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol';

contract TokenERC20 is ERC20PresetMinterPauser {
  uint8 _decimals = 18;

  constructor(
    string memory name,
    string memory symbol,
    uint8 decimalPlaces,
    string memory initialSupply
  ) ERC20PresetMinterPauser(name, symbol) {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(PAUSER_ROLE, msg.sender);
    _setupRole(MINTER_ROLE, msg.sender);

    _decimals = decimalPlaces;
    uint256 supply = _parseInt(initialSupply, _decimals);
    _mint(msg.sender, supply);
  }

  function decimals() public view override returns (uint8) {
    return _decimals;
  }

  function _parseInt(string memory _a, uint256 _b) internal pure returns (uint256) {
    bytes memory bresult = bytes(_a);
    uint256 mintAmount = 0;
    bool isDecimals = false;
    for (uint256 i = 0; i < bresult.length; i++) {
      uint256 c = uint256(uint8(bresult[i]));
      if ((c >= 48) && (c <= 57)) {
        if (isDecimals) {
          if (_b == 0) break;
          else _b--;
        }
        mintAmount *= 10;
        mintAmount += c - 48;
      } else if (c == 46) isDecimals = true;
    }
    if (_b > 0) mintAmount *= 10**_b;
    return mintAmount;
  }
}
