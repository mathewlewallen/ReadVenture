"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.connectToDatabase = exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
/**
 * MongoDB connection configuration and state
 */
class DatabaseConnection {
    constructor() {
        this.connection = {
            client: new mongodb_1.MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017'),
            db: null,
        };
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    /**
     * Establishes connection to MongoDB
     * @throws {Error} If connection fails or URI is invalid
     */
    async connect() {
        if (!process.env.MONGO_URI) {
            throw new Error('MongoDB URI not found in environment variables');
        }
        try {
            await this.connection.client.connect();
            this.connection.db = this.connection.client.db();
            console.log('Connected to MongoDB successfully');
        }
        catch (error) {
            const e = error;
            console.error('MongoDB connection error:', e.message);
            throw new Error(`Failed to connect to MongoDB: ${e.message}`);
        }
    }
    /**
     * Returns existing database connection or creates new one
     * @returns MongoDB database instance
     */
    async getDb() {
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
    async close() {
        try {
            await this.connection.client.close();
            this.connection.db = null;
            console.log('MongoDB connection closed');
        }
        catch (error) {
            const e = error;
            console.error('Error closing MongoDB connection:', e.message);
            throw new Error(`Failed to close MongoDB connection: ${e.message}`);
        }
    }
}
exports.db = DatabaseConnection.getInstance();
const connectToDatabase = () => exports.db.connect();
exports.connectToDatabase = connectToDatabase;
const closeDatabase = () => exports.db.close();
exports.closeDatabase = closeDatabase;
//# sourceMappingURL=mongodb.js.map