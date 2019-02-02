const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const
    md5 = require('md5'),
    multer = require('multer'),
    storage = multer.memoryStorage(),
    upload = multer({ storage: storage }),
    awsDao = require('../daos/awsDao'),
    wordings = require('../utils/wordings.json'),
    userController = require('../controllers/userController'),
    imgDirectoryName = "user_profile_image";

module.exports = function(apiRoutes){

    apiRoutes.get('/users/me',function(req,res){
      var userId = req.userId;
      userController.getUserById(userId).then(function(result){
           if(result){
                 res.status(200);
                 res.json(result);
           }else{
                res.status(400);
                res.json({message:wordings.error.user.notFound});
           }
      }).catch(function(err) {
          console.log(wordings.error.user.informationService, err);
      });
    });


    apiRoutes.put('/users/me/password',[
       check('password').exists().withMessage(wordings.error.user.requiredPassword),
     ], function(req,res){
       const errors = validationResult(req);1
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.mapped() });
       }
       var newPassword = md5(req.body.password);
       var userId = req.userId;
       userController.getUserPasswordById(userId).then(function(result){
            result.password = newPassword;
            userController.update(result).then(function(updateResult){
                if(updateResult){
                  res.status(200);
                  res.send({message:wordings.success.user.update});
                }
            }).catch(function(err){
                res.status(500);
                res.json({ message: wordings.error.user.update, error: err});
            });
       });
     });


     apiRoutes.put('/users/me/uploadImage', upload.single('image'), function (req, res, next) {
       var token = req.token;
       var imageProfile = req.file;
       if(imageProfile){
         var imageProfileBuffer = imageProfile.buffer;
           var userId = req.userId;
           awsDao.insertPic(imgDirectoryName, userId, imageProfileBuffer, function(result){
               var userToUpdate = {id: userId};
               userToUpdate.img = result.image;
               userToUpdate.thumb_img = result.thumb;
               userController.update(userToUpdate).then(function(userUpdate){
                   if(userUpdate){
                    res.status(200);
                    res.json({ img: result.image, thumb_img: result.thumb });
                  }
              }).catch(function(err){
                 res.status(500);
                 res.json({ message: wordings.error.user.updateImage, error: err});
              });
           });
       }else{
         res.status(400);
         res.json({ message: wordings.error.user.requireImage});
       }
     });
}
