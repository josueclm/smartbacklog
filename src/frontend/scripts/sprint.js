// sprint.js

import {
   getSprints,
   getSprintById,
   createSprint,
   updateSprint,
   deleteSprint,
   startSprint,
   completeSprint,
   getActiveSprint,
   getSprintMetrics
} from "../services/sprintService.js";
import { getProjects } from "../services/projectService.js";

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/
// let currentProjectId = 1;

let currentProjectId =
   new URLSearchParams(window.location.search)
      .get("projectId");

let sprintToArchive = null;
let editingSprintId = null;
let currentStatusFilter = "ALL";


/*
|--------------------------------------------------------------------------
| ELEMENTS
|--------------------------------------------------------------------------
*/

const sprintListContainer = document.getElementById("sprint_list_container");

const activeSprintContainer = document.getElementById(
   "active_sprint_container"
);

const plannedSprintsContainer = document.getElementById(
   "planned_sprints_container"
);

const completedSprintsContainer = document.getElementById(
   "completed_sprints_container"
);

const recentActivityContainer = document.getElementById(
   "recent_activity_container"
);

const filterProjectSelect = document.getElementById(
   "filter_project_id"
);

const createSprintProjectSelect = document.getElementById(
   "create_sprint_project_id"
);

/*
|--------------------------------------------------------------------------
| MODALS
|--------------------------------------------------------------------------
*/

const createSprintModal = document.getElementById(
   "create_sprint_modal"
);

const archiveSprintModal = document.getElementById(
   "archive_sprint_modal"
);

/*
|--------------------------------------------------------------------------
| CREATE FORM
|--------------------------------------------------------------------------
*/

const createSprintProjectId = document.getElementById(
   "create_sprint_project_id"
);

const createSprintName = document.getElementById(
   "create_sprint_name"
);

const createSprintStartDate = document.getElementById(
   "create_sprint_start_date"
);

const createSprintEndDate = document.getElementById(
   "create_sprint_end_date"
);

const createSprintGoal = document.getElementById(
   "create_sprint_goal"
);

const copyTasks = document.getElementById("copy_tasks");
const copyMembers = document.getElementById("copy_members");
const copyEstimatives = document.getElementById("copy_estimatives");

/*
|--------------------------------------------------------------------------
| BUTTONS
|--------------------------------------------------------------------------
*/

const btnOpenCreateSprintModal = document.getElementById(
   "btn_open_create_sprint_modal"
);

const btnOpenCreateSprintModalBottom = document.getElementById(
   "btn_open_create_sprint_modal_bottom"
);

const btnCloseCreateSprintModal = document.getElementById(
   "btn_close_create_sprint_modal"
);

const btnCancelCreateSprint = document.getElementById(
   "btn_cancel_create_sprint"
);

const btnCreateSprint = document.getElementById(
   "btn_create_sprint"
);

const btnCancelArchive = document.getElementById(
   "btn_cancel_archive"
);

const btnConfirmArchive = document.getElementById(
   "btn_confirm_archive"
);






/*
|--------------------------------------------------------------------------
| FILTER ELEMENTS
|--------------------------------------------------------------------------
*/

function initElements() {

   return {

      searchInput:
         document.getElementById( "search_input"),

      filterProjectId:
         document.getElementById("filter_project_id"),

      filterTeamId:
         document.getElementById("filter_team_id"),

      filterOrderBy:
         document.getElementById("filter_order_by"),

      filterButtons:
         document.querySelectorAll(".sprint-filter-btn")

   };

}

/*
|--------------------------------------------------------------------------
| INIT FILTERS
|--------------------------------------------------------------------------
*/

function initSprintFilters() {
  const elements = initElements();

  
   /*
   |--------------------------------------------------------------------------
   | STATUS BUTTONS
   |--------------------------------------------------------------------------
   */

   elements.filterButtons.forEach(button => {

      button.addEventListener("click", () => {

         currentStatusFilter =
            button.dataset.status;

         updateFilterButtons();

         applySprintFilters();

      });

   });

   /*
   |--------------------------------------------------------------------------
   | SEARCH
   |--------------------------------------------------------------------------
   */

   elements.searchInput.addEventListener(
      "input",
      debounce(applySprintFilters, 300)
   );

   /*
   |--------------------------------------------------------------------------
   | PROJECT
   |--------------------------------------------------------------------------
   */

   function changeProject(id) {
      currentProjectId = id;
      getSprints(currentProjectId);
      applySprintFilters();
   }

   elements.filterProjectId.addEventListener(
      "change",
      (e) => changeProject(e.target.value)  
   );

   /*
   |--------------------------------------------------------------------------
   | TEAM
   |--------------------------------------------------------------------------
   */

   elements.filterTeamId.addEventListener(
      "change",
      applySprintFilters
   );

   /*
   |--------------------------------------------------------------------------
   | ORDER
   |--------------------------------------------------------------------------
   */

   elements.filterOrderBy.addEventListener(
      "change",
      applySprintFilters
   );

}

/*
|--------------------------------------------------------------------------
| UPDATE ACTIVE FILTER BUTTON
|--------------------------------------------------------------------------
*/

function updateFilterButtons() {

   const elements = initElements();

   elements.filterButtons.forEach(button => {

      button.classList.remove(
         "bg-surface-container-lowest",
         "text-primary",
         "shadow-sm",
         "font-semibold"
      );

      button.classList.add(
         "text-on-surface-variant",
         "font-medium"
      );

      if (
         button.dataset.status ===
         currentStatusFilter
      ) {

         button.classList.add(
            "bg-surface-container-lowest",
            "text-primary",
            "shadow-sm",
            "font-semibold"
         );

         button.classList.remove(
            "text-on-surface-variant",
            "font-medium"
         );

      }

   });

}

/*
|--------------------------------------------------------------------------
| APPLY FILTERS
|--------------------------------------------------------------------------
*/

async function applySprintFilters() {
   const elements = initElements();
   try {
      /*
      |--------------------------------------------------------------------------
      | GET VALUES
      |--------------------------------------------------------------------------
      */

      let search = "";
      if ( elements.searchInput.value) {
        search = elements.searchInput.value.trim().toLowerCase();
      }
      const projectId =
         elements.filterProjectId.value;

      const teamId =
         elements.filterTeamId.value;

      const orderBy =
         elements.filterOrderBy.value;

      /*
      |--------------------------------------------------------------------------
      | LOAD ALL
      |--------------------------------------------------------------------------
      */

      let response = await getSprints(currentProjectId);

      let sprints =
         response.data || response || [];

      /*
      |--------------------------------------------------------------------------
      | STATUS FILTER
      |--------------------------------------------------------------------------
      */

      if (currentStatusFilter !== "ALL") {

         sprints = sprints.filter(sprint =>
            sprint.status === currentStatusFilter
         );

      }

      /*
      |--------------------------------------------------------------------------
      | PROJECT FILTER
      |--------------------------------------------------------------------------
      */

      if (projectId) {

         sprints = sprints.filter(sprint =>
            String(sprint.project_id) ===
            String(projectId)
         );

      }

      /*
      |--------------------------------------------------------------------------
      | TEAM FILTER
      |--------------------------------------------------------------------------
      */

      if (teamId) {

         sprints = sprints.filter(sprint =>
            String(sprint.team_id) ===
            String(teamId)
         );

      }

      /*
      |--------------------------------------------------------------------------
      | SEARCH FILTER
      |--------------------------------------------------------------------------
      */

      if (search) {

         sprints = sprints.filter(sprint => {

            return (
               sprint.name?.toLowerCase()
                  .includes(search)

               ||

               sprint.goal?.toLowerCase()
                  .includes(search)

               ||

               sprint.project_name?.toLowerCase()
                  .includes(search)
            );

         });

      }

      /*
      |--------------------------------------------------------------------------
      | ORDERING
      |--------------------------------------------------------------------------
      */

      switch (orderBy) {

         case "ACTIVE_FIRST":

            sprints.sort((a, b) => {

               if (
                  a.status === "ACTIVE" &&
                  b.status !== "ACTIVE"
               ) return -1;

               if (
                  a.status !== "ACTIVE" &&
                  b.status === "ACTIVE"
               ) return 1;

               return 0;

            });

         break;

         case "DATE_DESC":

            sprints.sort((a, b) =>
               new Date(b.created_at) -
               new Date(a.created_at)
            );

         break;

         case "DATE_ASC":

            sprints.sort((a, b) =>
               new Date(a.created_at) -
               new Date(b.created_at)
            );

         break;

         case "NAME_ASC":

            sprints.sort((a, b) =>
               a.name.localeCompare(b.name)
            );

         break;

      }

      /*
      |--------------------------------------------------------------------------
      | RENDER
      |--------------------------------------------------------------------------
      */
      await loadSprints();

      renderSprintList(sprints);


   } catch (error) {

      console.error(
         "Erro ao aplicar filtros:",
         error
      );

   }

}

/*
|--------------------------------------------------------------------------
| DEBOUNCE
|--------------------------------------------------------------------------
*/

function debounce(callback, delay = 300) {

   let timeout;

   return (...args) => {

      clearTimeout(timeout);

      timeout = setTimeout(() => {

         callback(...args);

      }, delay);

   };

}



/*
|--------------------------------------------------------------------------
| LOAD
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| LOAD TEAMS FILTER
|--------------------------------------------------------------------------
*/

async function loadTeamsFilter() {

   try {

      /*
      |--------------------------------------------------------------------------
      | GET SELECT
      |--------------------------------------------------------------------------
      */

      const select =
         document.getElementById(
            "filter_team_id"
         );

      if (!select) return;

      /*
      |--------------------------------------------------------------------------
      | RESET
      |--------------------------------------------------------------------------
      */

      select.innerHTML = `
         <option value="">
            Equipa: Todas
         </option>
      `;

      /*
      |--------------------------------------------------------------------------
      | REQUEST
      |--------------------------------------------------------------------------
      */

      const response = await getTeams();

      const teams =
         response.data || response || [];

      /*
      |--------------------------------------------------------------------------
      | APPEND OPTIONS
      |--------------------------------------------------------------------------
      */

      teams.forEach(team => {

         const option =
            document.createElement("option");

         option.value = team.id;

         option.textContent =
            team.name;

         select.appendChild(option);

      });

   } catch (error) {

      console.error(
         "Erro ao carregar equipas:",
         error
      );

   }

}

/*
|--------------------------------------------------------------------------
| LOAD PROJECTS
|--------------------------------------------------------------------------
*/

export async function loadProjectsSelects() {

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

      createSprintProjectSelect.innerHTML = `
         <option value="">
            Selecione o projeto
         </option>
      `;

      /*
      |--------------------------------------------------------------------------
      | APPEND OPTIONS
      |--------------------------------------------------------------------------
      */
     
      if(projects.length > 0 && !currentProjectId) {
         currentProjectId = projects[0].id;
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
         | CREATE SPRINT SELECT
         |--------------------------------------------------------------------------
         */

         const optionCreate =
            document.createElement("option");

         optionCreate.value = project.id;

         optionCreate.textContent = project.name;

         createSprintProjectSelect.appendChild(optionCreate);

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

async function loadSprints() {

   try {

      const response = await getSprints(currentProjectId);

      const sprints = response?.data || response || [];

      renderSprintList(sprints);

      renderActiveSprint(sprints);

      renderPlannedSprints(sprints);

      renderCompletedSprints(sprints);

   } catch (error) {

      console.error(error);

      alert("Erro ao carregar sprints");

   }

}

/*
|--------------------------------------------------------------------------
| RENDER ACTIVE
|--------------------------------------------------------------------------
*/

function renderActiveSprint(sprints = []) {

   const sprint = sprints.find(
      item => item.status === "ACTIVE"
   );

   /*
   |--------------------------------------------------------------------------
   | EMPTY
   |--------------------------------------------------------------------------
   */

   if (!sprint) {

      activeSprintContainer.innerHTML = `
         <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-10 text-center">

            <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">
               sprint
            </span>

            <h3 class="text-lg font-bold text-slate-700 mb-2">
               Nenhuma sprint ativa
            </h3>

            <p class="text-sm text-slate-400">
               Crie ou inicie uma sprint para acompanhar o progresso.
            </p>

         </div>
      `;

      return;

   }

   /*
   |--------------------------------------------------------------------------
   | METRICS
   |--------------------------------------------------------------------------
   */

   const totalTasks =
      sprint.total_tasks || 0;

   const completedTasks =
      sprint.completed_tasks || 0;

   const inProgressTasks =
      sprint.in_progress_tasks || 0;

   const delayedTasks =
      sprint.delayed_tasks || 0;

   const storyPoints =
      sprint.story_points || 0;

   const capacity =
      sprint.capacity || 0;

   const progress =
      totalTasks > 0
         ? Math.round(
            (completedTasks / totalTasks) * 100
         )
         : 0;

   /*
   |--------------------------------------------------------------------------
   | RENDER
   |--------------------------------------------------------------------------
   */

   activeSprintContainer.innerHTML = `

      <section class="bg-surface-container-lowest rounded-xl border-2 border-primary/20 ambient-shadow relative overflow-hidden group">

         <div class="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>

         <div class="p-8">

            <!-- HEADER -->
            <div class="flex justify-between items-start mb-8">

               <div>

                  <div class="flex items-center gap-3 mb-2">

                     <h3 class="text-2xl font-headline font-extrabold text-on-surface">
                        ${sprint.name}
                     </h3>

                     <span class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-extrabold tracking-widest rounded-full border border-primary/20">
                        ACTIVE
                     </span>

                  </div>

                  <div class="flex items-center gap-2 text-on-surface-variant text-sm font-medium">

                     <span class="material-symbols-outlined text-sm">
                        calendar_month
                     </span>

                     <span>
                        ${formatDate(sprint.start_date)}
                        -
                        ${formatDate(sprint.end_date)}
                     </span>

                  </div>

               </div>


            </div>

            <!-- PROGRESS -->
            <div class="bg-surface-container-low/50 rounded-xl p-6 border border-outline-variant/10 mb-8">

               <div class="flex justify-between items-end mb-4">

                  <div>

                     <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Status do Progresso
                     </p>

                     <span class="text-sm font-semibold text-on-surface">
                        ${completedTasks} / ${totalTasks} tarefas concluídas
                     </span>

                  </div>

                  <div class="text-right">

                     <span class="text-2xl font-headline font-extrabold text-primary">
                        ${progress}%
                     </span>

                  </div>

               </div>

               <div class="h-3 w-full bg-surface-container rounded-full overflow-hidden">

                  <div
                     class="h-full bg-primary rounded-full transition-all duration-500"
                     style="width: ${progress}%"
                  ></div>

               </div>

            </div>

            <!-- METRICS -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

               <div class="flex flex-col p-2">

                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                     Em progresso
                  </span>

                  <span class="text-lg font-headline font-bold text-on-surface">
                     ${inProgressTasks}
                  </span>

               </div>

               <div class="flex flex-col p-2">

                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                     Concluídas
                  </span>

                  <span class="text-lg font-headline font-bold text-success">
                     ${completedTasks}
                  </span>

               </div>

               <div class="flex flex-col p-2">

                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                     Atrasadas
                  </span>

                  <span class="text-lg font-headline font-bold text-error">
                     ${delayedTasks}
                  </span>

               </div>

               <div class="flex flex-col p-2">

                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                     Story Points
                  </span>

                  <span class="text-lg font-headline font-bold text-on-surface">
                     ${storyPoints}
                  </span>

               </div>

               <div class="flex flex-col p-2">

                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                     Capacidade
                  </span>

                  <span class="text-lg font-headline font-bold text-primary">
                     ${capacity}
                  </span>

               </div>

            </div>


            
               <!-- ACTIONS -->
               <div class="flex items-center gap-3">

                  <button
                     onclick="window.location.href = '../board?sprintId=${sprint.id}'"
                     class="btn-open-board bg-primary text-on-primary px-5 py-2.5 rounded-lg font-headline font-bold text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                     data-id="${sprint.id}"
                  >
                     <span class="material-symbols-outlined text-lg">
                        grid_view
                     </span>

                     <span>
                        Abrir Board
                     </span>
                  </button>

                  <button
                     class="btn-edit-sprint border border-outline-variant text-on-surface hover:bg-slate-50 px-5 py-2.5 rounded-lg font-headline font-bold text-sm transition-all flex items-center gap-2"
                     data-id="${sprint.id}"
                  >
                     <span class="material-symbols-outlined text-lg">
                        edit
                     </span>

                     <span>
                        Editar
                     </span>
                  </button>

                  <button
                     class="btn-complete-sprint px-5 py-2.5 rounded-lg font-headline font-bold text-sm transition-all flex items-center gap-2 bg-surface-container text-on-surface-variant hover:bg-slate-200"
                     data-id="${sprint.id}"
                  >
                     <span class="material-symbols-outlined text-lg">
                        check_circle
                     </span>

                     <span>
                        Concluir
                     </span>
                  </button>

               </div>

         </div>

      </section>
   `;

   /*
   |--------------------------------------------------------------------------
   | EVENTS
   |--------------------------------------------------------------------------
   */

   bindSprintActions();

}

/*
|--------------------------------------------------------------------------
| RENDER LIST
|--------------------------------------------------------------------------
*/

function renderSprintList(sprints = []) {

   const html = sprints.map(sprint => {

      return `
         <div
            class="grid grid-cols-12 items-center px-6 py-4 border-b border-outline-variant/5 hover:bg-slate-50 transition-colors"
         >

            <div class="col-span-1">

               <span class="material-symbols-outlined text-slate-300 text-lg">
                  drag_indicator
               </span>

            </div>

            <div class="col-span-4">

               <span class="font-bold text-sm text-on-surface">
                  ${sprint.name}
               </span>

            </div>

            <div class="col-span-3">

               <span class="
                  px-2 py-1 rounded-full text-[10px] font-bold
                  ${getStatusClass(sprint.status)}
               ">
                  ${sprint.status}
               </span>

            </div>

            <div class="col-span-2 text-xs text-on-surface-variant font-medium">

               ${formatDate(sprint.start_date)}

            </div>

            <div class="col-span-2 flex justify-end gap-2">

               <button
                  class="btn-edit-sprint p-2 hover:bg-slate-100 rounded-lg"
                  data-id="${sprint.id}"
               >
                  <span class="material-symbols-outlined text-lg">
                     edit
                  </span>
               </button>

               <button
                  class="btn-delete-sprint p-2 hover:bg-red-50 rounded-lg text-red-500"
                  data-id="${sprint.id}"
               >
                  <span class="material-symbols-outlined text-lg">
                     delete
                  </span>
               </button>

            </div>

         </div>
      `;

   }).join("");

   sprintListContainer.innerHTML = `
      <div class="grid grid-cols-12 items-center px-6 py-3 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/50">

         <div class="col-span-1"></div>

         <div class="col-span-4">
            Sprint
         </div>

         <div class="col-span-3">
            Status
         </div>

         <div class="col-span-2">
            Período
         </div>

         <div class="col-span-2 text-right">
            Ações
         </div>

      </div>

      ${html}
   `;

   bindSprintActions();

}

/*
|--------------------------------------------------------------------------
| PLANNED
|--------------------------------------------------------------------------
*/

function renderPlannedSprints(sprints = []) {

   const planned = sprints.filter(
      item => item.status === "PLANNED"
   );

   plannedSprintsContainer.innerHTML = planned.map(sprint => {

      return `
         <article class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 ambient-shadow p-6">

            <div class="flex justify-between items-start mb-4">

               <span class="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-extrabold tracking-widest rounded-full uppercase">
                  Planned
               </span>

            </div>

            <h4 class="text-lg font-headline font-bold text-on-surface mb-1">
               ${sprint.name}
            </h4>

            <div class="flex items-center gap-2 text-slate-500 text-xs font-medium mb-6">

               <span class="material-symbols-outlined text-sm">
                  event
               </span>

               <span>
                  ${formatDate(sprint.start_date)}
               </span>

            </div>

            <button
               class="btn-start-sprint w-full border-2 border-primary/20 text-primary hover:bg-primary hover:text-white px-4 py-2.5 rounded-lg font-headline font-bold text-xs transition-all duration-200"
               data-id="${sprint.id}"
            >
               Iniciar Sprint
            </button>

         </article>
      `;

   }).join("");

   bindSprintActions();

}

/*
|--------------------------------------------------------------------------
| COMPLETED
|--------------------------------------------------------------------------
*/

function renderCompletedSprints(sprints = []) {

   const completed = sprints.filter(
      item => item.status === "COMPLETED"
   );

   completedSprintsContainer.innerHTML = completed.map(sprint => {

      return `
         <article class="bg-white rounded-xl border border-emerald-100 ambient-shadow p-6">

            <div class="flex justify-between items-start mb-4">

               <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-extrabold tracking-widest rounded-full uppercase">
                  Completed
               </span>

            </div>

            <h4 class="text-lg font-headline font-bold text-on-surface mb-1">
               ${sprint.name}
            </h4>

            <div class="flex items-center gap-2 text-slate-500 text-xs font-medium">

               <span class="material-symbols-outlined text-sm">
                  history
               </span>

               <span>
                  ${formatDate(sprint.end_date)}
               </span>

            </div>

         </article>
      `;

   }).join("");

}


/*
|--------------------------------------------------------------------------
| CREATE OR UPDATE
|--------------------------------------------------------------------------
*/

async function handleCreateSprint() {

    if(!createSprintName.value)
      return showNotification("Nome obrigatótio", "error")
    if(!createSprintProjectId.value)
      return showNotification("Projecto obrigatório", "error")
    
   try {

      /*
      |--------------------------------------------------------------------------
      | PAYLOAD
      |--------------------------------------------------------------------------
      */

      const payload = {

         name: createSprintName.value,

         project_id: createSprintProjectId.value,

         start_date: createSprintStartDate.value,

         end_date: createSprintEndDate.value,

         goal: createSprintGoal.value,

         copyTasks: copyTasks.checked,

         copyMembers: copyMembers.checked,

         copyEstimatives: copyEstimatives.checked

      };

      console.log("PAYLOAD:", payload);

      /*
      |--------------------------------------------------------------------------
      | UPDATE
      |--------------------------------------------------------------------------
      */

      if (editingSprintId) {

         await updateSprint(
            editingSprintId,
            payload
         );

      }

      /*
      |--------------------------------------------------------------------------
      | CREATE
      |--------------------------------------------------------------------------
      */

      else {

         await createSprint(payload);

      }

      /*
      |--------------------------------------------------------------------------
      | RESET
      |--------------------------------------------------------------------------
      */

      resetSprintForm();

      /*
      |--------------------------------------------------------------------------
      | CLOSE
      |--------------------------------------------------------------------------
      */

      closeCreateModal();

      /*
      |--------------------------------------------------------------------------
      | RELOAD
      |--------------------------------------------------------------------------
      */

      await loadSprints();

   } catch (error) {

      console.error(error);

      alert("Erro ao salvar sprint");

   }

}


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

async function confirmArchiveSprint() {

   if (!sprintToArchive) return;

   try {

      await deleteSprint(sprintToArchive);

      closeArchiveModal();

      await loadSprints();

   } catch (error) {

      console.error(error);

      alert("Erro ao arquivar sprint");

   }

}

/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/

function bindSprintActions() {


     /*
   |--------------------------------------------------------------------------
   | EDIT
   |--------------------------------------------------------------------------
   */

   document.querySelectorAll(".btn-edit-sprint")
      .forEach(button => {

         button.onclick = async () => {

            try {

               const sprintId = button.dataset.id;

               await openEditSprint(sprintId);

            } catch (error) {

               console.error(error);

               alert("Erro ao carregar sprint");

            }

         };

      });


   /*
   |--------------------------------------------------------------------------
   | DELETE
   |--------------------------------------------------------------------------
   */

   document.querySelectorAll(".btn-delete-sprint")
      .forEach(button => {

         button.onclick = () => {

            sprintToArchive = button.dataset.id;

            openArchiveModal();

         };

      });

   /*
   |--------------------------------------------------------------------------
   | START
   |--------------------------------------------------------------------------
   */

   document.querySelectorAll(".btn-start-sprint")
      .forEach(button => {

         button.onclick = async () => {

            try {

               await startSprint(button.dataset.id);

               await loadSprints();

            } catch (error) {

               console.error(error);

            }

         };

      });

   /*
   |--------------------------------------------------------------------------
   | COMPLETE
   |--------------------------------------------------------------------------
   */

   document.querySelectorAll(".btn-complete-sprint")
      .forEach(button => {

         button.onclick = async () => {

            try {

               await completeSprint(button.dataset.id);

               await loadSprints();

            } catch (error) {

               console.error(error);

            }

         };

      });

}



async function openEditSprint(id) {

   try {

      /*
      |--------------------------------------------------------------------------
      | GET SPRINT
      |--------------------------------------------------------------------------
      */

      const response = await getSprintById(id);

      console.log("SPRINT:", response);

      const sprint = response.data || response;

      /*
      |--------------------------------------------------------------------------
      | SAVE EDIT ID
      |--------------------------------------------------------------------------
      */

      editingSprintId = sprint.id;

      /*
      |--------------------------------------------------------------------------
      | CHANGE TITLE
      |--------------------------------------------------------------------------
      */

      document.querySelector(
         "#create_sprint_modal h3"
      ).innerText = "Editar Sprint";

      /*
      |--------------------------------------------------------------------------
      | FILL FORM
      |--------------------------------------------------------------------------
      */

      createSprintProjectId.value =
         sprint.project_id || "";

      createSprintName.value =
         sprint.name || "";

      createSprintStartDate.value =
         sprint.start_date || "";

      createSprintEndDate.value =
         sprint.end_date || "";

      createSprintGoal.value =
         sprint.goal || "";

      /*
      |--------------------------------------------------------------------------
      | BUTTON TEXT
      |--------------------------------------------------------------------------
      */

      btnCreateSprint.innerText = "Salvar Alterações";

      /*
      |--------------------------------------------------------------------------
      | OPEN MODAL
      |--------------------------------------------------------------------------
      */

      openCreateModal();

   } catch (error) {

      console.error(error);

   }

}



/*
|--------------------------------------------------------------------------
| MODALS
|--------------------------------------------------------------------------
*/

function openCreateModal() {

   createSprintModal.classList.remove("hidden");

   createSprintModal.classList.add("flex");

}

function closeCreateModal() {

   createSprintModal.classList.remove("flex");

   createSprintModal.classList.add("hidden");

   resetSprintForm();

}

function openArchiveModal() {

   archiveSprintModal.classList.remove("hidden");

   archiveSprintModal.classList.add("flex");

}

function closeArchiveModal() {

   archiveSprintModal.classList.remove("flex");

   archiveSprintModal.classList.add("hidden");

}

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function resetCreateForm() {

   createSprintProjectId.value = "";

   createSprintName.value = "";

   createSprintStartDate.value = "";

   createSprintEndDate.value = "";

   createSprintGoal.value = "";

   copyTasks.checked = true;

   copyMembers.checked = false;

   copyEstimatives.checked = false;

}

function resetSprintForm() {

   editingSprintId = null;

   /*
   |--------------------------------------------------------------------------
   | RESET TITLE
   |--------------------------------------------------------------------------
   */

   document.querySelector(
      "#create_sprint_modal h3"
   ).innerText = "Nova Sprint";

   /*
   |--------------------------------------------------------------------------
   | RESET BUTTON
   |--------------------------------------------------------------------------
   */

   btnCreateSprint.innerText = "Criar Sprint";

   /*
   |--------------------------------------------------------------------------
   | RESET FIELDS
   |--------------------------------------------------------------------------
   */

   createSprintProjectId.value = "";

   createSprintName.value = "";

   createSprintStartDate.value = "";

   createSprintEndDate.value = "";

   createSprintGoal.value = "";

   copyTasks.checked = true;

   copyMembers.checked = false;

   copyEstimatives.checked = false;

}

function getStatusClass(status) {

   switch (status) {

      case "ACTIVE":
         return "bg-blue-100 text-blue-700";

      case "PLANNED":
         return "bg-amber-100 text-amber-700";

      case "COMPLETED":
         return "bg-emerald-100 text-emerald-700";

      default:
         return "bg-slate-100 text-slate-700";

   }

}

/*
|--------------------------------------------------------------------------
| EVENTS
|--------------------------------------------------------------------------
*/

function bindEvents() {

   /*
   |--------------------------------------------------------------------------
   | CREATE MODAL
   |--------------------------------------------------------------------------
   */

   btnOpenCreateSprintModal?.addEventListener("click", openCreateModal);

   btnOpenCreateSprintModalBottom?.addEventListener(
      "click",
      openCreateModal
   );

   btnCloseCreateSprintModal?.addEventListener(
      "click",
      closeCreateModal
   );

   btnCancelCreateSprint?.addEventListener(
      "click",
      closeCreateModal
   );

   btnCreateSprint?.addEventListener(
      "click",
      handleCreateSprint
   );
 
   /*
   |--------------------------------------------------------------------------
   | ARCHIVE MODAL
   |--------------------------------------------------------------------------
   */

   btnCancelArchive?.addEventListener(
      "click",
      closeArchiveModal
   );

   btnConfirmArchive?.addEventListener(
      "click",
      confirmArchiveSprint
   );

}

function bindOpenBoardButtons() {
   return true;

   document.querySelectorAll(".btn-open-board")
      .forEach(btn => {

         btn.addEventListener("click", () => {

            const sprintId =
               btn.dataset.id;

            window.location.href =
               `../board?sprintId=${sprintId}`;

         });

      });

}

   /*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/


// document.addEventListener("DOMContentLoaded", async () => {

//    bindEvents();
//    await loadSprints();
//    await loadProjectsSelects();
//    initSprintFilters();
// });


window.addEventListener(
   "layout-loaded",
   async () => {
      bindEvents();
      await loadProjectsSelects();
      await loadSprints();
      bindOpenBoardButtons();
      //await loadTeamsFilter();
      initSprintFilters();
   }
);