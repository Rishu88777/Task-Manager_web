
const BASE_URL = 'https://task-manager-backend-4axd.onrender.com/api';

// Handle login
document.getElementById('loginForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('userName', result.name); // Store the user's name
            window.location.href = 'taskmanager.html'; // Redirect to task page
        } else {
            document.getElementById('error-message').innerText = result.message;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('error-message').innerText = 'Something went wrong';
    }
});

// Handle signup
document.getElementById('signupForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const result = await response.json();
        if (response.ok) {
            alert('Signup successful! You can now login.');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            document.getElementById('error-message').innerText = result.message;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('error-message').innerText = 'Something went wrong';
    }
});

// Display user's name on the Task Manager page
if (document.getElementById('user-name')) {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('user-name').textContent = userName;
    } else {
        console.error('User name not found in localStorage');
    }
}

// Rest of the app.js code remains the same...

// Add task functionality on Task Manager page
document.getElementById('add-task-btn')?.addEventListener('click', async function () {
    console.log('Add Task button clicked'); // Debugging line

    const name = document.getElementById('task-name').value;
    const description = document.getElementById('task-desc').value;
    const status = document.getElementById('task-status').value;
    
    console.log('Task Name:', name); // Debugging line
    console.log('Task Description:', description); // Debugging line
    console.log('Task Status:', status); // Debugging line

    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debugging line
    
    if (name && description && token) {
        try {
            console.log('Sending request to add task...'); // Debugging line
            const response = await fetch(`${BASE_URL}/tasks`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, status })
            });
            console.log('Response:', response); // Debugging line

            if (response.ok) {
                console.log('Task added successfully'); // Debugging line
                loadTasks(); // Reload tasks after adding
                document.getElementById('task-name').value = ''; // Clear input fields
                document.getElementById('task-desc').value = '';
            } else {
                const errorResult = await response.json();
                console.error('Error adding task:', errorResult); // Debugging line
                alert('Error adding task');
            }
        } catch (error) {
            console.error('Error:', error); // Debugging line
        }
    } else {
        console.error('Validation failed: Name, description, or token is missing'); // Debugging line
    }
});

// Load tasks
async function loadTasks() {
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            const response = await fetch(`${BASE_URL}/tasks`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const tasks = await response.json();
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.classList.add('task-item');
                taskItem.innerHTML = `
                    <div>
                        <strong>${task.name}</strong>
                        <p>${task.description}</p>
                        <p class="task-status ${task.status.toLowerCase().replace(' ', '-')}">
                            <i class="fas fa-circle"></i> ${task.status}
                        </p>
                    </div>
                    <div>
                        <button class="edit-btn" onclick="editTask(${task.id}, '${task.name}', '${task.description}', '${task.status}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="delete-btn" onclick="deleteTask(${task.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
        } catch (error) {
            console.error(error);
        }
    }
}

// Edit task
async function editTask(id, name, description) {
    const newName = prompt('Enter new task name:', name);
    const newDescription = prompt('Enter new task description:', description);
    
    if (newName && newDescription) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName, description: newDescription })
            });
            if (response.ok) {
                loadTasks(); // Reload tasks after editing
            } else {
                alert('Error updating task');
            }
        } catch (error) {
            console.error(error);
        }
    }
}

// Delete task
async function deleteTask(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            loadTasks(); // Reload tasks after deleting
        } else {
            alert('Error deleting task');
        }
    } catch (error) {
        console.error(error);
    }
}

// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'index.html'; // Redirect to homepage
});

// Initialize task list on task manager page
if (document.getElementById('task-list')) {
    loadTasks();
}
