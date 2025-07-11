const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    present: Boolean
});

const studentSchema = new mongoose.Schema({
    name: String,
    attendance: [attendanceSchema]
});

module.exports = mongoose.model('Student', studentSchema);
