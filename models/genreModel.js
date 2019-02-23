var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema({
	id: { type: String, trim: true},
 	name: { type: String},
  	description: { type: String},
	img: { type: String},
	thumb_img: { type: String}
}, { collection : 'Genres' });

var Genre = mongoose.model('Genre', GenreSchema);


module.exports = Genre;
