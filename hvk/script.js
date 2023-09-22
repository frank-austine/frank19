const newTaskForm = document.getElementById('new-task-form');
const incompleteTaskList = document.getElementById('incomplete-task-list');
const completedTaskList = document.getElementById('completed-task-list');
const productivityScore = document.getElementById('productivity-score');
let tasks = [];
let editingIndex = -1;

// Function to create a new task object
function createTaskObject(name, activity, state, dateline) {
  return {
    name,
    activity,
    state,
    dateline,
    completed: false
  };
}

// Function to add a new task
function addTask(event) {
  event.preventDefault();
  const taskName = document.getElementById('task-name').value;
  const taskActivity = document.getElementById('task-activity').value;
  const taskState = document.getElementById('task-state').value;
  const taskDateline = document.getElementById('task-dateline').value;

  if (!taskName || !taskActivity || !taskState || !taskDateline) {
    return;
  }

  if (editingIndex > -1) {
    tasks[editingIndex] = createTaskObject(taskName, taskActivity, taskState, taskDateline);
    editingIndex = -1;
  } else {
    const newTask = createTaskObject(taskName, taskActivity, taskState, taskDateline);
    tasks.push(newTask);
  }

  renderTasks();
  updateProductivityScore();
  resetForm();
}

// Function to render the tasks in the task lists
function renderTasks() {
  incompleteTaskList.innerHTML = '';
  completedTaskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const listItem = document.createElement('li');
    const isEditing = editingIndex === index;

    listItem.innerHTML = `
      <div class="task-details ${isEditing ? 'hidden' : ''} ${task.completed ? 'completed-task' : ''}">
        <input type="checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
        <span>${task.name} - ${task.activity} - ${task.state} - ${task.dateline}</span>
        <button class="edit-button" data-index="${index}">Edit</button>
        <button class="remove-button" data-index="${index}">Remove</button>
        ${task.completed ? `<button class="undo-button" data-index="${index}">Undo</button>` : ''}
      </div>
      <form class="edit-task-form ${isEditing ? 'show' : ''}" data-index="${index}">
        <input type="text" class="edit-task-name" value="${task.name}" required>
        <input type="text" class="edit-task-activity" value="${task.activity}" required>
        <input type="text" class="edit-task-state" value="${task.state}" required>
        <input type="date" class="edit-task-dateline" value="${task.dateline}" required>
        <button class="cancel-button" type="button">Cancel</button>
        <button class="save-button" type="submit">Save</button>
      </form>
    `;

    if (task.completed) {
      completedTaskList.appendChild(listItem);
    } else {
      incompleteTaskList.appendChild(listItem);
    }
  });
}

// Function to handle task completion
function toggleTaskCompletion(event) {
  if (!event.target.matches('input[type="checkbox"]')) {
    return;
  }

  const index = event.target.dataset.index;
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
  updateProductivityScore();
}

// Function to remove a task
function removeTask(event) {
  if (!event.target.matches('.remove-button')) {
    return;
  }

  const index = event.target.dataset.index;
  tasks.splice(index, 1);
  renderTasks();
  updateProductivityScore();
}

// Function to toggle the edit mode for a task
function toggleEditMode(event) {
  if (!event.target.matches('.edit-button')) {
    return;
  }

  const index = event.target.dataset.index;
  editingIndex = editingIndex === index ? -1 : index;
  renderTasks();
  resetForm();
}

// Function to handle task editing
function editTask(event) {
  event.preventDefault();
  const index = event.target.parentNode.dataset.index;
  const editedTaskName = event.target.parentNode.querySelector('.edit-task-name').value;
  const editedTaskActivity = event.target.parentNode.querySelector('.edit-task-activity').value;
  const editedTaskState = event.target.parentNode.querySelector('.edit-task-state').value;
  const editedTaskDateline = event.target.parentNode.querySelector('.edit-task-dateline').value;

  tasks[index] = createTaskObject(editedTaskName, editedTaskActivity, editedTaskState, editedTaskDateline);
  editingIndex = -1;
  renderTasks();
  resetForm();
}

// Function to update the productivity score
function updateProductivityScore() {
  const completedTasks = tasks.filter(task => task.completed).length;
  const productivity = tasks.length ? (completedTasks / tasks.length) * 100 : 0;
  productivityScore.textContent = productivity.toFixed(2);
}

// Function to reset the form inputs
function resetForm() {
  newTaskForm.reset();
}

// Event listeners
newTaskForm.addEventListener('submit', addTask);
incompleteTaskList.addEventListener('change', toggleTaskCompletion);
completedTaskList.addEventListener('change', toggleTaskCompletion);
taskList.addEventListener('click', removeTask);
taskList.addEventListener('click', toggleEditMode);
taskList.addEventListener('submit', editTask);
taskList.addEventListener('click', function(event) {
  if (event.target.matches('.cancel-button')) {
    editingIndex = -1;
    renderTasks();
  }
});

var alarmSound = new Audio();
alarmSound.src = 'alarm.mp3';
var alarmTimer;

function setAlarm(button) {
  var ms = document.getElementById('alarmTime').valueAsNumber;
  if(isNaN(ms)) {
    alert('Invalid Date');
    return;
  }

  var alarm = new Date(ms);
  var alarmTime = new Date(alarm.getUTCFullYear(), alarm.getUTCMonth(), alarm.getUTCDate(),  alarm.getUTCHours(), alarm.getUTCMinutes(), alarm.getUTCSeconds());
  
  var differenceInMs = alarmTime.getTime() - (new Date()).getTime();

  if(differenceInMs < 0) {
    alert('Specified time is already passed');
    return;
  }

  alarmTimer = setTimeout(initAlarm, differenceInMs);
  button.innerText = 'Cancel Alarm';
  button.setAttribute('onclick', 'cancelAlarm(this);');
};

function cancelAlarm(button) {
  clearTimeout(alarmTimer);
  button.innerText = 'Set Alarm';
  button.setAttribute('onclick', 'setAlarm(this);')
};

function initAlarm() {
  alarmSound.play();
  document.getElementById('alarmOptions').style.display = '';
};

function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  document.getElementById('alarmOptions').style.display = 'none';
  cancelAlarm(document.getElementById('alarmButton'));
};

function snooze() {
  stopAlarm();
  alarmTimer = setTimeout(initAlarm, 300000); // 5 * 60 * 1000 = 5 Minutes
};