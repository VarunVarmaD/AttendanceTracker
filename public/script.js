document.addEventListener('DOMContentLoaded', () => {
    const studentList = document.getElementById('studentList');
    const form = document.getElementById('addStudentForm');

    async function loadStudents() {
        const res = await fetch('/api/students');
        const students = await res.json();

        studentList.innerHTML = '';
        students.forEach(student => {
            const li = document.createElement('li');
            li.className = 'student-item';

            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            li.innerHTML = `
                <strong>${student.name}</strong>
                <div class="actions">
                    <input type="date" id="date-${student._id}" value="${today}" />
                    <button onclick="markAttendance('${student._id}', true)">✅ Present</button>
                    <button onclick="markAttendance('${student._id}', false)">❌ Absent</button>
                    <button onclick="window.location.href='student.html?id=${student._id}'">📅 View Calendar</button>
                    <button onclick="deleteStudent('${student._id}')">🗑️ Delete</button>
                </div>
            `;
            studentList.appendChild(li);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        if (!name) return;

        await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        form.reset();
        loadStudents();
    });

    window.markAttendance = async (id, present) => {
        const dateInput = document.getElementById(`date-${id}`);
        const selectedDate = dateInput?.value || new Date().toISOString().split('T')[0];

        await fetch(`/api/attendance/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ present, date: selectedDate })
        });

        loadStudents();
    };

    window.deleteStudent = async (id) => {
        const confirmDelete = confirm('Are you sure you want to delete this student?');
        if (!confirmDelete) return;

        await fetch(`/api/students/${id}`, {
            method: 'DELETE'
        });

        loadStudents();
    };

    loadStudents();
});
