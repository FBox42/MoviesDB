

// Define the query parameters
const queryParams = {
  api_key: 'a6d5c5c1ba359501eb269dcd44731593b',
  language: 'en-US',
  sort_by: 'popularity.desc',
  include_adult: false,
  include_video: false,
  page: 1
};

apiKey = 'a6d5c5c1ba359501eb269dcd44731593b'

// Construct the URL by combining the base URL, endpoint, and query parameters
//const url = new URL(baseURL + endpoint);
//const url = 'https://api.themoviedb.org/3/movie/550?api_key=6d5c5c1ba359501eb269dcd44731593b'

baseURL = 'https://api.themoviedb.org/3/find/'
movieID = 'tt0076759' 
endURL = '?api_key=6d5c5c1ba359501eb269dcd44731593b&external_source=imdb_id'
url = baseURL+movieID+endURL
//url = 'https://api.themoviedb.org/3/find/tt0780504?api_key=6d5c5c1ba359501eb269dcd44731593b&external_source=imdb_id'

titleIds = ['tt0780504', 'tt0076759', 'tt0088763', 'tt0105236']

newURL = 'https://api.themoviedb.org/3/movie/550?api_key=6d5c5c1ba359501eb269dcd44731593b&append_to_response=videos'

final = []

// Make the API request using fetch()
// loop through the title IDs and make fetch requests for each

titleIds.forEach(titleId => {
  url = `https://api.themoviedb.org/3/find/${titleId}?api_key=6d5c5c1ba359501eb269dcd44731593b&external_source=imdb_id`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      newID = data.movie_results[0].id;
      newurl = `https://api.themoviedb.org/3/movie/${newID}?api_key=6d5c5c1ba359501eb269dcd44731593b&append_to_response=videos`;
        
      fetch(newurl)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            
            const posterPath = data.poster_path;
      
            const posterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;
            const posterElement = document.createElement('img');
            posterElement.src = posterUrl;
      
            // add click event listener to the poster element
            posterElement.addEventListener('click', () => {
              const title = data.title;
              const overview = data.overview;
              const releaseDate = data.release_date;
              const language = data.original_language

              // create iframe element for YouTube video
              const videoId = data.videos.results[0].key;
              const videoUrl = `https://www.youtube.com/embed/${videoId}`;
              const videoElement = document.createElement('iframe');
              videoElement.src = videoUrl;
              //videoElement.width = 560;
              //videoElement.height = 315;
              videoElement.allowFullscreen = true;
      
              const popupElement = document.createElement('div');
              popupElement.className = 'popup';
              popupElement.innerHTML = `
                <h3>${title}</h3>
                <div class="video-container">
                  <iframe src="${videoUrl}" allowfullscreen></iframe>
                </div>
                <p>${overview}</p>
                <span class="close">&times;</span>
              `;

              // add click event listener to the close button
              const closeButton = popupElement.querySelector('.close');
              closeButton.addEventListener('click', () => {
                popupElement.remove();
              });
      
              // add the popup element to the document body
              document.body.appendChild(popupElement);
            });
      
            // add the poster element to the document body
            document.body.appendChild(posterElement);
          })
          .catch(error => console.error(error));
      


    })
    .catch(error => console.error(error));
});






