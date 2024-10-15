document.addEventListener('DOMContentLoaded', async () => {
    await loadCheckinHistory(); // เรียกฟังก์ชันเพื่อโหลดข้อมูลทั้งหมดเมื่อหน้าเพจโหลดเสร็จ

    /* serch */
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', filterHistoryByIdAndDate);  // เรียกฟังก์ชันค้นหาเมื่อคลิก
});



// checkin-history.js

async function fetchCheckinHistory() {
    try {
      // ขอข้อมูล check-in จากเซิร์ฟเวอร์
      const response = await fetch('/checkin-history');
      const data = await response.json();
  
      // ถ้าเป็น teacher จะแสดงข้อมูลทั้งหมด
      if (data.role === 'teacher') {
        renderCheckinHistory(data.history);  // แสดงข้อมูลทั้งหมด
      } 
      // ถ้าเป็น student จะแสดงเฉพาะข้อมูลของตัวเอง
      else if (data.role === 'student') {
        const studentHistory = data.history.filter(entry => entry.student_id === data.user_id);
        renderCheckinHistory(studentHistory);  // แสดงข้อมูลเฉพาะของตัวเอง
      }
    } catch (error) {
      console.error('Error fetching checkin history:', error);
    }
  }
  
  // ฟังก์ชันสำหรับแสดงข้อมูลในหน้า
  function renderCheckinHistory(history) {
    const historyContainer = document.getElementById('historyContainer');
    history.forEach(entry => {
      const div = document.createElement('div');
      div.textContent = `ID: ${entry.student_id}, Time: ${entry.checkin_time}`;
      historyContainer.appendChild(div);
    });
  }
  
  fetchCheckinHistory();  // เรียกฟังก์ชันเพื่อดึงข้อมูล check-in เมื่อโหลดหน้า
  






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






// ฟังก์ชันสำหรับการค้นหาตาม student ID
/* function filterHistoryById() {
  const searchInput = document.getElementById('search-input').value.trim(); // รับค่าจากช่อง input
  const table = document.getElementById('checkin-history-table').querySelector('tbody');
  const rows = table.querySelectorAll('tr'); // ดึงทุกแถวในตาราง

  rows.forEach(row => {
      const studentIdCell = row.querySelector('td').textContent; // อ่านค่า student ID จากเซลล์แรกในแถว
      if (studentIdCell.includes(searchInput)) {
          row.style.display = ''; // แสดงแถวที่ตรงกับการค้นหา
      } else {
          row.style.display = 'none'; // ซ่อนแถวที่ไม่ตรง
      }
  });
}  */



/* // ฟังก์ชันสำหรับการค้นหาตาม student ID และ Date
function filterHistoryByIdAndDate() {
  const searchInputId = document.getElementById('search-input').value.trim();  // รับค่า Student ID จากช่อง input
  const searchInputDate = document.getElementById('search-input-date').value; // รับค่า Date จากช่อง input

  const table = document.getElementById('checkin-history-table').querySelector('tbody');
  const rows = table.querySelectorAll('tr');  // ดึงทุกแถวในตาราง
  let hasMatchingRows = false;  // ตัวแปรเพื่อตรวจสอบว่ามีข้อมูลตรงหรือไม่

  rows.forEach(row => {
      const studentIdCell = row.querySelector('td').textContent;      // อ่านค่า student ID จากเซลล์แรกในแถว
      const dateCell = row.querySelectorAll('td')[1].textContent;     // อ่านค่า date จากเซลล์ที่สองในแถว

      const isIdMatch = searchInputId ? studentIdCell.includes(searchInputId) : true; // ตรวจสอบการค้นหา Student ID
      const isDateMatch = searchInputDate ? dateCell.startsWith(searchInputDate) : true; // ตรวจสอบการค้นหาวันที่

      if (isIdMatch && isDateMatch) {
          row.style.display = '';  // แสดงแถวที่ตรงกับการค้นหา
          hasMatchingRows = true;  // พบข้อมูลที่ตรง
      } else {
          row.style.display = 'none';  // ซ่อนแถวที่ไม่ตรง
      }
  });

  // ถ้าไม่มีแถวที่ตรงกับการค้นหา ให้แสดงข้อความว่า "ไม่ได้ข้อมูลในวันนั้นๆ"
  const messageContainer = document.getElementById('no-data-message');
  if (!hasMatchingRows) {
      messageContainer.textContent = 'ไม่ได้ข้อมูลในวันนั้นๆ';  // แสดงข้อความเมื่อไม่มีข้อมูลที่ตรง
      messageContainer.style.display = 'block';  // แสดงข้อความ
  } else {
      messageContainer.textContent = '';  // ซ่อนข้อความเมื่อมีข้อมูลตรง
      messageContainer.style.display = 'none';  // ซ่อนข้อความ
  }
} */




/*   function filterHistoryById() {
    const searchInput = document.getElementById('search-input').value.trim(); // รับค่าจากช่อง input
    const table = document.getElementById('checkin-history-table').querySelector('tbody');
    const rows = table.querySelectorAll('tr'); // ดึงทุกแถวในตาราง
  
    // แสดงแถวทั้งหมดทุกครั้งก่อนทำการค้นหาใหม่
    rows.forEach(row => {
      row.style.display = ''; // แสดงแถวทั้งหมดก่อนที่จะทำการค้นหาใหม่
    });
  
    // ทำการค้นหา
    rows.forEach(row => {
        const studentIdCell = row.querySelector('td').textContent; // อ่านค่า student ID จากเซลล์แรกในแถว
        if (!studentIdCell.includes(searchInput)) {
            row.style.display = 'none'; // ซ่อนแถวที่ไม่ตรง
        }
    });
  
    // ตรวจสอบว่ามีแถวที่แสดงอยู่หรือไม่ หากไม่มี ให้แสดงข้อความว่าไม่พบข้อมูล
    const visibleRows = Array.from(rows).filter(row => row.style.display === '');
    if (visibleRows.length === 0) {
        alert('No matching records found.');
    }
  } */


    function filterHistoryByIdAndDate() {
      const searchInputId = document.getElementById('search-input').value.trim();  // รับค่า Student ID จากช่อง input
      const searchInputDate = document.getElementById('search-input-date').value;  // รับค่า Date จากช่อง input
      
      const table = document.getElementById('checkin-history-table').querySelector('tbody');
      const rows = table.querySelectorAll('tr');  // ดึงทุกแถวในตาราง
      let hasMatchingRows = false;  // ตัวแปรเพื่อตรวจสอบว่ามีข้อมูลตรงหรือไม่
    
      rows.forEach(row => {
          const studentIdCell = row.querySelector('td').textContent;     // อ่านค่า Student ID จากเซลล์แรกในแถว
          const dateCell = row.querySelectorAll('td')[1].textContent;    // อ่านค่า Date จากเซลล์ที่สองในแถว
    
          // ตรวจสอบว่า Student ID และ Date ตรงกับค่าที่กรอกหรือไม่
          const isIdMatch = searchInputId ? studentIdCell.includes(searchInputId) : true; // ตรวจสอบ Student ID
          const isDateMatch = searchInputDate ? dateCell.startsWith(searchInputDate) : true; // ตรวจสอบ Date
    
          if (isIdMatch && isDateMatch) {
              row.style.display = '';  // แสดงแถวที่ตรงกับการค้นหา
              hasMatchingRows = true;  // พบข้อมูลที่ตรง
          } else {
              row.style.display = 'none';  // ซ่อนแถวที่ไม่ตรง
          }
      });
    
      // ถ้าไม่มีแถวที่ตรงกับการค้นหา ให้แสดงข้อความว่า "ไม่พบข้อมูล"
      const messageContainer = document.getElementById('no-data-message');
      if (!hasMatchingRows) {
          messageContainer.textContent = 'ไม่พบข้อมูลที่ตรงกับการค้นหา';  // แสดงข้อความเมื่อไม่มีข้อมูลที่ตรง
          messageContainer.style.display = 'block';  // แสดงข้อความ
      } else {
          messageContainer.textContent = '';  // ซ่อนข้อความเมื่อมีข้อมูลตรง
          messageContainer.style.display = 'none';  // ซ่อนข้อความ
      }
    }
    
  
