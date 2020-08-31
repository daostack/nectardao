require("dotenv").config();

const Web3 = require("web3");
let web3, fromBlock, CLT4RAddress, Auction4ReputationAddress;
const NectarReputationRedeemer0x = "0x685e1594EfF5dCa50dd3cd1fC58f1E38432343FB"
const Auction4Reputation0x = "0xACfbe2dFb0745042f01d95A529a9735Aba8FE746"
const CLT4RAddress0x = "0xDa490e9acc7f7418293CFeA1FF2085c60d573626"


async function startRedeem(
    _web3Provider="https://mainnet.infura.io/v3/e0cdf3bfda9b468fa908aa6ab03d5ba2",
    _fromBlock=10503447,
    _nectarRedeemerAddress=NectarReputationRedeemer0x,
    _CLT4RAddress=CLT4RAddress0x,
    _Auction4ReputationAddress=Auction4Reputation0x
) {
    web3 = new Web3(_web3Provider, null, {
        transactionConfirmationBlocks: 1
    })
    fromBlock = _fromBlock
    CLT4RAddress = _CLT4RAddress
    Auction4ReputationAddress = _Auction4ReputationAddress

    const NectarReputationRedeemer = require("../build/contracts/NectarReputationRedeemer").abi;
    let nectarReputationRedeemer = new web3.eth.Contract(NectarReputationRedeemer, _nectarRedeemerAddress);

    let clt4rRedeems = await getRedeemedForCLT4R()
    let auction4rRedeems = await getRedeemedForAuction4R()
}
async function getRedeemedForCLT4R() {
    let redeems = []
    const ContinuousLockingToken4Reputation = require("@daostack/migration/contracts/0.0.1-rc.34/ContinuousLocking4Reputation.json").abi;
    let continuousLockingToken4Reputation = new web3.eth.Contract(ContinuousLockingToken4Reputation, CLT4RAddress);
    let events = await continuousLockingToken4Reputation.getPastEvents('Redeem', { fromBlock, toBlock: 'latest' })
    console.log("Contineous Locking Redeemed")
    var counter = 0;
    for (let event of events) {
        let beneficiary = event.returnValues._locker;
        let id = event.returnValues._lockingId;
        console.log("Contineous Locking Redeemed counter" ,counter++);
        console.log( "lockingId",event.returnValues._lockingId.toNumber());
        console.log( "beneficiary",beneficiary);
        console.log( "amount",web3.utils.fromWei(event.returnValues._amount.toString(), 'ether'));
        console.log( "batchIndex",event.returnValues._batchIndex.toNumber());
        console.log("---------------------------------------");
    }
}

async function getRedeemedForAuction4R() {
    let redeems = []
    let auctions = []
    const Auction4Reputation = require("@daostack/migration/contracts/0.0.1-rc.34/Auction4Reputation.json").abi;
    let auction4Reputation = new web3.eth.Contract(Auction4Reputation, Auction4ReputationAddress);
    let events = await auction4Reputation.getPastEvents('Redeem', { fromBlock, toBlock: 'latest' })
    console.log("GEN Auction redeem")
    var counter = 0
    for (let event of events) {
      console.log("gen auction redeem counter" ,counter++);
      console.log( "_auctionId",event.returnValues._auctionId.toNumber());
      console.log( "beneficiary",event.returnValues._beneficiary);
      console.log( "amount",web3.utils.fromWei(event.returnValues._amount.toString(), 'ether'));
      console.log("---------------------------");
    }
}

module.exports = {
    startRedeem
}
