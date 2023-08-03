const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    name: {type:String,required:true},
    content: String,
    tag: {type:String,default: "general"},
    date: {type:date,default: Date.now},
});

module.exports = mongoose.model('notes',NoteSchema);

