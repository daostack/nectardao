'use strict';
const fs = require("fs");
const model_params = require(process.argv[2]);
const params_json = require(process.argv[3]);


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
           model_params.CustomSchemes[j].params[1] = params_json.BOOTSTRAP_START;
       }
       else
      {
        console.log("ContinuousLocking4Reputation error");
      }
      if (model_params.CustomSchemes[j].params[3] === "BOOTSTRAP_END") {
          model_params.CustomSchemes[j].params[3] = params_json.BOOTSTRAP_END;
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
            model_params.CustomSchemes[j].params[1] = params_json.BOOTSTRAP_START;
        } else
        {
          console.log("Auction4Reputation error");
        }
        if (model_params.CustomSchemes[j].params[4] === "BOOTSTRAP_END") {
            model_params.CustomSchemes[j].params[4] = params_json.BOOTSTRAP_END;
        } else
        {
          console.log("Auction4Reputation error");
        }
      }
}

for (let j = 0; j < model_params.StandAloneContracts.length; j++) {
    if (model_params.StandAloneContracts[j].name === "NectarRepAllocation") {
        if (model_params.StandAloneContracts[j].params[1] === "BOOTSTRAP_START") {
           model_params.StandAloneContracts[j].params[1] = params_json.BOOTSTRAP_START;
        }
        if (model_params.StandAloneContracts[j].params[2] === "BOOTSTRAP_END") {
           model_params.StandAloneContracts[j].params[2] = params_json.BOOTSTRAP_END;
        }
        if (model_params.StandAloneContracts[j].params[3] === "SNAPSHOT_BLOCK") {
           model_params.StandAloneContracts[j].params[3] = params_json.SNAPSHOT_BLOCK;
        }
        if (model_params.StandAloneContracts[j].params[4] === "NEC") {
           model_params.StandAloneContracts[j].params[4] = params_json.NEC;
        }
      }
}

for (let j = 0; j < model_params.VotingMachinesParams.length; j++) {
     model_params.VotingMachinesParams[j].activationTime = params_json.GOVERNANCE_START;
}

fs.writeFileSync('params.json', JSON.stringify(model_params), 'utf8');

console.log("prepare done - see params.json")

module.exports = {

}
