const genreDao = require('../daos/genreDao');

module.exports = {
			save: function(newGenre){
				return genreDao.save(newGenre);
			},
			update: function(genre){
				return genreDao.update(genre);
			}, 
			getAll:function(){
				return genreDao.getAll();
			},
			getById: function(genreId){
        		return genreDao.getById(genreId);
    		},
			delete:function(genreId){
				return genreDao.delete(genreId);
			}
}
