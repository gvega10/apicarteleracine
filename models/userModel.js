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
	fcm_token:{type: String},
	admin: {type: Boolean, default: false},
	subscription:{
		genres: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
	},
	creation_date:{ type: Date, default: Date.now }
}, { collection : 'Users' });

var User = mongoose.model('User', UserSchema);


module.exports = User;
