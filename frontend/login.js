document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const userData = {
    email,
    password
  };

  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);  // Store JWT token
        window.location.href = 'task-manager.html';  // Redirect to task manager page
      } else {
        alert('Invalid credentials!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred during login.');
    });
});
