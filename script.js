const CLIENT_ID = '235789014744-i9qpe8djarm61ur76snoran9hp1e5o16.apps.googleusercontent.com';
const API_KEY = 'AIzaSyApMSwKRlbh_mRRncEoO2GzBSYHDmCyDaY';
const SPREADSHEET_ID = '12IXJaSQALSc7iY2xlzB_CBfJyoE9xopmIgWf9tvn9rc';
const RANGE = 'Sheet1!A:E'; // Adjust range if needed

// Initialize Google API Client
function loadClient() {
  gapi.client.setApiKey(API_KEY);
  return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4");
}

// Sign-In Function
function signIn() {
  gapi.auth2.getAuthInstance().signIn().then(() => {
    console.log("Signed in");
  }).catch(err => console.error("Sign-in error:", err));
}

// Function to Export Data to Google Sheets
function exportToGoogleSheets() {
  const tasks = getAllTasks(); // Fetch all tasks

  const taskData = tasks.map(task => [
    task.day,
    task.name,
    task.priority,
    task.completed ? 'Completed' : 'Pending',
    task.person
  ]);

  const resource = {
    values: taskData
  };

  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
    valueInputOption: 'RAW',
    resource: resource
  }).then((response) => {
    console.log(response);
    alert("Data successfully exported to Google Sheets!");
  }).catch((error) => {
    console.error("Error exporting to Google Sheets:", error);
    alert("Error exporting data to Google Sheets.");
  });
}

// Function to Get All Tasks
function getAllTasks() {
  let tasks = [];
  for (let day = 1; day <= 31; day++) {
    const storedTasks = JSON.parse(localStorage.getItem(`tasks-${day}`)) || [];
    storedTasks.forEach(task => {
      tasks.push({
        day: day,
        name: task.name,
        priority: task.priority,
        completed: task.completed,
        person: task.person
      });
    });
  }
  return tasks;
}

// Initialize Google API and Set Event Listeners
function init() {
  gapi.load("client:auth2", () => {
    gapi.auth2.init({ client_id: CLIENT_ID }).then(() => {
      // Removed Export to Excel button functionality
    });
  });
}

// Start the App on Page Load
window.onload = function() {
  init();
};

// Your existing code for task management
document.addEventListener('DOMContentLoaded', () => {
  const calendarGrid = document.getElementById('calendar-grid');
  const taskHeader = document.getElementById('task-header');
  const taskList = document.getElementById('task-list');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskForm = document.getElementById('task-form');
  const saveTaskBtn = document.getElementById('save-task-btn');
  const searchBar = document.getElementById('search-bar');
  const undoneTasksCount = document.getElementById('undone-tasks');

  let currentFileData = {}; // Stores task data for Excel export

  // Retrieve tasks from localStorage (or use sample data)
  const getTasksForDay = (day) => {
    const tasks = localStorage.getItem(`tasks-${day}`);
    return tasks ? JSON.parse(tasks) : [];
  };

  // Display calendar grid (simplified)
  const displayCalendar = () => {
    for (let i = 1; i <= 31; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      dayElement.textContent = i;
      dayElement.addEventListener('click', () => displayTasksForDay(i));
      calendarGrid.appendChild(dayElement);
    }
  };

  // Show tasks for selected day
  const displayTasksForDay = (day) => {
    taskHeader.textContent = `Tasks for Day ${day}`;
    taskList.innerHTML = ''; // Clear current list
    const tasks = getTasksForDay(day);
    tasks.forEach((task, index) => {
      const taskElement = document.createElement('li');
      taskElement.textContent = `${task.name} - ${task.priority} - ${task.person}`;
      taskElement.classList.add(task.priority + '-priority');
      taskList.appendChild(taskElement);
    });
  };

  // Add task functionality
  addTaskBtn.addEventListener('click', () => {
    taskForm.style.display = 'block';
    taskForm.classList.add('visible');
  });

  saveTaskBtn.addEventListener('click', () => {
    const taskName = document.getElementById('task-name').value;
    const taskPriority = document.getElementById('priority-select').value;
    const taskPerson = document.getElementById('person-select').value;
    const day = parseInt(taskHeader.textContent.split(' ')[2]);

    const task = {
      name: taskName,
      priority: taskPriority,
      person: taskPerson,
      completed: false,
    };

    let tasks = getTasksForDay(day);
    tasks.push(task);
    localStorage.setItem(`tasks-${day}`, JSON.stringify(tasks));

    taskForm.style.display = 'none';
    taskForm.classList.remove('visible');
    displayTasksForDay(day); // Refresh task list
  });

  // Initialize Calendar
  displayCalendar();
});
