let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        validate:{
            validator: function (level) {
                return level === "EXPERT" || level === "BEGINNER";
            }
        },
        //uppercase: true,
        required: true
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: String
    }
});
module.exports = mongoose.model('Developers', developerSchema);