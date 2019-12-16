test('redeem nectar reputation', async () => {
    // Import Redeem Script
    const { startRedeem } = require('../scripts/nectarRedeem.js')
    // Web3 setup
    const Web3 = require('web3')
    const web3 = new Web3('http://localhost:8545', null, {
      transactionConfirmationBlocks: 1
    })
    web3.eth.accounts.wallet.clear()
    let privateKeys = [
        '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
        '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1',
        '0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c',
        '0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913',
        '0xadd53f9a7e588d003326d1cbf9e4a43c061aadd9bc938c843a79e7b4fd2ad743',
        '0x395df67f0c2d2d9fe1ad08d1bc8b6627011959b79c53d7dd6a3536a33ab8a4fd',
        '0xe485d098507f54e7733a205420dfddbe58db035fa577fc294ebd14db90767a52',
        '0xa453611d9419d0e56f499079478fd72c37b251a94bfde4d19872c44cf65386e3',
        '0x829e924fdf021ba3dbbc4225edfece9aca04b929d6e75613329ca6f1d31c0bb4',
        '0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773'
    ]
    for (let i = 0; i < privateKeys.length; i++) {
        web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(privateKeys[i]))
    }
    let opts = {
      from: web3.eth.accounts.wallet[0].address,
      gas: 6000000,
      gasPrice: 10
    }
    // End Web3 setup

    // Test DAO Setup 
    const DAOstackMigration = require('@daostack/migration');
    const AGREEMENT_HASH = '0x1000000000000000000000000000000000000000000000000000000000000000';
    const ContinuousLockingToken4Reputation = require("../build/contracts/ContinuousLocking4Reputation.json").abi;
    const Auction4Reputation = require("../build/contracts/Auction4Reputation.json").abi;
    const GEN = require("../build/contracts/DAOToken.json").abi;
    let params = require('./test-parameters.json')

    const migrationBaseResult = (await DAOstackMigration.migrateBase({
      restart: true,
      force: true,
      quiet: true,
      params,
      arcVersion: '0.0.1-rc.34',
    })).base['0.0.1-rc.34'];

    params.CustomSchemes[0].params[1] = (await web3.eth.getBlock("latest")).timestamp;
    params.CustomSchemes[0].params[3] = (await web3.eth.getBlock("latest")).timestamp + 7200;
    params.CustomSchemes[0].params[8] = migrationBaseResult.GEN;
    params.CustomSchemes[1].params[1] = (await web3.eth.getBlock("latest")).timestamp;
    params.CustomSchemes[1].params[2] = 2400;
    params.CustomSchemes[1].params[4] = (await web3.eth.getBlock("latest")).timestamp + 7200;
    params.CustomSchemes[1].params[5] = migrationBaseResult.GEN;
    let genToken = new web3.eth.Contract(GEN, migrationBaseResult.GEN, opts);

    const migrationDAOResult = (await DAOstackMigration.migrateDAO({
      restart: true,
      force: true,
      quiet: true,
      params,
      arcVersion: '0.0.1-rc.34',
    })).dao['0.0.1-rc.34'];
    migrationDAOResult.ContinuousLockingToken4Reputation = migrationDAOResult.Schemes[0].address
    migrationDAOResult.Auction4Reputation = migrationDAOResult.Schemes[1].address

    let continuousLockingToken4Reputation = new web3.eth.Contract(ContinuousLockingToken4Reputation, migrationDAOResult.ContinuousLockingToken4Reputation, opts);
    let auction4Reputation = new web3.eth.Contract(Auction4Reputation, migrationDAOResult.Auction4Reputation, opts);
    // END Test DAO Setup
    const NectarReputationRedeemer = require("../build/contracts/NectarReputationRedeemer.json").abi;
    let nectarReputationRedeemer = await new web3.eth.Contract(NectarReputationRedeemer).deploy({
      data: require("../build/contracts/NectarReputationRedeemer.json").bytecode
    }).send({ from: web3.eth.accounts.wallet[0].address, gas: 6000000 })

    for (let i = 1; i <= 50; i++) {
        // console.log(`Locking number ${i}`)
        await genToken.methods.mint(web3.eth.accounts.wallet[i % 10].address, web3.utils.toWei(`${i}`)).send(opts)
        await genToken.methods.approve(migrationDAOResult.ContinuousLockingToken4Reputation, web3.utils.toWei(`${i}`)).send({ from: web3.eth.accounts.wallet[i % 10].address })
        await continuousLockingToken4Reputation.methods.lock(web3.utils.toWei(`${i}`), 1, 0, AGREEMENT_HASH).send({ from: web3.eth.accounts.wallet[i % 10].address })
    }
    for (let i = 1; i <= 10; i++) {
        // console.log(`Bid number ${i}`)
        await genToken.methods.mint(web3.eth.accounts.wallet[i % 10].address, web3.utils.toWei(`${i}`)).send(opts)
        await genToken.methods.approve(migrationDAOResult.Auction4Reputation, web3.utils.toWei(`${i}`)).send({ from: web3.eth.accounts.wallet[i % 10].address })
        await auction4Reputation.methods.bid(web3.utils.toWei(`${i}`), 0, AGREEMENT_HASH).send({ from: web3.eth.accounts.wallet[i % 10].address })
    }

    // TODO: Modify time according to final parameters.
    await increaseTime(7201, web3)

    await startRedeem(
        'http://localhost:8545',
        privateKeys[0],
        10,
        0,
        nectarReputationRedeemer.options.address,
        migrationDAOResult.ContinuousLockingToken4Reputation,
        migrationDAOResult.Auction4Reputation
    )

    let clt4rEvents = await continuousLockingToken4Reputation.getPastEvents('Redeem', { fromBlock: 0, toBlock: 'latest' })
    expect(clt4rEvents.length).toBe(50)
    for (let i in clt4rEvents) {
        i = Number(i)
        let amount = web3.utils.fromWei(`${clt4rEvents[i].returnValues._amount}`)
        let beneficiary = clt4rEvents[i].returnValues._beneficiary

        console.log(`CLT4R Amount: ${amount}`)
        console.log(`CLT4R Beneficiary: ${beneficiary}`)
        expect(beneficiary).toBe(web3.eth.accounts.wallet[(i + 1) % 10].address)
    }

    let a4rEvents = await auction4Reputation.getPastEvents('Redeem', { fromBlock: 0, toBlock: 'latest' })
    expect(a4rEvents.length).toBe(10)
    for (let i in a4rEvents) {
        i = Number(i)
        let amount = web3.utils.fromWei(`${a4rEvents[i].returnValues._amount}`)
        let beneficiary = a4rEvents[i].returnValues._beneficiary

        console.log(`A4R Amount: ${amount}`)
        console.log(`A4R Beneficiary: ${beneficiary}`)
        expect(beneficiary).toBe(web3.eth.accounts.wallet[(i + 1) % 10].address)
    }
}, 500000)

const increaseTime = async function(duration, web3) {
  try {
    await web3.currentProvider.send('evm_increaseTime', [duration])
    await web3.currentProvider.send('evm_mine', [])
  } catch (e) {
    console.log(e)
  }
};
