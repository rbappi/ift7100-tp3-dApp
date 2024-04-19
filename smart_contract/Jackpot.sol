// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;
 
contract Jackpot {
    mapping(address => uint) balances;

    Pool pool;
    uint incrementedId;
    uint playerCount;
    address charity;

    struct Pool
    {
        uint id;
        address[] addresses;
    }
 
    constructor(){
        incrementedId = 0;
        createPool();
        playerCount = 0;
        charity = 0x451fDA07adEcFFDa5471446a20424D2EC9Dc65A7;
    }
 
    function createPool() internal {
        Pool memory newPool = Pool(incrementedId, new address[](3));
        pool = newPool;
        incrementedId++;
        playerCount = 0;
    }
 
    function getId() public view returns (uint) {
        return pool.id;
    }

    function payTicket() payable external {
        for (uint i = 0; i < playerCount; i++) 
        {
            require(pool.addresses[i] != msg.sender);
        }
        require(msg.value == 0.01 ether);
        balances[msg.sender] += msg.value;
        pool.addresses[playerCount] = msg.sender;
        playerCount++;
        if (playerCount == 3) {
            distributeJackPot();
            createPool();
        }
    }

    function distributeJackPot() internal {
        uint winnerId = getRandomNumber();
        address winner = pool.addresses[winnerId];
        payable(winner).transfer((getBalance()*80)/100);
        payable(charity).transfer((getBalance()*20)/100);
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function getRandomNumber() internal view returns (uint){
        return uint (keccak256(abi.encodePacked(msg.sender, block.timestamp, pool.id)))%2;
    }

    modifier onlyCharity {
        require(msg.sender == charity);
        _;
    }

    function changeCharity (address newCharity) onlyCharity public{
        charity = newCharity;
    }

    function getCharity() public view returns (address){
        return charity;
    }

}