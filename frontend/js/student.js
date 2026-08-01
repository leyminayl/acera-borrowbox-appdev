const API_BASE_URL = "http://127.0.0.1:8000/api";
const PSGC_API_BASE_URL = "https://psgc.gitlab.io/api";

let allStudents = [];
let allColleges = [];
let allDepartments = [];
let allCourses = [];
let allRegions = [];

document.addEventListener("DOMContentLoaded", () => {
  const studentsTableBody = document.getElementById("studentsTableBody");
  const studentsSummary = document.getElementById("studentsSummary");
  const studentSearch = document.getElementById("studentSearch");
  const collegeFilter = document.getElementById("collegeFilter");
  const departmentFilter = document.getElementById("departmentFilter");
  const genderFilter = document.getElementById("genderFilter");
  const resetFilters = document.getElementById("resetFilters");

  const openAddStudentModal = document.getElementById("openAddStudentModal");
  const addStudentModal = document.getElementById("addStudentModal");
  const closeAddStudentModal = document.getElementById("closeAddStudentModal");
  const cancelAddStudent = document.getElementById("cancelAddStudent");
  const addStudentForm = document.getElementById("addStudentForm");
  const addStudentMessage = document.getElementById("addStudentMessage");
  const saveStudentButton = document.getElementById("saveStudentButton");

  const modalCollege = document.getElementById("modalCollege");
  const modalDepartment = document.getElementById("modalDepartment");
  const courseSelect = document.getElementById("course");

  const regionSelect = document.getElementById("region_code");
  const provinceSelect = document.getElementById("province_code");
  const citySelect = document.getElementById("city_municipality_code");
  const barangaySelect = document.getElementById("barangay_code");
  const provinceHint = document.getElementById("provinceHint");

  function getInitials(firstName = "", lastName = "") {
    const first = firstName.charAt(0).toUpperCase();
    const last = lastName.charAt(0).toUpperCase();
    return `${last}${first}`;
  }

  function getGenderBadge(gender) {
    if (gender === "Male") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
    if (gender === "Female") {
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
    }
    return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
  }

  function showFormMessage(message, type = "success") {
    addStudentMessage.className = "rounded-lg px-4 py-3 text-sm";
    addStudentMessage.classList.remove("hidden");

    if (type === "error") {
      addStudentMessage.classList.add("bg-red-100", "text-red-700", "border", "border-red-200");
    } else {
      addStudentMessage.classList.add("bg-emerald-100", "text-emerald-700", "border", "border-emerald-200");
    }

    addStudentMessage.textContent = message;
  }

  function clearFormMessage() {
    addStudentMessage.classList.add("hidden");
    addStudentMessage.textContent = "";
  }

  function openModal() {
    addStudentModal.classList.remove("hidden");
    addStudentModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    clearFormMessage();
  }

  function closeModal() {
    addStudentModal.classList.add("hidden");
    addStudentModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    addStudentForm.reset();
    clearFormMessage();
    resetAcademicDropdowns();
    resetPsgcDropdowns();
  }

  function populateFilters(students) {
    const colleges = [...new Set(students.map(student => student.college_name).filter(Boolean))].sort();
    const departments = [...new Set(students.map(student => student.department_name).filter(Boolean))].sort();

    collegeFilter.innerHTML = `<option value="">All Colleges</option>`;
    departmentFilter.innerHTML = `<option value="">All Departments</option>`;

    colleges.forEach(college => {
      collegeFilter.innerHTML += `<option value="${college}">${college}</option>`;
    });

    departments.forEach(department => {
      departmentFilter.innerHTML += `<option value="${department}">${department}</option>`;
    });
  }

  function populateModalColleges() {
    modalCollege.innerHTML = `<option value="">Select college</option>`;

    allColleges.forEach(college => {
      modalCollege.innerHTML += `<option value="${college.id}">${college.college_name}</option>`;
    });
  }

  function populateModalDepartments(collegeId) {
    modalDepartment.innerHTML = `<option value="">Select department</option>`;
    modalDepartment.disabled = true;

    courseSelect.innerHTML = `<option value="">Select department first</option>`;
    courseSelect.disabled = true;

    if (!collegeId) {
      modalDepartment.innerHTML = `<option value="">Select college first</option>`;
      return;
    }

    const filteredDepartments = allDepartments.filter(
      department => String(department.college) === String(collegeId)
    );

    filteredDepartments.forEach(department => {
      modalDepartment.innerHTML += `<option value="${department.id}">${department.department_name}</option>`;
    });

    modalDepartment.disabled = false;
  }

  function populateModalCourses(departmentId) {
    courseSelect.innerHTML = `<option value="">Select course</option>`;
    courseSelect.disabled = true;

    if (!departmentId) {
      courseSelect.innerHTML = `<option value="">Select department first</option>`;
      return;
    }

    const filteredCourses = allCourses.filter(
      course => String(course.department) === String(departmentId)
    );

    filteredCourses.forEach(course => {
      courseSelect.innerHTML += `<option value="${course.id}">${course.course_name}</option>`;
    });

    courseSelect.disabled = false;
  }

  function resetAcademicDropdowns() {
    modalCollege.value = "";
    modalDepartment.innerHTML = `<option value="">Select college first</option>`;
    modalDepartment.disabled = true;
    courseSelect.innerHTML = `<option value="">Select department first</option>`;
    courseSelect.disabled = true;
  }

  function resetPsgcDropdowns() {
    provinceSelect.innerHTML = `<option value="">Select region first</option>`;
    provinceSelect.disabled = true;

    citySelect.innerHTML = `<option value="">Select region or province first</option>`;
    citySelect.disabled = true;

    barangaySelect.innerHTML = `<option value="">Select city/municipality first</option>`;
    barangaySelect.disabled = true;

    provinceHint.classList.add("hidden");
  }

  function sortRegionsWithNcrFirst(regions) {
    const sorted = [...regions].sort((a, b) => a.name.localeCompare(b.name));
    const ncrIndex = sorted.findIndex(region => region.code === "130000000");

    if (ncrIndex > -1) {
      const [ncr] = sorted.splice(ncrIndex, 1);
      sorted.unshift(ncr);
    }

    return sorted;
  }

  function renderStudents(students) {
    if (!students.length) {
      studentsTableBody.innerHTML = ` 
        <tr> 
          <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500"> 
            No student records found. 
          </td> 
        </tr> 
      `;
      studentsSummary.innerHTML = `Showing <span class="font-semibold">0</span> students`;
      return;
    }

    studentsTableBody.innerHTML = students.map(student => {
      const photoHtml = student.photo
        ? `<img src="${student.photo}" alt="${student.first_name} ${student.last_name}" class="size-10 rounded-full bg-slate-100 object-cover" />`
        : `<div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">${getInitials(student.first_name, student.last_name)}</div>`;

      return ` 
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"> 
          <td class="px-6 py-4"> 
            <div class="flex items-center gap-3"> 
              ${photoHtml} 
              <div> 
                <p class="font-bold text-slate-900 dark:text-slate-100"> 
                  ${student.last_name}, ${student.first_name}${student.middle_initial ? ` ${student.middle_initial}.` : ""} 
                </p> 
                <p class="text-xs text-slate-500">ID: ${student.student_number}</p> 
              </div> 
            </div> 
          </td> 
 
          <td class="px-6 py-4"> 
            <div class="text-sm"> 
              <p class="font-semibold text-slate-700 dark:text-slate-200">${student.college_name ?? "-"}</p> 
              <p class="text-xs text-slate-500">${student.course_name ?? "-"}</p> 
              <p class="text-xs text-slate-400 mt-1">${student.department_name ?? "-"}</p> 
            </div> 
          </td> 
 
          <td class="px-6 py-4"> 
            <div class="text-sm"> 
              <p class="text-slate-700 dark:text-slate-200 flex items-center gap-1"> 
                <span class="material-symbols-outlined text-sm">phone</span> 
                ${student.phone ?? "-"} 
              </p> 
              <p class="text-xs text-slate-500">${student.email ?? "-"}</p> 
            </div> 
          </td> 
 
          <td class="px-6 py-4"> 
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenderBadge(student.gender)}"> 
              ${student.gender} 
            </span> 
          </td> 
 
          <td class="px-6 py-4 text-right"> 
            <div class="flex justify-end gap-2"> 
              <button class="p-2 text-slate-400 hover:text-primary transition-colors" title="View"> 
                <span class="material-symbols-outlined">visibility</span> 
              </button> 
              <button 
                onclick="editStudent('${student.id}', '${student.first_name}', '${student.last_name}')" 
                class="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Edit"> 
                <span class="material-symbols-outlined">edit</span> 
              </button> 
              <button 
                onclick="deleteStudent('${student.id}')" 
                class="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete"> 
                <span class="material-symbols-outlined">delete</span> 
              </button> 
            </div> 
          </td> 
        </tr> 
      `;
    }).join("");

    studentsSummary.innerHTML = `Showing <span class="font-semibold">${students.length}</span> student${students.length > 1 ? "s" : ""}`;
  }

  function applyFilters() {
    const searchValue = studentSearch.value.trim().toLowerCase();
    const selectedCollege = collegeFilter.value;
    const selectedDepartment = departmentFilter.value;
    const selectedGender = genderFilter.value;

    const filtered = allStudents.filter(student => {
      const fullName = `${student.last_name} ${student.first_name} ${student.middle_initial ?? ""}`.toLowerCase();
      const studentNumber = (student.student_number ?? "").toLowerCase();

      const matchesSearch =
        fullName.includes(searchValue) ||
        studentNumber.includes(searchValue);

      const matchesCollege = !selectedCollege || student.college_name === selectedCollege;
      const matchesDepartment = !selectedDepartment || student.department_name === selectedDepartment;
      const matchesGender = !selectedGender || student.gender === selectedGender;

      return matchesSearch && matchesCollege && matchesDepartment && matchesGender;
    });

    renderStudents(filtered);
  }

  async function loadStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/students/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.status}`);
      }

      allStudents = await response.json();
      populateFilters(allStudents);
      renderStudents(allStudents);
    } catch (error) {
      console.error("Students error:", error);
      studentsTableBody.innerHTML = ` 
        <tr> 
          <td colspan="5" class="px-6 py-10 text-center text-sm text-red-500"> 
            Failed to load students. 
          </td> 
        </tr> 
      `;
      studentsSummary.innerHTML = `Showing <span class="font-semibold">0</span> students`;
    }
  }

  // Ginawang pangkalahatan (global) para matawag mula sa table buttons
  window.loadStudents = loadStudents;

  async function loadAcademicData() {
    try {
      const [collegesResponse, departmentsResponse, coursesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/colleges/`),
        fetch(`${API_BASE_URL}/departments/`),
        fetch(`${API_BASE_URL}/courses/`)
      ]);

      if (!collegesResponse.ok || !departmentsResponse.ok || !coursesResponse.ok) {
        throw new Error("Failed to load academic dropdown data.");
      }

      allColleges = await collegesResponse.json();
      allDepartments = await departmentsResponse.json();
      allCourses = await coursesResponse.json();

      populateModalColleges();
    } catch (error) {
      console.error("Academic dropdown error:", error);
      modalCollege.innerHTML = `<option value="">Failed to load colleges</option>`;
      modalDepartment.innerHTML = `<option value="">Failed to load departments</option>`;
      courseSelect.innerHTML = `<option value="">Failed to load courses</option>`;
    }
  }

  async function loadRegions() {
    try {
      const response = await fetch(`${PSGC_API_BASE_URL}/regions/`);

      if (!response.ok) {
        throw new Error("Failed to load regions.");
      }

      allRegions = await response.json();
      const sortedRegions = sortRegionsWithNcrFirst(allRegions);

      regionSelect.innerHTML = `<option value="">Select region</option>`;

      sortedRegions.forEach(region => {
        regionSelect.innerHTML += `<option value="${region.code}">${region.name}</option>`;
      });
    } catch (error) {
      console.error("Regions error:", error);
      regionSelect.innerHTML = `<option value="">Failed to load regions</option>`;
    }
  }

  async function loadProvincesOrCitiesFromRegion(regionCode) {
    resetPsgcDropdowns();

    if (!regionCode) {
      return;
    }

    if (regionCode === "130000000") {
      provinceSelect.innerHTML = `<option value="">No province for NCR</option>`;
      provinceSelect.disabled = true;
      provinceHint.classList.remove("hidden");

      citySelect.innerHTML = `<option value="">Loading cities/municipalities...</option>`;
      citySelect.disabled = false;

      try {
        const response = await fetch(`${PSGC_API_BASE_URL}/regions/${regionCode}/cities-municipalities/`);

        if (!response.ok) {
          throw new Error("Failed to load NCR cities/municipalities.");
        }

        const cities = await response.json();

        citySelect.innerHTML = `<option value="">Select city/municipality</option>`;
        cities
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach(city => {
            citySelect.innerHTML += `<option value="${city.code}">${city.name}</option>`;
          });
      } catch (error) {
        console.error("NCR cities error:", error);
        citySelect.innerHTML = `<option value="">Failed to load cities/municipalities</option>`;
      }

      return;
    }

    provinceHint.classList.add("hidden");
    provinceSelect.disabled = false;
    provinceSelect.innerHTML = `<option value="">Loading provinces...</option>`;

    try {
      const response = await fetch(`${PSGC_API_BASE_URL}/regions/${regionCode}/provinces/`);

      if (!response.ok) {
        throw new Error("Failed to load provinces.");
      }

      const provinces = await response.json();

      provinceSelect.innerHTML = `<option value="">Select province</option>`;
      provinces
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(province => {
          provinceSelect.innerHTML += `<option value="${province.code}">${province.name}</option>`;
        });
    } catch (error) {
      console.error("Provinces error:", error);
      provinceSelect.innerHTML = `<option value="">Failed to load provinces</option>`;
    }
  }

  async function loadCitiesFromProvince(provinceCode) {
    citySelect.innerHTML = `<option value="">Select province first</option>`;
    citySelect.disabled = true;
    barangaySelect.innerHTML = `<option value="">Select city/municipality first</option>`;
    barangaySelect.disabled = true;

    if (!provinceCode) {
      return;
    }

    citySelect.disabled = false;
    citySelect.innerHTML = `<option value="">Loading cities/municipalities...</option>`;

    try {
      const response = await fetch(`${PSGC_API_BASE_URL}/provinces/${provinceCode}/cities-municipalities/`);

      if (!response.ok) {
        throw new Error("Failed to load cities/municipalities.");
      }

      const cities = await response.json();

      citySelect.innerHTML = `<option value="">Select city/municipality</option>`;
      cities
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(city => {
          citySelect.innerHTML += `<option value="${city.code}">${city.name}</option>`;
        });
    } catch (error) {
      console.error("Cities error:", error);
      citySelect.innerHTML = `<option value="">Failed to load cities/municipalities</option>`;
    }
  }

  async function loadBarangays(cityCode) {
    barangaySelect.innerHTML = `<option value="">Select city/municipality first</option>`;
    barangaySelect.disabled = true;

    if (!cityCode) {
      return;
    }

    barangaySelect.disabled = false;
    barangaySelect.innerHTML = `<option value="">Loading barangays...</option>`;

    try {
      const response = await fetch(`${PSGC_API_BASE_URL}/cities-municipalities/${cityCode}/barangays/`);

      if (!response.ok) {
        throw new Error("Failed to load barangays.");
      }

      const barangays = await response.json();

      barangaySelect.innerHTML = `<option value="">Select barangay</option>`;
      barangays
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(barangay => {
          barangaySelect.innerHTML += `<option value="${barangay.code}">${barangay.name}</option>`;
        });
    } catch (error) {
      console.error("Barangays error:", error);
      barangaySelect.innerHTML = `<option value="">Failed to load barangays</option>`;
    }
  }

  async function submitStudentForm(event) {
    event.preventDefault();
    clearFormMessage();

    saveStudentButton.disabled = true;
    saveStudentButton.textContent = "Saving...";

    try {
      const formData = new FormData(addStudentForm);

      if (regionSelect.value === "130000000") {
        formData.set("province_code", "");
      }

      const response = await fetch(`${API_BASE_URL}/students/`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        let errorMessage = "Failed to save student.";

        try {
          const errorData = await response.json();
          errorMessage = JSON.stringify(errorData);
        } catch {
          errorMessage = `Failed to save student. Status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      showFormMessage("Student added successfully.", "success");
      await loadStudents();

      setTimeout(() => {
        closeModal();
      }, 800);
    } catch (error) {
      console.error("Add student error:", error);
      showFormMessage(error.message, "error");
    } finally {
      saveStudentButton.disabled = false;
      saveStudentButton.textContent = "Save Student";
    }
  }

  studentSearch.addEventListener("input", applyFilters);
  collegeFilter.addEventListener("change", applyFilters);
  departmentFilter.addEventListener("change", applyFilters);
  genderFilter.addEventListener("change", applyFilters);

  resetFilters.addEventListener("click", () => {
    studentSearch.value = "";
    collegeFilter.value = "";
    departmentFilter.value = "";
    genderFilter.value = "";
    renderStudents(allStudents);
  });

  openAddStudentModal.addEventListener("click", openModal);
  closeAddStudentModal.addEventListener("click", closeModal);
  cancelAddStudent.addEventListener("click", closeModal);

  addStudentModal.addEventListener("click", (event) => {
    if (event.target === addStudentModal) {
      closeModal();
    }
  });

  modalCollege.addEventListener("change", () => {
    populateModalDepartments(modalCollege.value);
  });

  modalDepartment.addEventListener("change", () => {
    populateModalCourses(modalDepartment.value);
  });

  regionSelect.addEventListener("change", async () => {
    await loadProvincesOrCitiesFromRegion(regionSelect.value);
  });

  provinceSelect.addEventListener("change", async () => {
    await loadCitiesFromProvince(provinceSelect.value);
  });

  citySelect.addEventListener("change", async () => {
    await loadBarangays(citySelect.value);
  });

  addStudentForm.addEventListener("submit", submitStudentForm);

  loadStudents();
  loadAcademicData();
  loadRegions();
});

// ==========================================
// DELETE AT EDIT FUNCTIONS (Nasa Labas)
// ==========================================

async function deleteStudent(studentId) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) throw new Error('Failed to delete student');

    alert('Student deleted successfully!');
    if (window.loadStudents) window.loadStudents();
  } catch (error) {
    console.error("Delete error:", error);
    alert('Error deleting student.');
  }
}

async function editStudent(studentId, currentFirstName, currentLastName) {
  const newFirstName = prompt('Edit First Name:', currentFirstName);
  const newLastName = prompt('Edit Last Name:', currentLastName);

  if (!newFirstName || !newLastName) return;

  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: newFirstName,
        last_name: newLastName
      })
    });

    if (!response.ok) throw new Error('Failed to update student');

    alert('Student updated successfully!');
    if (window.loadStudents) window.loadStudents();
  } catch (error) {
    console.error("Update error:", error);
    alert('Error updating student.');
  }
}

async function deleteStudent(studentId) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  try {
    // Subukang i-delete gamit ang REST framework standard endpoint
    let response = await fetch(`${API_BASE_URL}/students/${studentId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Kung 404/Failed, subukan ang explicit /delete/ endpoint format
    if (!response.ok && response.status === 404) {
      response = await fetch(`${API_BASE_URL}/students/${studentId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    if (!response.ok) throw new Error(`Status ${response.status}`);

    alert('Student deleted successfully!');
    if (window.loadStudents) window.loadStudents();
  } catch (error) {
    console.error("Delete error:", error);
    alert('Failed to delete student. Check Django console for backend routing.');
  }
}