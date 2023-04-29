require('dotenv').config();

dbKey = process.env.DATABASE_PASSWORD

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://fbox:" + dbKey + "@moviesdb.oqspgh2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

async function deleteMovieFromWatchlist(userID, movieID) {
  try {
    await client.connect();

    const collection = client.db('MovieDB').collection('Watchlists');

    const result = await collection.updateOne(
      { userID: userID },
      { $pull: { Movies: movieID } }
    );

    if (result.modifiedCount === 0) {
      return 'Movie does not exist for this user.';
    } else {
      return 'Movie removed successfully.';
    }
  } catch (err) {
    return `Error: ${err}`;
  } finally {
    // await client.close();
  }
}

module.exports = deleteMovieFromWatchlist;
