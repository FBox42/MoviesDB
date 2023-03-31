<html>
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" />

<body>
<header>
    <div class="header">
    <span class="title"><a href="/movieDB/">Movie Recommendations Made Easy</a></span>
    <span class="settings">settings</span>
    </div>
  </header>
  
</body>

</html>

<style>
.header {
  display: flex;
  justify-content: space-between;
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
</style>

<?php
$uri = $_SERVER['REQUEST_URI'];
$tconst = $_REQUEST['tt'];


$conn = mysqli_connect("localhost", "root", "", "movies");

$array = array();


// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connection_error);
  }
  
  #$sql = "SELECT tconst, primaryTitle, startYear FROM recentmovies WHERE tconst='$tconst'";
  $sql = "SELECT  tconst, primaryTitle, startYear FROM recentmovies WHERE numVotes > 20000 LIMIT 10";
  
  $result = $conn->query($sql);
  #var_dump($result);
  
  $y=0;

  if ($result->num_rows > 0) {
    // output data of each row
    foreach ($result as $row){
      
      if ($y==0){
        echo "<h1><u>Results for:". $row['primaryTitle']. "</u></h1>";
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

  $command = "python C:/Users/findl/Documents/SDP/testJW.py $post_json";
  $jsonData = shell_exec($command);
  $data = json_decode($jsonData, TRUE);

  /*
  $command = "python C:/Users/findl/Documents/SDP/testJW.py $post_json";
  $jsonData = shell_exec($command);
  $data = json_decode($jsonData, TRUE);

  # Loop to output the streaming platforms
  foreach ($data as $title => $info) {
    echo "<br>";
    echo var_dump($data);
    echo "<br><br>";
    echo "<h2><u>".$title."</u></h2>" ;
    echo "Description:<br>" . $info["description"] . "<br>";
  


    if (empty($info["streamingPlatforms"])){
      print("No free streaming platforms.");
    }
    else{
      echo "Streaming platforms: ";
      $platformArray = $info["streamingPlatforms"];
      
      foreach ($platformArray as $platform){
       foreach ($platform as $pt){
        echo($pt. ", ");
       }
      }
    }

    if (empty($info["streamingLinks"])){
      echo("No Links found.");
    }
    else{
      echo("<br>Streaming Links: ");
      $linksArray = $info["streamingLinks"];
      foreach ($linksArray as $link){
        foreach ($link as $lk){
          echo($lk. ", ");
        }
      }
    }
 
  }
*/

?>

