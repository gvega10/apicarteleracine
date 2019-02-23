const 
    mongoose   = require('mongoose'),
    SubscriptionModel = require('../models/subscriptionModel');


module.exports = {
    save: function(newSubscription) {       
        var subscription = new SubscriptionModel(newSubscription);
        subscription.id = subscription._id;
        return subscription.save();
    },
    update: function(subscription) {
        return SubscriptionModel.findOneAndUpdateAsync({ 'user': subscription.user }, { $set: subscription }, { new: true });
    },
    findSubscriptionByUser:function(userId){
        return SubscriptionModel.findOneAsync({ 'user': userId });
    },
    getUserSubscriptedByGenre:function(genreId){
       // return SubscriptionModel.find( { 'genres': genreId }).execAsync();

        var query = [
            { "$match": { "genres": mongoose.Types.ObjectId(genreId) } },
            { "$group" : { _id : null, tokens: { $push: "$user_fcm_token" } } } 
        ];

        return SubscriptionModel.aggregate(query).execAsync();
    }
}


