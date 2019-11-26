var NectarReputationRedeemer = artifacts.require("./NectarReputationRedeemer.sol");

module.exports = function(deployer) {
  deployer.deploy(NectarReputationRedeemer).then(function() {
    console.log(`Nectar Reputation Redeemer Contract: ` + NectarReputationRedeemer.address)
    return NectarReputationRedeemer.address
  });  
};
