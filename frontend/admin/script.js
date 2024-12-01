
// Sample data
let users = [
    { id: 1, name: "Dr. Juan Pérez", role: "doctor", department: "cardiology", email: "juan@hospital.com" },
    { id: 2, name: "Enf. María López", role: "nurse", department: "pediatrics", email: "maria@hospital.com" },
    { id: 3, name: "Admin Carlos Ruiz", role: "admin", department: "emergency", email: "carlos@hospital.com" }
];

// Initialize table
function initTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.role}</td>
        <td>${user.department}</td>
        <td>${user.email}</td>
        <td>
        <button class="btn btn-link btn-edit" onclick="editUser(${user.id})">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-link btn-delete" onclick="deleteUser(${user.id})">
            <i class="fas fa-trash"></i>
        </button>
        </td>
    `;
    
    tbody.appendChild(tr);
});
}

// Show add modal
function showAddModal() {
    document.getElementById('addForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('addModal'));
    modal.show();
}

// Add user
function addUser() {
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: document.getElementById('addName').value,
        role: document.getElementById('addRole').value,
        department: document.getElementById('addDept').value,
        email: document.getElementById('addEmail').value
};

    users.push(newUser);
    const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    modal.hide();
    initTable();
}

// Filter users
function filterUsers() {
    const name = document.getElementById('searchName').value.toLowerCase();
    const role = document.getElementById('roleFilter').value;
    const dept = document.getElementById('deptFilter').value;

    const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(name) &&
            (role === '' || user.role === role) &&
            (dept === '' || user.department === dept);
});

    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

filteredUsers.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.role}</td>
        <td>${user.department}</td>
        <td>${user.email}</td>
        <td>
        <button class="btn btn-link btn-edit" onclick="editUser(${user.id})">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-link btn-delete" onclick="deleteUser(${user.id})">
            <i class="fas fa-trash"></i>
        </button>
        </td>
    `;
    tbody.appendChild(tr);
    });
}

// Edit user
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (user) {
    document.getElementById('editId').value = user.id;
    document.getElementById('editName').value = user.name;
    document.getElementById('editRole').value = user.role;
    document.getElementById('editDept').value = user.department;
    document.getElementById('editEmail').value = user.email;

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }
}

// Save edit
function saveEdit() {
  const id = parseInt(document.getElementById('editId').value);
  const user = users.find(u => u.id === id);

  if (user) {
    user.name = document.getElementById('editName').value;
    user.role = document.getElementById('editRole').value;
    user.department = document.getElementById('editDept').value;
    user.email = document.getElementById('editEmail').value;

    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    initTable();
  }
}

// Delete user
function deleteUser(id) {
  if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
    users = users.filter(u => u.id !== id);
    initTable();
  }
}

// Initialize table on load
document.addEventListener('DOMContentLoaded', initTable);
