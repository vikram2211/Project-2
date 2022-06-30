const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },

    email: {
        type: String,
        required: true,
        unique: true

    },
    mobile: {
        required: true,
        type: Number,
        unique: true

    },
    collegeId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "mycollege"

    },
    isDeleted: {
        type: Boolean,
        default: false

    }
}, { timestamps: true });

module.exports = mongoose.model('intern', internSchema)