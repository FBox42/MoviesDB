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
    <span class="settings">Settings</span>
    <span class="watchlist"><a href="/movieDB/">Watchlist</a></span>

    </div>
  </header>
  <h2>Toggle Switch</h2>
    <label class="switch">
    <input type="checkbox">
    <span class="slider round"></span>
    </label>

  <div class="container">
   <br/>
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

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 18px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 10px;
  width: 10px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

.slider.round {
  border-radius: 22px;
}

.slider.round:before {
  border-radius: 50%;
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