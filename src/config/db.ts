import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri: string = process.env.MONGODB_URI || '';
if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

const client: MongoClient = new MongoClient(uri);
let dbInstance: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (dbInstance) return dbInstance;
  await client.connect();
  dbInstance = client.db('goodgatherDB');
  console.log('Successfully connected to MongoDB Atlas');
  return dbInstance;
}