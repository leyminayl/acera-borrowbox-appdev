const API_BASE_URL = "http://127.0.0.1:8000/api";

async function loadStudents() {
    const message = document.getElementById("students-message");
    const table = document.getElementById("students-table");
    const body = document.getElementById("students-body");

    try {
        const response = await fetch(`${API_BASE_URL}/students/`);
        const students = await response.json();

        body.innerHTML = "";

        if (!students.length) {
            message.textContent = "No student records found.";
            table.classList.add("hidden");
            return;
        }

         students.forEach(student => {
            body.innerHTML += ` 
                <tr> 
                    <td>${student.id}</td> 
                    <td>${student.student_number}</td> 
                    <td>${student.last_name}</td> 
                    <td>${student.first_name}</td> 
                    <td>${student.college}</td> 
                    <td>${student.department}</td> 
                    <td>${student.course}</td> 
                    <td>${student.gender}</td> 
                    <td>${student.role_name}</td> 
                    <td>${student.status_name}</td> 
                </tr> 
            `;
        });

        message.textContent = "";
        table.classList.remove("hidden");

    } catch (error) {
        message.textContent = "Failed to load students.";
        table.classList.add("hidden");
        console.error("Students error:", error);
    }
}

async function loadEmployees() {
    const message = document.getElementById("employees-message");
    const table = document.getElementById("employees-table");
    const body = document.getElementById("employees-body");

    try {
        const response = await fetch(`${API_BASE_URL}/employees/`);
        const employees = await response.json();

        body.innerHTML = "";

        if (!employees.length) {
            message.textContent = "No employee records found.";
            table.classList.add("hidden");
            return;
        }

        employees.forEach(employee => {
            body.innerHTML += ` 
                <tr> 
                    <td>${employee.id}</td> 
                    <td>${employee.employee_number}</td> 
                    <td>${employee.last_name}</td> 
 <td>${employee.first_name}</td> 
                    <td>${employee.department}</td> 
                    <td>${employee.position}</td> 
                    <td>${employee.email ?? ""}</td> 
                    <td>${employee.role_name}</td> 
                    <td>${employee.status_name}</td> 
                </tr> 
            `;
        });

        message.textContent = "";
        table.classList.remove("hidden");

    } catch (error) {
        message.textContent = "Failed to load employees.";
        table.classList.add("hidden");
        console.error("Employees error:", error);
    }
}

loadStudents();
loadEmployees();