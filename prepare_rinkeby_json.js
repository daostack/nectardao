'use strict';
const fs = require("fs");
const rinkeby_addresses = require("./parameters/rinkeby_addresses.json");

const model_params = require(process.argv[2]);

for (let j = 0; j < model_params.CustomSchemes.length; j++) {
    if (model_params.CustomSchemes[j].params[2] === "ENS_PUBLIC_RESOLVER")
      {
        model_params.CustomSchemes[j].params[2] = rinkeby_addresses.ENS_PUBLIC_RESOLVER;
      }
      if (model_params.CustomSchemes[j].params[2] === "ENS_REGISTERY")
      {
          model_params.CustomSchemes[j].params[2] = rinkeby_addresses.ENS_REGISTERY;

      }
      if (model_params.CustomSchemes[j].name === "ContinuousLocking4Reputation") {
        if (model_params.CustomSchemes[j].params[8] === "NEC") {
            model_params.CustomSchemes[j].params[8] = rinkeby_addresses.NEC;
        }
      }
}

for (let j = 0; j < model_params.StandAloneContracts.length; j++) {
    if (model_params.StandAloneContracts[j].name === "NectarRepAllocation")
      {
        if (model_params.StandAloneContracts[j].params[4] === "NEC") {
           model_params.StandAloneContracts[j].params[4] = rinkeby_addresses.NEC;

        }

      }
}

fs.writeFileSync('params.json', JSON.stringify(model_params), 'utf8');

console.log("prepare done - see params.json")

module.exports = {

}
