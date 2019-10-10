# nectardao

production [parameters](https://docs.google.com/spreadsheets/d/1vt79eXdrc-kn04dRj5Qk-9xEqctPm5YcPEFI-qecQC4/edit#gid=0)

# how to deploy a test on rinkeby :

1. set parameter json . [e.g](https://github.com/daostack/nectardao/blob/master/parameters/model-10-10-2019-rinkeby.json) 
2. update migrate_rinkeby cmd at package.json https://github.com/daostack/nectardao/blob/master/package.json#L9 
3. run the following cmd :
   `npm run migrate_rinkeby --  --private-key <PRIVATE_KEY> --provider <RINKEBY_INFURA_URL>`
