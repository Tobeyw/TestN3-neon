import { CONST, rpc, sc, wallet, tx, u } from "@cityofzion/neon-core";

const inputs = {
  fromAccount: new wallet.Account(
    "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g"
  ),
  toAccount: new wallet.Account(
    "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
  ),
  tokenScriptHash: CONST.NATIVE_CONTRACT_HASH.GasToken,
  amountToTransfer: 1,
  systemFee: 0,
  networkFee: 0,
  networkMagic: CONST.MAGIC_NUMBER.TestNet,//894710606, 
  nodeUrl: "http://seed2t5.neo.org:20332", //"http://seed2t.neo.org:20332",
};

const vars = {};

export function transformGasDecimal(num) {
    if (num.length <= 8) {
      return "0." + num.padStart(8, "0");
    }
    const decimalPoint = num.length - 8;
    return (
      num.substring(0, decimalPoint) +
      "." +
      num.substring(decimalPoint, num.length)
    );
  }

  const rpcClient = new rpc.RPCClient(inputs.nodeUrl);

export async function createTransaction() {
  console.log("\n\n --- Today's Task ---");
  console.log(
    `Sending ${inputs.amountToTransfer} token \n` +
      `from ${inputs.fromAccount.address} \n` +
      `to ${inputs.toAccount.address}`
  );

  // Since the token is now an NEP-17 token, we transfer using a VM script.
  const script = sc.createScript({
    scriptHash: inputs.tokenScriptHash,
    operation: "transfer",
    args: [
      sc.ContractParam.hash160(inputs.fromAccount.address),
      sc.ContractParam.hash160(inputs.toAccount.address),
      inputs.amountToTransfer,
      sc.ContractParam.any(),
    ],
  });

  

  // We retrieve the current block height as we need to
  const currentHeight = await rpcClient.getBlockCount();
  vars.tx = new tx.Transaction({
    signers: [
      {
        account: inputs.fromAccount.scriptHash,
        scopes: tx.WitnessScope.CalledByEntry,
      },
    ],
    validUntilBlock: currentHeight + 1000,
    script: script,
  });
  console.log("\u001b[32m  ✓ Transaction created \u001b[0m");
}
