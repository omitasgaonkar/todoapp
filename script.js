// Base API URL
const apiUrl = 'http://localhost:8080/api/tasks';

// Fetch and display all tasks
// Fetch and display all tasks
// Example Basic Authentication
function fetchTasks() {
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa('omkar:omkar@123') // Use correct credentials here
        }
    })
    .then(response => {
        if (!response.ok) {
            // Log more details about the error for debugging
            return response.text().then(text => {
                throw new Error(`Network response was not ok: ${response.status} - ${text}`);
            });
        }
        return response.json();
    })
    .then(tasks => {
        if (Array.isArray(tasks)) {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Clear the existing list
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${task.description}</strong> 
                    - Due: ${task.dueDate} 
                    - Completed: ${task.completed ? 'Yes' : 'No'}
                    <button onclick="deleteTask(${task.id})">Delete</button>
                    <button onclick="editTask(${task.id})">Edit</button>
                `;
                taskList.appendChild(li);
            });
        } else {
            console.error('Fetched data is not an array:', tasks);
        }
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });
}



// Add a new task
document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const taskData = {
        description: document.getElementById('taskDescription').value,
        dueDate: document.getElementById('taskDueDate').value,
        completed: document.getElementById('taskCompleted').checked
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('omkar:omkar@123') // Basic Authentication
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(task => {
        fetchTasks(); // Refresh the task list
        document.getElementById('taskForm').reset(); // Reset the form
    })
    .catch(error => console.error('Error adding task:', error));
});

// Delete a task
function deleteTask(taskId) {
    fetch(`${apiUrl}/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Basic ' + btoa('omkar:omkar@123') // Basic Authentication
        }
    })
    .then(() => {
        fetchTasks(); // Refresh the task list
    })
    .catch(error => console.error('Error deleting task:', error));
}

// Edit a task
function editTask(taskId) {
    // Fetch the task details
    fetch(`${apiUrl}/${taskId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa('omkar:omkar@123') // Basic Authentication
        }
    })
    .then(response => response.json())
    .then(task => {
        // Populate the edit form with task data
        document.getElementById('editTaskName').value = task.description;
        document.getElementById('editTaskDescription').value = task.description;
        document.getElementById('editTaskDueDate').value = task.dueDate;
        document.getElementById('editTaskCompleted').checked = task.completed;

        // Show the edit form and hide the add task form
        document.getElementById('editTaskContainer').style.display = 'block';
        document.getElementById('taskForm').style.display = 'none';

        // Handle the form submission for updating the task
        document.getElementById('editTaskForm').onsubmit = function(event) {
            event.preventDefault();

            const updatedTaskData = {
                description: document.getElementById('editTaskDescription').value,
                dueDate: document.getElementById('editTaskDueDate').value,
                completed: document.getElementById('editTaskCompleted').checked
            };

            // Send the PUT request to update the task
            fetch(`${apiUrl}/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('omkar:omkar@123') // Basic Authentication
                },
                body: JSON.stringify(updatedTaskData)
            })
            .then(response => response.json())
            .then(updatedTask => {
                fetchTasks(); // Refresh the task list
                cancelEdit(); // Cancel edit and show the add task form
            })
            .catch(error => console.error('Error updating task:', error));
        };
    })
    .catch(error => console.error('Error fetching task:', error));
}

// Cancel editing
document.getElementById('cancelEdit').addEventListener('click', cancelEdit);

function cancelEdit() {
    document.getElementById('editTaskContainer').style.display = 'none';
    document.getElementById('taskForm').style.display = 'block';
    document.getElementById('editTaskForm').reset(); // Reset the edit form
}

// Initial fetch of tasks when the page loads
window.onload = fetchTasks;