pragma solidity ^0.5.13;
pragma experimental ABIEncoderV2;

import "@daostack/arc/contracts/schemes/Auction4Reputation.sol";
import "@daostack/arc/contracts/schemes/ContinuousLocking4Reputation.sol";

contract NectarReputationRedeemer {
    struct Redeem {
        address beneficiary;
        uint id;
    }

    function redeemContinuousLocking4Reputation(
        ContinuousLocking4Reputation clt4Reputation,
        Redeem[] memory clt4rRedeems) public {
        for (uint i = 0; i < clt4rRedeems.length; i++) {
            clt4Reputation.redeem(clt4rRedeems[i].beneficiary, clt4rRedeems[i].id);
        }
    }

    function redeemAuction4Reputation(
        Auction4Reputation auction4Reputation,
        Redeem[] memory auction4rRedeems) public {
        for (uint i = 0; i < auction4rRedeems.length; i++) {
            auction4Reputation.redeem(auction4rRedeems[i].beneficiary, auction4rRedeems[i].id);
        }
    }
}
