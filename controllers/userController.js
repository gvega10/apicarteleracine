const userDao = require('../daos/userDao');

module.exports = {
			save: function(newUser){
				return userDao.save(newUser);
			},
			update: function(user){
				return userDao.update(user);
			},
			getUserByEmail: function(email){
				return userDao.getUserByEmail(email);
			},
			getUserById: function(userId){
				return userDao.getUserById(userId);
			},
			getUserPasswordById: function(userId){
				return userDao.getUserPasswordById(userId);
			}
}
