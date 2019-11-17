'use strict';
const fs = require("fs");
const timestamp = require("unix-timestamp");
const Web3 = require('web3')
require('dotenv').config();

if (process.env.provider === undefined) {
  console.log("please define network provider at .env file");
  process.exit(1);
}
const web3 = new Web3(process.env.provider);
const model_params = require(process.argv[2]);
const params_json = require(process.argv[3]);

web3.eth.getBlockNumber(function(error, snapshotBlock){
  if (error)
  {
    console.log("error getting snapshotBlock",error);
    process.exit(1);
  }

for (let j = 0; j < model_params.CustomSchemes.length; j++) {
      if (model_params.CustomSchemes[j].params[2] === "ENS_PUBLIC_RESOLVER")
      {
        model_params.CustomSchemes[j].params[2] = params_json.ENS_PUBLIC_RESOLVER;
      }
      if (model_params.CustomSchemes[j].params[2] === "ENS_REGISTERY")
      {
          model_params.CustomSchemes[j].params[2] = params_json.ENS_REGISTERY;

      }
      if (model_params.CustomSchemes[j].params[2] === "REGISTERY_LOOKUP")
      {
          model_params.CustomSchemes[j].params[2] = params_json.REGISTERY_LOOKUP;

      }
      if (model_params.CustomSchemes[j].name === "ContinuousLocking4Reputation") {
        if (model_params.CustomSchemes[j].params[8] === "NEC") {
            model_params.CustomSchemes[j].params[8] = params_json.NEC;
        }
        else
       {
         console.log("ContinuousLocking4Reputation error");
       }
       if (model_params.CustomSchemes[j].params[1] === "BOOTSTRAP_START") {
           model_params.CustomSchemes[j].params[1] = timestamp.fromDate(params_json.BOOTSTRAP_START);
       }
       else
      {
        console.log("ContinuousLocking4Reputation error");
      }
      if (model_params.CustomSchemes[j].params[3] === "BOOTSTRAP_END") {
          model_params.CustomSchemes[j].params[3] = timestamp.fromDate(params_json.BOOTSTRAP_END);
      }
      else
     {
       console.log("ContinuousLocking4Reputation error");
     }
    }
      if (model_params.CustomSchemes[j].name === "Auction4Reputation") {
        if (model_params.CustomSchemes[j].params[5] === "GEN") {
            model_params.CustomSchemes[j].params[5] = params_json.GEN;
        } else
        {
          console.log("Auction4Reputation error");
        }
        if (model_params.CustomSchemes[j].params[1] === "BOOTSTRAP_START") {
            model_params.CustomSchemes[j].params[1] = timestamp.fromDate(params_json.BOOTSTRAP_START);
        } else
        {
          console.log("Auction4Reputation error");
        }
        if (model_params.CustomSchemes[j].params[4] === "BOOTSTRAP_END") {
            model_params.CustomSchemes[j].params[4] = timestamp.fromDate(params_json.BOOTSTRAP_END);
        } else
        {
          console.log("Auction4Reputation error");
        }
      }
}
if (model_params.StandAloneContracts !== undefined) {
for (let j = 0; j < model_params.StandAloneContracts.length; j++) {
    if (model_params.StandAloneContracts[j].name === "NectarRepAllocation") {
        if (model_params.StandAloneContracts[j].params[1] === "BOOTSTRAP_START") {
           model_params.StandAloneContracts[j].params[1] = timestamp.fromDate(params_json.BOOTSTRAP_START);
        }
        if (model_params.StandAloneContracts[j].params[2] === "BOOTSTRAP_END") {
           model_params.StandAloneContracts[j].params[2] = timestamp.fromDate(params_json.BOOTSTRAP_END);
        }
        if (model_params.StandAloneContracts[j].params[3] === "SNAPSHOT_BLOCK") {
           model_params.StandAloneContracts[j].params[3] = snapshotBlock;
        }
        if (model_params.StandAloneContracts[j].params[4] === "NEC") {
           model_params.StandAloneContracts[j].params[4] = params_json.NEC;
        }
      }
}
}
if (model_params.VotingMachinesParams !== undefined) {
   for (let j = 0; j < model_params.VotingMachinesParams.length; j++) {
        model_params.VotingMachinesParams[j].activationTime = timestamp.fromDate(params_json.GOVERNANCE_START);
   }
 }

   fs.writeFileSync('params.json', JSON.stringify(model_params), 'utf8');

});

console.log("prepare done - see params.json")

module.exports = {

}
