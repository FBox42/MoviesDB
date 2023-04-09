




// Get received data and parse to json
//var receivedJSON = document.currentScript.getAttribute("sentjson");
//const jsonArray = JSON.parse(receivedJSON);


// Create container for movies
const moviesContainer = document.createElement('div');


async function displayWatchlist(titleId) {

  // Get prelimary details on movie using IMDB ID
  url = `https://api.themoviedb.org/3/find/${titleId}?api_key=6d5c5c1ba359501eb269dcd44731593b&external_source=imdb_id`;



  fetch(url)
    .then(response => response.json())
    .then(data => {

      // Get TMDB ID from previous API call
      console.log(url)


      newID = data.movie_results[0].id;



      // Query API with new ID to gain full results
      newurl = `https://api.themoviedb.org/3/movie/${newID}?api_key=6d5c5c1ba359501eb269dcd44731593b&append_to_response=watch/providers,videos`;
      

      fetch(newurl)
        .then(response => response.json())
        .then(data => {

          // Create div for movies

          console.log(data);
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


          //const streamingResultsGB = data['watch/providers'].results.GB
          const streamingResultsGB = data['watch/providers'].results.GB


          freeProviderArray = [];
          freeLogoArray = [];

          rentProviderArray = [];
          rentLogoArray = [];

          buyProviderArray = [];
          buyLogoArray = [];

          if (typeof streamingResultsGB == 'undefined') {

            // CURRENTLY FOR DEBUGGING, CREATE PROPER WAY TO OUTPUT TO USER
            console.log("NO STREAMING IN GB");

          } else {

            const freeProviderResult = data['watch/providers'].results.GB.flatrate;

            // Get 'free' streaming services if they exist and obtain logo of said service, CURRENTLY ALSO OUTPUTS TO CONSOLE THE SERVICE NAME

            if (typeof freeProviderResult == 'undefined') {

              // CURRENTLY FOR DEBUGGING, CREATE PROPER WAY TO OUTPUT TO USER
              console.log("NO FREE STREAMING");

            } else {

              for (let i = 0; i < freeProviderResult.length; i++) {

                // Get path of current platform logo
                logoPath = data['watch/providers'].results.GB.flatrate[i].logo_path;
                logoUrl = `https://image.tmdb.org/t/p/w500${logoPath}`;

                // ... DO SOMETHING TO OUTPUT/ADD LOGOS FOR LATER DISPLAY
                freeLogoArray.push(logoUrl);


                // GET PROVIDER NAME, PROBABLY NOT NEEDED IN FINAL VERSION, USEFUL FOR DEBUGGING CURRENTLY
                freeProvider = data['watch/providers'].results.GB.flatrate[i].provider_name;
                freeProviderArray.push(freeProvider);
              }

            }



            // Get rental services if they exist and obtain logo of said service, CURRENTLY ALSO OUTPUTS TO CONSOLE THE SERVICE NAME
            const rentProviderResult = data['watch/providers'].results.GB.rent;

            if (typeof rentProviderResult == 'undefined') {

              console.log("NO RENT OPTIONS");

            } else {
              for (let i = 0; i < rentProviderResult.length; i++) {

                // Get path of current platform logo

                logoPath = data['watch/providers'].results.GB.rent[i].logo_path;
                logoUrl = `https://image.tmdb.org/t/p/w500/${logoPath}`;

                // ... DO SOMETHING TO OUTPUT/ADD LOGOS FOR LATER DISPLAY

                rentLogoArray.push(logoUrl);

                // GET PROVIDER NAME, PROBABLY NOT NEEDED IN FINAL VERSION, USEFUL FOR DEBUGGING CURRENTLY
                rentProvider = data['watch/providers'].results.GB.rent[i].provider_name;
                rentProviderArray.push(rentProvider);
              }
              // USED FOR DEBUGGING
              console.log(rentProviderArray);
            }



            // Get purchase services if they exist and obtain logo of said service, CURRENTLY ALSO OUTPUTS TO CONSOLE THE SERVICE NAME
            const buyProviderResult = data['watch/providers'].results.GB.buy;

            if (typeof buyProviderResult == 'undefined') {

              console.log("NO BUY OPTIONS");

            } else {
              for (let i = 0; i < buyProviderResult.length; i++) {

                // Get path of current platform logo

                logoPath = data['watch/providers'].results.GB.buy[i].logo_path;
                logoUrl = `https://image.tmdb.org/t/p/w500/${logoPath}`;

                // ... DO SOMETHING TO OUTPUT/ADD LOGOS FOR LATER DISPLAY
                buyLogoArray.push(logoUrl);

                // GET PROVIDER NAME, PROBABLY NOT NEEDED IN FINAL VERSION, USEFUL FOR DEBUGGING CURRENTLY
                buyProvider = data['watch/providers'].results.GB.buy[i].provider_name;
                buyProviderArray.push(buyProvider);
              }

              // USED FOR DEBUGGING
              console.log(buyProviderArray);
            }



            // Get result path for streaming services of current movie, then create empty array for platforms
          }

          freeStreamingHTML = '';
          rentStreamingHTML = '';
          buyStreamingHTML = '';


          for (let i = 0; i < freeLogoArray.length; i++) {
            freeStreamingHTML += `<img src="${freeLogoArray[i]}" width="30" height="30" title = ${freeProviderArray[i]} altr=${freeProviderArray[i]}>`;
          }

          for (let i = 0; i < rentLogoArray.length; i++) {
            rentStreamingHTML += `<img src="${rentLogoArray[i]}" width="30" height="30" title=${rentProviderArray[i]} altr=${rentProviderArray[i]}>`;
          }

          for (let i = 0; i < buyLogoArray.length; i++) {
            buyStreamingHTML += `<img src="${buyLogoArray[i]}" width="30" height="30" title=${buyProviderArray[i]} altr=${buyProviderArray[i]}>`;
          }


          console.log(buyStreamingHTML);
          // Create HTML for text content (movie information)
          titleAndOverviewElement.innerHTML = `<h2 class="movie-title">${title}</h2>
          <p class="movie-overview">${overview}</p>
          <p class="buttonClass"><button id="${titleId}">Remove from watchlist</button></p>
          <br>
          <p>Streaming platforms: ${freeStreamingHTML}</p>
          <p>Rental platforms: ${rentStreamingHTML}</p>
          <p>Purchase platforms: ${buyStreamingHTML}</p>
          `
            ;

          imdbID = titleId


          // Append text to movie div
          movieDiv.appendChild(titleAndOverviewElement);



          videoHTML = ''

          // Create iframe element 
          const videoResult = data.videos.results[0];

          if (typeof videoResult == 'undefined') {
            console.log("NO VIDEO");
          } else {

            const videoId = data.videos.results[0].key;
            const videoUrl = `https://www.youtube.com/embed/${videoId}`;

            const videoElement = document.createElement('iframe');
            videoElement.src = videoUrl;
            videoElement.classList.add('movie-video');
            movieDiv.appendChild(videoElement);
          }



          // Create iframe element and then add API video result to movie div


          // Add new movie div to the movie container created before the loop
          moviesContainer.appendChild(movieDiv);



          const removeFromWatchlistButton = titleAndOverviewElement.querySelector('button');
          removeFromWatchlistButton.addEventListener('click', function () {
            var $button = $(this); // cache the button element

            const imdbID = this.id; // capture the titleId value in a closure
            // AJAX request
            $.ajax({
              type: "POST",
              url: "/removeFromWatchlist",
              data: {
                imdbID
              },
              success: function (response) {
                console.log(response);
                // Change text of HTML element
                $button.text("Removed"); // change the text of the button
                $button.prop("disabled", true); // disable the button
              },
              error: function (error) {
                console.log(error);
              }
            });
          });



        });
    })
    .catch(error => console.error(error));


};
document.body.appendChild(moviesContainer);

// Add movie container to page

/*
 
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
 
*/

userID = '111';

fetch(`/displayWatchlist?id=${userID}`)
  .then(response => response.json())
  .then(data => {

    console.log(data.watchlistIDs);

    jsonArray = (data.watchlistIDs);


  })
  .then(() => {
    for (let i = 0; i < jsonArray.length; i++) {
      // Wait for the getPoster function to finish before continuing
      console.log(jsonArray[i]);
      displayWatchlist(jsonArray[i]);
    }
  });



/*
async function loop() {
for (let i = 0; i < 10; i++) {
  // Wait for the getPoster function to finish before continuing
  await getPoster(i);
}
}
*/