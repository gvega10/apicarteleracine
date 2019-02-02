const { check, param, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const
    multer = require('multer'),
    storage = multer.memoryStorage(),
    upload = multer({ storage: storage }),
    awsDao = require('../daos/awsDao'),
    imgDirectoryName = "genre_image",
    wordings = require('../utils/wordings.json'),
    genreController = require('../controllers/genreController');

module.exports = function(apiRoutes){

    apiRoutes.post('/genres',[
        check('name').exists().withMessage(wordings.error.genre.nameRequired),
        check('description').exists().withMessage(wordings.error.genre.descriptionRequired)
    ], function(req,res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.mapped() });
        }
        const newGenre = matchedData(req);

        var isAdmin = req.isAdmin;

        if(isAdmin){
            genreController.save(newGenre).then(function(insertResult){
                res.status(201);
                res.json(insertResult);
           }).catch(function(errResult){
                res.status(500);
                res.json({message:wordings.error.genre.insert, error: err});
           });
        } else {
            res.status(403);
            res.json({message:wordings.error.auth.needAdminPermission});
        }
    });



     apiRoutes.put('/genres/:id',[
            param('id').exists().withMessage(wordings.error.genre.genreIdRequired),
            check('name').optional(),
            check('description').optional()
     ],function(req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.mapped() });
            }
            const genreUpdate = matchedData(req);

            var isAdmin = req.isAdmin;

            if(isAdmin){
                genreController.update(genreUpdate).then(function(updateResult){
                    if(updateResult){
                      res.status(200);
                      res.json(updateResult);
                    }
                }).catch(function(err){
                    res.status(500);
                    res.json({ message: wordings.error.genre.update, error: err});
                });
            } else {
                res.status(403);
                res.json({message:wordings.error.auth.needAdminPermission});
            }
    });


    apiRoutes.put('/genres/:id/uploadImage', upload.single('image'), function (req, res, next) {
       var genreId = req.params.id;
       var genreImage = req.file;
       var isAdmin = req.isAdmin;
       if(isAdmin){
          if(genreImage){
             var genreImageBuffer = genreImage.buffer;
               awsDao.insertPic(imgDirectoryName, genreId, genreImageBuffer, function(result){
                   var genreToUpdate = {id: genreId};
                   genreToUpdate.img = result.image;
                   genreToUpdate.thumb_img = result.thumb;
                   genreController.update(genreToUpdate).then(function(genreUpdate){
                       if(genreUpdate){
                        res.status(200);
                        res.json({ img: result.image, thumb_img: result.thumb });
                      }
                  }).catch(function(err){
                     res.status(500);
                     res.json({ message: wordings.error.genre.updateImage, error: err});
                  });
               });
           }else{
             res.status(400);
             res.json({ message: wordings.error.genre.requireImage});
           }
       } else {
         res.status(403);
         res.json({message:wordings.error.auth.needAdminPermission});
       }
     });


    

}
