'use strict';
const bs58 = require('bs58');
const fs = require("fs");
const timestamp = require("unix-timestamp");
const Web3 = require('web3')
require('dotenv').config();
const REAL_FBITS = 40;
const BNJS = require('bn.js');
if (process.env.provider === undefined) {
  console.log("please define network provider at .env file");
  process.exit(1);
}
const web3 = new Web3(process.env.provider);
const params_json = require("./parameters/production_mainnet_params.json");
const addresses_json = require("./production_addreseses.json");

var snapshotBlock = params_json.SNAPSHOT_BLOCK;
// IPFS hash for user agreement
var agreementHash = '0x' + bs58.decode(params_json.AGREEMENT_HASH).slice(2).toString('hex');
console.log("agreementHash",agreementHash);
var BN = web3.utils.BN;
async function startAudit() {
    const ContinuousLockingToken4Reputation = require("@daostack/migration/contracts/0.0.1-rc.34/ContinuousLocking4Reputation.json").abi;
    let continuousLockingToken4Reputation = new web3.eth.Contract(ContinuousLockingToken4Reputation, addresses_json.CONTINUES_LOCKING4REP);
    let batchTime = await continuousLockingToken4Reputation.methods.batchTime().call();
    if (batchTime.toNumber() !== 2592000) {
      console.log("(batchTime !== 2592000)")
    }
    let startTime = await continuousLockingToken4Reputation.methods.startTime().call();
    if (startTime.toNumber() !== timestamp.fromDate(params_json.BOOTSTRAP_START)) {
      console.log("(batchTime !==",timestamp.fromDate(params_json.BOOTSTRAP_START))
    }
    var reputationRewardLeft = await continuousLockingToken4Reputation.methods.reputationRewardLeft().call();
    if (reputationRewardLeft.toString() !== await web3.utils.toWei("850000" )) {
      console.log(" continuousLockingToken4Reputation (reputationRewardLeft.toNumber() ",await web3.utils.toWei("100000" ));
      console.log(reputationReward);
    }

    var repRewardConstA = await continuousLockingToken4Reputation.methods.repRewardConstA().call();
    var repRewardConstAJS = new BNJS(repRewardConstA.toString());
    if (repRewardConstAJS.shrn(REAL_FBITS).toString() !== await web3.utils.toWei("85000" )) {
      console.log(" continuousLockingToken4Reputation (repRewardConstA.toNumber() !== web3.utils.toWei(10000 )) ",await web3.utils.toWei("100000" ));
    }
    // function fraction(uint216 numerator, uint216 denominator) internal pure returns (uint256) {
    //         return div(uint256(numerator) * REAL_ONE, uint256(denominator) * REAL_ONE);
    //     }
    var repRewardConstB = await continuousLockingToken4Reputation.methods.repRewardConstB().call();
    var repRewardConstBJS = new BNJS(repRewardConstB.toString());
    var realOne = (new BNJS('1')).shln(REAL_FBITS);
    var expected = Math.floor((900 * realOne*realOne)/(1000 * realOne));
    console.log(expected,repRewardConstB.toString())
    if (repRewardConstB.toString() !== expected.toString()) {
      //console.log(repRewardConstBJS.mul(1000).shrn(REAL_FBITS).toString());
      console.log(" continuousLockingToken4Reputation (repRewardConstBJS.toNumber() !== web3.utils.toWei(10000 )) ",await web3.utils.toWei("100000" ));
    }

    console.log("repRewardConstB.toString()",repRewardConstB.toString())

    console.log("startTime:",timestamp.fromDate(params_json.BOOTSTRAP_START));

    let redeemEnableTime = await continuousLockingToken4Reputation.methods.redeemEnableTime().call();
    if (redeemEnableTime.toNumber() !== timestamp.fromDate(params_json.BOOTSTRAP_END)) {
      console.log("(redeemEnableTime !==",timestamp.fromDate(params_json.BOOTSTRAP_END))
    }

    const ReputationFromToken = require("@daostack/migration/contracts/0.0.1-rc.34/ReputationFromToken.json").abi;
    let reputationFromToken = new web3.eth.Contract(ReputationFromToken, addresses_json.RFROMTOKEN);

    var tokenContract = await reputationFromToken.methods.tokenContract().call();

    const NectarRepAllocation = require("@daostack/migration/contracts/0.0.1-rc.34/NectarRepAllocation.json").abi;
    let nectarRepAllocation = new web3.eth.Contract(NectarRepAllocation, tokenContract);

    var blockReference = await nectarRepAllocation.methods.blockReference().call();
    if (blockReference.toNumber() !== params_json.SNAPSHOT_BLOCK) {
      console.log("(blockReference.toNumber() !== params_json.SNAPSHOT_BLOCK)");
    }

    var reputationReward = await nectarRepAllocation.methods.reputationReward().call();
    if (reputationReward.toString() !== await web3.utils.toWei("100000" )) {
      console.log(" (reputationReward.toNumber() !== web3.utils.toWei(10000 )) ",await web3.utils.toWei("100000" ));
      console.log(reputationReward);
    }
    console.log("blockReference",blockReference.toNumber());
}



module.exports = {
    startAudit
}
