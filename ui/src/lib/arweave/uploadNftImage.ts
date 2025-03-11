import path from "path";
import { arweave, getWallet } from "./client";

export async function uploadNftImage(
  imageFile: File,
  tags: Record<string, string> = {}
) {
  try {
    // Read the image file
    const imagePath = URL.createObjectURL(imageFile);
    // const imageData = fs.readFileSync(imagePath);
    const imageArrayBuffer = await imageFile.arrayBuffer();
    const fileExtension = path.extname(imagePath).substring(1);

    // Get wallet
    const wallet = await getWallet();

    // Create the transaction
    const transaction = await arweave.createTransaction(
      {
        data: imageArrayBuffer,
      },
      wallet
    );

    // Add content type tag based on file extension
    let contentType = "image/png"; // default
    if (fileExtension === "jpg" || fileExtension === "jpeg")
      contentType = "image/jpeg";
    if (fileExtension === "gif") contentType = "image/gif";
    if (fileExtension === "svg") contentType = "image/svg+xml";

    // Add essential tags
    transaction.addTag("Content-Type", contentType);
    transaction.addTag("App-Name", "MyNFTCollection");
    transaction.addTag("Type", "NFT-Image");

    // Add custom tags
    Object.entries(tags).forEach(([key, value]) => {
      transaction.addTag(key, value);
    });

    // Sign the transaction
    await arweave.transactions.sign(transaction, wallet);

    // Submit the transaction
    const response = await arweave.transactions.post(transaction);

    if (response.status !== 200 && response.status !== 202) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    console.log(
      `Image uploaded to Arweave with transaction ID: ${transaction.id}`
    );
    console.log(`View at: https://arweave.net/${transaction.id}`);

    return {
      id: transaction.id,
      url: `https://arweave.net/${transaction.id}`,
    };
  } catch (error) {
    console.error("Error uploading image to Arweave:", error);
    throw error;
  }
}
