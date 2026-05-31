import {
  getBacklogTasks,
  getById,
  createTask,
  deleteTask,
  updateTask,
  updateStatus,
  updatePriority,
  reorder
} from "../services/taskService.js";

import {getSprints} from "../services/sprintService.js";

import {
  getProject,
  getProjects,
} from "../services/projectService.js";

const API = "http://localhost:3000/api/tasks";


// =========================
// STATE
// =========================
// let currentProjectId = 1;
let currentProjectId =
   new URLSearchParams(window.location.search)
      .get("projectId");
      
let currentTask = null;
let currentTaskId = null; // null = create | id = edit
let allTasks = [];
let draggedTaskId = null;


const filterProjectSelect = document.getElementById(
   "filter_project_id"
);

const createTaskProjectSelect = document.getElementById(
   "create_task_project_id"
);


// =========================
// GET FORM DATA
// =========================
function getFormData() {
  const title = document.getElementById("title_task").value;
  const description = document.getElementById("description_task").value;
  const user_story = document.getElementById("user_story_task").value;
  const sprint_id = document.getElementById("sprint_task_id").value;

  const status = (document.getElementById("estado_task").value);
  const priority = (document.getElementById("prioridade_task").value);
  const story_points = document.getElementById("story_points_task").value;
  
  const projecto_id = createTaskProjectSelect.value || currentProjectId;


  const acceptance_criteria = getAcceptanceCriteria();

  return {
    title: title || "Sem título",
    story_points: story_points,
    description,
    user_story,
    acceptance_criteria: JSON.stringify(acceptance_criteria),
    status,
    priority,
    sprint_id: sprint_id || null,
    projectId: projecto_id || currentProjectId
  };
}


// =========================
// MAP VALUES UI → DB
// =========================
function mapStatus(label) {
  if (label.includes("Progresso")) return "IN_PROGRESS";
  if (label.includes("Concluído")) return "DONE";
  return "TODO";
}

function mapPriority(label) {
  if (label.includes("Alta")) return "HIGH";
  if (label.includes("Média")) return "MEDIUM";
  return "LOW";
}


// =========================
// GET ACCEPTANCE CRITERIA
// =========================
function getAcceptanceCriteria() {

   const items =
      document.querySelectorAll(
         "#lista_criterio_aceitacao .criteria-item"
      );

   return Array.from(items).map(item => {

      const checkbox =
         item.querySelector(
            'input[type="checkbox"]'
         );

      const textElement =
         item.querySelector(
            ".criteria-text"
         );

      return {

         text:
            textElement.innerText.trim(),

         done:
            checkbox.checked

      };

   });

}


// =========================
// SAVE TASK
// =========================
async function saveTask() {

  if(!document.getElementById("title_task").value)
    return showNotification("Titúlo obrigatótio", "error")

  startSubmit();

  const data = getFormData();

  try {
    let res;

     if (currentTaskId) {
       // UPDATE
       res = updateTask(currentTaskId, data);
     } else {
       // CREATE
       res = createTask(data);
     }

    console.log("Task salva:", res);
    finishSubmit(true);
    // reset
    currentTaskId = null;

    // reload UI
    loadTasks();
    closeDrawer();

  } catch (err) {
    finishSubmit(false);
    console.error("Erro ao salvar task:", err);
  }
}


// {
//     "id": 2,
//     "title": "qfwefe",
//     "description": "",
//     "priority": "MEDIUM",
//     "status": "TODO",
//     "user_story": "",
//     "acceptance_criteria": "",
//     "story_points": 0,
//     "position": 1776626310999,
//     "is_blocked": 0,
//     "project_id": 1,
//     "sprint_id": null,
//     "assigned_to": null,
//     "created_at": "2026-04-19 19:18:30",
//     "updated_at": "2026-04-19 19:18:46"
// }

async function loadTaskToForm(task) {
  document.getElementById("seccao_comment").style.display = "block";
  currentTaskId = task.id;

  console.log(currentTask)

  document.getElementById("story_points_task").value = task.story_points || "";
  document.getElementById("title_task").value = task.title || "";
  console.log(task.title);
  document.getElementById("description_task").value = task.description || "";
  document.getElementById("user_story_task").value = task.user_story || "";

  document.getElementById("sprint_task_id").value = task.sprint_id || "";

  // projeto
  setSelectValue("create_task_project_id", (task.project_id));

  // prioridade
  setSelectValue("prioridade_task", (task.priority));

  // estado
  setSelectValue("estado_task", (task.status));

  // critérios
  renderAcceptanceCriteria(task.acceptance_criteria);

  loadComments(task.id);

  openDrawer();
}


// =========================
// RENDER CRITERIA
// =========================

function renderAcceptanceCriteria11(json) {
  const container = document.getElementById("lista_criterio_aceitacao");

  container.innerHTML = "";

  let items = [];

  try {
    items = JSON.parse(json || "[]");
  } catch {}

  items.forEach(item => {
    container.innerHTML += `
      <label class="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
        <input type="checkbox" ${item.done ? "checked" : ""}>
        <span>${item.text}</span>
      </label>
    `;
  });
}


function renderAcceptanceCriteria(json) {

   const container =
      document.getElementById(
         "lista_criterio_aceitacao"
      );

   container.innerHTML = "";

   let items = [];

   // =========================
   // PARSE JSON
   // =========================

   try {

      items =
         JSON.parse(
            json || "[]"
         );

   } catch {

      items = [];

   }

   // =========================
   // RENDER
   // =========================

   items.forEach((item, index) => {

      container.innerHTML += `
         <div
            class="
               criteria-item
               flex
               items-start
               gap-3
               p-4
               bg-white
               border
               border-slate-200
               rounded-xl
            "
            data-index="${index}"
         >

            <!-- CHECK -->

            <input
               type="checkbox"
               class="mt-1"
               ${item.done ? "checked" : ""}
            >

            <!-- TEXT -->

            <div class="flex-1">

               <span
                  class="
                     criteria-text
                     text-sm
                     text-slate-700
                  "
               >
                  ${item.text}
               </span>

            </div>

            <!-- ACTIONS -->

            <div class="flex items-center gap-2">

               <!-- EDIT -->

               <button
                  type="button"
                  class="
                     btn-edit-criteria
                     w-8
                     h-8
                     flex
                     items-center
                     justify-center
                     rounded-lg
                     hover:bg-blue-50
                     text-slate-400
                     hover:text-blue-600
                     transition-all
                  "
               >

                  <span class="material-symbols-outlined text-[18px]">
                     edit
                  </span>

               </button>

               <!-- REMOVE -->

               <button
                  type="button"
                  class="
                     btn-remove-criteria
                     w-8
                     h-8
                     flex
                     items-center
                     justify-center
                     rounded-lg
                     hover:bg-red-50
                     text-slate-400
                     hover:text-red-600
                     transition-all
                  "
               >

                  <span class="material-symbols-outlined text-[18px]">
                     delete
                  </span>

               </button>

            </div>

         </div>
      `;

   });

   bindCriteriaActions();

}



function reversePriority(p) {
  if (p === "HIGH") return "Alta";
  if (p === "MEDIUM") return "Média";
  return "Baixa";
}

function reverseStatus(s) {
  if (s === "IN_PROGRESS") return "Em Progresso";
  if (s === "DONE") return "Concluído";
  return "A Fazer";
}

function setSelectValue(id, value) {
  const select = document.getElementById(id);

  select.value = value;

  // Array.from(select.options).forEach(opt => {
  //   if (opt.text.includes(value)) opt.selected = true;
  // });
}





// =========================
// LOAD SELECTS
// =========================
async function loadSelects() {
  await Promise.all([
    loadSprints(),
    loadProjects(),
    // loadPriorities(),
    // loadStatus()
  ]);
}


// =========================
// PROJECTS
// =========================
// async function loadProjects() {
//   try {
//     const select = document.getElementById("projeto_id");
//     if(currentProjectId){
//       const projects = await getProject(currentProjectId);
//       console.log(projects)
//       document.getElementById("text_nome_projecto").innerText = projects.name;
//       document.getElementById("projeto_atual_id").innerText = projects.name;
//       select.innerHTML = `
//         <option value="${projects.id}">${projects.name}</option>
//       `
//     }else{
//       const projects = await getProjects();
//       select.innerHTML = projects.map(p => `
//         <option value="${p.id}">${p.name}</option>
//       `).join("");
//     }



//   } catch (err) {
//     console.error("Erro ao carregar projetos:", err);
//   }
// }


/*
|--------------------------------------------------------------------------
| LOAD PROJECTS
|--------------------------------------------------------------------------
*/

export async function loadProjects() {

   try {

      /*
      |--------------------------------------------------------------------------
      | REQUEST
      |--------------------------------------------------------------------------
      */

      const response = await getProjects();

      console.log("PROJECTS RESPONSE:", response);

      /*
      |--------------------------------------------------------------------------
      | NORMALIZE
      |--------------------------------------------------------------------------
      */

      let projects = [];

      if (Array.isArray(response)) {

         projects = response;

      } else if (Array.isArray(response.data)) {

         projects = response.data;

      }

      /*
      |--------------------------------------------------------------------------
      | RESET
      |--------------------------------------------------------------------------
      */

      // filterProjectSelect.innerHTML = `
      //    <option value="">
      //       Projeto: Todos
      //    </option>
      // `;

      createTaskProjectSelect.innerHTML = `
        
      `;

      /*
      |--------------------------------------------------------------------------
      | APPEND OPTIONS
      |--------------------------------------------------------------------------
      */
     
      if(projects.length > 0 && !currentProjectId) {
         currentProjectId = projects[0].id;
         await loadTasks();
      }

      projects.forEach(project => {

         /*
         |--------------------------------------------------------------------------
         | FILTER SELECT
         |--------------------------------------------------------------------------
         */

         const optionFilter =
            document.createElement("option");

         optionFilter.value = project.id;

         optionFilter.textContent = project.name;

         filterProjectSelect.appendChild(optionFilter);

         /*
         |--------------------------------------------------------------------------
         | CREATE TASK PROJECT SELECT
         |--------------------------------------------------------------------------
         */

         const optionCreate =
            document.createElement("option");

         optionCreate.value = project.id;

         optionCreate.textContent = project.name;

         createTaskProjectSelect.appendChild(optionCreate);

      });

      if (currentProjectId) {
         filterProjectSelect.value = currentProjectId;
         // alert("Projetos carregados com sucesso!" + currentProjectId);
      }


   } catch (error) {

      console.error(
         "ERROR LOAD PROJECT SELECTS:",
         error
      );

   }

}

// =========================
// SPRINT
// =========================

async function loadSprints() {
  try {
    const select = document.getElementById("sprint_task_id");
    if(currentProjectId){
      const sprints = await getSprints(currentProjectId);
      select.innerHTML = `
        <option value="">Selecione um sprint</option>
        ${sprints.map(s => `
          <option value="${s.id}">${s.name}</option>
        `).join("")}
      `
    }else{
      const sprints = await getSprints();
      select.innerHTML = `
        <option value="">Selecione um sprint</option>
        ${sprints.map(s => `
          <option value="${s.id}">${s.name}</option>
        `).join("")}
      `
    }
  } catch (err) {
    console.error("Erro ao carregar sprints:", err);
  }
}


// =========================
// PRIORIDADES (FIXO)
// =========================
function loadPriorities() {
  const priorities = ["HIGH", "MEDIUM", "LOW"];

  const select = document.getElementById("prioridade_id");

  select.innerHTML = priorities.map(p => `
    <option value="${p}">${formatLabel(p)}</option>
  `).join("");
}


// =========================
// STATUS (FIXO)
// =========================
function loadStatus() {
  const status = ["TODO", "IN_PROGRESS", "DONE"];

  const select = document.getElementById("estado_id");

  select.innerHTML = status.map(s => `
    <option value="${s}">${formatLabel(s)}</option>
  `).join("");
}


// =========================
// FORMAT LABEL
// =========================
function formatLabel(value) {
  return value
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}


// =========================
// LOAD TASKS
// =========================

function applyFilters() {
  const container = document.querySelector(".space-y-3");

  const prioridade = document.getElementById("prioridade_id").value;
  const estado = document.getElementById("estado_id").value;

  let filtered = [...allTasks];

  console.log("APPLY FILTERS:", { prioridade, estado, search: document.getElementById("search_input").value });
  console.log(filtered)

  const search = document.getElementById("search_input")?.value?.toLowerCase();

  if (search) {
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(search)
    );
  }
  


  // filtro prioridade
  if (prioridade !== "ALL") {
    filtered = filtered.filter(t => t.priority === prioridade);
  }

  // filtro estado
  if (estado !== "ALL") {
    filtered = filtered.filter(t => t.status === estado);
  }

  // métricas
  const total = filtered.length;
  const open = filtered.filter(t => t.status !== "DONE").length;
  const completed = filtered.filter(t => t.status === "DONE").length;

  document.getElementById("total_task").innerText = total;
  document.getElementById("total_task1").innerText = total;
  document.getElementById("open_task").innerText = open;
  document.getElementById("completed_task").innerText = completed;

  // render
  container.innerHTML = filtered.map(task => TaskCard(task)).join("");
}


async function loadTasks() {
  const tasks = await getBacklogTasks(currentProjectId);

  allTasks = tasks;

  applyFilters();
}

// async function loadTasks() {
//   const tasks = await getBacklogTasks(currentProjectId);

//   const container = document.querySelector(".space-y-3");

//   const total = tasks.length;
//   const open = tasks.filter(t => t.status !== "DONE").length;
//   const completed = tasks.filter(t => t.status === "DONE").length;

//   // atualizar HTML
//   document.getElementById("total_task").innerText = total;
//   document.getElementById("total_task1").innerText = total;
//   document.getElementById("open_task").innerText = open;
//   document.getElementById("completed_task").innerText = completed;

//   container.innerHTML = tasks.map(task => TaskCard(task)).join("");
// }


function getPriorityUI(priority) {
  const map = {
    HIGH: {
      color: "text-red-600",
      icon: "priority_high"
    },
    MEDIUM: {
      color: "text-amber-500",
      icon: "report_problem"
    },
    LOW: {
      color: "text-green-600",
      icon: "low_priority"
    }
  };

  return map[priority] || {
    color: "text-slate-400",
    icon: "remove"
  };
}

// =========================
// TASK CARD TEMPLATE
// =========================


function dragStart(event, id) {
  draggedTaskId = id;
}

function dragOver(event) {
  event.preventDefault(); // permite drop
}

async function dropTask(event, targetId) {
  event.preventDefault();

  if (draggedTaskId === targetId) return;

  const container = document.querySelector(".space-y-3");
  const cards = [...container.children];

  // obter ordem atual
  const orderedIds = cards.map(card =>
    parseInt(card.getAttribute("data-id"))
  );

  // remover item arrastado
  const fromIndex = orderedIds.indexOf(draggedTaskId);
  orderedIds.splice(fromIndex, 1);

  // inserir na nova posição
  const toIndex = orderedIds.indexOf(targetId);
  orderedIds.splice(toIndex, 0, draggedTaskId);

  // montar payload
  const payload = orderedIds.map(id => ({ id }));

  // atualizar backend
  await reorder(payload)

  // reload UI
  loadTasks();
}


function handleCardClick(event, id) {
  openTask(id);
}

function TaskCard(task) {

  const prio = getPriorityUI(task.priority);

  return `
  <div 
    onclick="handleCardClick(event, ${task.id})"
    data-id="${task.id}"
    draggable="true"
    ondragstart="dragStart(event, ${task.id})"
    ondragover="dragOver(event)"
    ondrop="dropTask(event, ${task.id})"
    class="task-card bg-white border border-slate-200 rounded-lg p-3 lg:p-4 flex items-center gap-3 lg:gap-4 cursor-pointer transition-all hover:translate-x-1 hover:bg-slate-50 hover:shadow-md">

    <span class="material-symbols-outlined text-slate-300 hidden sm:block">
      drag_indicator
    </span>

    <div title="Story points" class="flex-shrink-0 text-[10px] lg:text-xs font-bold text-slate-500 w-12 lg:w-16">
      ${task.story_points}
    </div>

    <div class="flex-shrink-0">
      <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] lg:text-[10px] font-bold rounded uppercase">
        ${task.status}
      </span>
    </div>

    <div class="flex-1 min-w-0">
      <p class="font-bold text-slate-900 text-xs lg:text-sm truncate">
        ${task.title}
      </p>
    </div>

    <div class="flex items-center gap-2 lg:gap-4">

      <div class="flex items-center gap-1 ${prio.color}">
        <span class="material-symbols-outlined text-base lg:text-lg">
          ${prio.icon}
        </span>
      </div>

      <!-- DELETE (IMPORTANTE: stopPropagation) -->
      <div class="flex items-center gap-1 text-amber-600">
        <span onclick="deleteTaskUI(event, ${task.id})"
          class="material-symbols-outlined text-base lg:text-lg">
          delete
        </span>
      </div>

    </div>
  </div>
  `;
}

// function TaskCard1(task) {

//   return`
//   <div class="bg-white border border-slate-200 rounded-lg p-3 lg:p-4 flex items-center gap-3 lg:gap-4 cursor-pointer transition-all hover:translate-x-1 hover:bg-slate-50 hover:shadow-md">
//                         <span class="material-symbols-outlined text-slate-300 hidden sm:block">drag_indicator</span>
//                         <div class="flex-shrink-0 text-[10px] lg:text-xs font-bold text-slate-500 w-12 lg:w-16">${task.id}</div>
//                         <div class="flex-shrink-0">
//                            <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] lg:text-[10px] font-bold rounded uppercase">${task.status}</span>
//                         </div>
//                         <div class="flex-1 min-w-0" onclick="openTask(${task.id})">
//                            <p class="font-bold text-slate-900 text-xs lg:text-sm truncate">${task.title}</p>
//                         </div>
//                         <div class="flex items-center gap-2 lg:gap-4">
//                           <div class="flex items-center gap-1 text-red-600">
//                               <span class="material-symbols-outlined text-base lg:text-lg">priority_high</span>
//                            </div>
//                             <div class="flex items-center gap-1 text-amber-600">
//                               <span onclick="deleteTaskUI(${task.id})" class="material-symbols-outlined text-base lg:text-lg">delete</span>
//                            </div>
//                            <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
//                               <span class="material-symbols-outlined text-[10px] lg:text-[12px] text-slate-400">person_add</span>
//                            </div>
//                         </div>
//                      </div>
//   `
// }

// =========================
// PRIORITY COLOR
// =========================
function priorityColor(priority) {
  if (priority === "HIGH") return "text-red-600";
  if (priority === "MEDIUM") return "text-amber-600";
  return "text-slate-500";
}


// =========================
// OPEN TASK (DRAWER)
// =========================
async function openTask(id) {
  const tasks = await getById(id);
  // currentTask = tasks.find(t => t.id === id);

  if (!tasks) {
    console.error("Tarefa não encontrada:", id);
    return;
  }

  document.querySelector("#task-drawer h4").innerText = tasks.title;

  document.querySelector("textarea").value = tasks.description || "";

  loadTaskToForm(tasks)

  openDrawer();
}


// =========================
// CREATE TASK
// =========================
async function addTask() {
  const title = prompt("Título da tarefa:");

  if (!title) return;

  await createTask({
    title,
    priority: "MEDIUM",
    projectId: currentProjectId
  });

  loadTasks();
}


// =========================
// DELETE
// =========================
async function deleteTaskUI(event, id) {

    event.stopPropagation(); // 🔥 evita abrir o card

    const confirmed = await showConfirm({
        title: "Eliminar tarefa",
        message: "Esta ação não pode ser desfeita."
    });

    if (!confirmed) return;
    // continua a lógica
    await deleteTask(id);
    console.log("Apagado!");
  loadTasks();
}



// =========================
// UPDATE STATUS
// =========================
async function changeStatus(status) {
  if (!currentTask) return;

  await updateStatus(currentTask.id, status);
  loadTasks();
}


// =========================
// UPDATE PRIORITY
// =========================
async function changePriority(priority) {
  if (!currentTask) return;

  await updatePriority(currentTask.id, priority);
  loadTasks();
}

document.getElementById("bt_add_new_task")
  .addEventListener("click", function () {
    document.querySelector("#task-drawer h4").innerText = "";
    currentTask = null;
    currentTaskId = null; // null = create | id = edit

    document.getElementById("title_task").value = "";
    document.getElementById("description_task").value =  "";
    document.getElementById("user_story_task").value = "";
    document.getElementById("sprint_task_id").value = "";
    document.getElementById("story_points_task").value = "";
    document.getElementById("seccao_comment").style.display = "none";

    const container = document.getElementById("lista_criterio_aceitacao");
    container.innerHTML = "";
    openDrawer();
});


function openDrawer() {
    const drawer = document.getElementById('task-drawer');
    const content = document.getElementById('main-content');
    drawer.classList.remove('hidden-drawer');
             
    if (window.innerWidth >= 1024) {
      content.style.paddingRight = '420px';
    } else {
      document.body.classList.add('overflow-hidden');
    }
}

function closeDrawer() {
  const drawer = document.getElementById('task-drawer');
  const content = document.getElementById('main-content');
  drawer.classList.add('hidden-drawer');
        
  if (window.innerWidth >= 1024) {
    content.style.paddingRight = '32px'; 
  } else {
    document.body.classList.remove('overflow-hidden');
  }
}

function addAccCrit(text = "") {

   const container =
      document.getElementById(
         "lista_criterio_aceitacao"
      );

   const item = `
      <div
         class="
            criteria-item
            flex
            items-start
            gap-3
            p-4
            bg-white
            border
            border-slate-200
            rounded-xl
         "
      >

         <!-- CHECK -->

         <input
            type="checkbox"
            class="mt-1"
         >

         <!-- TEXT -->

         <div class="flex-1">

            <span
               class="
                  criteria-text
                  text-sm
                  text-slate-700
               "
            >
               ${text}
            </span>

         </div>

         <!-- ACTIONS -->

         <div class="flex items-center gap-2">

            <!-- EDIT -->

            <button
               type="button"
               class="
                  btn-edit-criteria
                  w-8
                  h-8
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  hover:bg-blue-50
                  text-slate-400
                  hover:text-blue-600
                  transition-all
               "
            >

               <span class="material-symbols-outlined text-[18px]">
                  edit
               </span>

            </button>

            <!-- REMOVE -->

            <button
               type="button"
               class="
                  btn-remove-criteria
                  w-8
                  h-8
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  hover:bg-red-50
                  text-slate-400
                  hover:text-red-600
                  transition-all
               "
            >

               <span class="material-symbols-outlined text-[18px]">
                  delete
               </span>

            </button>

         </div>

      </div>
   `;

   container.insertAdjacentHTML(
      "afterbegin",
      item
   );

   bindCriteriaActions();

}



         function showAcceptanceCriteriaPanel({
            title = "Adicionar Critérios de Aceitação",
            placeholder = "Ex: Dado que..., Quando..., Então..."
         } = {}) {

            return new Promise((resolve) => {

               // overlay
               const overlay = document.createElement('div');
               overlay.className = `
                     fixed inset-0 z-50 flex items-center justify-center
                     bg-black/50 backdrop-blur-sm
               `;

               // modal
               const modal = document.createElement('div');
               modal.className = `
                     bg-white rounded-xl shadow-lg w-full max-w-lg p-6
                     transform transition-all duration-300 scale-95 opacity-0
               `;

               modal.innerHTML = `
                     <h2 class="text-lg font-semibold mb-3">${title}</h2>

                     <textarea id="criteria-input"
                        class="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="5"
                        placeholder="${placeholder}"></textarea>

                     <div class="flex justify-end gap-3 mt-5">
                        <button id="criteria-cancel"
                           class="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">
                           Cancelar
                        </button>

                        <button id="criteria-save"
                           class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                           Guardar
                        </button>
                     </div>
               `;

               overlay.appendChild(modal);
               document.body.appendChild(overlay);

               const textarea = modal.querySelector('#criteria-input');

               // animação entrada
               setTimeout(() => {
                     modal.classList.remove('scale-95', 'opacity-0');
                     modal.classList.add('scale-100', 'opacity-100');
                     textarea.focus();
               }, 10);

               // handlers
               modal.querySelector('#criteria-save').onclick = () => {
                     const value = textarea.value.trim();

                     if (!value) {
                        textarea.classList.add('border-red-500');
                        textarea.placeholder = "Campo obrigatório...";
                        return;
                     }else{
                        addAccCrit(value);
                     }

                     close(value);
               };

               modal.querySelector('#criteria-cancel').onclick = () => {
                     close(null);
               };

               overlay.onclick = (e) => {
                     if (e.target === overlay) close(null);
               };

               function close(result) {
                     modal.classList.add('scale-95', 'opacity-0');

                     setTimeout(() => {
                        overlay.remove();
                        resolve(result);
                     }, 200);
               }
            });
         }
         
 window.addEventListener('DOMContentLoaded', () => {
    const drawer = document.getElementById('task-drawer');
    drawer.classList.add('hidden-drawer');
    document.getElementById('main-content').style.paddingRight = '32px'; 

    loadTasks();
    loadSelects();
    blindEventListeners();
});


function blindEventListeners() {
  document.getElementById("bt_add_criterio_aceitacao")
  .addEventListener("click", function () {

    showAcceptanceCriteriaPanel()

  });

  document.getElementById("prioridade_id")
    .addEventListener("change", applyFilters);

  document.getElementById("estado_id")
    .addEventListener("change", applyFilters);

  document.getElementById("search_input")
    .addEventListener("keyup", applyFilters); 


  filterProjectSelect.addEventListener("change", async () => {
    currentProjectId = filterProjectSelect.value;
    console.log("Filtrando por projeto: " + currentProjectId);
    await loadTasks();
    applyFilters();
  });
}

  

// =========================
// INIT
// =========================
window.addTask = addTask;
window.deleteTaskUI = deleteTaskUI;
window.openTask = openTask;
window.saveTask = saveTask;
window.changeStatus = changeStatus;
window.changePriority = changePriority;
window.addAccCrit = addAccCrit;
window.handleCardClick = handleCardClick;
window.dragOver  = dragOver;
window.dragStart  = dragStart;
window.dropTask  = dropTask;
window.closeDrawer  = closeDrawer;
window.openDrawer  = openDrawer;


