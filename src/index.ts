import "dotenv/config";
import { MongoClient } from "mongodb";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var: ${name}. Please set MONGO_URI, MONGO_DB_NAME, MONGO_CLAIMS_COLLECTION, and MONGO_DEALS_COLLECTION.`
    );
  }
  return value;
}

const uri = requireEnv("MONGO_URI");
const databaseName = requireEnv("MONGO_DB_NAME");
const claimsCollectionName = requireEnv("MONGO_CLAIMS_COLLECTION");
const dealsCollectionName = requireEnv("MONGO_DEALS_COLLECTION");

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db(databaseName);
    const claimsCollection = db.collection(claimsCollectionName);
    const dealsCollection = db.collection(dealsCollectionName);
    const [claimsCount, dealsCount] = await Promise.all([
      claimsCollection.countDocuments(),
      dealsCollection.countDocuments(),
    ]);
    console.log(`Database: ${databaseName}`);
    console.log(`${claimsCollectionName} documents:`, claimsCount);
    console.log(`${dealsCollectionName} documents:`, dealsCount);
  } catch (error) {
    console.error(`Failed to query collection in database '${databaseName}'.`);
    console.error(error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();