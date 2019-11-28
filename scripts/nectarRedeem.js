require("dotenv").config();

const Web3 = require("web3");
let web3, fromBlock, CLT4RAddress, Auction4ReputationAddress;

async function startRedeem(
    _web3Provider=process.env.ws_provider,
    _privateKey=process.env.private_key,
    _gasPrice=process.env.gas_price,
    _fromBlock=process.env.from_block,
    _nectarRedeemerAddress=process.env.NectarReputationRedeemerAddress,
    _CLT4RAddress=process.env.CLT4RAddress,
    _Auction4ReputationAddress=process.env.Auction4ReputationAddress
) {
    web3 = new Web3(_web3Provider, null, {
        transactionConfirmationBlocks: 1
    })
    let account = web3.eth.accounts.privateKeyToAccount(_privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    fromBlock = _fromBlock
    CLT4RAddress = _CLT4RAddress
    Auction4ReputationAddress = _Auction4ReputationAddress

    const NectarReputationRedeemer = require("../build/contracts/NectarReputationRedeemer").abi;
    let nectarReputationRedeemer = new web3.eth.Contract(NectarReputationRedeemer, _nectarRedeemerAddress);

    let clt4rRedeems = await getRedeemsForCLT4R()
    let auction4rRedeems = await getRedeemsForAuction4R()

    const redeemsBatchSize = 10
    let redeemsCount = clt4rRedeems.length > auction4rRedeems.length ? clt4rRedeems.length : auction4rRedeems.length
    let redeemsCounter = 0
    while (redeemsCount > 0) {
        let currentBatchCount = redeemsCount < redeemsBatchSize ? redeemsCount : redeemsBatchSize
        let clt4rRedeemsBatch = clt4rRedeems.slice(redeemsCounter * redeemsBatchSize, redeemsCounter  * redeemsBatchSize + currentBatchCount)
        let auction4rRedeemsBatch = auction4rRedeems.slice(redeemsCounter * redeemsBatchSize, redeemsCounter  * redeemsBatchSize + currentBatchCount)
        
        tx = await nectarReputationRedeemer.methods.redeem(
            CLT4RAddress,
            clt4rRedeemsBatch,
            Auction4ReputationAddress,
            auction4rRedeemsBatch
        )

        let gas
        const blockLimit = (await web3.eth.getBlock('latest')).gasLimit
        try {
            gas = await tx.estimateGas()
            if (gas * 1.1 < blockLimit - 100000) {
                gas *= 1.1
            }
        } catch (error) {
            gas = blockLimit - 100000
        }
        gas = parseInt(gas)
        console.log("GAS " + gas)
        await tx.send({
            from: web3.eth.defaultAccount,
            gas,
            _gasPrice,
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
    const ContinuousLockingToken4Reputation = require("@daostack/migration/contracts/0.0.1-rc.33/ContinuousLocking4Reputation.json").abi;
    let continuousLockingToken4Reputation = new web3.eth.Contract(ContinuousLockingToken4Reputation, CLT4RAddress);
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

async function getRedeemsForAuction4R() {
    let redeems = []
    let auctions = []
    const Auction4Reputation = require("@daostack/migration/contracts/0.0.1-rc.33/Auction4Reputation.json").abi;
    let auction4Reputation = new web3.eth.Contract(Auction4Reputation, Auction4ReputationAddress);
    let events = await auction4Reputation.getPastEvents('Bid', { fromBlock, toBlock: 'latest' })
    for (let event of events) {
        let beneficiary = event.returnValues._bidder;
        let id = event.returnValues._auctionId;
        if (!auctions[id]) {
            auctions[id] = {}
        }
        if (auctions[id] && auctions[id][beneficiary]) {
            continue
        } else {
            auctions[id][beneficiary] = true
        }
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
