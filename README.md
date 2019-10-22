# nectardao

## Architecture 

### Diagram 
  <p align="center">
  <img src="https://github.com/daostack/nectardao/blob/master/necdao.png?raw=true" alt="necdiagram"/>
</p>

### Voting parameters  
  Production [voting parameters](https://docs.google.com/spreadsheets/d/1vt79eXdrc-kn04dRj5Qk-9xEqctPm5YcPEFI-qecQC4/edit#gid=0)

### Contracts
 The dao contracts are based on [arc version 0.0.1-rc.30](https://github.com/daostack/arc/releases/tag/0.0.1-rc.30) 
#### Reputaiton bootstrap schemes
 [locking batches](https://github.com/daostack/arc/blob/0.0.1-rc.30/contracts/schemes/ContinuousLockingToken4Reputation.sol)
 [nec snapshot](https://github.com/daostack/arc/blob/0.0.1-rc.30/contracts/schemes/ReputationFromToken.sol)
 - Will use (nectar rep allocation)[https://github.com/daostack/arc/blob/0.0.1-rc.30/contracts/test/NectarRepAllocation.sol] as a link contract to the nec token contract
 
 [gen auction](https://github.com/daostack/arc/blob/0.0.1-rc.30/contracts/schemes/Auction4Reputation.sol)
## Deployment
### Rinkeby:

1. Set parameter json [example](https://github.com/daostack/nectardao/blob/master/parameters/model-10-10-2019-rinkeby.json) 
2. Update migrate_rinkeby cmd at package.json https://github.com/daostack/nectardao/blob/master/package.json#L9 
3. `npm i`
4. `npm run migrate_rinkeby --  --private-key <PRIVATE_KEY> --provider https://rinkeby.infura.io/v3/<infuraKey>`
