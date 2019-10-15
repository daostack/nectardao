# nectardao

## architecture 

### diagram 
  ![necdiagram](necdao.jpg)
### voting parameters  
production [parameters](https://docs.google.com/spreadsheets/d/1vt79eXdrc-kn04dRj5Qk-9xEqctPm5YcPEFI-qecQC4/edit#gid=0)

## deployment
### rinkeby:

1. set parameter json . [e.g](https://github.com/daostack/nectardao/blob/master/parameters/model-10-10-2019-rinkeby.json) 
2. update migrate_rinkeby cmd at package.json https://github.com/daostack/nectardao/blob/master/package.json#L9 
3. `npm i`
4. `npm run migrate_rinkeby --  --private-key <PRIVATE_KEY> --provider https://rinkeby.infura.io/v3/<infuraKey>`
