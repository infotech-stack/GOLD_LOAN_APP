const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: './config/config.env' });

const localDB = 'mongodb://127.0.0.1:27017/Gold_loan';
const atlasDB = process.env.MONGO_CLOUD_URI;

(async () => {
  try {
    // Connect to local MongoDB
    const localConn = await mongoose.connect(localDB);
    console.log(`Connected to local MongoDB: ${localDB}`);

    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (let collection of collections) {
      const localCollection = localConn.connection.db.collection(collection.name);
      const data = await localCollection.find({}).toArray();

      if (data.length > 0) {
        console.log(`Seeding collection: ${collection.name}`);

        // Connect to MongoDB Atlas
        const atlasConn = await mongoose.createConnection(atlasDB);

        const atlasCollection = atlasConn.collection(collection.name);

        // Upsert documents to handle duplicates
        for (let doc of data) {
          await atlasCollection.updateOne(
            { _id: doc._id }, 
            { $set: doc }, 
            { upsert: true }
          );
        }

        console.log(`Successfully seeded ${data.length} documents to collection: ${collection.name}`);
        await atlasConn.close();
      } else {
        console.log(`No data found in collection: ${collection.name}`);
      }
    }
    
    // Close the local connection after all collections have been processed
    await mongoose.disconnect();
    console.log('All data seeded and connections closed.');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
})();
