const { check, param, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const
    wordings = require('../utils/wordings.json'),
    genreController = require('../controllers/genreController'),
    subscriptionController = require('../controllers/subscriptionController');

module.exports = function(apiRoutes){

  
     apiRoutes.post('/subscription/genres/:genreId',[
            param('genreId').exists().withMessage(wordings.error.genre.genreIdRequired)
     ],function(req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.mapped() });
            }

            var genreId = req.params.genreId;
            var userId = req.userId;


            subscriptionController.findSubscriptionByUser(userId).then(function(userSubscription){
                  if(userSubscription != null){
                         var arrayContainsGenre = (userSubscription.genres.indexOf(genreId) > -1);

                         if(!arrayContainsGenre){
                                 userSubscription.genres.push(genreId);
                                 subscriptionController.update(userSubscription).then(function(subscriptionUpdates){
                                      res.status(200);
                                      res.json(subscriptionUpdates);
                                 });
                         }else{
                                 res.status(200);
                                 res.json(userSubscription);
                         }
                      
                  }else{
                        var newSubscription = {user:userId, genres:[genreId]};
                        subscriptionController.save(newSubscription).then(function(subscriptionResult){
                              res.status(200);
                              res.json(subscriptionResult);
                        });  
                  }
            });
    });

     
    apiRoutes.delete('/subscription/genres/:genreId',[
        param('genreId').exists().withMessage(wordings.error.genre.genreIdRequired)
    ],function(req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.mapped() });
            }

            var genreId = req.params.genreId;
            var userId = req.userId;


            subscriptionController.findSubscriptionByUser(userId).then(function(userSubscription){
                  if(userSubscription != null){
                         var genrePosition = userSubscription.genres.indexOf(genreId);
                         var arrayContainsGenre = (genrePosition > -1);

                         if(arrayContainsGenre){
                              userSubscription.genres.splice(genrePosition, 1);
                              subscriptionController.update(userSubscription).then(function(subscriptionUpdates){
                                  res.status(200);
                                  res.json(subscriptionUpdates);
                              });
                         }else{
                              res.status(200);
                              res.json(userSubscription);
                         }
                      
                  }else{
                    res.status(200);
                    res.json(userSubscription); 
                  }
           });
    });


    apiRoutes.get('/subscription/user', function(req, res) {
           var userId = req.userId;
           genreController.getAll().then(function(genres){
               subscriptionController.findSubscriptionByUser(userId).then(function(userSubscription){
                      if(userSubscription != null && userSubscription.genres.length > 0){
                            genres.forEach(function(genre, index, arr){
                                   var subscripciones = userSubscription.genres;
                                   var genreExist = false;
                                   subscripciones.forEach(function(genreSubscription){
                                       if( genre.id == genreSubscription){
                                           genreExist = true;
                                       }
                                   });
                                   genre.notification = genreExist;
                            });
                      }
                      
                      res.status(200);
                      res.json({genres:genres}); 
               });
           });
    });




    apiRoutes.get('/subscription/user/:genreId', function(req, res) {
           var genreId = req.params.genreId;
          
           subscriptionController.getUserSubscriptedByGenre(genreId).then(function(tokens){
               res.status(200);
               res.json(tokens); 
           });

    });










}
