
Go to redeem-logs.txt, take the last transaction hash there, and check the block where it was sent
(ie. 0x7cb7ba9383e65c45b4d2aa19ac0e2ad81619206cc0026d086953d95f315ac5c8 at block 9703514)

Increment this block number by 1 (ie. 9703514 -> 9703515) and paste it in the `scripts/nectarRedeemLogs.js` file at line 12 as the `_fromBlock=` value.

Run `npm run redeem`, wait a few minutes (probably 15 should be good, possibly less), then stop the script take the output of that and paste it at the end of the `logs/redeem-logs.txt` file
(ie. ```
GAS 6555678
Transaction 0x7b4f2d11d6486fd881772f1a885e8b13f006b855d59874416f42c41de1055eda successfully redeemed 66 CLT4Reputation locks.
Redeems Counter: 1
```)

Run `npm run redeemLog`, copy the result and paste it into a new file under `logs` folder called `redeemed_dd_mm_yy.txt` (ie. `redeemed_22_4_20.txt`)

Commit the changes, pr them, and you're done!