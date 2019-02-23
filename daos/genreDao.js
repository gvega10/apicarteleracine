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
        return GenreModel.find().lean().execAsync();
    },
    getById: function(genreId){
        return GenreModel.findOneAsync({ 'id': genreId });
    },
    delete: function(genreId){
          return GenreModel.findOneAndRemoveAsync({ 'id': genreId});
    }
}


