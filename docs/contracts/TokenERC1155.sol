// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol';
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';

contract ERC1155 is IERC1155, ERC165, IERC1155MetadataURI {
  using SafeMath for uint256;
  using Address for address;

  bytes4 internal constant ERC1155_ACCEPTED = 0xf23a6e61; // bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))
  bytes4 internal constant ERC1155_BATCH_ACCEPTED = 0xbc197c81; // bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))
  string internal baseURI;
  // id => (owner => balance)
  mapping(uint256 => mapping(address => uint256)) internal balances;
  // owner => (operator => approved)
  mapping(address => mapping(address => bool)) internal operatorApproval;
  mapping(uint256 => string) internal tokenURIs;

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
    return
      interfaceId == type(IERC1155).interfaceId ||
      interfaceId == type(IERC1155MetadataURI).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  function uri(uint256 _id) public view override returns (string memory) {
    string memory _tokenURI = tokenURIs[_id];

    // If there is no base URI, return the token URI.
    if (bytes(baseURI).length == 0) {
      return _tokenURI;
    }
    // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
    if (bytes(_tokenURI).length > 0) {
      return string(abi.encodePacked(baseURI, _tokenURI));
    }
    return baseURI;
  }

  /**
   * @dev Creates `amount` tokens of token type `id`, and assigns them to `to`.
   *
   * Emits a {TransferSingle} event.
   *
   * Requirements:
   *
   * - `to` cannot be the zero address.
   * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
   * acceptance magic value.
   */
  function mint(
    address _to,
    uint256 _id,
    uint256 _amount,
    bytes memory _data
  ) public virtual {
    require(_to != address(0), 'mint to the zero address');

    address _operator = msg.sender;
    _beforeTokenTransfer(_operator, address(0), _to, _asSingletonArray(_id), _asSingletonArray(_amount), _data);

    balances[_id][_to] = balances[_id][_to].add(_amount);
    emit TransferSingle(_operator, address(0), _to, _id, _amount);
    if (_to.isContract()) {
      _doSafeTransferAcceptanceCheck(_operator, address(0), _to, _id, _amount, _data);
    }
  }

  /**
   * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_mint}.
   *
   * Requirements:
   *
   * - `ids` and `amounts` must have the same length.
   * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
   * acceptance magic value.
   */
  function mintBatch(
    address _to,
    uint256[] memory _ids,
    uint256[] memory _amounts,
    bytes memory _data
  ) public virtual {
    require(_to != address(0), 'mint to the zero address');
    require(_ids.length == _amounts.length, 'ids and amounts length mismatch');

    address _operator = msg.sender;

    _beforeTokenTransfer(_operator, address(0), _to, _ids, _amounts, _data);

    for (uint256 i = 0; i < _ids.length; i++) {
      balances[_ids[i]][_to] += _amounts[i];
    }

    emit TransferBatch(_operator, address(0), _to, _ids, _amounts);
    if (_to.isContract()) {
      _doSafeBatchTransferAcceptanceCheck(_operator, address(0), _to, _ids, _amounts, _data);
    }
  }

  /**
   * @dev Destroys `amount` tokens of token type `id` from `from`
   *
   * Requirements:
   *
   * - `from` cannot be the zero address.
   * - `from` must have at least `amount` tokens of token type `id`.
   */
  function burn(
    address from,
    uint256 id,
    uint256 amount
  ) public virtual {
    require(from != address(0), 'burn from the zero address');
    require(
      from == msg.sender || operatorApproval[from][msg.sender] == true,
      'Need operator approval for 3rd party transfers.'
    );
    address operator = msg.sender;

    _beforeTokenTransfer(operator, from, address(0), _asSingletonArray(id), _asSingletonArray(amount), '');

    uint256 fromBalance = balances[id][from];
    require(fromBalance >= amount, 'burn amount exceeds balance');
    unchecked {
      balances[id][from] = fromBalance.sub(amount);
    }

    emit TransferSingle(operator, from, address(0), id, amount);
  }

  /**
   * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_burn}.
   *
   * Requirements:
   *
   * - `ids` and `amounts` must have the same length.
   */
  function burnBatch(
    address from,
    uint256[] memory ids,
    uint256[] memory amounts
  ) public virtual {
    require(from != address(0), 'burn from the zero address');
    require(ids.length == amounts.length, 'ids and amounts length mismatch');
    require(
      from == msg.sender || operatorApproval[from][msg.sender] == true,
      'Need operator approval for 3rd party transfers.'
    );

    address operator = msg.sender;

    _beforeTokenTransfer(operator, from, address(0), ids, amounts, '');

    for (uint256 i = 0; i < ids.length; i++) {
      uint256 id = ids[i];
      uint256 amount = amounts[i];

      uint256 fromBalance = balances[id][from];
      require(fromBalance >= amount, 'burn amount exceeds balance');
      unchecked {
        balances[id][from] = fromBalance.sub(amount);
      }
    }

    emit TransferBatch(operator, from, address(0), ids, amounts);
  }

  /**
        @notice Transfers `_value` amount of an `_id` from the `_from` address to the `_to` address specified (with safety call).
        @dev Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
        MUST revert if `_to` is the zero address.
        MUST revert if balance of holder for token `_id` is lower than the `_value` sent.
        MUST revert on any other error.
        MUST emit the `TransferSingle` event to reflect the balance change (see "Safe Transfer Rules" section of the standard).
        After the above conditions are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call `onERC1155Received` on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).
        @param _from    Source address
        @param _to      Target address
        @param _id      ID of the token type
        @param _value   Transfer amount
        @param _data    Additional data with no specified format, MUST be sent unaltered in call to `onERC1155Received` on `_to`
    */
  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _id,
    uint256 _value,
    bytes calldata _data
  ) public virtual override {
    require(_to != address(0x0), '_to must be non-zero.');
    require(
      _from == msg.sender || operatorApproval[_from][msg.sender] == true,
      'Need operator approval for 3rd party transfers.'
    );

    address _operator = msg.sender;
    _beforeTokenTransfer(_operator, _from, _to, _asSingletonArray(_id), _asSingletonArray(_value), _data);

    // SafeMath will throw with insuficient funds _from
    // or if _id is not valid (balance will be 0)
    balances[_id][_from] = balances[_id][_from].sub(_value);
    balances[_id][_to] = _value.add(balances[_id][_to]);

    // MUST emit event
    emit TransferSingle(msg.sender, _from, _to, _id, _value);

    // Now that the balance is updated and the event was emitted,
    // call onERC1155Received if the destination is a contract.
    if (_to.isContract()) {
      _doSafeTransferAcceptanceCheck(msg.sender, _from, _to, _id, _value, _data);
    }
  }

  /**
        @notice Transfers `_values` amount(s) of `_ids` from the `_from` address to the `_to` address specified (with safety call).
        @dev Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
        MUST revert if `_to` is the zero address.
        MUST revert if length of `_ids` is not the same as length of `_values`.
        MUST revert if any of the balance(s) of the holder(s) for token(s) in `_ids` is lower than the respective amount(s) in `_values` sent to the recipient.
        MUST revert on any other error.
        MUST emit `TransferSingle` or `TransferBatch` event(s) such that all the balance changes are reflected (see "Safe Transfer Rules" section of the standard).
        Balance changes and events MUST follow the ordering of the arrays (_ids[0]/_values[0] before _ids[1]/_values[1], etc).
        After the above conditions for the transfer(s) in the batch are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call the relevant `ERC1155TokenReceiver` hook(s) on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).
        @param _from    Source address
        @param _to      Target address
        @param _ids     IDs of each token type (order and length must match _values array)
        @param _values  Transfer amounts per token type (order and length must match _ids array)
        @param _data    Additional data with no specified format, MUST be sent unaltered in call to the `ERC1155TokenReceiver` hook(s) on `_to`
    */
  function safeBatchTransferFrom(
    address _from,
    address _to,
    uint256[] calldata _ids,
    uint256[] calldata _values,
    bytes calldata _data
  ) external virtual override {
    // MUST Throw on errors
    require(_to != address(0x0), 'destination address must be non-zero.');
    require(_ids.length == _values.length, '_ids and _values array length must match.');
    require(
      _from == msg.sender || operatorApproval[_from][msg.sender] == true,
      'Need operator approval for 3rd party transfers.'
    );

    address _operator = msg.sender;
    _beforeTokenTransfer(_operator, _from, _to, _ids, _values, _data);

    for (uint256 i = 0; i < _ids.length; ++i) {
      uint256 id = _ids[i];
      uint256 value = _values[i];

      // SafeMath will throw with insuficient funds _from
      // or if _id is not valid (balance will be 0)
      balances[id][_from] = balances[id][_from].sub(value);
      balances[id][_to] = value.add(balances[id][_to]);
    }

    // Note: instead of the below batch versions of event and acceptance check you MAY have emitted a TransferSingle
    // event and a subsequent call to _doSafeTransferAcceptanceCheck in above loop for each balance change instead.
    // Or emitted a TransferSingle event for each in the loop and then the single _doSafeBatchTransferAcceptanceCheck below.
    // However it is implemented the balance changes and events MUST match when a check (i.e. calling an external contract) is done.

    // MUST emit event
    emit TransferBatch(msg.sender, _from, _to, _ids, _values);

    // Now that the balances are updated and the events are emitted,
    // call onERC1155BatchReceived if the destination is a contract.
    if (_to.isContract()) {
      _doSafeBatchTransferAcceptanceCheck(msg.sender, _from, _to, _ids, _values, _data);
    }
  }

  /**
        @notice Get the balance of an account's Tokens.
        @param _owner  The address of the token holder
        @param _id     ID of the Token
        @return        The _owner's balance of the Token type requested
     */
  function balanceOf(address _owner, uint256 _id) external view virtual override returns (uint256) {
    // The balance of any account can be calculated from the Transfer events history.
    // However, since we need to keep the balances to validate transfer request,
    // there is no extra cost to also privide a querry function.
    return balances[_id][_owner];
  }

  /**
        @notice Get the balance of multiple account/token pairs
        @param _owners The addresses of the token holders
        @param _ids    ID of the Tokens
        @return        The _owner's balance of the Token types requested (i.e. balance for each (owner, id) pair)
     */
  function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids)
    external
    view
    virtual
    override
    returns (uint256[] memory)
  {
    require(_owners.length == _ids.length);

    uint256[] memory balances_ = new uint256[](_owners.length);

    for (uint256 i = 0; i < _owners.length; ++i) {
      balances_[i] = balances[_ids[i]][_owners[i]];
    }

    return balances_;
  }

  /**
        @notice Enable or disable approval for a third party ("operator") to manage all of the caller's tokens.
        @dev MUST emit the ApprovalForAll event on success.
        @param _operator  Address to add to the set of authorized operators
        @param _approved  True if the operator is approved, false to revoke approval
    */
  function setApprovalForAll(address _operator, bool _approved) external override {
    operatorApproval[msg.sender][_operator] = _approved;
    emit ApprovalForAll(msg.sender, _operator, _approved);
  }

  /**
        @notice Queries the approval status of an operator for a given owner.
        @param _owner     The owner of the Tokens
        @param _operator  Address of authorized operator
        @return           True if the operator is approved, false if not
    */
  function isApprovedForAll(address _owner, address _operator) external view override returns (bool) {
    return operatorApproval[_owner][_operator];
  }

  /**
   * @dev Hook that is called before any token transfer. This includes minting
   * and burning, as well as batched variants.
   *
   * The same hook is called on both single and batched variants. For single
   * transfers, the length of the `id` and `amount` arrays will be 1.
   *
   * Calling conditions (for each `id` and `amount` pair):
   *
   * - When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
   * of token type `id` will be  transferred to `to`.
   * - When `from` is zero, `amount` tokens of token type `id` will be minted
   * for `to`.
   * - when `to` is zero, `amount` of ``from``'s tokens of token type `id`
   * will be burned.
   * - `from` and `to` are never both zero.
   * - `ids` and `amounts` have the same, non-zero length.
   *
   * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
   */
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual {}

  function _doSafeTransferAcceptanceCheck(
    address _operator,
    address _from,
    address _to,
    uint256 _id,
    uint256 _value,
    bytes memory _data
  ) internal {
    // If this was a hybrid standards solution you would have to check ERC165(_to).supportsInterface(0x4e2312e0) here but as this is a pure implementation of an ERC-1155 token set as recommended by
    // the standard, it is not necessary. The below should revert in all failure cases i.e. _to isn't a receiver, or it is and either returns an unknown value or it reverts in the call to indicate non-acceptance.

    // Note: if the below reverts in the onERC1155Received function of the _to address you will have an undefined revert reason returned rather than the one in the require test.
    // If you want predictable revert reasons consider using low level _to.call() style instead so the revert does not bubble up and you can revert yourself on the ERC1155_ACCEPTED test.
    require(
      IERC1155Receiver(_to).onERC1155Received(_operator, _from, _id, _value, _data) == ERC1155_ACCEPTED,
      'contract returned an unknown value from onERC1155Received'
    );
  }

  function _doSafeBatchTransferAcceptanceCheck(
    address _operator,
    address _from,
    address _to,
    uint256[] memory _ids,
    uint256[] memory _values,
    bytes memory _data
  ) internal {
    // If this was a hybrid standards solution you would have to check ERC165(_to).supportsInterface(0x4e2312e0) here but as this is a pure implementation of an ERC-1155 token set as recommended by
    // the standard, it is not necessary. The below should revert in all failure cases i.e. _to isn't a receiver, or it is and either returns an unknown value or it reverts in the call to indicate non-acceptance.

    // Note: if the below reverts in the onERC1155BatchReceived function of the _to address you will have an undefined revert reason returned rather than the one in the require test.
    // If you want predictable revert reasons consider using low level _to.call() style instead so the revert does not bubble up and you can revert yourself on the ERC1155_BATCH_ACCEPTED test.
    require(
      IERC1155Receiver(_to).onERC1155BatchReceived(_operator, _from, _ids, _values, _data) == ERC1155_BATCH_ACCEPTED,
      'contract returned an unknown value from onERC1155BatchReceived'
    );
  }

  function _asSingletonArray(uint256 element) private pure returns (uint256[] memory) {
    uint256[] memory array = new uint256[](1);
    array[0] = element;

    return array;
  }
}

contract TokenERC1155 is ERC1155, Pausable, Ownable {
  using SafeMath for uint256;
  using Address for address;

  string public name;
  string public symbol;
  uint256 public totalSupply; // token count
  mapping(uint256 => uint256) public totalSupplies;
  mapping(uint256 => uint256) public tokenIndexes;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _baseURI
  ) {
    name = _name;
    symbol = _symbol;
    baseURI = _baseURI;
  }

  function setURI(uint256 _id, string memory _uri) public onlyOwner {
    tokenURIs[_id] = _uri;
  }

  function setBaseURI(string memory _uri) public onlyOwner {
    baseURI = _uri;
  }

  function createAndMintNonFungible(address[] calldata _to, string calldata _uri) external onlyOwner {
    uint256 _id = totalSupply++;
    tokenIndexes[_id] = _id;
    setURI(_id, _uri);

    for (uint256 i = 0; i < _to.length; ++i) {
      address dst = _to[i];
      totalSupplies[_id] += 1;
      balances[_id][dst] = 1;

      emit TransferSingle(msg.sender, address(0x0), dst, _id, 1);

      if (dst.isContract()) {
        _doSafeTransferAcceptanceCheck(msg.sender, msg.sender, dst, _id, 1, '');
      }
    }
  }

  function createAndMintFungible(
    address[] calldata _to,
    uint256[] calldata _quantities,
    string calldata _uri
  ) external onlyOwner {
    uint256 _id = totalSupply++;
    tokenIndexes[_id] = _id;
    setURI(_id, _uri);

    for (uint256 i = 0; i < _to.length; ++i) {
      address to = _to[i];
      uint256 quantity = _quantities[i];
      totalSupplies[_id] += quantity;

      balances[_id][to] = quantity.add(balances[_id][to]);

      emit TransferSingle(msg.sender, address(0x0), to, _id, quantity);

      if (to.isContract()) {
        _doSafeTransferAcceptanceCheck(msg.sender, msg.sender, to, _id, quantity, '');
      }
    }
  }

  function mint(
    address _to,
    uint256 _id,
    uint256 _amount,
    bytes memory _data
  ) public override onlyOwner {
    super.mint(_to, _id, _amount, _data);
    if (totalSupplies[_id] == 0) {
      tokenIndexes[totalSupply] = _id;
      ++totalSupply;
    }
    totalSupplies[_id] += _amount;
  }

  function mint(
    address _to,
    uint256 _id,
    uint256 _amount,
    string memory _uri,
    bytes memory _data
  ) public onlyOwner {
    super.mint(_to, _id, _amount, _data);
    setURI(_id, _uri);
    if (totalSupplies[_id] == 0) {
      tokenIndexes[totalSupply] = _id;
      ++totalSupply;
    }
    totalSupplies[_id] += _amount;
  }

  function mintBatch(
    address _to,
    uint256[] memory _ids,
    uint256[] memory _amounts,
    bytes memory _data
  ) public override onlyOwner {
    require(_to != address(0), 'mint to the zero address');
    require(_ids.length == _amounts.length, 'ids and amounts length mismatch');

    address _operator = msg.sender;
    _beforeTokenTransfer(_operator, address(0), _to, _ids, _amounts, _data);
    for (uint256 i = 0; i < _ids.length; i++) {
      balances[_ids[i]][_to] += _amounts[i];
      if (totalSupplies[_ids[i]] == 0) {
        ++totalSupply;
      }
      totalSupplies[_ids[i]] += _amounts[i];
    }

    emit TransferBatch(_operator, address(0), _to, _ids, _amounts);
    if (_to.isContract()) {
      _doSafeBatchTransferAcceptanceCheck(_operator, address(0), _to, _ids, _amounts, _data);
    }
  }

  function burn(
    address from,
    uint256 id,
    uint256 amount
  ) public override onlyOwner {
    super.burn(from, id, amount);
    totalSupplies[id] -= amount;
  }

  function burnBatch(
    address from,
    uint256[] memory ids,
    uint256[] memory amounts
  ) public override onlyOwner {
    super.burnBatch(from, ids, amounts);
    for (uint256 i = 0; i < ids.length; i++) {
      totalSupplies[ids[i]] -= amounts[i];
    }
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  // override
  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _id,
    uint256 _value,
    bytes calldata _data
  ) public override {
    super.safeTransferFrom(_from, _to, _id, _value, _data);
  }

  // override
  function safeBatchTransferFrom(
    address _from,
    address _to,
    uint256[] calldata _ids,
    uint256[] calldata _values,
    bytes calldata _data
  ) external override {
    require(_to != address(0x0), 'destination address must be non-zero.');
    require(_ids.length == _values.length, '_ids and _values array length must match.');
    require(
      _from == msg.sender || operatorApproval[_from][msg.sender] == true,
      'Need operator approval for 3rd party transfers.'
    );

    address _operator = msg.sender;
    _beforeTokenTransfer(_operator, _from, _to, _ids, _values, _data);

    for (uint256 i = 0; i < _ids.length; ++i) {
      uint256 id = _ids[i];
      uint256 value = _values[i];

      // SafeMath will throw with insuficient funds _from
      // or if _id is not valid (balance will be 0)
      balances[id][_from] = balances[id][_from].sub(value);
      balances[id][_to] = value.add(balances[id][_to]);
    }

    emit TransferBatch(msg.sender, _from, _to, _ids, _values);

    // Now that the balances are updated and the events are emitted,
    // call onERC1155BatchReceived if the destination is a contract.
    if (_to.isContract()) {
      _doSafeBatchTransferAcceptanceCheck(msg.sender, _from, _to, _ids, _values, _data);
    }
  }

  struct Token {
    uint256 id;
    uint256 amount;
    string uri;
  }

  function tokensOfOwner(address _owner, uint256[] calldata _ids) external view returns (Token[] memory) {
    require(_owner != address(0x0), 'Zero address');

    Token[] memory _tokens;
    uint256 size = _ids.length;

    if (_ids.length == 0) {
      return _tokens;
    }
    _tokens = new Token[](size);
    for (uint256 i = 0; i < size; ++i) {
      uint256 _id = _ids[i];
      string memory _uri = uri(_id);
      _tokens[i] = Token(_id, balances[_id][_owner], _uri);
    }
    return _tokens;
  }

  function tokensOfOwner(
    address ownerAccount,
    uint256 startIndex,
    uint256 endIndex
  ) external view returns (Token[] memory) {
    require(ownerAccount != address(0x0), 'Zero address');
    Token[] memory tokens;

    require(startIndex <= totalSupply && startIndex < endIndex, 'Out of bounds');
    if (totalSupply == 0) {
      return tokens;
    }
    if (endIndex > totalSupply) {
      endIndex = totalSupply;
    }
    tokens = new Token[](endIndex - startIndex);
    for (uint256 i = 0; i < endIndex - startIndex; ++i) {
      uint256 _id = tokenIndexes[i + startIndex];
      string memory _uri = uri(_id);
      tokens[i] = Token(_id, balances[_id][ownerAccount], _uri);
    }
    return tokens;
  }

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    require(!paused(), 'token transfer while paused');
  }
}
