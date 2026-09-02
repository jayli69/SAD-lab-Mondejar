// ======================================================
// SUPABASE SETUP
// Replace these two values with your own Supabase project details.
// Find them in: Supabase Dashboard > Project Settings > API
// ======================================================
const SUPABASE_URL = "https://vtjhppkqfsitgctetztr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0amhwcGtxZnNpdGdjdGV0enRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwOTA5MDQsImV4cCI6MjEwMjY2NjkwNH0.OWNqR1JMuN8I5CmEw5oTb73BdYhyeTsZDGIVGM-OcrQ";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======================================================
// ELEMENT REFERENCES
// ======================================================
const form = document.getElementById("student-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const tableBody = document.getElementById("student-table-body");

const recordIdInput = document.getElementById("record-id");
const studentIdInput = document.getElementById("student_id");
const fullNameInput = document.getElementById("full_name");
const programInput = document.getElementById("program");
const yearLevelInput = document.getElementById("year_level");
const emailInput = document.getElementById("email");

let isEditing = false;

// ======================================================
// LOAD STUDENTS WHEN PAGE OPENS
// ======================================================
document.addEventListener("DOMContentLoaded", loadStudents);

async function loadStudents() {
  const { data, error } = await supabaseClient
    .from("students")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    alert(error.message);
    return;
  }

  renderTable(data);
}

// ======================================================
// RENDER TABLE ROWS
// ======================================================
function renderTable(students) {
  tableBody.innerHTML = "";

  students.forEach((student) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.student_id}</td>
      <td>${student.full_name}</td>
      <td>${student.program}</td>
      <td>${student.year_level}</td>
      <td>${student.email}</td>
      <td>
        <button class="edit-btn" data-id="${student.id}">Edit</button>
        <button class="delete-btn" data-id="${student.id}">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Attach click events for the newly created buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => startEdit(btn.dataset.id, students));
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteStudent(btn.dataset.id));
  });
}

// ======================================================
// FORM SUBMIT (ADD OR UPDATE)
// ======================================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentData = {
    student_id: studentIdInput.value.trim(),
    full_name: fullNameInput.value.trim(),
    program: programInput.value.trim(),
    year_level: yearLevelInput.value.trim(),
    email: emailInput.value.trim(),
  };

  // Basic validation (required attribute already helps, this is a backup check)
  if (
    !studentData.student_id ||
    !studentData.full_name ||
    !studentData.program ||
    !studentData.year_level ||
    !studentData.email
  ) {
    alert("Please fill in all fields.");
    return;
  }

  if (isEditing) {
    await updateStudent(recordIdInput.value, studentData);
  } else {
    await addStudent(studentData);
  }
});

// ======================================================
// CREATE
// ======================================================
async function addStudent(studentData) {
  const { error } = await supabaseClient.from("students").insert([studentData]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Student added successfully!");
  resetForm();
  loadStudents();
}

// ======================================================
// UPDATE
// ======================================================
function startEdit(id, students) {
  const student = students.find((s) => s.id == id);
  if (!student) return;

  isEditing = true;
  recordIdInput.value = student.id;
  studentIdInput.value = student.student_id;
  fullNameInput.value = student.full_name;
  programInput.value = student.program;
  yearLevelInput.value = student.year_level;
  emailInput.value = student.email;

  formTitle.textContent = "Edit Student";
  submitBtn.textContent = "Update Student";
  cancelBtn.style.display = "inline-block";

  window.scrollTo(0, 0);
}

async function updateStudent(id, studentData) {
  const { error } = await supabaseClient
    .from("students")
    .update(studentData)
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Student updated successfully!");
  resetForm();
  loadStudents();
}

// ======================================================
// DELETE
// ======================================================
async function deleteStudent(id) {
  const confirmDelete = confirm("Are you sure you want to delete this student?");
  if (!confirmDelete) return;

  const { error } = await supabaseClient.from("students").delete().eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Student deleted successfully!");
  loadStudents();
}

// ======================================================
// CANCEL EDIT
// ======================================================
cancelBtn.addEventListener("click", resetForm);

// ======================================================
// RESET FORM TO "ADD" MODE
// ======================================================
function resetForm() {
  isEditing = false;
  form.reset();
  recordIdInput.value = "";

  formTitle.textContent = "Add Student";
  submitBtn.textContent = "Save Student";
  cancelBtn.style.display = "none";
}
