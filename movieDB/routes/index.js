const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const bodyParser = require("body-parser");
const searchMovies = require('../temp/fetch');
const getMovieWatchlist = require('../temp/getWatchlistIDs');
const getWatchlistStatus = require('../temp/getWatchlistStatus');
const getMovieRecommendationsJSON = require('../temp/movieJSON');
const addMovieToWatchlist = require('../temp/addToWatchlist');
const deleteMovieFromWatchlist = require('../temp/deleteFromWatchlist');


router.use(express.static('public'))


router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard


router.get('/index', ensureAuthenticated, (req, res) =>
  res.render('index')
);
router.get('/recommendations', ensureAuthenticated, (req, res) =>
  res.render('recommendations')
);
router.get('/data', async function (req, res) {

  tconst = (req.query.id);


  const { title, jsonArray } = await getMovieRecommendationsJSON(tconst);

  // const finalArray = await getFinalMovieArray(jsonArray)
  

  // res.json(jsonArray);
  res.json({ title, jsonArray: jsonArray });
});



router.post("/fetch", async function (req, res) {

  const query = req.body.query;
  const params = req.body.params;

  const output = await searchMovies(query, params);

  res.send(output);

});

router.post('/getWatchlistStatus', async function (req, res) {

  movieID = req.body.imdbID;

  user = req.user.email;

  // IMPLEMENT CHECK SO THAT IF movieID IS UNDEFINED YOU DONT CALL THE FUNCTION
  const watchListStatus = await getWatchlistStatus(user, movieID);

  res.send(watchListStatus);


});

router.post('/insertWatchlist', async function (req, res) {

  movieID = req.body.currentPopupId;

  user = req.user.email;

  // IMPLEMENT CHECK SO THAT IF movieID IS UNDEFINED YOU DONT CALL THE FUNCTION
  const watchlistResponse = await addMovieToWatchlist(user, movieID);

  res.send(watchlistResponse);
  // res.json(jsonArray);
  // res.json({ title, jsonArray: jsonArray });

});



router.get('/watchlist', ensureAuthenticated, (req, res) =>
  res.render('watchlist')
);


router.get('/displayWatchlist', async function (req, res) {

  userEmail = req.user.email;

  // Call the watchlist function to return all the titleIDs from the users watchlist
  const watchlistIDs = await getMovieWatchlist(userEmail);

  res.json({ watchlistIDs: watchlistIDs });
});

router.post('/removeFromWatchlist', async function (req, res) {

  movieID = req.body.imdbID
  userEmail = req.user.email;


  ;
  // IMPLEMENT CHECK SO THAT IF movieID IS UNDEFINED YOU DONT CALL THE FUNCTION
  const watchlistResponse = await deleteMovieFromWatchlist(userEmail, movieID);

  res.send(watchlistResponse);
  // res.json(jsonArray);
  // res.json({ title, jsonArray: jsonArray });

});


module.exports = router;
