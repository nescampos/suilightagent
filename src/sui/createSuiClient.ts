import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export function createSuiClient(keyPair: Ed25519Keypair, network: String) {
    return {keyPair: keyPair, network: network};
}