document.addEventListener('DOMContentLoaded', async () => {
    await loadCheckinHistory(); // เรียกฟังก์ชันเพื่อโหลดข้อมูลทั้งหมดเมื่อหน้าเพจโหลดเสร็จ
});

async function loadCheckinHistory() {
    try {
        const response = await fetch(`/api/checkin-history`);  // ดึงข้อมูลจาก API ที่เราแก้ไข
        if (!response.ok) {
            throw new Error('Failed to load check-in history');
        }
        const checkinHistory = await response.json();  // รับข้อมูลในรูปแบบ JSON
        const tableBody = document.getElementById('checkin-history-table').querySelector('tbody');
        
        checkinHistory.forEach(record => {
            const row = document.createElement('tr');
            
            // แสดง Student ID
            const studentIdCell = document.createElement('td');
            studentIdCell.textContent = record.student_id;
            row.appendChild(studentIdCell);
            
            // แสดง Date ในรูปแบบ YYYY-MM-DD HH:mm:ss
            const dateCell = document.createElement('td');
            dateCell.textContent = formatDate(record.active_date); // เรียกใช้ฟังก์ชันเพื่อจัดรูปแบบวันที่
            row.appendChild(dateCell);
            
            // แสดง Status
            const statusCell = document.createElement('td');
            statusCell.textContent = record.status;
            row.appendChild(statusCell);
            
            tableBody.appendChild(row);  // เพิ่มแถวเข้าไปในตาราง
        });
    } catch (error) {
        console.error('Error loading check-in history:', error);
    }
}

// ฟังก์ชันแปลงวันที่ให้อยู่ในรูปแบบ "YYYY-MM-DD HH:mm:ss"
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 จึงบวก 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// checkin-history.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/checkin-history');
        const data = await response.json();

        // แสดงข้อมูลเช็คอินในตารางหรือวิธีอื่นๆ
    } catch (error) {
        console.error('Error fetching check-in data:', error);
    }
});
