<?php

require 'vendor/autoload.php'; 

// Create a MongoDB client
$client = new \MongoDB\Client(
    'mongodb://fbox:MOVIE@ac-7jgdwg6-shard-00-00.oqspgh2.mongodb.net:27017,ac-7jgdwg6-shard-00-01.oqspgh2.mongodb.net:27017,ac-7jgdwg6-shard-00-02.oqspgh2.mongodb.net:27017/?ssl=true&replicaSet=atlas-ozlfc9-shard-0&authSource=admin&retryWrites=true&w=majority'
);

$collection = $client->MovieDB->Movies;

$output = '';

if (isset($_POST["query"])) {
    $search = $_POST["query"];
    $options = [
        'projection' => ['_id' => 0, 'tconst' => 1, 'primaryTitle' => 1, 'startYear' => 1],
        'sort' => ['weightedAverage' => -1]
    ];
    
    $query = ['primaryTitle' => ['$regex' => '.*' . $search . '.*', '$options' => 'i']];



    $cursor = $collection->find($query, $options);

    if ($cursor->isDead() === false) {
        $output .= '
        <div class="table-responsive">
            <table class="table table bordered">
                <tr>
                    <th>Title</th>
                </tr>
        ';

        foreach ($cursor as $document) {
            $output .= '
                <tr>
                    <td><a href="movie poster.php?tt='.$document["tconst"].'">'.$document["primaryTitle"].' ('.$document["startYear"].')</a></td>
                </tr>
            ';
        }

        $output .= '</table></div>';
        echo $output;
    } else {
        echo 'Movie Not Found';
    }
} else {
    echo "Trending:";
}
?>