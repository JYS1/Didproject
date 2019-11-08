pragma solidity ^0.4.18;

contract StoreIPFS {

    mapping(string => string) ipfsData;

    function saveHash(string hash , string ipfs_hash) public {
        ipfsData[hash] = ipfs_hash;
    }

    function sendHash(string _hash) public view returns (string) {
        var get_ipfs = ipfsData[_hash];
        return get_ipfs;
    }
}
