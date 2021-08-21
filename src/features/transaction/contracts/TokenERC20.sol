// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20PresetMinterPauser
import '@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol';

contract TokenERC20 is ERC20PresetMinterPauser {
    constructor(
        string memory name,
        string memory symbol,
        string memory initialSupply
    ) ERC20PresetMinterPauser(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        uint256 supply = _parseInt(initialSupply, decimals());
        _mint(msg.sender, supply);
    }

    function _parseInt(string memory _a, uint256 _b) internal pure returns (uint256) {
        bytes memory bresult = bytes(_a);
        uint256 mint = 0;
        bool decimals = false;
        for (uint256 i = 0; i < bresult.length; i++) {
            uint256 c = uint256(uint8(bresult[i]));
            if ((c >= 48) && (c <= 57)) {
                if (decimals) {
                    if (_b == 0) break;
                    else _b--;
                }
                mint *= 10;
                mint += c - 48;
            } else if (c == 46) decimals = true;
        }
        if (_b > 0) mint *= 10**_b;
        return mint;
    }
}
