
<?php

// Get autoloader for MongoDB driver
require 'vendor/autoload.php'; 

// Create MongoDB client
$client = new \MongoDB\Client(
  'mongodb://fbox:MOVIE@ac-7jgdwg6-shard-00-00.oqspgh2.mongodb.net:27017,ac-7jgdwg6-shard-00-01.oqspgh2.mongodb.net:27017,ac-7jgdwg6-shard-00-02.oqspgh2.mongodb.net:27017/?ssl=true&replicaSet=atlas-ozlfc9-shard-0&authSource=admin&retryWrites=true&w=majority'
);

// Select collection from DB
$collection = $client->MovieDB->Watchlists;

// Get user ID, currently using hardcoded value
#$userd = $SUPERGLOBAL SESSION;
$userID = '111';


// Construct query then execute
$query = ['userID' => $userID];
$cursor = $collection->find($query);


// Create array for movie watchlist IDs
$wacthlistIDs = [];

foreach ($cursor as $document) {

  # Get recommendations from array
  $watchlistMovies = $document->Movies;

  foreach ($watchlistMovies as $movie){
    array_push($wacthlistIDs, $movie);
  }
}

$json = json_encode($wacthlistIDs);

?>


<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Movie Watchlist</title>
  </head>
  <body>
    <h2>Movie Watchlist:</h2>
    </div>  
    <script src= 'watchlist.js' sentJSON=<?php echo $json?> ></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  </body>
</html>
<style>
.movie {
  display: flex;
  flex-direction: row;
  padding-top: 5px;
  padding-bottom: 5px;
  border-top: 4px solid black;
  margin-top: 10px;
  margin-bottom: 10px;
  
}

.movie-poster {
  flex: 0 0 auto;
  width: 150px;
  margin-right: 20px;
}

.movie-title{
    margin-top: 5px;
    text-decoration: underline;
}

.text-content{
    margin-right: 5%;

}

.movie-video {
  flex: 0 0 auto;
  width: 400px;
  height: 225px;
  border: none;
  margin-left: 20px;
}
</style>