var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	id: { type: String },
 	name: { type: String},
  	email: { type: String},
  	password: { type: String},
	img: { type: String},
	thumb_img: { type: String},
	access_token: { type: String},
	token_exp:{type: String},
	admin: {type: Boolean, default: false},
	creation_date:{ type: Date, default: Date.now }
}, { collection : 'Users' });

var User = mongoose.model('User', UserSchema);


module.exports = User;
