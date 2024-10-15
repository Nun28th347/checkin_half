document.addEventListener('DOMContentLoaded', async () => {
    await loadStudents();
    await loadSections();
});

async function loadStudents() {
    const studentDatalist = document.getElementById('students'); // ใช้ datalist แทน
    studentDatalist.innerHTML = ''; // ล้างรายการเก่าออก
    try {
        const response = await fetch('/api/students');
        if (!response.ok) {
            throw new Error('Failed to load students');
        }
        const students = await response.json();
        
        // Loop เพิ่ม options เข้าไปใน datalist
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = `${student.id} - ${student.first_name} ${student.last_name}`;
            studentDatalist.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading students:', error);
        document.getElementById('message').textContent = 'Failed to load students';
    }
}


async function loadSections() {
    const sectionSelect = document.getElementById('section-id');
    sectionSelect.innerHTML = ''; // Clear existing options
    try {
        const response = await fetch('/api/sections');
        if (!response.ok) {
            throw new Error('Failed to load sections');
        }
        const sections = await response.json();
        sections.forEach(section => {
            const option = document.createElement('option');
            option.value = section.id;
            option.textContent = section.section;
            sectionSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading sections:', error);
        document.getElementById('message').textContent = 'Failed to load sections';
    }
}

document.getElementById('checkin-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Check if both student and section are selected
    const studentId = document.getElementById('student-id').value;
    const sectionId = document.getElementById('section-id').value;

    if (!studentId || !sectionId) {
        document.getElementById('message').textContent = 'Please select both student and section';
        return;
    }

    const formData = {
        student_id: studentId,
        section_id: sectionId,
    };

    console.log(formData); // Log form data for debugging

    try {
        const response = await fetch('/api/checkin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            document.getElementById('message').textContent = 'Check-in successful';
        } else {
            const errorText = await response.text();
            document.getElementById('message').textContent = `Failed to check in: ${errorText}`;
        }
    } catch (error) {
        console.error('Error during check-in:', error);
        document.getElementById('message').textContent = 'Error during check-in';
    }
});