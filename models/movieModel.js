var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MovieSchema = new Schema({
	id: { type: String },
 	name: { type: String},
  	synopsis: { type: String},
	img: { type: String},
	thumb_img: { type: String},
	premiere: { type: Boolean, default: false},
	premiereDate: {type: Date},
	genre: {type: Schema.Types.ObjectId, ref: 'Genre'},
	score: { type: Number },
	duration: { type: Number }, //min
	actors: [{ type: String}] 
}, { collection : 'Movies' });

var Movie = mongoose.model('Movie', MovieSchema);


module.exports = Movie;
