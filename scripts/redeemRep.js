require("dotenv").config();

let privateKey = process.env.private_key;
let web3WSProvider = process.env.ws_provider;
let fromBlock = process.env.from_block
let nonce = -1;

// Setting up Web3 instance
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.WebsocketProvider(web3WSProvider));
let account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
let gasPrice = web3.utils.toWei(process.env.gas_price, "gwei");

async function startRedeem() {
    const NectarReputationRedeemer = require("../build/contracts/NectarReputationRedeemer").abi;
    let nectarReputationRedeemer = new web3.eth.Contract(NectarReputationRedeemer, process.env.NectarReputationRedeemerAddress);

    let clt4rRedeems = await getRedeemsForCLT4R()
    let auction4rRedeems = await getRedeemsForAuction4R()

    const redeemsBatchSize = 100
    let redeemsCount = clt4rRedeems.length > auction4rRedeems.length ? clt4rRedeems.length : auction4rRedeems.length
    let redeemsCounter = 0
    while (redeemsCount > 0) {
        let currentBatchCount = redeemsCount < redeemsBatchSize ? redeemsCount : redeemsBatchSize
        let clt4rRedeemsBatch = clt4rRedeems.slice(redeemsCounter * redeemsBatchSize, redeemsCounter  * redeemsBatchSize + currentBatchCount)
        let auction4rRedeemsBatch = auction4rRedeems.slice(redeemsCounter * redeemsBatchSize, redeemsCounter  * redeemsBatchSize + currentBatchCount)
        
        tx = await nectarReputationRedeemer.methods.redeem([
            process.env.CLT4RAddress,
            clt4rRedeemsBatch,
            process.env.Auction4ReputationAddress,
            auction4rRedeemsBatch
        ])

        let gas
        try {
            gas = (await tx.estimateGas())
            if (gas * 1.1 < block - 100000) {
                gas *= 1.1
            }
        } catch (error) {
            gas = blockLimit - 100000
        }

        await tx.send({
            from: web3.eth.defaultAccount,
            gas,
            gasPrice,
            nonce: ++nonce
        }).on("confirmation", function(_, receipt) {
            console.log(
                `Transaction ${receipt.transactionHash} successfully redeemed ${clt4rRedeemsBatch.length} CLT4Reputation locks and ${auction4rRedeemsBatch.length} AuctionReputation bids`
                )
          })
          .on("error", console.error);

        redeemsCount -= redeemsBatchSize
        redeemsCounter++
    }
}

async function getRedeemsForCLT4R() {
    let redeems = []
    const ContinuousLockingToken4Reputation = require("@daostack/migration/contracts/0.0.1-rc.30/ContinuousLocking4Reputation.json").abi;
    let continuousLockingToken4Reputation = new web3.eth.Contract(ContinuousLockingToken4Reputation, process.env.CLT4RAddress);
    let events = await continuousLockingToken4Reputation.getPastEvents('LockToken', { fromBlock, toBlock: 'latest' })
    for (let event of events) {
        let beneficiary = event.returnValues._locker;
        let id = event.returnValues._lockingId;

        // Check if can close the proposal as expired and claim the bounty
        let failed = false;
        let redeemCall = await continuousLockingToken4Reputation.methods
        .redeem(beneficiary, id)
        .call()
        .catch(() => {
            failed = true;
        });
        await continuousLockingToken4Reputation.methods
        .redeem(beneficiary, id)
        .estimateGas()
        .catch(error => {
            failed = true;
        });
        if (!failed &&
            redeemCall !== null &&
            Number(web3.utils.fromWei(redeemCall.toString())) > 0) {
            redeems.push({ beneficiary, id })
        }
    }
    return redeems
}

async function getRedeemsForAuction4R() {
    let redeems = []
    const Auction4Reputation = require("@daostack/migration/contracts/0.0.1-rc.30/Auction4Reputation.json").abi;
    let auction4Reputation = new web3.eth.Contract(Auction4Reputation, process.env.Auction4ReputationAddress);
    let events = await auction4Reputation.getPastEvents('Bid', { fromBlock, toBlock: 'latest' })
    for (let event of events) {
        let beneficiary = event.returnValues._bidder;
        let id = event.returnValues._auctionId;

        // Check if can close the proposal as expired and claim the bounty
        let failed = false;
        let redeemCall = await auction4Reputation.methods
        .redeem(beneficiary, id)
        .call()
        .catch(() => {
            failed = true;
        });
        await auction4Reputation.methods
        .redeem(beneficiary, id)
        .estimateGas()
        .catch(() => {
            failed = true;
        });
        if (!failed &&
            redeemCall !== null &&
            Number(web3.utils.fromWei(redeemCall.toString())) > 0) {
            redeems.push({ beneficiary, id })
        }
    }
    return redeems
}

module.exports = {
    startRedeem
}
