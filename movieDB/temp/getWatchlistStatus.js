const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://fbox:MOVIE@moviesdb.oqspgh2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function getWatchlistStatus(userID, movieTitle) {
    try {
        await client.connect();

        const collection = client.db('MovieDB').collection('Watchlists');
        
        const result = await collection.findOne({ userID: userID, Movies: { $in: [movieTitle] } });

        if (!result) {
            return 'Movie not found in the collection for this user.';
        } else {
            return 'Movie already in watchlist';
        }
    } catch (err) {
        return `Error: ${err}`;
    } finally {
        //await client.close();
    }
}

module.exports = getWatchlistStatus;
