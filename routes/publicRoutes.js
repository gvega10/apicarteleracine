const { check, param, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const
    wordings = require('../utils/wordings.json'),
    genreController = require('../controllers/genreController'),
    moviesController = require('../controllers/moviesController');

module.exports = function(apiRoutes){

     apiRoutes.get('/genres', function(req,res){
            genreController.getAll().then(function(result){
                res.status(200);
                res.json(result);
           });
    });


     apiRoutes.get('/movies', function(req,res){
            moviesController.getAll().then(function(result){
                res.status(200);
                res.json(result);
           });
    });

    apiRoutes.get('/movies/:id/reviews',[
        param('id').exists().withMessage(wordings.error.movie.movieIdRequired)
    ], function(req,res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.mapped() });
        }
        const request = matchedData(req);
        var movieId = request.id;

        moviesController.getAllReviewsByMovie(movieId).then(function(moviesReviews){
              res.status(200);
              res.json(moviesReviews);
        });
    });

    
}
