pragma solidity ^0.4.18;

contract StoreIPFS {

    mapping(string => string) ipfsData;

    function saveHash(string _id , string ipfs_hash) public {
        ipfsData[_id] = ipfs_hash;
    }

    function sendHash(string _id) public view returns (string) {
        var get_ipfs = ipfsData[_id];
        return get_ipfs;
    }
}
