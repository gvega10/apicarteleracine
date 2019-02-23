const movieDao = require('../daos/moviesDao');

module.exports = {
			save: function(newMovie){
				return movieDao.save(newMovie);
			},
			update: function(movie){
				return movieDao.update(movie);
			}, 
			getAll:function(){
				return movieDao.getAll();
			},
			delete:function(movieId){
				return movieDao.delete(movieId);
			},
			saveMovieReview: function(movieReview){
				return movieDao.saveMovieReview(movieReview);
			},
			findReviewById:function(movieId){
				return movieDao.findReviewById(movieId);
			},
			getAllReviewsByMovie: function(movieId){
				return movieDao.getAllReviewsByMovie(movieId);
			},
			getMovieAverageScore:function(movieId){
				return movieDao.getMovieAverageScore(movieId);
			},
			updateMovieReview:function(moviewReview){
				return movieDao.updateMovieReview(moviewReview);
			}
}
