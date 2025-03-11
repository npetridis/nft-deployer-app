import Arweave from "arweave";

// Initialize the Arweave client
export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

// Load your wallet key
export const getWallet = async () => {
  if (typeof window !== "undefined") {
    throw new Error("Wallet access should only be done server-side");
  }

  const keyString = process.env.ARWEAVE_KEY;
  if (!keyString) {
    throw new Error("Arweave key not specified in environment variables");
  }

  try {
    return JSON.parse(keyString);
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
