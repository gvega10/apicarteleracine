const 
     mongoose   = require('mongoose'),
    MovieModel = require('../models/movieModel'),
    MoviewReviewModel = require('../models/movieReviewModel');

module.exports = {
    save: function(newMovie) {       
        var movie = new MovieModel(newMovie);
        movie.id = movie._id;
        return movie.save();
    },
    update: function(movie) {
        return MovieModel.findOneAndUpdateAsync({ 'id': movie.id }, { $set: movie }, { new: true });
    },
    getAll: function() {
        return MovieModel.find().populate("genre").execAsync();
    },
    delete: function(movieId){
        return MovieModel.findOneAndRemoveAsync({ 'id': movieId});
    },
    getMovieById: function(movieId){
        return MovieModel.findOneAsync({ 'id': movieId });
    },
    saveMovieReview: function(review){
        var moviewReview = new MoviewReviewModel(review);
        moviewReview.id = moviewReview._id;
        return moviewReview.save();
    },
    findReviewById:function(movieId){
        return MoviewReviewModel.findOne({ 'id': movieId }).populate("user").execAsync();
    },
    updateMovieReview:function(movieReview){
        return MoviewReviewModel.findOneAndUpdate({ 'movie': movieReview.movie,  'user': movieReview.user }, { $set: movieReview }, { new: true }).populate("user").execAsync();;
    },
    getAllReviewsByMovie: function(movieId){
        return MoviewReviewModel.find({ 'movie': movieId }).populate("user").execAsync();
    },
    getMovieAverageScore:function(movieId){
        var query = [
            { 
                "$match": { 
                    "movie": mongoose.Types.ObjectId(movieId)
                     } 
            },
            {
                "$group": {
                    "_id": null, 
                    "score": { "$avg": "$score" }
                }
            }   
        ];

        return MoviewReviewModel.aggregate(query).execAsync();
    }
}


