require('dotenv').config();

dbKey = process.env.DATABASE_PASSWORD

const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a new MongoClient

async function searchMovies(searchQuery, params) {

  paramString = '';

  paramArray = JSON.parse(params);

  for (let i = 0; i < paramArray.length; i++) {

    paramString += paramArray[i];
    paramString += '-';
  }

  const paramURL = paramString.slice(0, -1);


  if (typeof searchQuery === 'undefined' || searchQuery === '') {
    return ''
  }

  const uri = "mongodb+srv://fbox:" + dbKey + "@moviesdb.oqspgh2.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  try {
    await client.connect();
    const collection = client.db('MovieDB').collection('Movies');

    const query = { primaryTitle: { $regex: `.*${searchQuery}.*`, $options: 'i' } };
    const options = { projection: { _id: 0, tconst: 1, primaryTitle: 1, startYear: 1 }, sort: { weightedAverage: -1 } };
    const cursor = collection.find(query, options);

    const results = await cursor.toArray();
    if (results.length === 0) {
      return 'Movie Not Found';
    }

    outputText = ''

    if (results.length==1){
      outputText="result"
    }
    else{
      outputText="results"
    }

    const output = results.map((movie) => `
      <tr>
        <td><a href="recommendations?id=${movie.tconst}&sp=${paramURL}">${movie.primaryTitle} (${movie.startYear})</a></td>
      </tr>
    `).join('');

    const table = `
      <div class="table-responsive">
        <table class="table table-bordered">
          <tr>
            <th>${results.length} ${outputText} found.</th>
          </tr>
          ${output}
        </table>
      </div>
    `;

    return table;
  } finally {
    await client.close();
  }
}

module.exports = searchMovies;
