const apiUrl = 'http://student-record-management-api-ron-cada-projects.vercel.app/students';
let students = []; // Define the students variable to store the fetched student data

document.addEventListener('DOMContentLoaded', fetchAndDisplayStudents);

async function fetchAndDisplayStudents() {
    try {
        const response = await fetch(apiUrl);
        const data = await handleResponse(response);
        students = data.students; // Store the fetched student data in the students variable
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
        console.log('student found', id);
    } else {
        console.log('create student', id);
        await createStudent();
    }
    hideForm();
    fetchAndDisplayStudents();
}

async function createStudent() {
    const student = getStudentData();
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });
    await handleResponse(response);
}

async function updateStudent(id) {
    const student = getStudentData();
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });
    await handleResponse(response);

}

async function partialUpdateStudent(id) {
    const student = getStudentData();
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });
    await handleResponse(response);
    fetchAndDisplayStudents();
}

async function deleteStudent(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    await handleResponse(response);
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
        students.forEach((student, index) => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = student.name;
            row.insertCell(1).innerText = student.student_number;
            row.insertCell(2).innerText = student.program;
            const actionsCell = row.insertCell(3);
            actionsCell.innerHTML = `
                <button onclick="editStudent(${index + 1})">Edit</button>
                <button onclick="partialEditStudent(${index + 1})">Partial Edit</button>
                <button onclick="deleteStudent(${index + 1})">Delete</button>
            `;
        });
    } else {
        document.getElementById('response').innerText = 'No content';
    }
}

function editStudent(id) {
    console.log('edit student', id);
    showAddStudentForm();
    document.getElementById('studentId').value = id;
}

function partialEditStudent(id) {
    const student = students[id - 1];
    showAddStudentForm();
    document.getElementById('studentId').value = id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentNumber').value = student.student_number;
    document.getElementById('studentProgram').value = student.program;
}

async function handleResponse(response) {
    if (response.status === 204) {
        return null;
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}