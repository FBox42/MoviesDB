// Parse received data
var receivedData = document.currentScript.getAttribute("sentJSON");
const jsonArray = JSON.parse(receivedData);



// Create div for movies
const movieContainer = document.createElement('div');
movieContainer.className = 'movie-container';


// Function to get movie details, display on page given reccomendation order and add popup box for further information
function getPoster(posterNum) {

  // Get prelimary details on movie using IMDB ID
  url = `https://api.themoviedb.org/3/find/${jsonArray[posterNum]}?api_key=6d5c5c1ba359501eb269dcd44731593b&external_source=imdb_id`;

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
          console.log(data);


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

            // Get result path for streaming services of current movie, then create empty array for platforms
            const freeProviderResult = data['watch/providers'].results.GB.flatrate;
            freeProviderArray = [];

            // Get 'free' streaming services if they exist and obtain logo of said service, CURRENTLY ALSO OUTPUTS TO CONSOLE THE SERVICE NAME

            if (typeof freeProviderResult == 'undefined') {

              // CURRENTLY FOR DEBUGGING, CREATE PROPER WAY TO OUTPUT TO USER
              console.log("NO FREE STREAMING");

            } else {

              for (let i = 0; i < freeProviderResult.length; i++) {

                // Get path of current platform logo
                logoPath = data['watch/providers'].results.GB.flatrate[i].logo_path;
                logoUrl = `https://image.tmdb.org/t/p/w500/${logoPath}`;

                // ... DO SOMETHING TO OUTPUT/ADD LOGOS FOR LATER DISPLAY


                // GET PROVIDER NAME, PROBABLY NOT NEEDED IN FINAL VERSION, USEFUL FOR DEBUGGING CURRENTLY
                freeProvider = data['watch/providers'].results.GB.flatrate[i].provider_name;
                freeProviderArray.push(freeProvider);
              }
              // USED FOR DEBUGGING
              console.log(freeProviderArray);
            }



            // Get rental services if they exist and obtain logo of said service, CURRENTLY ALSO OUTPUTS TO CONSOLE THE SERVICE NAME
            const rentProviderResult = data['watch/providers'].results.GB.rent;
            rentProviderArray = [];

            if (typeof rentProviderResult == 'undefined') {

              console.log("NO RENT OPTIONS");

            } else {
              for (let i = 0; i < rentProviderResult.length; i++) {

                // Get path of current platform logo

                logoPath = data['watch/providers'].results.GB.rent[i].logo_path;
                logoUrl = `https://image.tmdb.org/t/p/w500/${logoPath}`;

                // ... DO SOMETHING TO OUTPUT/ADD LOGOS FOR LATER DISPLAY


                // GET PROVIDER NAME, PROBABLY NOT NEEDED IN FINAL VERSION, USEFUL FOR DEBUGGING CURRENTLY
                rentProvider = data['watch/providers'].results.GB.rent[i].provider_name;
                rentProviderArray.push(rentProvider);
              }
              // USED FOR DEBUGGING
              console.log(rentProviderArray);
            }



            // Get purchase services if they exist and obtain logo of said service, CURRENTLY ALSO OUTPUTS TO CONSOLE THE SERVICE NAME
            const buyProviderResult = data['watch/providers'].results.GB.buy;
            buyProviderArray = [];

            if (typeof buyProviderResult == 'undefined') {

              console.log("NO BUY OPTIONS");

            } else {
              for (let i = 0; i < buyProviderResult.length; i++) {

                // Get path of current platform logo
           
                logoPath = data['watch/providers'].results.GB.buy[i].logo_path;
                logoUrl = `https://image.tmdb.org/t/p/w500/${logoPath}`;

                // ... DO SOMETHING TO OUTPUT/ADD LOGOS FOR LATER DISPLAY
                
                // GET PROVIDER NAME, PROBABLY NOT NEEDED IN FINAL VERSION, USEFUL FOR DEBUGGING CURRENTLY
                buyProvider = data['watch/providers'].results.GB.buy[i].provider_name;
                buyProviderArray.push(buyProvider);
              }
              
              // USED FOR DEBUGGING
              console.log(buyProviderArray);
            }

            // Create iframe element 
            const videoId = data.videos.results[0].key;
            const videoUrl = `https://www.youtube.com/embed/${videoId}`;
            const videoElement = document.createElement('iframe');
            videoElement.src = videoUrl;
            //videoElement.width = 560;
            //videoElement.height = 315;
            videoElement.allowFullscreen = true;

            // Create popup element and then create html for it
            const popupElement = document.createElement('div');
            popupElement.className = 'popup';
            popupElement.innerHTML = `
                <h3>${title}</h3>
                <div class="video-container">
                  <iframe src="${videoUrl}" allowfullscreen></iframe>
                </div>
                <p>${overview}</p>
                <p>Genres: ${genreString}<br>
                Rating: ${voteAverage}/10<br>
                Runtime: ${runtime} minutes.</p>
                <span class="close">&times;</span>
              `;


            // Add event listener to the close button so when pressed it closes
            const closeButton = popupElement.querySelector('.close');
            closeButton.addEventListener('click', () => {
              popupElement.remove();
            });

            // Add the popup element to the document
            document.body.appendChild(popupElement);
          });

          // Set poster location on page
          posterElement.style.position = 'absolute';
          posterElement.style.top = posterDesigns[posterNum].top;
          posterElement.style.left = posterDesigns[posterNum].left;


          // Add poster to document
          movieContainer.appendChild(posterElement);

        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));


};

// Add posters to page
document.body.appendChild(movieContainer);

// Create location data for posters to be displayed at
const posterDesigns = [
  { top: '20%', left: '40%' },
  { top: '65%', left: '50%' },
  { top: '40%', left: '63%' },
  { top: '70%', left: '30%' },
  { top: '9%', left: '54%' },
  { top: '18%', left: '21%' },
  { top: '65%', left: '72%' },
  { top: '25%', left: '85%' },
  { top: '60%', left: '9%' },
  { top: '10%', left: '0%' }
];


// Create counter and then call getPoster to return 10 results
functionCounter = 0;

while (functionCounter < 10) {
  getPoster(functionCounter);
  functionCounter = functionCounter + 1;
}


