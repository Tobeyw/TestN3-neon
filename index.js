/*
 * @Descripttion: 
 * @version: 
 * @Author: Mindy
 * @Date: 2024-04-02 17:46:36
 */


import { CONST, rpc, sc, wallet, tx, u } from "@cityofzion/neon-js";
import {
  checkToken,
  checkSystemFee,
  checkNetworkFee,
  checkBalance,
  performTransfer,
  createTransferTransaction,
  createContractTransaction}  from "./creatTx.js" ;
import {deployContract} from "./deployContract.js";

import {getDataFromContract} from "./readData.js";



// createTransferTransaction()
//   .then(checkToken)
//   .then(checkNetworkFee)
//   .then(checkSystemFee)
//   .then(checkBalance)
//   .then(performTransfer)
//   .catch((err) => console.log(err));

//deployContract()
getDataFromContract()

// createContractTransaction()
//   .then(checkToken)
//   .then(checkNetworkFee)
//   .then(checkSystemFee)
//   .then(checkBalance)
//   .then(performTransfer)
//   .catch((err) => console.log(err));


