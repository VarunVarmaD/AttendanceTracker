document.addEventListener('DOMContentLoaded', () => {
    const studentList = document.getElementById('studentList');
    const form = document.getElementById('addStudentForm');

    async function loadStudents() {
        const res = await fetch('/api/students');
        const students = await res.json();

        studentList.innerHTML = '';
        students.forEach(student => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${student.name}
                <button onclick="markAttendance('${student._id}', true)">Present</button>
                <button onclick="markAttendance('${student._id}', false)">Absent</button>
            `;
            studentList.appendChild(li);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        form.reset();
        loadStudents();
    });

    window.markAttendance = async (id, present) => {
        await fetch(`/api/attendance/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ present })
        });
        alert(`Attendance marked as ${present ? 'Present' : 'Absent'}`);
    };

    loadStudents();
});
