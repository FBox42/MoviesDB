require('dotenv').config();

dbKey = process.env.DATABASE_PASSWORD

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://fbox:" + dbKey + "@moviesdb.oqspgh2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function getMoviesForUser(userID) {
  try {
    await client.connect();

    const collection = client.db('MovieDB').collection('Watchlists');

    const result = await collection.findOne({ userID: userID });

    if (!result) {
      console.log("USER NOT FOUND");
      return 'User not found.';
    } else {
      return result.Movies;
    }
  } catch (err) {
    return `Error: ${err}`;
  } finally {
   // await client.close();
  }
}

module.exports = getMoviesForUser;