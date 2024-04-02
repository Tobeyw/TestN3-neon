import { CONST, rpc, sc, wallet, tx, u } from "@cityofzion/neon-core";

const inputs = {
  fromAccount: new wallet.Account(
    "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g"
  ),
  toAccount: new wallet.Account(
    "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
  ),
  tokenScriptHash: CONST.NATIVE_CONTRACT_HASH.GasToken,
  bridgeContract: "64789bde6fd6c0b9b26a1d84b07fb679e0f3639f",
  amountToTransfer: 2500000000,
  systemFee: 0,
  networkFee: 0,
  networkMagic: CONST.MAGIC_NUMBER.TestNet,//894710606, 
  nodeUrl: "http://seed2t5.neo.org:20332", //"http://seed2t.neo.org:20332",
};

const vars = {};

const rpcClient = new rpc.RPCClient(inputs.nodeUrl);
//=============================createContractTransaction===================================
export async function createContractTransaction() {
  console.log("\n\n --- Deposit Task ---");
  
 const depositTo = "0xF5aD3d4e846f33041180Aea32e11137009cC1734"  //evm address

  console.log(
    `Deposit ${inputs.amountToTransfer} token \n` +
      `from ${inputs.fromAccount.address} of N3\n` +
      `to ${depositTo} of Neo X`
  );
 
  const script = sc.createScript({
    scriptHash: inputs.bridgeContract,
    operation: "deposit",
    args: [
      sc.ContractParam.hash160(inputs.fromAccount.address),
      sc.ContractParam.hash160(depositTo),
      inputs.amountToTransfer,
  //    sc.ContractParam.any(),
    ],
  });

  // We retrieve the current block height as we need to
  const currentHeight = await rpcClient.getBlockCount();
  vars.tx = new tx.Transaction({
    signers: [
      {
        account: inputs.fromAccount.scriptHash,
        scopes: tx.WitnessScope.Global,
      },
    ],
   validUntilBlock: currentHeight + 1000,
    script: script,
  });
  console.log("\u001b[32m  ✓ Transaction created \u001b[0m");



} 
//==========================createTransferTransaction======================================
export async function createTransferTransaction() {
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
      sc.ContractParam.hash160(inputs.fromAccount.address),
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

//================================performTransfer================================
export async function performTransfer() {
  const signedTransaction = vars.tx.sign(
    inputs.fromAccount,
    inputs.networkMagic
  );

  console.log(vars.tx.toJson());
  const result = await rpcClient.sendRawTransaction(
    u.HexString.fromHex(signedTransaction.serialize(true))
  );

  console.log("\n\n--- Transaction hash ---");
  console.log(result);
}

//================================================================
export async function checkNetworkFee() {
  const feePerByteInvokeResponse = await rpcClient.invokeFunction(
    CONST.NATIVE_CONTRACT_HASH.PolicyContract,
    "getFeePerByte"
  );

  if (feePerByteInvokeResponse.state !== "HALT") {
    if (inputs.networkFee === 0) {
      throw new Error("Unable to retrieve data to calculate network fee.");
    } else {
      console.log(
        "\u001b[31m  ✗ Unable to get information to calculate network fee.  Using user provided value.\u001b[0m"
      );
      vars.tx.networkFee = u.BigInteger.fromNumber(inputs.networkFee);
    }
  }
  const feePerByte = u.BigInteger.fromNumber(
    feePerByteInvokeResponse.stack[0].value
  );
  // Account for witness size
  const transactionByteSize = vars.tx.serialize().length / 2 + 109;
  // Hardcoded. Running a witness is always the same cost for the basic account.
  const witnessProcessingFee = u.BigInteger.fromNumber(1000390);
  const networkFeeEstimate = feePerByte
    .mul(transactionByteSize)
    .add(witnessProcessingFee);
  if (inputs.networkFee && inputs.networkFee >= networkFeeEstimate.toNumber()) {
    vars.tx.networkFee = u.BigInteger.fromNumber(inputs.networkFee);
    console.log(
      `  i Node indicates ${networkFeeEstimate.toDecimal(
        8
      )} networkFee but using user provided value of ${inputs.networkFee}`
    );
  } else {
    vars.tx.networkFee = networkFeeEstimate;
  }
  console.log(
    `\u001b[32m  ✓ Network Fee set: ${vars.tx.networkFee.toDecimal(
      8
    )} \u001b[0m`
  );
}

export async function checkSystemFee() {
  const invokeFunctionResponse = await rpcClient.invokeScript(
    u.HexString.fromHex(vars.tx.script),
    [
      {
        account: inputs.fromAccount.scriptHash,
        scopes: tx.WitnessScope.Global,
      },
    ]
  );
  if (invokeFunctionResponse.state !== "HALT") {
    throw new Error(
      `invokeFunction script errored out: ${invokeFunctionResponse.exception}`
    );
  }
  const requiredSystemFee = u.BigInteger.fromNumber(
    invokeFunctionResponse.gasconsumed
  );
  if (inputs.systemFee && inputs.systemFee >= requiredSystemFee) {
    vars.tx.systemFee = u.BigInteger.fromNumber(inputs.systemFee);
    console.log(
      `  i Node indicates ${requiredSystemFee} systemFee but using user provided value of ${inputs.systemFee}`
    );
  } else {
    vars.tx.systemFee = requiredSystemFee;
  }
  console.log(
    `\u001b[32m  ✓ SystemFee set: ${vars.tx.systemFee.toDecimal(8)}\u001b[0m`
  );
}

export async function checkToken() {
  const tokenNameResponse = await rpcClient.invokeFunction(
    inputs.tokenScriptHash,
    "symbol"
  );

  if (tokenNameResponse.state !== "HALT") {
    throw new Error(
      "Token not found! Please check the provided tokenScriptHash is correct."
    );
  }

  vars.tokenName = u.HexString.fromBase64(
    tokenNameResponse.stack[0].value
  ).toAscii();

  console.log("\u001b[32m  ✓ Token found \u001b[0m");
}

export async function checkBalance() {
  let balanceResponse;
  try {
    balanceResponse = await rpcClient.execute(
      new rpc.Query({
        method: "getnep17balances",
        params: [inputs.fromAccount.address],
      })
    );
  } catch (e) {
    console.log(e);
    console.log(
      "\u001b[31m  ✗ Unable to get balances as plugin was not available. \u001b[0m"
    );
    return;
  }
  // Check for token funds
  const balances = balanceResponse.balance.filter((bal) =>
    bal.assethash.includes(inputs.tokenScriptHash)
  );
  const balanceAmount =
    balances.length === 0 ? 0 : parseInt(balances[0].amount);
  if (balanceAmount < inputs.amountToTransfer) {
    throw new Error(`Insufficient funds! Found ${balanceAmount}`);
  } else {
    console.log("\u001b[32m  ✓ Token funds found \u001b[0m");
  }

  // Check for gas funds for fees
  const gasRequirements = vars.tx.networkFee.add(vars.tx.systemFee);
  const gasBalance = balanceResponse.balance.filter((bal) =>
    bal.assethash.includes(CONST.NATIVE_CONTRACT_HASH.GasToken)
  );
  const gasAmount =
    gasBalance.length === 0
      ? u.BigInteger.fromNumber(0)
      : u.BigInteger.fromNumber(gasBalance[0].amount);

  if (gasAmount.compare(gasRequirements) === -1) {
    throw new Error(
      `Insufficient gas to pay for fees! Required ${gasRequirements.toString()} but only had ${gasAmount.toString()}`
    );
  } else {
    console.log(
      `\u001b[32m  ✓ Sufficient GAS for fees found (${gasRequirements.toString()}) \u001b[0m`
    );
  }
}
