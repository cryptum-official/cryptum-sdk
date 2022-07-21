// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract TokenERC721 is ERC721Pausable, ERC721Enumerable, ERC721URIStorage, Ownable {
  string private baseURI;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _baseUri
  ) ERC721(_name, _symbol) {
    baseURI = _baseUri;
  }

  function mint(
    address to,
    uint256 tokenId,
    string memory uri
  ) public onlyOwner returns (bool) {
    _mint(to, tokenId);
    _setTokenURI(tokenId, uri);
    return true;
  }

  function mintTokenWithURI(
    address to,
    uint256 tokenId,
    string memory uri
  ) public onlyOwner returns (bool) {
    _mint(to, tokenId);
    _setTokenURI(tokenId, uri);
    return true;
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  function setBaseURI(string memory _uri) public onlyOwner {
    baseURI = _uri;
  }

  function setURI(uint256 _id, string memory _uri) public onlyOwner {
    _setTokenURI(_id, _uri);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return ERC721URIStorage.tokenURI(tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable, ERC721Pausable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    return ERC721URIStorage._burn(tokenId);
  }

  function mintBatch(
    address[] memory to,
    uint256[] memory tokenId,
    string[] memory uris
  ) public onlyOwner returns (bool) {
    for (uint256 i = 0; i < to.length; i++) {
      _mint(to[i], tokenId[i]);
      _setTokenURI(tokenId[i], uris[i]);
    }
    return true;
  }

  function burn(uint256 tokenId) external {
    require(_isApprovedOrOwner(_msgSender(), tokenId), 'caller is not owner nor approved');
    _burn(tokenId);
  }

  function safeTransfer(address to, uint256 tokenId) external {
    safeTransferFrom(_msgSender(), to, tokenId);
  }

  struct Token {
    uint256 id;
    string uri;
  }

  function tokensOfOwner(
    address ownerAccount,
    uint256 startIndex,
    uint256 endIndex
  ) external view returns (Token[] memory) {
    require(ownerAccount != address(0x0), 'Zero address');
    Token[] memory tokens;
    uint256 balance = balanceOf(ownerAccount);
    require(startIndex <= balance && startIndex < endIndex, 'Out of bounds');
    if (balance == 0) {
      return tokens;
    }
    if (endIndex > balance) {
      endIndex = balance;
    }
    tokens = new Token[](endIndex - startIndex);
    for (uint256 i = 0; i < endIndex - startIndex; ++i) {
      uint256 id = tokenOfOwnerByIndex(ownerAccount, i + startIndex);
      string memory uri = tokenURI(id);
      tokens[i] = Token(id, uri);
    }
    return tokens;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }
}
