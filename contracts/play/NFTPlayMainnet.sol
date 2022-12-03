// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
/// @title ETHIndia22NFT
/// @author curiousapple (abhishek vispute)

contract NFTPlayMainnet is ERC721 {

    /*///////////////////////////////////////////////////////////////
                        STATE
    //////////////////////////////////////////////////////////////*/

    uint32 public originDomain; // 3 v could be made constant
    bool public allowed;
    address public source;
    address public connext;


    error TransfersNotPossible();


    constructor(
        uint32 _originDomain,
        address _source,
        address _connext
    ) ERC721("EthIndia22", "ETHIN22"){
        originDomain = _originDomain;
        source = _source;
        connext = _connext;
    }

    
    modifier onlySource(address _originSender, uint32 _origin) {
        require(
        _origin == originDomain &&
            _originSender == source &&
            msg.sender == address(connext),
        "Expected source contract on origin domain called by Connext"
        );
        _;
    }

    //////////////////////////////////////////////////////////////*/

    function xReceive(
        bytes32 _transferId,
        uint256 _amount,
        address _asset,
        address _originSender,
        uint32 _origin,
        bytes memory _callData
    ) external onlySource(_originSender, _origin) returns (bytes memory) {
        
        address from;
        address to;
        uint256 tokenId;

        (from, to, tokenId) = abi.decode(_callData, (address, address, uint256));
        allowed = true;
        _transfer(from, to, tokenId);
        allowed = false;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256, 
        uint256 batchSize
    ) internal override {
        if(!allowed) revert TransfersNotPossible();
    }

}