pragma solidity ^0.4.18;

contract StoreIPFS {

    mapping(address => string) ipfsData;

    function saveHash(address hash , string ipfs_hash) public {
        ipfsData[hash] = ipfs_hash;
    }

    function sendHash(address _hash) public view returns (string) {
        var get_ipfs = ipfsData[_hash];
        return get_ipfs;
    }
}
