import { getTasks, createTask, deleteTask } from "../services/taskService.js";
import { TaskCard } from "../components/TaskCard.js";

const list = document.getElementById("taskList");

async function loadTasks() {
  const tasks = await getTasks();

  list.innerHTML = tasks.map(TaskCard).join("");
}

async function addTask() {
  const title = document.getElementById("title").value;

  await createTask({
    title,
    priority: "HIGH"
  });

  loadTasks();
}

async function deleteTaskUI(id) {
  await deleteTask(id);
  loadTasks();
}

window.addTask = addTask;
window.deleteTaskUI = deleteTaskUI;

loadTasks();
