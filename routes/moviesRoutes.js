const { check, param, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const
    multer = require('multer'),
    storage = multer.memoryStorage(),
    upload = multer({ storage: storage }),
    awsDao = require('../daos/awsDao'),
    imgDirectoryName = "movies_images",
    config = require('config'),
    wordings = require('../utils/wordings.json'),
    subscriptionController = require('../controllers/subscriptionController'),
    moviesController = require('../controllers/moviesController'),
    genreController = require('../controllers/genreController'),
    firebase = require("firebase-admin"),
    firebaseConfig = require("../config/firebaseConfig.json");

    firebase.initializeApp({
      credential: firebase.credential.cert(firebaseConfig),
      databaseURL: (process.env.DB_FIREBASE) ? process.env.DB_FIREBASE : config.get('dbFirebase')
    });


module.exports = function(apiRoutes){

    apiRoutes.post('/movies',[
        check('name').exists().withMessage(wordings.error.movie.nameRequired),
        check('synopsis').exists().withMessage(wordings.error.movie.synopsisRequired),
        check('genre').exists().withMessage(wordings.error.movie.genreRequired),
        check('duration').exists().withMessage(wordings.error.movie.durationRequired),
        check('premiere').optional(),
        check('premiereDate').optional(),
        check('actors').optional()
    ], function(req,res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.mapped() });
        }
        const newMovie = matchedData(req);
        var isAdmin = req.isAdmin;

        if(isAdmin){
            moviesController.save(newMovie).then(function(insertResult){
                genreController.getById(insertResult.genre).then(function(genre){
                    insertResult.genre = genre;
                    subscriptionController.getUserSubscriptedByGenre(insertResult.genre.id).then(function(result){
                        console.log("Get tokens result");
                        console.log(result);

                        var payload = {
                          notification: {
                            title: insertResult.name,
                            body: insertResult.synopsis
                          },
                          data:{
                            "movie": JSON.stringify(insertResult)
                          }
                        };

                        if(result.length > 0){
                            var genreTokens = result[0].tokens;
                            firebase.messaging().sendToDevice(genreTokens, payload).then(function(response) {
                              console.log('Successfully sent message:', response);
                            }).catch(function(error) {
                              console.log('Error sending message:', error);
                            });
                        }

                        res.status(201);
                        res.json(insertResult);
                    });
                });
            }).catch(function(errResult){
                res.status(500);
                res.json({message:wordings.error.movie.insert, error: err});
            });
        } else {
            res.status(403);
            res.json({message:wordings.error.auth.needAdminPermission});
        }
    });



     apiRoutes.put('/movies/:id',[
            param('id').exists().withMessage(wordings.error.movie.movieIdRequired),
            check('name').optional(),
            check('synopsis').optional(),
            check('genre').optional(),
            check('premiere').optional(),
            check('premiereDate').optional(),
            check('duration').optional(),
            check('actors').optional()
     ],function(req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.mapped() });
            }
            const movieUpdate = matchedData(req);
            var isAdmin = req.isAdmin;

            if(isAdmin){
                moviesController.update(movieUpdate).then(function(updateResult){
                  if(updateResult){
                     res.status(200);
                     res.json(updateResult);
                  }
                }).catch(function(err){
                    res.status(500);
                    res.json({ message: wordings.error.movie.update, error: err});
                });
            } else {
              res.status(403);
              res.json({message:wordings.error.auth.needAdminPermission});
            }
    });


    apiRoutes.put('/movies/:id/uploadImage', upload.single('image'), function (req, res, next) {
           var movieId = req.params.id;
           var movieImage = req.file;
           var isAdmin = req.isAdmin;

           if(isAdmin){
              if(movieImage){
                   var movieImageBuffer = movieImage.buffer;
                   awsDao.insertPic(imgDirectoryName, movieId, movieImageBuffer, function(result){
                       var movieToUpdate = {id: movieId};
                       movieToUpdate.img = result.image;
                       movieToUpdate.thumb_img = result.thumb;
                       moviesController.update(movieToUpdate).then(function(movieUpdate){
                           if(movieUpdate){
                            res.status(200);
                            res.json({ img: result.image, thumb_img: result.thumb });
                          }
                      }).catch(function(err){
                         res.status(500);
                         res.json({ message: wordings.error.movie.updateImage, error: err});
                      });
                   });
               }else{
                 res.status(400);
                 res.json({ message: wordings.error.movie.requireImage});
               }
           } else {
            res.status(403);
            res.json({message:wordings.error.auth.needAdminPermission});
           }
     });



    apiRoutes.post('/movies/reviews',[
        check('id').exists().withMessage(wordings.error.movie.movieIdRequired),
        check('message').exists().withMessage(wordings.error.movie.reviewMessageRequired),
        check('score').exists().withMessage(wordings.error.movie.scoreIsRequired)
    ], function(req,res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.mapped() });
        }
        const request = matchedData(req);
        var userId = req.userId;
        var messageReview = request.message;
        var scoreReview = request.score;
        var movieId = request.id;

        var review = {user : userId, message: messageReview, score: scoreReview, movie: movieId};

        moviesController.updateMovieReview(review).then(function(reviewUpdateSuccess){
          console.log("Review update?");
          console.log(reviewUpdateSuccess);
          if(reviewUpdateSuccess == null){
              moviesController.saveMovieReview(review).then(function(reviewSaved){
                    moviesController.findReviewById(reviewSaved.id).then(function(reviewSavedPopulated){
                          moviesController.getMovieAverageScore(movieId).then(function(movieScore){
                              moviesController.update({id:movieId, score: movieScore[0].score }).then(function(updateMovieSuccess){
                                      console.log("Update movie score success");
                                      res.status(200);
                                      res.json(reviewSavedPopulated);
                              });
                           }).catch(function(err){
                              console.log(err);
                              res.status(500);
                              res.json("Failed to save review");
                           });
                    });
              });
          }else{
            res.status(200);
            res.json(reviewUpdateSuccess);
          }

        }).catch(function(err){
            console.log(err);
            res.status(500);
            res.json("Failed to save review");
        });
    });

}
