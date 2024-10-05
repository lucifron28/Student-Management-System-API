const apiUrl = 'https://student-record-management-api-ron-cada-projects.vercel.app/students';
let students = [];

document.addEventListener('DOMContentLoaded', fetchAndDisplayStudents);

async function fetchAndDisplayStudents() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        students = data;
        displayStudents(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        document.getElementById('response').innerText = 'Error fetching students';
    }
}

function showAddStudentForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
}

function hideForm() {
    document.getElementById('formContainer').style.display = 'none';
}

async function submitStudentForm() {
    const id = document.getElementById('studentId').value;
    if (id) {
        await updateStudent(id);
    } else {
        await createStudent();
    }
    hideForm();
    fetchAndDisplayStudents();
}

async function createStudent() {
    const student = getStudentData();
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });
        if (!response.ok) {
            throw new Error('Error creating student');
        }
    } catch (error) {
        console.error('Error creating student:', error);
    }
}

async function updateStudent(id) {
    const student = getStudentData();
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });
        if (!response.ok) {
            throw new Error('Error updating student');
        }
    } catch (error) {
        console.error('Error updating student:', error);
    }
    fetchAndDisplayStudents();
}

async function partialUpdateStudent(id) {
    const student = getStudentData();
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });
        if (!response.ok) {
            throw new Error('Error partially updating student');
        }
    } catch (error) {
        console.error('Error partially updating student:', error);
    }
    fetchAndDisplayStudents();
}

async function deleteStudent(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error deleting student');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
    }
    fetchAndDisplayStudents();
}

function getStudentData() {
    return {
        name: document.getElementById('studentName').value,
        student_number: document.getElementById('studentNumber').value,
        program: document.getElementById('studentProgram').value
    };
}

function displayStudents(students) {
    const tableBody = document.getElementById('studentsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table rows

    if (students && Array.isArray(students)) {
        students.forEach((student) => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = student.name;
            row.insertCell(1).innerText = student.student_number;
            row.insertCell(2).innerText = student.program;
            const actionsCell = row.insertCell(3);
            actionsCell.innerHTML = `
                <button onclick="editStudent(${student.id})">Edit</button>
                <button onclick="partialEditStudent(${student.id})">Partial Edit</button>
                <button onclick="deleteStudent(${student.id})">Delete</button>
            `;
        });
    } else {
        document.getElementById('response').innerText = 'No content';
    }
}

function editStudent(id) {
    const student = students.find(student => student.id === id);
    if (student) {
        showAddStudentForm();
        document.getElementById('studentId').value = id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentNumber').value = student.student_number;
        document.getElementById('studentProgram').value = student.program;
    } else {
        console.error('Student not found:', id);
    }
}

function partialEditStudent(id) {
    const student = students.find(student => student.id === id);
    if (student) {
        showAddStudentForm();
        document.getElementById('studentId').value = id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentNumber').value = student.student_number;
        document.getElementById('studentProgram').value = student.program;
    } else {
        console.error('Student not found:', id);
    }
}

async function handleResponse(response) {
    if (response.status === 204) {
        return null;
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}