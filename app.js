
const STORAGE_KEY = 'interncircle_todo_tasks';


let tasks = [];
let currentFilter = 'all'; // Options: 'all', 'active', 'done'

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const remainingCount = document.getElementById('remaining-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');


function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


function load() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const parsedData = storedData ? JSON.parse(storedData) : [];
    tasks = Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error('Failed to parse tasks from localStorage, resetting to empty array:', error);
    tasks = [];
  }
}


function render() {
  
  todoList.innerHTML = '';

  
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.done;
    if (currentFilter === 'done') return task.done;
    return true; 
  });

  
  if (filteredTasks.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty-msg';
    emptyItem.textContent =
      tasks.length === 0
        ? 'No tasks yet. Add one above!'
        : `No ${currentFilter} tasks found.`;
    todoList.appendChild(emptyItem);
  } else {
    
    filteredTasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = `todo-item${task.done ? ' completed' : ''}`;
      li.dataset.id = task.id;

      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = task.done;
      checkbox.dataset.id = task.id;
      checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.done ? 'active' : 'done'}`);

      
      const textSpan = document.createElement('span');
      textSpan.className = 'todo-text';
      textSpan.textContent = task.text;

      
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-btn';
      deleteBtn.dataset.id = task.id;
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', `Delete task "${task.text}"`);

      li.appendChild(checkbox);
      li.appendChild(textSpan);
      li.appendChild(deleteBtn);

      todoList.appendChild(li);
    });
  }

  
  const remainingTasks = tasks.filter((task) => !task.done).length;
  remainingCount.textContent = `${remainingTasks} ${
    remainingTasks === 1 ? 'task' : 'tasks'
  } remaining`;
}


todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const trimmedText = todoInput.value.trim();

  
  if (!trimmedText) {
    return;
  }

  
  const newTask = {
    id: Date.now(),
    text: trimmedText,
    done: false,
  };

  tasks.push(newTask);
  todoInput.value = '';
  save();
  render();
});


todoList.addEventListener('click', (e) => {
  const target = e.target;
  const taskId = Number(target.dataset.id);

  if (!taskId) return;

  if (target.classList.contains('todo-checkbox')) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.done = !task.done;
      save();
      render();
    }
  } else if (target.classList.contains('delete-btn')) {
    tasks = tasks.filter((t) => t.id !== taskId);
    save();
    render();
  }
});


filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});


clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.done);
  save();
  render();
});


load();
render();
