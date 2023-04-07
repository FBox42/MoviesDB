<?php

// Get autoloader for MongoDB driver
require 'vendor/autoload.php'; 

// Create MongoDB client
$client = new \MongoDB\Client(
  'mongodb://fbox:MOVIE@ac-7jgdwg6-shard-00-00.oqspgh2.mongodb.net:27017,ac-7jgdwg6-shard-00-01.oqspgh2.mongodb.net:27017,ac-7jgdwg6-shard-00-02.oqspgh2.mongodb.net:27017/?ssl=true&replicaSet=atlas-ozlfc9-shard-0&authSource=admin&retryWrites=true&w=majority'
);

// Select collection from DB
$collection = $client->MovieDB->Test;

// Get the movie ID of the chosen film
$tconst = $_REQUEST['tt'];


// Create query, set options for query, then execute query
$query = ['tconst' => $tconst];

$options = [
  'projection' => ['_id' => 0, 'tconst' => 1, 'Recommendations' => 1],
  'sort' => ['tconst' => -1]
];

$cursor = $collection->find($query);

# Create array for Recommendations
$finalRecs = [];

# Loop to get Recommendations
foreach ($cursor as $document) {

  # Get recommendations from array
  $recommendations = $document->Recommendations;
  $title = $document->primaryTitle;

  // Push Recommendations to PHP array
  foreach ($recommendations as $rec){
    array_push($finalRecs, $rec);
  }
}

# Encode Recommendations as JSON
$json = json_encode($finalRecs);

?>


<!DOCTYPE html>
<html>
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" />
  <head>
    <header>
      <div class="header">
        <span class="title"><a href="/movieDB/">Movie Recommendations Made Easy</a></span>
        <span class="settings">Settings</span>
        <span class="watchlist"><a href="/movieDB/">Watchlist</a></span>
      </div>
    </header>
      <meta charset="UTF-8">
      <title>Movie Recommendations</title>
    </head>
  <body>
    <div class="centreTitle"><?php echo $title; ?></div>    
  </body>
  <script src= 'movies.js' sentJSON=<?php echo $json?> ></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</html>


<style>

.header {
  background-color: #333;
  height: 70px;
  padding: 0 20px;
  font-weight: bold;
  text-decoration: none; 
}

.settings {
  float: right;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  color: white;
}

.watchlist {
  float: right;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  color: white;
  padding-right: 40px;
}

.watchlist a {
  text-decoration: none;
  color: white;
}

.title {
  float: left;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  color: white;

}

.title a {
  text-decoration: none;
  color: white;
}

img {
  max-width: 170px;
  max-height: 200px;
  margin: 10px;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: inherit;
  height: inherit;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  flex-direction: column;
  align-items: center;
}

.popup h3 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  text-align: center;
  text-decoration: underline;
}

.popup p {
  font-size: 18px;
  margin: 30px 0 20px 300px;
  text-align: left;
}

.popup .close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
}

.popup iframe {
  display: block;
  margin: auto 0;
  float: left;
  height: 150px;
  width: 250px;
}

.centreTitle {
  width: 300px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
}

</style>




