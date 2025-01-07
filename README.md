<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zaki's Planner</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      background: linear-gradient(135deg, #f4f4f9, #dfe6f4);
      color: #333;
    }

    header {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1em;
      background: #6200ea;
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .task-count {
      position: absolute;
      right: 20px;
      font-size: 1em;
      color: red;
    }

    main {
      display: flex;
      padding: 1em;
      gap: 1em;
    }

    #calendar, #tasks {
      flex: 1;
      background: white;
      padding: 1em;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    #calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5em;
    }

    .day {
      padding: 0.5em;
      background: #e0e0e0;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .day:hover {
      background: #9575cd;
      color: white;
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .active {
      background: #6200ea;
      color: white;
    }

    #task-header {
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 1em;
    }

    #task-list {
      list-style: none;
      padding: 0;
    }

    #task-list li {
      padding: 0.5em;
      margin: 0.5em 0;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: fadeIn 0.3s ease;
    }

    #task-list li button {
      background: #ff5252;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.3em 0.7em;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    #task-list li button:hover {
      background: #d32f2f;
    }

    #add-task-btn {
      background: #03dac5;
      color: white;
      border: none;
      padding: 0.5em 1em;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 1em;
      transition: all 0.3s ease;
    }

    #add-task-btn:hover {
      background: #018786;
    }

    #search-bar {
      margin-bottom: 1em;
      padding: 0.5em;
      width: 100%;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    .low-priority {
      background-color: #81c784;
    }

    .medium-priority {
      background-color: #ffeb3b;
    }

    .high-priority {
      background-color: #f44336;
    }

    #task-form {
      transform: translateY(-20px);
      opacity: 0;
      transition: opacity 0.5s, transform 0.5s ease-in-out;
    }

    #task-form.visible {
      transform: translateY(0);
      opacity: 1;
    }

  </style>
</head>
<body>
  <header>
    <h1>Zaki's Planner</h1>
    <div class="task-count" id="undone-tasks">0 undone tasks</div>
  </header>
  <main>
    <section id="calendar">
      <h2>Calendar</h2>
      <div id="calendar-grid"></div>
    </section>
    <section id="tasks">
      <input type="text" id="search-bar" placeholder="Search tasks..." />
      <div id="task-header">Select a day to view your plan</div>
      <ul id="task-list"></ul>
      <button id="add-task-btn">+ Add Task</button>

      <div id="task-form" style="display: none;">
        <input type="text" id="task-name" placeholder="Task name" />
        <select id="priority-select">
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <select id="person-select">
          <option value="self">Self</option>
          <option value="person1">Person 1</option>
          <option value="person2">Person 2</option>
        </select>
        <button id="save-task-btn">Save Task</button>
      </div>
    </section>
  </main>

  <!-- Google API Libraries -->
  <script src="https://apis.google.com/js/api.js"></script>
  <script>
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
  </script>
</body>
</html>
