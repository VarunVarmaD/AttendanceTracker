const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Student = require('./models/Student');
const app = express();

// 🔗 MongoDB Atlas connection (direct, no .env)
mongoose.connect('mongodb+srv://VarunVarma:varundantuluri@cluster0.oj3oz4a.mongodb.net/attendance?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 🔧 Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Add student
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add student.' });
    }
});

// ✅ Mark attendance with optional custom date
app.post('/api/attendance/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found.' });

        const date = req.body.date ? new Date(req.body.date) : new Date();

        // Optional: prevent duplicate entries for same date
        const alreadyMarked = student.attendance.find(entry =>
            new Date(entry.date).toDateString() === date.toDateString()
        );

        if (alreadyMarked) {
            // Overwrite status for that day
            alreadyMarked.present = req.body.present;
        } else {
            // Add new entry
            student.attendance.push({ date, present: req.body.present });
        }

        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark attendance.' });
    }
});

// ✅ Get all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch students.' });
    }
});

// ✅ Get a specific student by ID (for calendar view)
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found.' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get student.' });
    }
});

// ✅ Delete a student by ID
app.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found.' });
        res.json({ message: 'Student deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete student.' });
    }
});

// 🟢 Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
