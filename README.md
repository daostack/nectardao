# nectardao
Nectar DAO is a DAO for the Nectar-DeversiFi community. This repo is configuring and deploying the nectar DAO.

## Architecture
The DAO is based on DAOstack's [Arc platform](https://github.com/daostack/arc), and using the [Infra platform](https://github.com/daostack/infra) for decision making, based on [Holographic Consensus](https://medium.com/daostack/holographic-consensus-part-1-116a73ba1e1c).

A rinkeby example for the DAO was deployed, with its Avatar on address [0x5B3dd2a8D0B50A22223d825fB671b51b6A713448](https://rinkeby.etherscan.io/address/0x5B3dd2a8D0B50A22223d825fB671b51b6A713448). The complete addresses and deployment logs can be found [here](https://github.com/daostack/nectardao/blob/master/logs/bounty-16-10-2019-rinkeby-logs.txt).

**Rinkeby deployment links**
  * [Avatar](https://rinkeby.etherscan.io/address/0x5B3dd2a8D0B50A22223d825fB671b51b6A713448)
  * [Reputation](https://rinkeby.etherscan.io/address/0xe84B26c2935FE59e845176827C90E9e5f1C120Dd)
  * [Token](https://rinkeby.etherscan.io/address/0x8817bC1EB121533e9AB4f5CC12AE2521DB452104)
  * [Controller](https://rinkeby.etherscan.io/address/0x11B8Ac7B92bDf6D0Fe6b2CF2E9DC648816088cd4)
  * Reputation bootstrap schemes
    * [Continues Nectar locking in batches](https://rinkeby.etherscan.io/address/0x3661aE7fb556F06C5Db982bC2389B6C19a9d8015)
    * [Nectar holder's reputation airdrop](https://rinkeby.etherscan.io/address/0xc73b7fC1C19F54c2A8ccD1F4fCdD95a27F943494)
    * [GEN auction](https://rinkeby.etherscan.io/address/0xD6F26AAc332285f56a9762a55dfE1045a9bB0E90)
  * Governance schemes
    * [Contribution reward](https://rinkeby.etherscan.io/address/0x8ff49219e74e076cf4f1b244a47875d7009e2595)
    * [Scheme registrar](https://rinkeby.etherscan.io/address/0x2c411266902c001351f49ad63646f32b542d905e)
    * [Generic scheme controlling the whitelist registry scheme](https://rinkeby.etherscan.io/address/0xd72feD6A6E19bB768f72a15624569846F1A01C51)
    * [Generic scheme controlling the ENS public resolver](https://rinkeby.etherscan.io/address/0xAd68ae92AeA2A5Af6609c6Ae2a76576BF3ff7DF7)
    * [Generic scheme controlling the ENS registry](https://rinkeby.etherscan.io/address/0x2815D12d591B2DC44517fa4a1dC0c517B54E68C6)
  * Voting machine
    * [Genesis protocol](https://rinkeby.etherscan.io/address/0x7648665cda324511b71e002e9c62da98a8e68505)


### Diagram
  <p align="center">
  <img src="https://github.com/daostack/nectardao/blob/master/necdao.png?raw=true" alt="necdiagram"/>
</p>

### Voting parameters  
  Production [voting parameters](https://docs.google.com/spreadsheets/d/1vt79eXdrc-kn04dRj5Qk-9xEqctPm5YcPEFI-qecQC4/edit#gid=0)

### Contracts
 The dao contracts are based on [arc version 0.0.1-rc.33](https://github.com/daostack/arc/releases/tag/0.0.1-rc.33)
#### Reputaiton bootstrap schemes
 [locking batches](https://github.com/daostack/arc/blob/0.0.1-rc.30/contracts/schemes/ContinuousLockingToken4Reputation.sol)
 [nec snapshot](https://github.com/daostack/arc/blob/0.0.1-rc.30/contracts/schemes/ReputationFromToken.sol)
 - Will use (nectar rep allocation)[https://github.com/daostack/arc/blob/0.0.1-rc.30/contracts/test/NectarRepAllocation.sol] as a link contract to the nec token contract

 [gen auction](https://github.com/daostack/arc/blob/0.0.1-rc.30/contracts/schemes/Auction4Reputation.sol)
## Deployment

1. Add .env file which include the `provider` url
   e.g `provider="https://mainnet.infura.io/v3/1234`
2. Set parameter json [example](https://github.com/daostack/nectardao/blob/master/parameters/model-params-25_11.json)
3. Update `prepare` cmd at [package.json](https://github.com/daostack/nectardao/blob/master/package.json#L9)
4. `npm i`
5. `npm run migrate --  --private-key <PRIVATE_KEY> --provider https://mainnet.infura.io/v3/<infuraKey>`
