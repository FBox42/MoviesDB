dbKey = process.env.DATABASE_PASSWORD

dbPassword = 'mongodb+srv://fbox:'+ encodeURIComponent(dbKey) + '@moviesdb.oqspgh2.mongodb.net/MovieDB?retryWrites=true&w=majority';

module.exports = {
    mongoURI: dbPassword
};
