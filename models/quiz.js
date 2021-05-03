const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const quizSchema = new mongoose.Schema({
    questions: {
        type: Array,
        required: true
    }
}, {timestamps: true});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;