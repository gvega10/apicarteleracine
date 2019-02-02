const
    config = require('config'),
    AWS = require('aws-sdk'),
    sharp = require('sharp');


AWS.config.loadFromPath('./config/awsConfig.json');
var s3 = new AWS.S3();
const AWS_BUCKET_NAME = (process.env.AWS_BUCKET_NAME) ? process.env.AWS_BUCKET_NAME : config.get('awsBucketName');
var s3Bucket = new AWS.S3( { params: {Bucket: AWS_BUCKET_NAME } } );


function insertImage(directoryName,imageName, imageFile, callback){
    var awsImageName= directoryName + "/" + imageName;
    var data = {
      ACL: 'public-read',
      Key: awsImageName,
      Body: imageFile
    };
    s3Bucket.putObject(data, function(err, data){
      if (err)
        { console.log('Error uploading data: ', err);
        } else {
          var urlParams = {Key: awsImageName};
          s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
            callback(url.split("?")[0]);
          })
        }
    });
};


module.exports  =  {
		insertPic: function(directoryName, imageName, imageFile, callback){
            insertImage(directoryName, imageName + ".png", imageFile, function(imageUrl){
              sharp(imageFile)
               .resize(350, 350)
               .max()
               .toBuffer(function(err, outputBuffer) {
                 if (err) {
                   throw err;
                 }
                  insertImage(directoryName, imageName + "_thumb.png", outputBuffer, function(thumbImageUrl){
                       callback({image: imageUrl, thumb: thumbImageUrl });
                  });
               });
            });
		}
};
