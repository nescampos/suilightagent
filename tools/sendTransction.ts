// Importing necessary functions and types for transaction handling
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { createSuiWalletClient } from "../src/sui/createSuiWalletClient.js"; // Function to create a Viem wallet client
import type { ToolConfig } from "./allTools.js"; // Type definition for tool configurations
import type { SendTransactionArgs } from "../interface/index.js"; // Type definition for send transaction arguments

// Configuration for the send transaction tool
export const sendTransactionTool: ToolConfig<SendTransactionArgs> = {
  definition: {
    type: "function",
    function: {
      name: "send_transaction",
      description: "Send a transaction with optional parameters",
      parameters: {
        type: "object",
        properties: {
          to: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{66}$",
            description: "The recipient address",
          },
          value: {
            type: "string",
            description: "The amount of SUI to send",
          }
        },
        required: ["to", "value"],
      },
    },
  },
  // Handler function to execute the send transaction tool
  handler: async (args) => {
    const result = await sendTransaction(args);
    if (!result.success || !result.hash) throw new Error(result.message);
    return result.hash;
  },
};

// Function to send a transaction
async function sendTransaction({
  to,
  value,
}: SendTransactionArgs) {
  try {
    const walletClient = createSuiWalletClient();
    const client = new SuiClient({
      url: walletClient.network.toString(),
    });
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [value]);
    tx.transferObjects([coin], to);
    const result = await client.signAndExecuteTransaction({
      signer: walletClient.keyPair,
      transaction: tx,
    });


    // Returning the transaction hash and a success message
    return {
      success: true,
      hash: result.digest,
      message: `Transaction sent successfully. Digest: ${result.digest}`,
    };
  } catch (error) {
    // Handling errors and returning an error message
    return {
      success: false,
      hash: null,
      message: `Failed to send transaction: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
