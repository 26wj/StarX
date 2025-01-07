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

/* New Styles for Task Form */
#task-form select {
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 1em;
}

#task-form input[type="text"] {
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  margin-bottom: 1em;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation for task form */
#task-form {
  transform: translateY(-20px);
  opacity: 0;
  transition: opacity 0.5s, transform 0.5s ease-in-out;
}

#task-form.visible {
  transform: translateY(0);
  opacity: 1;
}
