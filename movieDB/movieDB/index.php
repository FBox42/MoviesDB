<html>
 <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>MoviesDB</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" />

  

  <body>
  <header>
    <div class="header">
    <span class="title"><a href="/movieDB/">Movie Recommendations Made Easy</a></span>
    <span class="settings">settings</span>
    </div>
  </header>
  <div class="container">
   <br />
   <h2 align="center">Movie search</h2><br />
   <div class="form-group">
    <div class="input-group">
     <input type="text" name="search_text" id="search_text" placeholder="Search for movies ..."form-control" />
    </div>
   </div>
   <br />
   <div id="result"></div>
  </div>
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

<script>
$(document).ready(function(){

 load_data();

 function load_data(query)
 {
  $.ajax({
   url:"fetch.php",
   method:"POST",
   data:{query:query},
   success:function(data)
   {
    $('#result').html(data);
   }
  });
 }
 $('#search_text').keyup(function(){
  var search = $(this).val();
  if(search != '')
  {
   load_data(search);
  }
  else
  {
   load_data();
  }
 });
});
</script>