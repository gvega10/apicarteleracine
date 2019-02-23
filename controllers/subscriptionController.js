const subscriptionDao = require('../daos/subscriptionDao');

module.exports = {
			save: function(newSubscription){
				return subscriptionDao.save(newSubscription);
			},
			update: function(subscription){
				return subscriptionDao.update(subscription);
			}, 
			findSubscriptionByUser:function(userId){
				return subscriptionDao.findSubscriptionByUser(userId);
			},
			getUserSubscriptedByGenre:function(genreId){
				return subscriptionDao.getUserSubscriptedByGenre(genreId);
			}
}
