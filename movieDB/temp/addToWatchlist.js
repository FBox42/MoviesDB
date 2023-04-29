require('dotenv').config();

dbKey = process.env.DATABASE_PASSWORD

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://fbox:"+dbKey+"@moviesdb.oqspgh2.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function addMovieToWatchlist(userID, movieID) {

    try {
        await client.connect();

        const collection = client.db('MovieDB').collection('Watchlists');

        const result = await collection.updateOne(
            { userID: userID },
            { $addToSet: { Movies: movieID } },
            { upsert: true }
        );
        if (result.modifiedCount === 0 && result.upsertedCount === 0) {
            return 'Movie already exists for this user.';
        } else {
            return 'Movie added successfully.';
        }
    } catch (err) {
        return `Error: ${err}`;
    } finally {
        //await client.close();
    }
}

module.exports = addMovieToWatchlist;
