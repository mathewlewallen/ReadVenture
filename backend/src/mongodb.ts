import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';

dotenv.config();

interface MongoConnection {
  client: MongoClient;
  db: Db | null;
}

/**
 * MongoDB connection configuration and state
 */
class DatabaseConnection {
  collection(_arg0: string) {
    throw new Error('Method not implemented.');
  }
  private static instance: DatabaseConnection;
  private connection: MongoConnection = {
    client: new MongoClient(
      process.env.MONGO_URI || 'mongodb://localhost:27017',
    ),
    db: null,
  };

  private constructor() { }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Establishes connection to MongoDB
   * @throws {Error} If connection fails or URI is invalid
   */
  async connect(): Promise<void> {
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    try {
      await this.connection.client.connect();
      this.connection.db = this.connection.client.db();
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      const e = error as Error;
      console.error('MongoDB connection error:', e.message);
      throw new Error(`Failed to connect to MongoDB: ${e.message}`);
    }
  }

  /**
   * Returns existing database connection or creates new one
   * @returns MongoDB database instance
   */
  async getDb(): Promise<Db> {
    if (!this.connection.db) {
      await this.connect();
    }
    if (!this.connection.db) {
      throw new Error('Database connection not established');
    }
    return this.connection.db;
  }

  /**
   * Closes database connection
   */
  async close(): Promise<void> {
    try {
      await this.connection.client.close();
      this.connection.db = null;
      console.log('MongoDB connection closed');
    } catch (error) {
      const e = error as Error;
      console.error('Error closing MongoDB connection:', e.message);
      throw new Error(`Failed to close MongoDB connection: ${e.message}`);
    }
  }
}

export const db = DatabaseConnection.getInstance();
export const connectToDatabase = () => db.connect();
export const closeDatabase = () => db.close();
