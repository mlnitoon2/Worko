document.getElementById('signup-role').addEventListener('change', function () {
  const classCodeField = document.getElementById('signup-class');
  if (this.value === 'student') {
    classCodeField.classList.remove('hidden');
  } else {
    classCodeField.classList.add('hidden');
  }
});

document.getElementById('signup-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const role = document.getElementById('signup-role').value;
  const classCode = document.getElementById('signup-class').value;

  if (role === 'student' && !classCode) {
    alert('Class code is required for students.');
    return;
  }

  // Save user to localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users.push({ username, password, role, classCode, reports: [] });
  localStorage.setItem('users', JSON.stringify(users));

  // Auto-sign-in
  localStorage.setItem('currentUser', JSON.stringify({ username, role }));
  alert(`Signed up and logged in as ${role}!`);

  // Redirect based on role
  if (role === 'teacher') {
    window.location.href = 'teacher-dashboard.html';
  } else {
    window.location.href = 'student-dashboard.html';
  }
});