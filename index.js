/*
 * @Descripttion: 
 * @version: 
 * @Author: Mindy
 * @Date: 2024-04-02 17:46:36
 */


import { CONST, rpc, sc, wallet, tx, u } from "@cityofzion/neon-core";
import {
  checkToken,
  checkSystemFee,
  checkNetworkFee,
  checkBalance,
  performTransfer,
  createTransferTransaction,
  createContractTransaction}  from "./creatTx.js" ;

const to = "F5aD3d4e846f33041180Aea32e11137009cC1734"   // evm address
 
console.log( u.hash160(to))
const toAccount =new wallet.Account(
  "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
)


console.log(sc.ContractParam.hash160(toAccount.address))
// createTransferTransaction()
//   .then(checkToken)
//   .then(checkNetworkFee)
//   .then(checkSystemFee)
//   .then(checkBalance)
//   .then(performTransfer)
//   .catch((err) => console.log(err));


createContractTransaction()
  .then(checkToken)
  .then(checkNetworkFee)
  .then(checkSystemFee)
  .then(checkBalance)
  .then(performTransfer)
  .catch((err) => console.log(err));


