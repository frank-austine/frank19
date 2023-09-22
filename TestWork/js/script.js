document.addEventListener("DOMContentLoaded", function () {
    const taskNameInput = document.getElementById("task-name");
    const activityInput = document.getElementById("activity");
    const dateTimeInput = document.getElementById("date-time");
    const reminderTypeInput = document.getElementById("reminder-type");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const completedTaskList = document.getElementById("completed-task-list");
    const failedTaskList = document.getElementById("failed-task-list");
    const scoreValue = document.getElementById("score-value");

    let tasks = [];

    addTaskButton.addEventListener("click", addTask);

    function addTask() {
        const taskName = taskNameInput.value;
        const activity = activityInput.value;
        const dateTime = dateTimeInput.value;
        const reminderType = reminderTypeInput.value;

        if (taskName.trim() === "") {
            alert("Task name cannot be empty.");
            return;
        }

        const task = {
            id: Date.now(),
            name: taskName,
            activity: activity,
            dateTime: dateTime,
            reminderType: reminderType,
            completed: false,
            failed: false,
        };

        tasks.push(task);
        updateTaskList();

        // Clear input fields
        taskNameInput.value = "";
        activityInput.value = "";
        dateTimeInput.value = "";
        reminderTypeInput.value = "none";
    }

    function updateTaskList() {
        taskList.innerHTML = "";
        completedTaskList.innerHTML = "";
        failedTaskList.innerHTML = "";

        tasks.forEach((task) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${task.name} - ${task.activity} - ${task.dateTime}`;

            if (task.completed) {
                listItem.classList.add("completed-task");
            } else if (task.failed) {
                listItem.classList.add("failed-task");
            }

            const completeButton = document.createElement("button");
            completeButton.textContent = task.completed ? "Uncomplete" : "Complete";
            completeButton.addEventListener("click", () => toggleComplete(task));

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => editTask(task));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteTask(task));

            listItem.appendChild(completeButton);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            if (task.completed) {
                completedTaskList.appendChild(listItem);
            } else if (task.failed) {
                failedTaskList.appendChild(listItem);
            } else {
                taskList.appendChild(listItem);
                setReminder(task);
            }
        });

        calculateScore();
    }

    function toggleComplete(task) {
        task.completed = !task.completed;
        if (task.completed) {
            task.failed = false;
        }
        updateTaskList();
    }

    function editTask(task) {
        const newTaskName = prompt("Edit Task Name:", task.name);
        if (newTaskName !== null) {
            task.name = newTaskName;
            task.activity = prompt("Edit Activity:", task.activity);
            task.dateTime = prompt("Edit Date and Time:", task.dateTime);
            task.reminderType = prompt("Edit Reminder Type:", task.reminderType);
            updateTaskList();
        }
    }

    function deleteTask(task) {
        const index = tasks.indexOf(task);
        if (index !== -1) {
            tasks.splice(index, 1);
            updateTaskList();
        }
    }

    function setReminder(task) {
        const dateTime = new Date(task.dateTime);
        const now = new Date();

        if (dateTime <= now) {
            if (task.reminderType === "text") {
                sendTextReminder(task);
            } else if (task.reminderType === "sound") {
                playSoundReminder();
            }
        } else {
            const timeDifference = dateTime - now;
            setTimeout(() => {
                if (task.reminderType === "text") {
                    sendTextReminder(task);
                } else if (task.reminderType === "sound") {
                    playSoundReminder();
                }
            }, timeDifference);
        }
    }

    function sendTextReminder(task) {
        alert(`Reminder for '${task.name}': ${task.activity}`);
    }

    function playSoundReminder() {
        // Use the HTML5 Audio API to play a sound
        // Replace 'sound-file.mp3' with the path to your sound file
        const audio = new Audio('testsound.mp3');
        audio.play();
    }

    function calculateScore() {
        const completedTasks = tasks.filter((task) => task.completed);
        const score = completedTasks.length;
        scoreValue.textContent = score;
    }

    setInterval(checkOverdueTasks, 2 * 60 * 1000);

    function checkOverdueTasks() {
        const now = new Date();
        tasks.forEach((task) => {
            if (!task.completed && !task.failed) {
                const dateTime = new Date(task.dateTime);
                if (dateTime <= now) {
                    task.failed = true;
                    updateTaskList();
                }
            }
        });
    }
});
