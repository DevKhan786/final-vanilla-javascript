const input = document.getElementById("task-input");
const priority = document.getElementById("priority-select");

const showAll = document.getElementById("show-all");
const showCompleted = document.getElementById("show-completed");
const showPending = document.getElementById("show-pending");

const sortButton = document.getElementById("sort-task");
const addButton = document.getElementById("add-task");

let tasks = [];

const getTasks = () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
};

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

getTasks();
renderTasks();

showAll.addEventListener("click", () => {
  renderTasks("all");
});
showCompleted.addEventListener("click", () => {
  renderTasks("completed");
});
showPending.addEventListener("click", () => {
  renderTasks("pending");
});

addButton.addEventListener("click", () => {
  const inputValue = input.value.trim();

  if (inputValue !== "") {
    const newTask = {
      id: Date.now(),
      inputValue,
      priority: priority.value,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    input.value = "";
  } else {
    alert("Please enter a task");
  }
});

function renderTasks(filter = "all") {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList = task.completed ? "completed" : "";
    li.classList.add(task.priority);
    li.innerHTML = `
    <span>${task.inputValue}</span>
    <div class="task-buttons">
    <button class="complete-btn">${
      task.completed ? "Undo" : "Complete"
    }</button>
    <button class="delete-btn">Delete</button>
    </div>
    `;

    li.querySelector(".complete-btn").addEventListener("click", () => {
      toggleTaskCompletion(task.id);
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTask(task.id);
    });

    li.querySelector("span").addEventListener("dblclick", () => {
      const span = li.querySelector("span");
      const inputNew = document.createElement("input");
      inputNew.type = "text";
      inputNew.value = span.textContent;
      li.insertBefore(inputNew, span);
      li.removeChild(span);

      inputNew.focus();

      inputNew.addEventListener("blur", () => {
        const newValue = inputNew.value.trim();
        if (newValue) {
          task.inputValue = newValue;
          saveTasks();
          renderTasks();
        } else {
          span.textContent = task.inputValue;
          li.insertBefore(span, inputNew);
        }
        li.removeChild(inputNew);
      });

      inputNew.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          inputNew.blur();
        }
      });
    });

    list.appendChild(li);
  });
}

function toggleTaskCompletion(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

sortButton.addEventListener("click", () => {
  const priorityOrder = { low: 1, medium: 2, high: 3 };

  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  saveTasks();
  renderTasks();
});
