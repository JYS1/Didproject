pragma solidity ^0.4.24;

contract StoreIPFS {
    struct IPFS_map{
        string [] ipfs_hash;
    }
    mapping(string => IPFS_map) ipfsData;
    function sendHash(string memory hash , string ipfs_hash) public {
        ipfsData[hash].ipfs_hash.push(ipfs_hash);
    }

    function getHash(string _hash) public view returns string {
        var get_ipfs = ipfsData[_hash];
        return get_ipfs.ipfs_hash;
    }
}