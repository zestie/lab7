let mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);

let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    assign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developers'
    },
    due: DateOnly,
    status: String,
    desc: String 
});
module.exports = mongoose.model('Tasks',taskSchema);