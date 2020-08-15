
const C2 = artifacts.require("C2");
const truffleAssert = require('truffle-assertions');

const assertBalance = async (instance, addr, amount) => {
    const bal = await instance.balanceOf.call(addr);
    assert.equal(bal.toNumber(), amount, `Balance is ${bal.toNumber()}, not ${amount}`);
}

contract("C2", async (accounts) => {

    before(async () =>{
        this.c2 = await C2.deployed();
    })

    it("shouldn't have any tokens to start", async () => {
        const totalSupply = await this.c2.totalSupply.call();
        assert.equal(
            totalSupply.toNumber(),
            0,
            "tokens were created when none should have been"
        );
    });
    it("can issue tokens", async () => {
        await this.c2.issue(accounts[1], 1);

        await assertBalance(this.c2, accounts[1], 1);
    });
    it("should only allow the owner to issue tokens", async() => {
        truffleAssert.reverts(this.c2.issue(accounts[1], 1, { from: accounts[1] }))
    })
    it("can relinquish tokens", async() => {
        await this.c2.issue(accounts[1], 9);

        await assertBalance(this.c2, accounts[1], 10);
        
        await this.c2.burn(1, { from: accounts[1] });

        await assertBalance(this.c2, accounts[1], 9);
    });
    // it("should only allow transfers to and from owner", () => {
    //     assert.fail();
    // });
});
