const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    present: {
        type: Boolean,
        required: true,
    }
}, { _id: false }); // optional: prevents auto-adding _id to each entry

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    attendance: {
        type: [attendanceSchema],
        default: [],
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
