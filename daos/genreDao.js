var GenreModel = require('../models/genreModel');

module.exports = {
    save: function(genre) {       
        var genre = new GenreModel(genre);
        genre.id = genre._id;
        return genre.save();
    },
    update: function(genre) {
        return GenreModel.findOneAndUpdateAsync({ 'id': genre.id }, { $set: genre }, { new: true });
    },
    getAll: function() {
        return GenreModel.findAsync();
    },
    delete: function(genreId){
          return GenreModel.findOneAndRemoveAsync({ 'id': genreId});
    }
}


