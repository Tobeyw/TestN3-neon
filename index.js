/*
 * @Descripttion: 
 * @version: 
 * @Author: Mindy
 * @Date: 2024-04-02 17:46:36
 */


import { CONST, rpc, sc, wallet, tx, u } from "@cityofzion/neon-core";
import {transformGasDecimal,createTransaction}  from "./func.js" ;


 


const rpcClient = new rpc.RPCClient("http://seed2t5.neo.org:20332");

// console.log(inputs.fromAccount.address)
// console.log(rpcClient)
getGasTotalSupply()
createTransaction()

function getGasTotalSupply() {
    console.log("--- Current GAS total supply ---");
    // This is a hexstring
    const gasTotalSupplyScript = new sc.ScriptBuilder()
      .emitContractCall(sc.GasContract.INSTANCE.totalSupply())
      .build();
  
    //We wrap the script in a HexString class so the SDK can handle the conversion to Base64 for us.
    const payload = u.HexString.fromHex(gasTotalSupplyScript);
    return rpcClient.invokeScript(payload).then((gasTotalSupplyResult) => {
      const gasTotalSupply = gasTotalSupplyResult.stack[0].value;
  
      console.log(`Gas total supply is ${transformGasDecimal(gasTotalSupply)}`);
      console.log(
        `This action took ${transformGasDecimal(
          gasTotalSupplyResult.gasconsumed
        )} GAS to run.\n\n`
      );
    });
  }


