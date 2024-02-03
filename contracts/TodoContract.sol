// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";


// sepolia network 0x8f92F9860A155bD774dEa5e0facEA6FB80793CeE
// polygonmumbai 0xC500b50cFdbd86c388527d2f1E714173B3705837
contract TodoContract {

    address public owner;

    struct Todo {
        uint id;
        string task;
        uint timestamp;
        address from;
        bool isCompleted;
    }

    mapping (address => string) names;
    mapping (address => Todo[]) todos;


    event completedTodo(string name);

    modifier isOwner {
        require(msg.sender == owner,"Only For Admin");
        _;
    }

    modifier isRegistered {
        require(bytes(names[msg.sender]).length != 0,"Please Register To Continue");
        _;
    }

    modifier userNameCondition(string memory _name) {
        require(bytes(_name).length > 5,"Username should be atleast of length 5");
        _;        
    }

    constructor(address _owner){
        owner = _owner;
    }

    function registerUser(string calldata name) external userNameCondition(name){
        names[msg.sender] = name;
    }

    function addTodo(string calldata task) external isRegistered{
        uint id = todos[msg.sender].length;
        Todo memory newTodo = Todo(id,task,block.timestamp,msg.sender,false);
        todos[msg.sender].push(newTodo);
    }   

    function completeTodo(uint _id) external isRegistered{
        uint temp = todos[msg.sender].length;
        for(uint i=0;i<temp;i++){
            if(todos[msg.sender][i].id == _id){
                emit completedTodo(names[msg.sender]);
                todos[msg.sender][i].isCompleted = true;
            }
        }
    } 

    function getAllTodos() external view returns(Todo[] memory){
        return todos[msg.sender];
    }

    function getAnyOneTodo(address userAddress) external view isOwner returns(Todo[] memory){
        return todos[userAddress];
    }

    function getName(address userAddress) external view isOwner returns(string memory){
        return names[userAddress];
    }

}
