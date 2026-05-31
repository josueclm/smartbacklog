import {
   getBoard,
   updateBoardTaskStatus,
   reorderBoardTasks
} from "../services/boardService.js";

import {
   getSprintById,
   completeSprint 
} from "../services/sprintService.js";

import {
  getBacklogTasks,
  addToSprint,
  removeTaskFromSprint
} from "../services/taskService.js";

// =========================
// CONFIG
// =========================
let sprintId = new URLSearchParams(window.location.search)
      .get("sprintId");

let selectedBacklogTasks = [];

// =========================
// ELEMENTS
// =========================
const todoList =
   document.querySelector(
      "#column-todo .task-list"
   );

const inprogressList =
   document.querySelector(
      "#column-inprogress .task-list"
   );

const doneList =
   document.querySelector(
      "#column-done .task-list"
   );



   async function removeTaskFromSprintt(event, taskId) {

   // =========================
   // STOP CARD CLICK
   // =========================
   event.stopPropagation();

   try {

      if (!taskId) {

         console.error(
            "Task ID inválido"
         );

         return;

      }

      const confirmRemove =
         confirm(
            "Remover tarefa da sprint?"
         );

      if (!confirmRemove) return;

      // =========================
      // UPDATE TASK
      // =========================
      await removeTaskFromSprint(
         taskId,
         {
            sprint_id: null,
            status: "TODO"
         }
      );

      // =========================
      // RELOAD BOARD
      // =========================
      await loadBoard();

      // =========================
      // FEEDBACK
      // =========================
      showToast(
         "Tarefa removida da sprint"
      );

   }

   catch (error) {

      console.error(
         "Erro ao remover tarefa",
         error
      );

      showToast(
         "Erro ao remover tarefa",
         "error"
      );

   }

}

// =========================
// LOAD BOARD
// =========================
async function loadBoard() {

   try {

      const board =
         await getBoard(sprintId);

      renderColumn(
         todoList,
         board.TODO,
         "todo"
      );

      renderColumn(
         inprogressList,
         board.IN_PROGRESS,
         "inprogress"
      );

      renderColumn(
         doneList,
         board.DONE,
         "done"
      );

      updateColumnCounters();

   } catch (err) {

      console.error(err);

   }

}


// =========================
// RENDER COLUMN
// =========================
function renderColumn(container, tasks, status) {

   if (!container) {

      console.error(
         "Container não encontrado",
         status
      );

      return;

   }

   container.innerHTML = "";

   tasks.forEach(task => {

      const priority =
         (task.priority || 'MEDIUM').toUpperCase();

      const taskStatus =
         (task.status || 'TODO').toUpperCase();

      // =========================
      // PRIORITY
      // =========================

      let priorityClass =
         'bg-amber-400 text-amber-900';

      let dotClass =
         'bg-amber-500';

      if (priority === 'HIGH') {

         priorityClass =
            'bg-red-600 text-white';

         dotClass =
            'bg-red-600';

      }

      if (priority === 'LOW') {

         priorityClass =
            'bg-green-500 text-white';

         dotClass =
            'bg-green-500';

      }

      // =========================
      // STATUS TEMPLATE
      // =========================

      let cardClass =
         'bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group/card mb-4';

      let titleClass =
         'font-headline font-bold text-sm mb-1 group-hover/card:text-primary transition-colors pointer-events-none';

      let topBorder =
         'border-slate-50';

      let leftContent =
         `
            <div class="w-1.5 h-1.5 rounded-full ${dotClass}"></div>

            <span class="text-[10px] font-bold text-slate-400">
               LIN-${task.id}
            </span>
         `;

      let footerRight =
         '';

      if (taskStatus === 'IN_PROGRESS') {

         cardClass =
            'bg-blue-50/70 p-4 rounded-xl shadow-md border-2 border-primary border-l-[6px] relative overflow-hidden mb-4';

         titleClass =
            'font-headline font-bold text-sm mb-1 text-primary pointer-events-none';

         topBorder =
            'border-blue-100/50';

         leftContent =
            `
               <div class="w-1.5 h-1.5 rounded-full ${dotClass}"></div>

               <span class="text-[10px] font-bold text-primary/70">
                  LIN-${task.id}
               </span>
            `;
      }

      if (taskStatus === 'DONE') {

         cardClass =
            'bg-green-50/40 p-4 rounded-xl shadow-sm border border-green-100/60 group/card mb-4';

         titleClass =
            'font-headline font-bold text-sm mb-1 text-green-800 line-through decoration-green-300/60 transition-all group-hover/card:text-green-900 pointer-events-none';

         topBorder =
            'border-green-100/30';

         leftContent =
            `
               <span
                  class="material-symbols-outlined text-[18px] text-green-600"
                  style="font-variation-settings: 'FILL' 1;"
               >
                  check_circle
               </span>

               <span class="text-[10px] font-bold text-slate-400">
                  LIN-${task.id}
               </span>
            `;

         footerRight =
            `
               <span class="material-symbols-outlined text-[16px] text-green-500">
                  check
               </span>
            `;
      }

      container.innerHTML += `
         <div
            class="task-card ${cardClass}"
            draggable="true"
            id="task-${task.id}"
            data-id="${task.id}"
            data-status="${task.status}"
            onclick="handleCardClick(event, ${task.id})"
         >

            <div class="flex justify-between items-start mb-2 pointer-events-none">

               <div class="flex items-center gap-2">

                  ${leftContent}

               </div>

               <span class="${priorityClass} px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm">
                  ${priority}
               </span>

            </div>

            <h5 class="${titleClass}">
               ${task.title}
            </h5>

            ${
               taskStatus !== 'DONE'
                  ? `
                     <p class="text-[11px] text-on-surface-variant line-clamp-2 mb-4 leading-relaxed pointer-events-none">
                        ${task.description || ''}
                     </p>
                  `
                  : ''
            }

            <div class="flex items-center justify-between pt-3 border-t ${topBorder} pointer-events-none">

               <div class="flex items-center gap-2">

                  ${
                     taskStatus !== 'DONE'
                        ? `
                           <img
                              class="w-6 h-6 rounded-full ${
                                 taskStatus === 'IN_PROGRESS'
                                    ? 'border border-primary/20'
                                    : 'border border-slate-100'
                              }"
                              src="https://ui-avatars.com/api/?name=${encodeURIComponent(task.assigned_user_name || 'User')}&background=random"
                           >
                        `
                        : ''
                  }

                  <div class="flex gap-1">

                     <span class="
                        text-[9px]
                        font-bold
                        px-1.5
                        py-0.5
                        rounded

                        ${
                           taskStatus === 'DONE'
                              ? 'bg-green-100/80 text-green-700'
                              : taskStatus === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-50 text-red-600'
                        }
                     ">
                        ${task.type || 'Task'}
                     </span>

                     <span class="
                        text-[9px]
                        font-bold
                        px-1.5
                        py-0.5
                        rounded

                        ${
                           taskStatus === 'IN_PROGRESS'
                              ? 'bg-white/60 text-slate-500 border border-slate-100'
                              : 'bg-slate-100 text-slate-500'
                        }
                     ">
                        ${task.story_points || 0} SP
                     </span>

                        <!-- REMOVE FROM SPRINT -->
                  <!-- REMOVE FROM SPRINT -->
                  <button
                     class="
                        btn-remove-from-sprint
                        w-6
                        h-6
                        flex
                        items-center
                        justify-center
                        rounded-md
                        hover:bg-red-50
                        text-slate-400
                        hover:text-red-600
                        transition-all
                        pointer-events-auto
                     "
                     data-id="${task.id}"
                     onclick="removeTaskFromSprintt(event, ${task.id})"
                     title="Remover da sprint"
                  >

                     <span class="material-symbols-outlined text-[16px]">
                        remove_circle
                     </span>

                  </button>

                  </div>

               </div>

               ${footerRight}

            </div>

         </div>
      `;

   });

   bindDragEvents();

   updateColumnCounters();

}

// =========================
// DRAG EVENTS
// =========================
function bindDragEvents() {

   document.querySelectorAll(".task-card")
      .forEach(card => {

         card.addEventListener(
            "dragstart",
            handleDragStart
         );

         card.addEventListener(
            "dragend",
            handleDragEnd
         );

      });


   document.querySelectorAll(".drop-zone")
      .forEach(zone => {

         zone.addEventListener(
            "dragover",
            handleDragOver
         );

         zone.addEventListener(
            "dragleave",
            handleDragLeave
         );

         zone.addEventListener(
            "drop",
            (e) => {

               const status =
                  zone.dataset.status;

               handleDrop(e, status);

            }
         );

      });

}


// =========================
// DRAG STATE
// =========================
let draggedElement = null;


// =========================
// DRAG START
// =========================
function handleDragStart(e) {

   draggedElement = e.target;

   e.target.classList.add("dragging");

   e.dataTransfer.setData(
      "text/plain",
      e.target.id
   );

   e.dataTransfer.effectAllowed = "move";

}


// =========================
// DRAG END
// =========================
function handleDragEnd(e) {

   e.target.classList.remove("dragging");

   document.querySelectorAll(".drop-zone")
      .forEach(zone => {

         zone.classList.remove("drag-over");

      });

}


// =========================
// DRAG OVER
// =========================
function handleDragOver(e) {

   e.preventDefault();

   e.dataTransfer.dropEffect = "move";

   e.currentTarget.classList.add("drag-over");

}


// =========================
// DRAG LEAVE
// =========================
function handleDragLeave(e) {

   if (!e.currentTarget.contains(e.relatedTarget)) {

      e.currentTarget.classList.remove("drag-over");

   }

}


// =========================
// DROP
// =========================
let isDropping = false;

async function handleDrop(e, status) {

   e.preventDefault();
   e.stopPropagation();

   // =========================
   // PREVENT MULTIPLE DROPS
   // =========================
   if (isDropping) return;

   isDropping = true;

   try {

      const dropZone =
         e.currentTarget;

      dropZone.classList.remove(
         "drag-over"
      );

      const id =
         e.dataTransfer.getData(
            "text/plain"
         );

      const element =
         document.getElementById(id);

      if (!element) {

         console.error(
            "Elemento não encontrado:",
            id
         );

         return;

      }

      const taskId =
         element.dataset.id;

      // =========================
      // MOVE UI
      // =========================
        const list =
        dropZone.querySelector(".task-list");

        if (!list) {

        console.error(
            ".task-list não encontrada",
            dropZone
        );

        return;

        }

        console.log(
        "Elemento movido para:",
        list
        );

        list.appendChild(element);
      console.log(
         "Elemento movido:",
         element
      );

      // =========================
      // STATUS MAP
      // =========================
      let backendStatus = "TODO";

      if (status === "inprogress") {

         backendStatus =
            "IN_PROGRESS";

      }

      if (status === "done") {

         backendStatus =
            "DONE";

      }

      // =========================
      // UPDATE BACKEND
      // =========================
      await updateBoardTaskStatus(
         taskId,
         backendStatus
      );

      // =========================
      // SAVE ORDER
      // =========================
      await saveBoardOrder();

      // =========================
      // UI UPDATE
      // =========================
      updateCardStyle(
         element,
         status
      );

      updateColumnCounters();

      showToast();

      await loadBoard();

      await renderSprintHeader();

   } catch (err) {

      console.error(
         "Erro no drop:",
         err
      );

   } finally {

      setTimeout(() => {

         isDropping = false;

      }, 150);

   }

}



async function renderSprintHeader() {
   const sprint = await getSprintById(sprintId);

   if (!sprint) {

      console.error(
         "Sprint não encontrada"
      );

      return;

   }

   const totalTasks =
      sprint.total_tasks || 0;

   const completedTasks =
      sprint.completed_tasks || 0;

   const progress =
      totalTasks > 0
         ? Math.round(
              (completedTasks / totalTasks) * 100
           )
         : 0;

   // =========================
   // NAME
   // =========================

   document.getElementById(
      "sprint_header_name"
   ).textContent =
      sprint.name;

   // =========================
   // STATUS
   // =========================

   document.getElementById(
      "sprint_header_status"
   ).textContent =
      sprint.status;

   // =========================
   // DATES
   // =========================

   document.getElementById(
      "sprint_header_dates"
   ).textContent =
      `
         ${formatDate(sprint.start_date)}
         -
         ${formatDate(sprint.end_date)}
      `;

   // =========================
   // TASKS
   // =========================

   document.getElementById(
      "sprint_header_total_tasks"
   ).textContent =
      totalTasks;

   document.getElementById(
      "sprint_header_completed_tasks"
   ).textContent =
      `${completedTasks} completed`;

   // =========================
   // PROGRESS
   // =========================

   document.getElementById(
      "sprint_header_progress_bar"
   ).style.width =
      `${progress}%`;

   document.getElementById(
      "sprint_header_progress_text"
   ).textContent =
      `${progress}% Progress`;

   // =========================
   // BUTTON DATA
   // =========================

   document.getElementById(
      "btn-complete-sprint"
   ).dataset.id =
      sprint.id;

   document.getElementById(
      "bt_add_new_task"
   ).dataset.sprintId =
      sprint.id;

}

// =========================
// SAVE ORDER
// =========================
async function saveBoardOrder() {

   const tasks = [];

   document.querySelectorAll(".task-card")
      .forEach((card, index) => {

         tasks.push({
            id: card.dataset.id,
            position: index
         });

      });

   await reorderBoardTasks(tasks);

}


// =========================
// UPDATE CARD STYLE
// =========================
function updateCardStyle(card, status) {

   card.classList.remove(
      'bg-blue-50/70',
      'border-2',
      'border-primary',
      'border-l-[6px]',
      'bg-green-50/40',
      'border-green-100/60'
   );

   const h5 =
      card.querySelector('h5');

   h5.classList.remove(
      'text-primary',
      'text-green-800',
      'line-through'
   );


   if (status === 'inprogress') {

      card.classList.add(
         'bg-blue-50/70',
         'border-2',
         'border-primary',
         'border-l-[6px]'
      );

      h5.classList.add(
         'text-primary'
      );

   }

   if (status === 'done') {

      card.classList.add(
         'bg-green-50/40',
         'border-green-100/60'
      );

      h5.classList.add(
         'text-green-800',
         'line-through'
      );

   }

}


async function completeSprintjs(sprintId) {

   try {

      if (!sprintId) {

         console.error(
            "Sprint ID inválido"
         );

         return;

      }

    const confirmed = await showConfirm({
        title: "Concluir Sprint",
        message: "Esta ação não pode ser desfeita."
    });

    if (!confirmed) return;

    //   const confirmComplete =
    //      confirm(
    //         "Tem certeza que deseja concluir esta sprint?"
    //      );

    //   if (!confirmComplete) return;

      // =========================
      // REQUEST
      // =========================

      await completeSprint(
         sprintId,
         {
            status: "COMPLETED"
         }
      );

      // =========================
      // FEEDBACK
      // =========================

      showToast(
         "Sprint concluída com sucesso"
      );

      window.location.href = "/sprint";
      // alert(
      //    "Sprint concluída com sucesso"
      // );

      // =========================
      // RELOAD
      // =========================

      await loadBoard();

   }

   catch (error) {

      console.error(
         "Erro ao concluir sprint",
         error
      );

      showToast(
         "Erro ao concluir sprint",
         "error"
      );

   }

}



// =========================
// COUNTERS
// =========================
function updateColumnCounters() {

   document.querySelectorAll('.drop-zone')
      .forEach(zone => {

         const count =
            zone.querySelectorAll('.task-card').length;

         const counter =
            zone.querySelector('.column-count');

         if (counter) {

            counter.innerText = count;

         }

      });

}


// =========================
// TOAST
// =========================
function showToast() {

   const toast =
      document.getElementById('toast');

   if (!toast) return;

   toast.classList.remove('hidden');

   toast.classList.add('toast-active');

   setTimeout(() => {

      toast.classList.remove('toast-active');

      toast.classList.add('hidden');

   }, 3000);

}


async function openAddTasksModal() {

   const modal =
      document.getElementById(
         "add_tasks_modal"
      );

   modal.classList.remove("hidden");

   modal.classList.add("flex");

   await loadBacklogTasks();

}

function closeAddTasksModal() {

   const modal =
      document.getElementById(
         "add_tasks_modal"
      );

   modal.classList.add("hidden");

   modal.classList.remove("flex");

   selectedBacklogTasks = [];

}


async function loadBacklogTasks() {

   try {

      const sprintId =
         await getSprintIdFromUrl();

      const sprint = await getSprintById(sprintId);

      const tasks =
         await getBacklogTasks(
            sprint.project_id
         );

      const container =
         document.getElementById(
            "backlog_tasks_container"
         );

      if (!tasks.length) {

         container.innerHTML = `
            <div class="text-center text-slate-400 py-10">
               Nenhuma tarefa no backlog
            </div>
         `;

         return;

      }

      container.innerHTML = "";

      tasks.forEach(task => {

         container.innerHTML += `
            <label class="
               flex
               items-start
               gap-4
               p-4
               rounded-xl
               border
               border-slate-200
               hover:border-primary
               hover:bg-slate-50
               cursor-pointer
               transition-all
            ">

               <input
                  type="checkbox"
                  class="backlog-task-checkbox mt-1"
                  value="${task.id}"
               >

               <div class="flex-1">

                  <div class="flex items-center justify-between mb-1">

                     <h4 class="font-bold text-sm text-slate-800">
                        ${task.title}
                     </h4>

                     <span class="
                        text-[10px]
                        font-bold
                        px-2
                        py-1
                        rounded-full

                        ${
                           task.priority === "HIGH"
                              ? "bg-red-50 text-red-600"
                              : task.priority === "LOW"
                              ? "bg-green-50 text-green-600"
                              : "bg-amber-50 text-amber-600"
                        }
                     ">
                        ${task.priority}
                     </span>

                  </div>

                  <p class="text-xs text-slate-500 mb-3">
                     ${task.description || ""}
                  </p>

                  <div class="flex items-center gap-2">

                     <span class="
                        text-[10px]
                        font-bold
                        px-2
                        py-1
                        rounded-full
                        bg-slate-100
                        text-slate-500
                     ">
                        ${task.story_points || 0} SP
                     </span>

                  </div>

               </div>

            </label>
         `;

      });

   }

   catch (error) {

      console.error(
         "Erro ao carregar backlog",
         error
      );

   }

}


async function getSprintIdFromUrl() {
   const sprintId =
   new URLSearchParams(window.location.search)
      .get("sprintId");

   return sprintId;
}


async function addTasksToSprint() {

   try {

      const sprintId =
         await getSprintIdFromUrl();

      const checkboxes =
         document.querySelectorAll(
            ".backlog-task-checkbox:checked"
         );

      const taskIds =
         [...checkboxes].map(
            item => item.value
         );

      if (!taskIds.length) {

         alert(
            "Selecione pelo menos uma tarefa"
         );

         return;

      }

      for (const taskId of taskIds) {

         await addToSprint(
            taskId,
            {
               sprint_id: sprintId,
               status: "TODO"
            }
         );

      }

      closeAddTasksModal();

      await loadBoard();

      showToast(
         "Tarefas adicionadas à sprint"
      );


   }

   catch (error) {

      console.error(
         "Erro ao adicionar tarefas",
         error
      );

   }

}



// OPEN MODAL
document
   .querySelectorAll(".bt_add_new_task_sprint")
   .forEach(button => {

      button.addEventListener(
         "click",
         openAddTasksModal
      );

   });

// CLOSE
document
   .getElementById(
      "close_add_tasks_modal"
   )
   .addEventListener(
      "click",
      closeAddTasksModal
   );

document
   .getElementById(
      "cancel_add_tasks"
   )
   .addEventListener(
      "click",
      closeAddTasksModal
   );

// CONFIRM
document
   .getElementById(
      "confirm_add_tasks"
   )
   .addEventListener(
      "click",
      addTasksToSprint
   );




 document.getElementById("btn-complete-sprint")
   .addEventListener("click", async function () {
    await completeSprintjs(sprintId);
 });


// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", async () => {

   if (!sprintId) return;
   await loadBoard();

   await renderSprintHeader();

});



window.handleDragOver = handleDragOver;
window.handleDragLeave = handleDragLeave;
window.handleDrop = handleDrop;
window.renderSprintHeader = renderSprintHeader;
window.loadBoard = loadBoard;
window.showToast = showToast;
window.removeTaskFromSprintt = removeTaskFromSprintt;