var User = require('../models/userModel');

module.exports = {
    save: function(newUser) {       
        var user = new User(newUser);
        user.id = user._id;
        return user.save();
    },
    getUserByEmail: function(email) {
        return User.findOneAsync({ 'email': email });
    },
    getUserById: function(userId) {
        return User.findOne({ 'id': userId }).select("-password").execAsync();
    },
    getUserPasswordById: function(userId) {
        return User.findOneAsync({ 'id': userId });
    },
    update: function(user) {
        return User.findOneAndUpdateAsync({ 'id': user.id }, { $set: user }, { new: true });
    },
    delete: function(user){
          return User.findOneAndRemoveAsync({ 'id': user.id});
    }
}




