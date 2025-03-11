import Arweave from "arweave";
import fs from "fs";

// Initialize the Arweave client
export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

// Load your wallet key
export const getWallet = async () => {
  const keyfilePath = process.env.ARWEAVE_KEY_FILE_PATH;
  if (!keyfilePath) {
    throw new Error(
      "Arweave key file path not specified in environment variables"
    );
  }

  try {
    const rawKey = fs.readFileSync(keyfilePath);
    return JSON.parse(rawKey.toString());
  } catch (error) {
    console.error("Error loading Arweave wallet:", error);
    throw error;
  }
};

// Get wallet address from key
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getWalletAddress = async (wallet: any): Promise<string> => {
  return await arweave.wallets.jwkToAddress(wallet);
};

// Get wallet balance
export const getWalletBalance = async (address: string): Promise<string> => {
  const balance = await arweave.wallets.getBalance(address);
  return arweave.ar.winstonToAr(balance);
};
