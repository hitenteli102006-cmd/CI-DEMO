// State management with localStorage fallback
let tasks = JSON.parse(localStorage.getItem('app_tasks')) || [];

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const itemsLeft = document.getElementById('items-left');
const clearBtn = document.getElementById('clear-completed');

// Save tasks to LocalStorage
function saveTasks() {
  localStorage.setItem('app_tasks', JSON.stringify(tasks));
}

// Render tasks to the screen
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    li.innerHTML = `
      <div class="task-content ${task.completed ? 'completed' : ''}" onclick="toggleTask(${index})">
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span>${escapeHtml(task.text)}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask(${index})">&times;</button>
    `;

    taskList.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.completed).length;
  itemsLeft.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;
  saveTasks();
}

// Add new task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text: text, completed: false });
  taskInput.value = '';
  renderTasks();
});

// Toggle task completion
window.toggleTask = function(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
};

// Delete single task
window.deleteTask = function(index) {
  tasks.splice(index, 1);
  renderTasks();
};

// Clear completed tasks
clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  renderTasks();
});

// Helper to prevent HTML injection attacks
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));
}

// Initial Render
renderTasks();