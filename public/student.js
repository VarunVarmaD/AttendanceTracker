document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const studentId = params.get('id');

    const res = await fetch(`/api/students/${studentId}`);
    const student = await res.json();
    const attendance = student.attendance.map(entry => ({
        date: new Date(entry.date),
        present: entry.present
    }));

    document.getElementById('studentName').textContent = `📊 ${student.name}'s Attendance`;

    const monthPicker = document.getElementById('monthPicker');
    const today = new Date();
    monthPicker.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    const renderCalendar = (year, month) => {
        const calendarDiv = document.getElementById('calendar');
        calendarDiv.innerHTML = '';

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

        const grid = document.createElement('div');
        grid.className = 'grid';

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const d = document.createElement('div');
            d.className = 'day header';
            d.textContent = day;
            grid.appendChild(d);
        });

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'day';
            grid.appendChild(empty);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const cellDate = new Date(year, month, i);
            const match = attendance.find(a =>
                a.date.getFullYear() === cellDate.getFullYear() &&
                a.date.getMonth() === cellDate.getMonth() &&
                a.date.getDate() === cellDate.getDate()
            );

            const dayCell = document.createElement('div');
            dayCell.className = 'day';
            dayCell.textContent = i;

            if (match) {
                dayCell.classList.add(match.present ? 'present' : 'absent');
                dayCell.textContent += match.present ? ' ✅' : ' ❌';
            }

            grid.appendChild(dayCell);
        }

        calendarDiv.appendChild(grid);
    };

    const [year, month] = monthPicker.value.split('-').map(Number);
    renderCalendar(year, month - 1);

    monthPicker.addEventListener('change', () => {
        const [year, month] = monthPicker.value.split('-').map(Number);
        renderCalendar(year, month - 1);
    });
});
