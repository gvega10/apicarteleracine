var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MovieReviewSchema = new Schema({
	id: { type: String },
 	message: { type: String},
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	movie: {type: Schema.Types.ObjectId, ref: 'Movie'},
	score: { type: Number },
	date:{ type: Date, default: Date.now }
}, { collection : 'MoviesReviews' });

var MovieReview = mongoose.model('MovieReviewSchema', MovieReviewSchema);


module.exports = MovieReview;