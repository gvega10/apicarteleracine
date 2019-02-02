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
			delete:function(genreId){
				return genreDao.delete(genreId);
			}
}
