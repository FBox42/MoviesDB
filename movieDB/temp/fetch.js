
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a new MongoClient

async function searchMovies(searchQuery, params) {

  paramString = '';

  paramArray = JSON.parse(params);

  for (let i = 0; i < paramArray.length; i++) {

    paramString += paramArray[i];
    paramString += '-';
    // code to execute for each item in the array
  }

  const paramURL = paramString.slice(0, -1);


  if (typeof searchQuery === 'undefined' || searchQuery === '') {
    return 'Trending'
  }

  const uri = "mongodb+srv://fbox:MOVIE@moviesdb.oqspgh2.mongodb.net/?retryWrites=true&w=majority";
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

    const output = results.map((movie) => `
      <tr>
        <td><a href="recommendations?id=${movie.tconst}&sp=${paramURL}">${movie.primaryTitle} (${movie.startYear})</a></td>
      </tr>
    `).join('');

    const table = `
      <div class="table-responsive">
        <table class="table table-bordered">
          <tr>
            <th>Title</th>
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




/*
function searchMovies(query, callback) {
  client.connect(function(err, client) {
    if (err) {
      callback(err, null);
      return;
    }


    const options = {
      projection: { _id: 0, tconst: 1, primaryTitle: 1, startYear: 1 },
      sort: { weightedAverage: -1 }
    };

    const regexQuery = { primaryTitle: { $regex: `.*${query}.*`, $options: 'i' } };
    const cursor = collection.find(regexQuery, options);
    let output = '';

    cursor.toArray(function(err, docs) {
      if (err) {
        callback(err, null);
        return;
      }

      if (docs.length === 0) {
        callback(null, 'Movie Not Found');
        return;
      }

      output += `
        <div class="table-responsive">
          <table class="table table-bordered">
            <tr>
              <th>Title</th>
            </tr>
      `;

      docs.forEach(function(doc) {
        output += `
          <tr>
            <td><a href="movie poster.php?tt=${doc.tconst}">${doc.primaryTitle} (${doc.startYear})</a></td>
          </tr>
        `;
      });

      output += '</table></div>';
      callback(null, output);
    });
  });
}

module.exports = searchMovies;



*/





/*
const movieSchema = new mongoose.Schema({
  tconst: String,
  primaryTitle: String,
  startYear: Number,
  weightedAverage: Number,
});

const Movie = mongoose.model('Movie', movieSchema);

const searchMovies = async (query) => {
  const regex = new RegExp(`.*${query}.*`, 'i');
  const options = {
    projection: { _id: 0, tconst: 1, primaryTitle: 1, startYear: 1 },
    sort: { weightedAverage: -1 },
  };
  const movies = await Movie.find({ primaryTitle: regex }, options);
  return movies;
};

const searchQuery = async (req, res) => {
  const query = req.body.query;
  if (query) {
    try {
      const movies = await searchMovies(query);
      if (movies.length > 0) {
        const output = `
          <div class="table-responsive">
            <table class="table table bordered">
              <tr>
                <th>Title</th>
              </tr>
              ${movies
                .map(
                  (movie) => `
                    <tr>
                      <td>
                        <a href="movie poster.php?tt=${movie.tconst}">
                          ${movie.primaryTitle} (${movie.startYear})
                        </a>
                      </td>
                    </tr>
                  `
                )
                .join('')}
            </table>
          </div>
        `;
        res.send(output);
      } else {
        res.send('Movie Not Found');
      }
    } catch (error) {
      console.error(error);
      res.send('An error occurred while searching for movies.');
    }
  } else {
    res.send('Trending:');
  }
};

module.exports = {
  myFunction: myFunction
};
*/