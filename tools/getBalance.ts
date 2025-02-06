import { createSuiWalletClient } from "../src/sui/createSuiWalletClient";
import type { ToolConfig } from "./allTools.js";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { MIST_PER_SUI } from "@mysten/sui/utils";

import type { GetBalanceArgs } from "../interface/index.js";

/**
 * Get the balance of a wallet.
 *
 * This tool takes a single parameter, the wallet address to get the balance
 * from.
 */
export const getBalanceTool: ToolConfig<GetBalanceArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_balance",
      description: "Get the balance of a wallet",
      parameters: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
            description: "The wallet address to get the balance from",
          },
        },
        required: ["wallet"],
      },
    },
  },
  handler: async ({ wallet }) => {
    return await getBalance(wallet);
  },
};

async function getBalance(address: string) {
  const publicClient = createSuiWalletClient();
  const rpcUrl = getFullnodeUrl(process.env?.SUI_NETWORK);
  const client = new SuiClient({ url: rpcUrl });
  const balances = await client.getBalance({
    owner: address,
  });
  const suiAmount =
                Number.parseInt(balances.totalBalance) /
                Number(MIST_PER_SUI);
  return suiAmount;
}
