const
    bluebirdPromise = require('bluebird'),
    config = require('config'),
    jwt = require('jsonwebtoken'),
    jwtSignAsync = bluebirdPromise.promisify(jwt.sign, jwt);


const JWT_SECRET = (process.env.JWT_SECRET) ?
  process.env.JWT_SECRET :
  config.get('jwtSecret');

const JWT_EXP = (process.env.JWT_EXP) ?
  process.env.JWT_EXP :
  config.get('jwtExp');

module.exports = {
        congif: function(){
         return function(req, res, next) {
              var token = req.body.accessToken || req.query.accessToken || req.headers['accesstoken'];

              if (token) {
                jwt.verify(token, JWT_SECRET, function(err, decoded) {
                  if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                  } else {
                    req.userId = decoded.data.id;
                    req.isAdmin = decoded.data.isAdmin;
                    next();
                  }
                });
              } else {
                return res.status(403).send({
                    success: false,
                    message: 'No token provided.'
                });
              }
            };
        }, 
        generateToken: function(userPayload){
            var payload = {id: userPayload.id, isAdmin: userPayload.admin};
            return jwtSignAsync({data: payload}, JWT_SECRET, { expiresIn: JWT_EXP});
        }
}



  