require("dotenv").config();

let privateKey = process.env.private_key;
let web3WSProvider = process.env.ws_provider;
let gasPrice = process.env.gas_price;
let nonce = -1;

// Setting up Web3 instance
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.WebsocketProvider(web3WSProvider));
let account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

async function startRedeem() {
    await redeemCLT4R()
    await redeemA4R()
}
async function redeemCLT4R() {
    const ContinuousLockingToken4Reputation = require("@daostack/migration/contracts/0.0.1-rc.30/ContinuousLocking4Reputation.json").abi;
    let continuousLockingToken4Reputation = new web3.eth.Contract(ContinuousLockingToken4Reputation, process.env.CLT4RAddress);
    console.log("Started listening to Lock Events on ContinuousLocking4Reputation Scheme: " +  process.env.CLT4RAddress)
    continuousLockingToken4Reputation.events
    .LockToken(
        {
            fromBlock: process.env.from_block
        },
        async (error, events) => {
            if (nonce === -1) {
                nonce = (await web3.eth.getTransactionCount(web3.eth.defaultAccount)) - 1;
            }

            if (!error) {
                let beneficiary = events.returnValues._locker;
                let lockingId = events.returnValues._lockingId;

                // Check if can close the proposal as expired and claim the bounty
                let failed = false;
                let redeemCall = await continuousLockingToken4Reputation.methods
                .redeem(beneficiary, lockingId)
                .call()
                .catch(error => {
                    console.log(
                    "Could not redeem account: " +
                        beneficiary +
                        ". error returned: " +
                        extractJSON(error.toString())[0].message
                    );
                    failed = true;
                });
                await continuousLockingToken4Reputation.methods
                .redeem(beneficiary, lockingId)
                .estimateGas()
                .catch(error => {
                    console.log(
                    "Could not redeem account: " +
                        beneficiary +
                        ". error returned: " +
                        extractJSON(error.toString())[0].message
                    );
                    failed = true;
                });
                if (
                !failed &&
                redeemCall !== null &&
                Number(web3.utils.fromWei(redeemCall.toString())) > 0
                ) {
                // Close the proposal as expired and claim the bounty
                await continuousLockingToken4Reputation.methods
                    .redeem(beneficiary, lockingId)
                    .send(
                    {
                        from: web3.eth.defaultAccount,
                        gas: 300000,
                        gasPrice: web3.utils.toWei(gasPrice, "gwei"),
                        nonce: ++nonce
                    },
                    async function(error) {
                        if (error) {
                            console.log(error);
                        }
                    })
                    .on("receipt", function(receipt) {
                        console.log(
                            "Redeem transaction: " +
                            receipt.transactionHash +
                            " for account: " +
                            beneficiary +
                            " was successfully confirmed. Redeem amount: " + Number(web3.utils.fromWei(redeemCall.toString()))
                        );
                    })
                    .on("error", console.error);
                } else {
                console.log(
                    "Failed to redeem for account:" +
                    beneficiary +
                    " for " +
                    Number(web3.utils.fromWei(redeemCall.toString())) +
                    " Rep"
                );
                }
            } else {
                console.log("Error!")
            }
        }
    )
    .on("error", console.error);
}

async function redeemA4R() {
    const Auction4Reputation = require("@daostack/migration/contracts/0.0.1-rc.30/Auction4Reputation.json").abi;
    let auction4Reputation = new web3.eth.Contract(Auction4Reputation, process.env.Auction4ReputationAddress);
    console.log("Started listening to Lock Events on Auction4Reputation Scheme: " +  process.env.Auction4ReputationAddress)
    auction4Reputation.events
    .Bid(
        { 
            fromBlock: process.env.from_block
        },
        async (error, events) => {
            if (nonce === -1) {
                nonce = (await web3.eth.getTransactionCount(web3.eth.defaultAccount)) - 1;
            }
            
            if (!error) {
                let beneficiary = events.returnValues._bidder;
                let auctionId = events.returnValues._auctionId;
    
                // Check if can close the proposal as expired and claim the bounty
                let failed = false;
                let redeemCall = await auction4Reputation.methods
                .redeem(beneficiary, auctionId)
                .call()
                .catch(error => {
                    console.log(
                    "Could not redeem account: " +
                        beneficiary +
                        ". error returned: " +
                        extractJSON(error.toString())[0].message
                    );
                    failed = true;
                });
                await auction4Reputation.methods
                .redeem(beneficiary, auctionId)
                .estimateGas()
                .catch(error => {
                    console.log(
                    "Could not redeem account: " +
                        beneficiary +
                        ". error returned: " +
                        extractJSON(error.toString())[0].message
                    );
                    failed = true;
                });
                if (
                !failed &&
                redeemCall !== null &&
                Number(web3.utils.fromWei(redeemCall.toString())) > 0
                ) {
                // Close the proposal as expired and claim the bounty
                await auction4Reputation.methods
                    .redeem(beneficiary, auctionId)
                    .send(
                    {
                        from: web3.eth.defaultAccount,
                        gas: 300000,
                        gasPrice: web3.utils.toWei(gasPrice, "gwei"),
                        nonce: ++nonce
                    },
                    async function(error) {
                        if (error) {
                            console.log(error);
                        }
                    })
                    .on("receipt", function(receipt) {
                        console.log(
                            "Redeem transaction: " +
                            receipt.transactionHash +
                            " for account: " +
                            beneficiary +
                            " was successfully confirmed. Redeem amount: " + Number(web3.utils.fromWei(redeemCall.toString()))
                        );
                    })
                    .on("error", console.error);
                } else {
                console.log(
                    "Failed to redeem for account:" +
                    beneficiary +
                    " for " +
                    Number(web3.utils.fromWei(redeemCall.toString())) +
                    " Rep"
                );
                }
            }
        }
    )
    .on("error", console.error);
}

module.exports = {
    startRedeem
}

// Extract error JSON object from the error string
function extractJSON(str) {
    var firstOpen, firstClose, candidate;
    firstOpen = str.indexOf("{", firstOpen + 1);
    do {
      firstClose = str.lastIndexOf("}");
      if (firstClose <= firstOpen) {
        return null;
      }
      do {
        candidate = str.substring(firstOpen, firstClose + 1);
        try {
          var res = JSON.parse(candidate);
          return [res, firstOpen, firstClose + 1];
        } catch (e) {
          log("JSON error parsing failed.");
        }
        firstClose = str.substr(0, firstClose).lastIndexOf("}");
      } while (firstClose > firstOpen);
      firstOpen = str.indexOf("{", firstOpen + 1);
    } while (firstOpen !== -1);
}