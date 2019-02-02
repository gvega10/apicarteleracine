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
			getAllReviewsByMovie: function(movieId){
				return movieDao.getAllReviewsByMovie(movieId);
			},
			getMovieAverageScore:function(movieId){
				return movieDao.getMovieAverageScore(movieId);
			}
}
