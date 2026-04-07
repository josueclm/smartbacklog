export function TaskCard(task) {
  return `
    <div class="task-card">
      <strong>${task.title}</strong>
      <p>${task.priority}</p>
      <button onclick="deleteTaskUI(${task.id})">❌</button>
    </div>
  `;
}