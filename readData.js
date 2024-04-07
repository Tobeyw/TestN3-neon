/*
 * @Descripttion: 
 * @version: 
 * @Author: Mindy
 * @Date: 2024-04-07 14:25:46
 */
import { CONST, rpc, sc, wallet, tx, u } from "@cityofzion/neon-js";

const inputs = {
  fromAccount: new wallet.Account(
    "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g"
  ),
  toAccount: new wallet.Account(
    "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
  ),
  tokenScriptHash: CONST.NATIVE_CONTRACT_HASH.GasToken,
  bridgeContract: "64789bde6fd6c0b9b26a1d84b07fb679e0f3639f",
  amountToTransfer: 200000000,
  systemFee: 0,
  networkFee: 0,
  networkMagic: CONST.MAGIC_NUMBER.TestNet,//894710606, 
  nodeUrl: "http://seed2t5.neo.org:20332", //"http://seed2t.neo.org:20332",
};

const rpcClient = new rpc.RPCClient(inputs.nodeUrl);
export async function getDataFromContract() {
    console.log("--- Reading data ---");

    const script = await rpcClient.invokeFunction(inputs.bridgeContract,"withdrawalsProcessed");

      console.log(script)
  
  }