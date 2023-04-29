// Create container for movies
const moviesContainer = document.createElement('div');

//Function to output all watchlist items
async function displayWatchlist(titleId) {

  // Get prelimary details on movie using IMDB ID
  url = `https://api.themoviedb.org/3/find/${titleId}?api_key=6d5c5c1ba359501eb269dcd44731593b&external_source=imdb_id`;


  fetch(url)
    .then(response => response.json())
    .then(data => {

      // Get TMDB ID from previous API call
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
          const runtime = data.runtime;
          language = data.original_language;

          language = language.charAt(0).toUpperCase() + language.slice(1);

          const genres = data.genres;
              genreString = '';

              // If genre array does not exist, create string stating that, otherwise append each genre result from API array into genreString
              if (typeof genres == 'undefined') {

                genreString = "No genres found."

              } else {

                for (let i = 0; i < genres.length; i++) {

                  genreString = genreString.concat(data.genres[i].name);
                  if (i + 1 !== genres.length) {
                    genreString = genreString.concat(" | ");
                  }

                }

              }


          // Create img element and add poster url
          const posterElement = document.createElement('img');
          posterElement.src = posterUrl;

          // Add poster to movie div
          posterElement.classList.add('movie-poster');
          movieDiv.appendChild(posterElement);

          // Create div for movie information
          const titleAndOverviewElement = document.createElement('div');
          titleAndOverviewElement.classList.add('text-content');


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

            // Get 'free' streaming services if they exist and obtain logo of said service

            if (typeof freeProviderResult == 'undefined') {


            } else {

              for (let i = 0; i < freeProviderResult.length; i++) {

                // Get path of current platform logo
                logoPath = data['watch/providers'].results.GB.flatrate[i].logo_path;
                logoUrl = `https://image.tmdb.org/t/p/w500${logoPath}`;

                // ... DO SOMETHING TO OUTPUT/ADD LOGOS FOR LATER DISPLAY
                freeLogoArray.push(logoUrl);

                freeProvider = data['watch/providers'].results.GB.flatrate[i].provider_name;
                freeProviderArray.push(freeProvider);
              }

            }



            // Get rental services if they exist and obtain logo of said service
            const rentProviderResult = data['watch/providers'].results.GB.rent;

            if (typeof rentProviderResult == 'undefined') {


            } else {
              for (let i = 0; i < rentProviderResult.length; i++) {

                // Get path of current platform logo

                logoPath = data['watch/providers'].results.GB.rent[i].logo_path;
                logoUrl = `https://image.tmdb.org/t/p/w500/${logoPath}`;


                rentLogoArray.push(logoUrl);

                rentProvider = data['watch/providers'].results.GB.rent[i].provider_name;
                rentProviderArray.push(rentProvider);
              }
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

                buyLogoArray.push(logoUrl);

                buyProvider = data['watch/providers'].results.GB.buy[i].provider_name;
                buyProviderArray.push(buyProvider);
              }

            }
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

          const voteAverage = (Math.round(data.vote_average * 10)) / 10;


          // Create HTML for text content (movie information)
          titleAndOverviewElement.innerHTML = `<h2 class="movie-title">${title}</h2>
          <p class="movie-overview">${overview}</p>
          <p>Genres: &nbsp ${genreString}<br>
          Rating: &nbsp&nbsp&nbsp&nbsp${voteAverage}/10<br>
          Runtime: &nbsp${runtime} minutes<br>
          Original language: &nbsp${language}<br>
          Release date: &nbsp${releaseDate}</p><br>
          <p class="buttonClass"><button class="btn btn-primary btn-block" id="${titleId}">Remove from watchlist</button></p>
          <br>
          <p>Streaming platforms:&nbsp;&nbsp;${freeStreamingHTML}</p>
          <p>Rental platforms:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${rentStreamingHTML}</p>
          <p>Purchase platforms:&nbsp; ${buyStreamingHTML}</p>
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


          // Add new movie div to the movie container created before the loop
          moviesContainer.appendChild(movieDiv);



          const removeFromWatchlistButton = titleAndOverviewElement.querySelector('button');
          removeFromWatchlistButton.addEventListener('click', function () {
            var $button = $(this); 

            const imdbID = this.id; 

            $.ajax({
              type: "POST",
              url: "/removeFromWatchlist",
              data: {
                imdbID
              },
              success: function (response) {
                console.log(response);
                // Change text of HTML element
                $button.text("Removed"); 
                $button.prop("disabled", true); 
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


fetch(`/displayWatchlist`)
  .then(response => response.json())
  .then(data => {

    console.log(data.watchlistIDs); 

    jsonArray = (data.watchlistIDs);


  })
  .then(() => {

    if (jsonArray == "User not found." || typeof jsonArray !== 'object') {
      //document.write("No movies found in watchlist")
      var newElement = document.createElement("p");

      // Set the text content of the new element
      var textNode = document.createTextNode("No movies found in watchlist");
      newElement.appendChild(textNode);

      // Append the new element to the body of the page
      document.body.appendChild(newElement);

    } else {
      for (let i = 0; i < jsonArray.length; i++) {
        // Wait for the getPoster function to finish before continuing
        displayWatchlist(jsonArray[i]);
      }
    }
  });
