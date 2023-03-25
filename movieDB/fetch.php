<?php
//fetch.php
$connect = mysqli_connect("localhost", "root", "", "movies");
$output = '';
if(isset($_POST["query"]))
{
 $search = mysqli_real_escape_string($connect, $_POST["query"]);
 $query = "
 SELECT tconst, primaryTitle, startYear  FROM recentmovies 
 WHERE primaryTitle LIKE '%".$search."%'
 ORDER BY numVotes DESC 
 ";
   $seachBoolean = TRUE;
 
}
else
{
 $query = "
  ";
}


if ($seachBoolean = TRUE){
   $result = mysqli_query($connect, $query);

   if(mysqli_num_rows($result) > 0)
   {
   $output .= '
   <div class="table-responsive">
      <table class="table table bordered">
      <tr>
      </tr>
   ';
   while($row = mysqli_fetch_array($result))
      {
      $output .= '
         <tr>
         <td><a href="output.php?tt='.$row["tconst"].'">'.$row["primaryTitle"].' ('.$row["startYear"].')</a></td>
         </tr>
      ';
      }
   echo $output;
   }
   
   else
   {
   echo 'Movie Not Found';
   }
}


?>