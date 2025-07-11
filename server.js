const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Student = require('./models/Student');
const app = express();

mongoose.connect('mongodb+srv://VarunVarma:varundantuluri@cluster0.oj3oz4a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add student
app.post('/api/students', async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
});

// Mark attendance
app.post('/api/attendance/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    student.attendance.push({ date: new Date(), present: req.body.present });
    await student.save();
    res.json(student);
});

// Get all students
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
