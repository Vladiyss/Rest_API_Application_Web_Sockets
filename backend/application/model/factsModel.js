const mongoose = require('mongoose');

let factSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    }],
    image: {
        type: String,
        //required: false,
        default: ''
    }
}, {versionKey: false});

module.exports = mongoose.model('Fact', factSchema);
