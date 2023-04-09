const express = require('express');
const searchMovies = require('./public/fetch');
const getMovieRecommendationsJSON = require('./public/movieJSON');
const addMovieToWatchlist = require('./public/addToWatchlist');
const getMovieWatchlist = require('./public/getWatchlistIDs');
const deleteMovieFromWatchlist = require('./public/deleteFromWatchlist');
const getWatchlistStatus = require('./public/getWatchlistStatus');


const http = require('http');
const querystring = require('querystring');
const url = require('url');




const bodyParser = require("body-parser");
const { RSA_NO_PADDING } = require('constants');

const app = express();

const port = 3000;


app.set('view engine', 'ejs');

app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
/*
app.route("/ajax")
.get(function(req,res){
    res.render('ajax', {quote: "Ajax is great"});
})
.post(function(req,res) {
    res.send({response: req.body.quote});
});
*/

app.route("/index")
    .get(function (req, res) {
        res.render('index');
    })

app.route("/fetch")
    .post(async function (req, res) {
        const data = req.body.query;

        const output = await searchMovies(req.body.query);

        res.send(output);

    });

app.route("/recommendations")
    .get(async function (req, res) {

        res.render('recommendations');

    })

app.get('/data', async function (req, res) {

    tconst = (req.query.id);


    const { title, jsonArray } = await getMovieRecommendationsJSON(tconst);

    // res.json(jsonArray);
    res.json({ title, jsonArray: jsonArray });

});

app.post('/insertWatchlist', async function (req, res) {

    movieID = req.body.currentPopupId;
    // IMPLEMENT CHECK SO THAT IF movieID IS UNDEFINED YOU DONT CALL THE FUNCTION
    const watchlistResponse = await addMovieToWatchlist('111', movieID);

    res.send(watchlistResponse);
    // res.json(jsonArray);
    // res.json({ title, jsonArray: jsonArray });

});

app.post('/removeFromWatchlist', async function (req, res) {

    movieID = req.body.imdbID
    ;
    // IMPLEMENT CHECK SO THAT IF movieID IS UNDEFINED YOU DONT CALL THE FUNCTION
    const watchlistResponse = await deleteMovieFromWatchlist('111', movieID);

    res.send(watchlistResponse);
    // res.json(jsonArray);
    // res.json({ title, jsonArray: jsonArray });

});

app.post('/getWatchlistStatus', async function (req, res) {

    movieID = req.body.imdbID

    console.log(movieID)
    ;
    // IMPLEMENT CHECK SO THAT IF movieID IS UNDEFINED YOU DONT CALL THE FUNCTION
    const watchListStatus = await getWatchlistStatus('111', movieID);

    console.log(watchListStatus);

    res.send(watchListStatus);
    // res.json(jsonArray);
    // res.json({ title, jsonArray: jsonArray });

});


app.route("/watchlist")
    .get(function (req, res) {
        res.render('watchlist');
    })

app.get('/displayWatchlist', async function (req, res) {
  
    userID = req.query.id;

    console.log(userID);

    
    // Call the watchlist function to return all the titleIDs from the users watchlist
    const watchlistIDs = await getMovieWatchlist(userID);

    console.log(watchlistIDs);

    res.json({ watchlistIDs: watchlistIDs });
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
