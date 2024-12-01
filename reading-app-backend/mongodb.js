require('dotenv').config(); // Load environment variables from .env
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; // Get the connection string from .env

const client = new MongoClient(uri); // Create a new MongoClient

// Connect to the database
(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // You can add code here to interact with the database
    // (e.g., insert documents, perform queries)

    // Close the connection when done
    // await client.close();
  } catch (e) {
    console.error('Error connecting to MongoDB:', e);
  }
})();