//const { response } = require("express");

// Create div for movies
const movieContainer = document.createElement('div');
movieContainer.className = 'movie-container';


posterCounter = 0;
loopCounter = 0;

function getPosterCounter() {
  return posterCounter;
}

function updatePosterCounter() {
  posterCounter = posterCounter + 1;
  loopCounter = loopCounter + 1;
}

// Function to get movie details, display on page given reccomendation order and add popup box for further information
async function getPoster(posterNum) {


  while (postersPlaced < 10 && loopCounter < jsonArray.length) {



    const imdbID = jsonArray[loopCounter];
    // Get prelimary details on movie using IMDB ID
    url = `https://api.themoviedb.org/3/find/${imdbID}?api_key=6d5c5c1ba359501eb269dcd44731593b&external_source=imdb_id`;

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

            // Log result for debugging, remove before finalisation

            const streamingResultsGB = data['watch/providers'].results.GB

            freeProviderArray = [];
            freeLogoArray = [];

            rentProviderArray = [];
            rentLogoArray = [];

            buyProviderArray = [];
            buyLogoArray = [];

            if (typeof streamingResultsGB == 'undefined') {

              // CURRENTLY FOR DEBUGGING, CREATE PROPER WAY TO OUTPUT TO USER
            } else {

              const freeProviderResult = data['watch/providers'].results.GB.flatrate;

              // Get 'free' streaming services if they exist and obtain logo of said service, CURRENTLY ALSO OUTPUTS TO CONSOLE THE SERVICE NAME

              if (typeof freeProviderResult == 'undefined') {

                // CURRENTLY FOR DEBUGGING, CREATE PROPER WAY TO OUTPUT TO USER

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
              }


              // Get purchase services if they exist and obtain logo of said service, CURRENTLY ALSO OUTPUTS TO CONSOLE THE SERVICE NAME
              const buyProviderResult = data['watch/providers'].results.GB.buy;

              if (typeof buyProviderResult == 'undefined') {

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
              }


              totalProviderArray = freeProviderArray + rentProviderArray + buyProviderArray;


              // Get result path for streaming services of current movie, then create empty array for platforms
            }


            // Gain movie information from API result
            const posterPath = data.poster_path;
            const posterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;
            const title = data.title;
            const overview = data.overview;
            const releaseDate = data.release_date;
            const language = data.original_language;
            const runtime = data.runtime;
            const voteAverage = (Math.round(data.vote_average * 10)) / 10;



            // Get poster image and add to poster element 
            const posterElement = document.createElement('img');
            posterElement.src = posterUrl;

            // add click event listener to the poster element
            posterElement.addEventListener('click', () => {

              const streamingResultsGB = data['watch/providers'].results.GB

              freeProviderArray = [];
              freeLogoArray = [];

              rentProviderArray = [];
              rentLogoArray = [];

              buyProviderArray = [];
              buyLogoArray = [];

              if (typeof streamingResultsGB == 'undefined') {

                // CURRENTLY FOR DEBUGGING, CREATE PROPER WAY TO OUTPUT TO USER

              } else {

                const freeProviderResult = data['watch/providers'].results.GB.flatrate;

                // Get 'free' streaming services if they exist and obtain logo of said service, CURRENTLY ALSO OUTPUTS TO CONSOLE THE SERVICE NAME

                if (typeof freeProviderResult == 'undefined') {

                } else {

                  for (let i = 0; i < freeProviderResult.length; i++) {

                    // Get path of current platform logo
                    logoPath = data['watch/providers'].results.GB.flatrate[i].logo_path;
                    logoUrl = `https://image.tmdb.org/t/p/w500${logoPath}`;

                    freeLogoArray.push(logoUrl);


                    freeProvider = data['watch/providers'].results.GB.flatrate[i].provider_name;
                    freeProviderArray.push(freeProvider);
                  }

                }



                // Get rental services if they exist and obtain logo of said service, CURRENTLY ALSO OUTPUTS TO CONSOLE THE SERVICE NAME
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


                totalProviderArray = freeProviderArray + rentProviderArray + buyProviderArray;

              }


              // Get genres and create empty string
              const genres = data.genres;
              genreString = '';

              // If genre array does not exist, create string stating that, otherwise append each genre result from API array into genreString
              if (typeof genres == 'undefined') {

                genreString = "No genres found."

              } else {

                for (let i = 0; i < genres.length; i++) {

                  genreString = genreString.concat(data.genres[i].name);
                  genreString = genreString.concat(" | ");

                }
              }


              videoHTML = ''

              // Create iframe element 
              const videoResult = data.videos.results[0];

              if (typeof videoResult == 'undefined') {
              } else {

                const videoId = data.videos.results[0].key;
                const videoUrl = `https://www.youtube.com/embed/${videoId}`;
                const videoElement = document.createElement('iframe');
                videoElement.src = videoUrl;
                videoElement.allowFullscreen = true;
                videoHTML = `<iframe src="${videoUrl}" allowfullscreen></iframe>`
              }


              $.ajax({
                type: "POST",
                url: "/getWatchlistStatus",
                data: {
                  imdbID
                },
                success: function (response) {

                  if (response == 'Movie already in watchlist') {
                    const buttonElement = document.getElementById(imdbID);
                    buttonElement.innerHTML = "Already in watchlist";
                  }
                  else {
                    const buttonElement = document.getElementById(imdbID);
                    buttonElement.innerHTML = "Add to watchlist";
                    buttonElement.disabled = false;
                  }

                },
                error: function (error) {
                  console.log(error);
                }
              });

              // In server create call to function to check it

              // Create watchlistCheck.js where it querys the database with the user id and movie id 

              // Return false or true 

              freeStreamingHTML = '';
              rentStreamingHTML = '';
              buyStreamingHTML = '';


              for (let i = 0; i < freeLogoArray.length; i++) {
                freeStreamingHTML += `<img src="${freeLogoArray[i]}" width="40" height="40" title = ${freeProviderArray[i]} altr=${freeProviderArray[i]}>`;
              }

              for (let i = 0; i < rentLogoArray.length; i++) {
                rentStreamingHTML += `<img src="${rentLogoArray[i]}" width="40" height="40" title=${rentProviderArray[i]} altr=${rentProviderArray[i]}>`;
              }

              for (let i = 0; i < buyLogoArray.length; i++) {
                buyStreamingHTML += `<img src="${buyLogoArray[i]}" width="40" height="40" title=${buyProviderArray[i]} altr=${buyProviderArray[i]}>`;
              }


              // Create popup element and then create html for it
              const popupElement = document.createElement('div');
              popupElement.className = 'popup';
              popupElement.innerHTML = `
                <h3>${title}</h3>
                <br>
                <div class="video-container">
                ${videoHTML}
                </div>
                <p>${overview}</p>
                <p>Genres: ${genreString}<br>
                Rating: ${voteAverage}/10<br>
                Runtime: ${runtime} minutes.</p>
                <p class="buttonClass"><button id="${imdbID}" disabled>Loading</button></p>
                <p>Streaming platforms: ${freeStreamingHTML}</p>
                <p>Rental platforms: ${rentStreamingHTML}</P>
                <p>Purchase platforms: ${buyStreamingHTML}</p>
                <span class="close">&times;</span>
              `;


              currentPopupId = imdbID;

              const addToWatchlistButton = popupElement.querySelector(`.buttonClass button#${currentPopupId}`);


              // Add an event listener to the button
              addToWatchlistButton.addEventListener('click', function () {
                var $button = $(this); // cache the button element

                // AJAX request
                $.ajax({
                  type: "POST",
                  url: "/insertWatchlist",
                  data: {
                    currentPopupId
                  },
                  success: function (response) {

                    // Change text of HTML element
                    $button.text("Added"); // change the text of the button
                    $button.prop("disabled", true); // disable the button

                  },
                  error: function (error) {
                    console.log(error);
                  }
                });
              });

              // Add event listener to the close button so when pressed it closes
              const closeButton = popupElement.querySelector('.close');
              closeButton.addEventListener('click', () => {
                popupElement.remove();
              });

              // Add the popup element to the document
              document.body.appendChild(popupElement);





            });

            // Set poster location on page



            if (paramArray.some(platform => totalProviderArray.includes(platform) || paramArray[0] == "All")) {
              newvalue = getPosterPlacement();

              if (newvalue < 10){
              posterElement.style.position = 'absolute';
              posterElement.style.top = posterDesigns[newvalue].top;
              posterElement.style.left = posterDesigns[newvalue].left;
              }
              else{
                return;
              }

            } else {
              return false;
            }            

            // Add poster to document
            movieContainer.appendChild(posterElement);


          })
          .catch(error => console.error(error));

      })
      .catch(error => console.error(error));


    // END OF WHILE LOOP

    updatePosterCounter();

  }

};

// Add posters to page
document.body.appendChild(movieContainer);


postersPlaced = -1;
function getPosterPlacement() {
  postersPlaced = postersPlaced + 1;
  return postersPlaced;

}

const posterDesigns = [
  { top: '20%', left: '40%' },
  { top: '65%', left: '50%' },
  { top: '45%', left: '65%' },
  { top: '70%', left: '30%' },
  { top: '11%', left: '56%' },
  { top: '18%', left: '21%' },
  { top: '66%', left: '84%' },
  { top: '22%', left: '90%' },
  { top: '58%', left: '8%' },
  { top: '11%', left: '0%' }

];


// Create counter and then call getPoster to return 10 results
const urlParams = new URLSearchParams(window.location.search);
const tconst = urlParams.get('id');
const params = urlParams.get('sp');

paramArray = [];

if (params.includes("All")) {

  paramArray.push("All")
    
}
else{
  if (params.includes("NF")) {

    paramArray.push("Netflix")
  }
  if (params.includes("AZ")) {

    paramArray.push("Amazon Prime")
  }

  if (params.includes("DY")) {

    paramArray.push("Disney")
  }

}


fetch(`/data?id=${tconst}`)
  .then(response => response.json())
  .then(async data => {
    jsonArray = JSON.parse(data.jsonArray);
    primaryTitle = data.title;

    const header = document.getElementById("primaryTitle");
    // Change the text value
    header.textContent = primaryTitle;

    await getPoster();


  })
