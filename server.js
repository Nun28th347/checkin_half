import pkg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';


const { Pool } = pkg;

const app = express();
app.use(bodyParser.json());




// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'check_in_four',
  password: 'n',
  port: 5432,
});






/* **************************** */

// Path management for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});





// Serve add-student.html for '/add-student' route
// Endpoint to add a new student (POST /add-student)
app.post('/add-student', async (req, res) => {
  const { id, prefix_name, first_name, last_name, date_of_birth, sex, curriculum_id, previous_school, address, telephone, email, line_id, status, section_id } = req.body;

  try {
    
    await pool.query(
      `INSERT INTO student (id, prefix_name, first_name, last_name, date_of_birth, sex, curriculum_id, previous_school, address, telephone, email, line_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [id, prefix_name, first_name, last_name, date_of_birth, sex, curriculum_id, previous_school, address, telephone, email, line_id, status]
    );

    res.status(200).send('Student added successfully');
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send('Failed to add student');
  }
});




// Endpoint to get all sections
app.get('/api/sections', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, section FROM section');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to handle check-in
app.post('/api/checkin', async (req, res) => {
  console.log('Received check-in data:', req.body);
  const { student_id, section_id } = req.body;

  // Convert student_id and section_id to INTEGER
  const parsedStudentId = parseInt(student_id);
  const parsedSectionId = parseInt(section_id);

  // Validate that both IDs are numbers
  if (isNaN(parsedStudentId) || isNaN(parsedSectionId)) {
    return res.status(400).send('Invalid student ID or section ID.');
  }

  try {
    const studentCheckQuery = `SELECT * FROM student WHERE id = $1;`;
    const studentCheckResult = await pool.query(studentCheckQuery, [parsedStudentId]);

    if (studentCheckResult.rows.length === 0) {
      console.error('Student ID does not exist:', parsedStudentId);
      return res.status(400).send('Student ID does not exist.');
    }

    const sectionCheckQuery = `SELECT * FROM section WHERE id = $1;`;
    const sectionCheckResult = await pool.query(sectionCheckQuery, [parsedSectionId]);

    if (sectionCheckResult.rows.length === 0) {
      console.error('Section ID does not exist:', parsedSectionId);
      return res.status(400).send('Section ID does not exist.');
    }

    const generatedId = parsedStudentId * 100 + parsedSectionId;

    const existingCheckIn = await pool.query(
      `SELECT * FROM student_list WHERE id = $1;`, 
      [generatedId]
    );

    if (existingCheckIn.rows.length > 0) {
      // Update existing check-in record
      await pool.query(
        `UPDATE student_list 
         SET active_date = NOW(), status = 'Checked In' 
         WHERE id = $1;`, 
        [generatedId]
      );
      return res.status(200).send('Check-in updated successfully');
    } else {
      // Insert new check-in record
      await pool.query(
        `INSERT INTO student_list (id, section_id, student_id, active_date, status) 
         VALUES ($1, $2, $3, NOW(), $4);`,
        [generatedId, parsedSectionId, parsedStudentId, 'Checked In']
      );

      res.status(200).send('Check-in successful');
    }
  } catch (error) {
    console.error('Failed to check in student:', error);
    res.status(500).send('Failed to check in student');
  }
});

// Endpoint to get all check-in history
app.get('/api/checkin-history', async (req, res) => {
  try {
    // ดึงข้อมูลทั้งหมดจากตาราง student_list
    const result = await pool.query(`
      SELECT sl.student_id, s.first_name, s.last_name, sl.active_date, sl.status
      FROM student_list sl
      JOIN student s ON sl.student_id = s.id
      ORDER BY sl.active_date DESC
    `);
    res.json(result.rows);  // ส่งข้อมูลที่ดึงมาในรูปแบบ JSON
  } catch (error) {
    console.error('Error fetching check-in history:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Start server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Fetch students from the database
/* app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, first_name, last_name FROM student');
        res.json(result.rows);  // ส่งข้อมูลนักเรียนในรูปแบบ JSON
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal Server Error');  // ส่งข้อความหากเกิดข้อผิดพลาด
    }
}); */

app.get('/api/students', async (req, res) => {
  try {
      const result = await pool.query('SELECT id, first_name, last_name FROM student');
      res.json(result.rows);  // ส่งข้อมูลนักเรียนในรูปแบบ JSON
  } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).send('Internal Server Error');  // ส่งข้อความหากเกิดข้อผิดพลาด
  }
});


// Check student name
app.post('/check-in/:studentId', async (req, res) => {
  const { studentId } = req.params;

  // Convert studentId to integer
  const parsedStudentId = parseInt(studentId);
  if (isNaN(parsedStudentId)) {
    return res.status(400).send('Invalid student ID.');
  }

  try {
    const updateCheckInQuery = `
        UPDATE student_list
        SET active_date = NOW()
        WHERE student_id = $1
    `;
    await pool.query(updateCheckInQuery, [parsedStudentId]); // Use parsedStudentId
    
    res.status(200).send('Student checked in successfully');
  } catch (error) {
    console.error('Failed to check in student', error);
    res.status(500).send('Failed to check in student');
  }
});



app.get('/api/checkin-history', async (req, res) => {
  const userId = req.session.user.id; // ดึง user ID จาก session ที่ล็อกอินอยู่

  try {
      const result = await pool.query('SELECT * FROM checkin WHERE student_id = $1', [userId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching check-in history:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
