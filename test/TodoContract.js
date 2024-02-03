const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("TodoContract",()=>{

    async function deployTodosFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
    
        const TodoContract = await ethers.getContractFactory("TodoContract");
        const todoContract = await TodoContract.deploy(owner);
    
        return { todoContract, owner, otherAccount };
      }

    describe("Deployments",()=>{

        it("Should set the right owner", async function () {
            const { todoContract, owner } = await loadFixture(deployTodosFixture);
        
            expect(await todoContract.owner()).to.equal(owner.address);
        });

        it("Should register a user",async function (){
            const { todoContract, owner, otherAccount } = await loadFixture(deployTodosFixture);
            
            const name = "vaibhav";
            await todoContract.connect(otherAccount).registerUser(name);

            expect(await todoContract.connect(owner).getName(otherAccount)).to.equal(name);
        })

        it("Should revert register if username less than length 5",async function(){
            const { todoContract, owner, otherAccount } = await loadFixture(deployTodosFixture);
            
            const name = "fg";

            await expect(todoContract.connect(otherAccount).registerUser(name)).to.be.reverted;
        })


        it("Should add a todo", async function(){
            const { todoContract, owner, otherAccount } = await loadFixture(deployTodosFixture);

            const name = "vaibhav";
            await todoContract.connect(otherAccount).registerUser(name);
            
            const task = "write newspaper"
            await expect(todoContract.connect(otherAccount).addTodo(task)).not.to.be.reverted;
        })

        it("Should get the todo", async function(){
            const { todoContract, owner, otherAccount } = await loadFixture(deployTodosFixture);

            const name = "vaibhav";
            await todoContract.connect(otherAccount).registerUser(name);
            
            const task = "write newspaper"
            await todoContract.connect(otherAccount).addTodo(task)
           
            const todos = await todoContract.connect(otherAccount).getAllTodos();
            console.log("todos",todos[0].id);

            expect(todos[0].id).to.equal(0);
            expect(todos[0].task).to.equal(task);
            expect(todos[0].isCompleted).to.equal(false);
        })

        it("Should complete the todo", async function(){
            const { todoContract, owner, otherAccount } = await loadFixture(deployTodosFixture);

            const name = "vaibhav";
            await todoContract.connect(otherAccount).registerUser(name);
            
            const task = "write newspaper"
            await todoContract.connect(otherAccount).addTodo(task)
           
            const todos = await todoContract.connect(otherAccount).getAllTodos();
            
            await expect(todoContract.connect(otherAccount).completeTodo(todos[0].id)).not.to.be.rejected;
        })

        it("Should emit an event on completing todos", async function () {
            const { todoContract, owner, otherAccount } = await loadFixture(deployTodosFixture);

            const name = "vaibhav";
            await todoContract.connect(otherAccount).registerUser(name);
            
            const task = "write newspaper"
            await todoContract.connect(otherAccount).addTodo(task)
           
            const todos = await todoContract.connect(otherAccount).getAllTodos();
            
            await expect(todoContract.connect(otherAccount).completeTodo(todos[0].id))
                .to.emit(todoContract,"completedTodo")
                .withArgs(name); 
          });

    })

})