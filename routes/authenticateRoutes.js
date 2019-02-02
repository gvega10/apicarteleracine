const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const
    wordings = require('../utils/wordings.json'),
    config = require('config'),
    md5 = require('md5'),
    tokenModule = require('../jwt_module/tokenModule.js'),
    userController = require('../controllers/userController');


module.exports = function(apiRoutes){

  apiRoutes.post('/users', [
    check('email')
    .exists().withMessage(wordings.error.user.requiredEmail)
    .isEmail().withMessage(wordings.error.user.mustBeEmail)
    .trim(),
    check('password').exists().withMessage(wordings.error.user.requiredPassword),
    check('name').exists().withMessage(wordings.error.user.requiredName),
    check('admin').optional()
  ], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const newUser = matchedData(req);
    userController.getUserByEmail(newUser.email).then(function(user){
        if(user){
          res.status(400).json({ errors: {message: wordings.error.user.mailExist}});
        }else{
          newUser.password = md5(newUser.password);
          userController.save(newUser).then(function(insertResult){
                tokenModule.generateToken(insertResult).then(function(tokenResult){
                      insertResult.access_token = tokenResult;
                      insertResult.token_exp = Date.now() + ((60*60*24*100) * 180);
                      userController.update(insertResult).then(function(updateResult){
                            res.status(201);
                            updateResult.password = "";
                            res.json(updateResult);
                      }).catch(function(err){
                            res.status(500);
                            res.json({message: wordings.error.user.update, error: err});
                      });
                }).catch(function(err){
                    console.log(err);
                    res.status(500);
                    res.json({ message: 'Failed to create token' });
                });
          }).catch(function(err){
                res.status(500);
                res.json({message: wordings.error.user.insert, error: err});
          });
      }
    });
  });

  apiRoutes.post('/auth', [
    check('email')
    .exists().withMessage(wordings.error.user.requiredEmail)
    .isEmail().withMessage(wordings.error.user.mustBeEmail)
    .trim(),
    check('password').exists().withMessage(wordings.error.user.requiredPassword)
  ],function(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.mapped() });
      }
      const userAuth = matchedData(req);
      userAuth.password = md5(userAuth.password);
      userController.getUserByEmail(userAuth.email).then(function(user){
          if(user){
            if (user.password != userAuth.password) {
              res.status(401);
              res.json({message: wordings.error.auth.wrongPassword });
            }
            if(Date.now() >= user.token_exp){
                tokenModule.generateToken(user).then(function(token){
                      user.access_token = token;
                      user.token_exp = Date.now() + ((60*60*24*100) * 180);
                      userController.update(user).then(function(userUpdate){
                          res.status(200);
                          userUpdate.password = "";
                          res.json(userUpdate);
                     }).catch(function(err){
                         res.status(500);
                         res.json({message:wordings.error.user.updateToken, err});
                     });
                }).catch(function(err){
                     console.log(err);
                     res.status(500);
                     res.json({ message: 'Failed to create token' });
                });
            }else{
              res.status(200);
              res.json(user);
            }
          } else{
            res.status(404);
            res.json({message: wordings.error.auth.userNotExist });
          }
      });
  });
}
