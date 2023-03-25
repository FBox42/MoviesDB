<html>
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" />

<body>
<header>
      <a href="/movieDB/" class="title">Movie Recommendations Made Easy</a>
      <span class="settings">settings</span>


</header>
  
</body>

</html>

<style>
  .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  height: 80px;
  padding: 0 20px;
  font-size: 25px;
  font-weight: bold;
  text-decoration: none; 
}
a.title{
    color: white; 
}

.settings{
  float: right;

}
</style>

<?php
$uri = $_SERVER['REQUEST_URI'];
$tconst = $_REQUEST['tt'];


$conn = mysqli_connect("localhost", "root", "", "movies");

$array = array();


// Check connion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connection_error);
  }
  
  #$sql = "SELECT tconst, primaryTitle, startYear FROM recentmovies WHERE tconst='$tconst'";
  $sql = "SELECT  tconst, primaryTitle, startYear FROM recentmovies WHERE numVotes > 20000 ORDER BY RAND()LIMIT 10";
  
  $result = $conn->query($sql);
  #var_dump($result);
  
  $y=0;

  if ($result->num_rows > 0) {
    // output data of each row
    foreach ($result as $row){
      
      if ($y==0){
        echo "<h1><u>". $row['primaryTitle']. "</u></h1>";
        echo "id: " . $row["tconst"]. " - Name: " . $row["primaryTitle"]. " " . $row["startYear"]. "<br>";
      }
      
      $movieName = $row["primaryTitle"];
      $movieReleaseDate = $row["startYear"];     
      $array[$movieName] = $movieReleaseDate;
      $y=$y+1;

    }
  } else {
    echo "No results";
  }
  $conn->close();

  #var_dump($array);
  
  $array = json_encode($array);

  #echo($array);

  #$post_json = base64_encode($array);

  $post_json = json_encode($array);
  $post_json = base64_encode($post_json);
  
  $command = "python C:/Users/findl/Documents/SDP/test.py $post_json";
  $jsonData = shell_exec($command);
  $data = json_decode($jsonData, TRUE);

  foreach ($data as $title => $info) {
    echo "<br>";
    echo "<h2><u>".$title."</u></h2>" ;
    echo "Description:<br>" . $info["description"] . "<br>";

    if (empty($info["streamingPlatforms"])){
      print("No free streaming platforms.");
    }
    else{
      echo "Streaming platforms: ";
      $platformArray = $info["streamingPlatforms"];
      foreach ($platformArray as $platform){
       echo $platform;
      }

    }
    echo "Streaming links:<br>". $info["streamingLinks"] . "<br>";

}


  # echo $jsonData;
  
  # for each item in json data
  

    // Pass the JSON string as a command-line argument to the Python script
  #$output = shell_exec('C:/Users/findl/Documents/SDP/test.py' . $post_json);
  #echo ($post_json);
  #$command = "python C:/Users/findl/Documents/SDP/test.py $post_json";
  #echo shell_exec($command);

  #$tmp = exec("python create_prescription.py .$post_json");
  #$result = json_decode($tmp); 

  #$command = escapeshellcmd('C:/Users/findl/Documents/SDP/test.py ' .  ' ' . escapeshellarg($array));

  // Execute the command and capture the output
  #$output = shell_exec($command);
  
  // Output the response from the Python script
  #echo $output;


/*
$output = '
   <div class="table-responsive">
      <table class="table table bordered">
      <tr>
      </tr>
   ';
   while($row = mysqli_fetch_array($result))
   {
   $output .= '
      <tr>
      <td>'.$row["primaryTitle"].' ('.$row["startYear"].')</a></td>
      </tr>
   ';
   }

*/



// Get tconst from url, get top 10 reccomendations
// For each recommondation call the api for api 

?>

