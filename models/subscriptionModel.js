var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
	id: { type: String },
	genres: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	user_fcm_token: { type: String }
}, { collection : 'Subscriptions' });

var Subscription = mongoose.model('SubscriptionSchema', SubscriptionSchema);


module.exports = Subscription;