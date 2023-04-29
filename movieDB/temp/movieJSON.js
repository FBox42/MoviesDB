require('dotenv').config();

dbKey = process.env.DATABASE_PASSWORD

async function getMovieRecommendationsJSON(tconst) {

    const { MongoClient, ServerApiVersion } = require('mongodb');    

    const uri = "mongodb+srv://fbox:" + dbKey + "@moviesdb.oqspgh2.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


    // Select database and collection
    const dbName = 'MovieDB';
    const collectionName = 'Recommendations';

    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();

            const database = client.db(dbName);
            const collection = database.collection(collectionName);

            // Create query, set options for query, then execute query
            const query = { tconst };
            const projection = { _id: 0, tconst: 1, primaryTitle: 1, Recommendations: 1 };
            const sort = { tconst: -1 };
            const cursor = collection.find(query, { projection, sort });

            // Create array for Recommendations
            const finalRecs = [];
            title = '';
            // Loop to get Recommendations
            await cursor.forEach((document) => {
                // Get recommendations from array
                const recommendations = document.Recommendations;
                const primaryTitle = document.primaryTitle;
                title = primaryTitle;

                // Push Recommendations to array
                finalRecs.push(...recommendations);
            });

            // Encode Recommendations as JSON
            const jsonArray = JSON.stringify(finalRecs);

            resolve({ title, jsonArray });

        } catch (err) {
            console.error(err);
            reject(err);
        } finally {
            await client.close();
        }
    });
}

module.exports = getMovieRecommendationsJSON;
