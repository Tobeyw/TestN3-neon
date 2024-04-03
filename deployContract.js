/*
 * @Descripttion: 
 * @version: 
 * @Author: Mindy
 * @Date: 2024-04-03 15:26:26
 */
import * as Neon from "@cityofzion/neon-js";
import * as fs from "fs";
const fs1 = fs.promises;

const account = new Neon.wallet.Account("L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g");

console.log(account.address);
const config = {
    networkMagic: Neon.CONST.MAGIC_NUMBER.TestNet,
    rpcAddress: "http://seed2t5.neo.org:20332", // the RPC end point to use for retrieving information and sending the transaction to the network
    account: account,
  };

     // Load the smart contract files from disk, in this example we assume the contract is named "sample1"
     const nef = Neon.sc.NEF.fromBuffer(
        await fs1.readFile(
          "D:\\Neo-Project\\Neo3ContractTest\\Neo3ContractTest\\bin\\sc\\Neo3ContractTest.nef",
          null  
        )
      );
      const manifest = Neon.sc.ContractManifest.fromJson(
        JSON.parse(await fs1.readFile("D:\\Neo-Project\\Neo3ContractTest\\Neo3ContractTest\\bin\\sc\\Neo3ContractTest.manifest.json"))
      );



  export async function deployContract() { 
   try {

    console.log("Deploying");
     // Finally, deploy and get a transaction id in return if successful
     const contract_hash = Neon.experimental.getContractHash(
       Neon.u.HexString.fromHex(account.scriptHash),
       nef.checksum,
       manifest.name
     );
     console.log(`Atemping to deploy contract with hash: 0x${contract_hash}`);
     console.log(await Neon.experimental.deployContract(nef, manifest, config));
     // We can query the blockchain for our contract
     // Note that you'll want to delay this call after a deploy because the deploy transaction will first have to be processed.
     // At the time of writing a block is generated every 15 seconds, thus the following call might will fail until it is processed.
     
    //  const rpcClient = new Neon.rpc.RPCClient(config.rpcAddress);
    //  console.log(await rpcClient.getContractState(contract_hash));

   } catch (e) {
     console.log(e);
   }
 }
 

