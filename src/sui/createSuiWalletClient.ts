import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import {createSuiClient} from "./createSuiClient";

/**
 * Creates a new Viem wallet client connected to the Sui network.
 *
 * A wallet client is a client that is connected to a specific wallet and
 * can therefore perform write operations.
 *
 * @returns A new Viem wallet client.
 */
export function createSuiWalletClient() {
  // Check if the private key environment variable is set
  if (!process.env.WALLET_PRIVATE_KEY) {
    throw new Error(
      "⛔ WALLET_PRIVATE_KEY environment variable is not set. You need to set it to create a wallet client."
    );
  }

  const rpcUrl = getFullnodeUrl('testnet');

  const keyPair = Ed25519Keypair.deriveKeypair(process.env.WALLET_PRIVATE_KEY?.toString());


  // Create the wallet client
  return createSuiClient(keyPair, rpcUrl);
}
