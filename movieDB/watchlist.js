// Get received data and parse to json
var receivedJSON = document.currentScript.getAttribute("sentjson");
const jsonArray = JSON.parse(receivedJSON);


// Create container for movies
const moviesContainer = document.createElement('div');


// For each received movie, query api to gain details and then output to user
jsonArray.forEach(titleId => {

  // Get prelimary details on movie using IMDB ID
  url = `https://api.themoviedb.org/3/find/${titleId}?api_key=6d5c5c1ba359501eb269dcd44731593b&external_source=imdb_id`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      // Get TMDB ID from previous API call
      newID = data.movie_results[0].id;

      // Query API with new ID to gain full results
      newurl = `https://api.themoviedb.org/3/movie/${newID}?api_key=6d5c5c1ba359501eb269dcd44731593b&append_to_response==watch/providers,videos`;

      fetch(newurl)
        .then(response => response.json())
        .then(data => {

          // Create div for movies
          const movieDiv = document.createElement('div');
          movieDiv.classList.add('movie');

          // Gain movie information from API result
          const posterPath = data.poster_path;
          const posterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;
          const title = data.title;
          const overview = data.overview;
          const releaseDate = data.release_date;
          const language = data.original_language;

          // Create img element and add poster url
          const posterElement = document.createElement('img');
          posterElement.src = posterUrl;

          // Add poster to movie div
          posterElement.classList.add('movie-poster');
          movieDiv.appendChild(posterElement);

          // Create div for movie information
          const titleAndOverviewElement = document.createElement('div');
          titleAndOverviewElement.classList.add('text-content');

          // Create HTML for text content (movie information)
          titleAndOverviewElement.innerHTML = `<h2 class="movie-title">${title}</h2><p class="movie-overview">${overview}</p>`;

          // Append text to movie div
          movieDiv.appendChild(titleAndOverviewElement);

          // Get video results, IN FUTURE ADD CHECK TO ENSURE ERROR WONT BE THROWN IF THERE IS 0 RESULTS OR THE RESULT IS NOT FROM YT
          const videoId = data.videos.results[0].key;
          const videoUrl = `https://www.youtube.com/embed/${videoId}`;

          // Create iframe element and then add API video result to movie div
          const videoElement = document.createElement('iframe');
          videoElement.src = videoUrl;
          videoElement.classList.add('movie-video');
          movieDiv.appendChild(videoElement);

          // Add new movie div to the movie container created before the loop
          moviesContainer.appendChild(movieDiv);
        });
    })
    .catch(error => console.error(error));
});

// Add movie container to page
document.body.appendChild(moviesContainer);
