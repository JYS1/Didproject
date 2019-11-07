pragma solidity ^0.4.18;

contract StoreIPFS {

    mapping(string => string) ipfsData;
    
    function saveHash(string _hash , string _ipfs) public {
        ipfsData[_hash] = _ipfs;
    }
    
    function sendHash(string _hash) public view returns (string) {
        var get_ipfs = ipfsData[_hash];
        return get_ipfs;
    }
}