import {

   getProjects,
   getProject,
   createProject,
   updateProject,
   deleteProject

} from "../services/projectService.js";


// =========================
// ELEMENTS
// =========================

const projectsContainer =
   document.getElementById(
      "projects_container"
   );

const projectModal =
   document.getElementById(
      "project_modal"
   );

const projectForm =
   document.getElementById(
      "project_form"
   );

const btnAddProject =
   document.getElementById(
      "btn_add_project"
   );


// =========================
// INIT
// =========================

document.addEventListener(
   "DOMContentLoaded",
   async () => {

      bindEvents();

      await loadProjects();

   }
);


// =========================
// EVENTS
// =========================

function bindEvents() {

   btnAddProject.addEventListener(
      "click",
      openCreateModal
   );

   document
      .getElementById(
         "btn_close_project_modal"
      )
      .addEventListener(
         "click",
         closeModal
      );

   projectForm.addEventListener(
      "submit",
      handleSubmitProject
   );

}


// =========================
// LOAD PROJECTS
// =========================

async function loadProjects() {

   try {

      const projects =
         await getProjects();

      renderProjects(projects);

   } catch (error) {

      console.error(error);

   }

}


// =========================
// RENDER
// =========================

function renderProjects(projects = []) {

   projectsContainer.innerHTML = "";

   projects.forEach(project => {

      const progress =
         Math.floor(
            Math.random() * 100
         );

      projectsContainer.innerHTML += `
         <div
            class="
               bg-white
               rounded-2xl
               p-6
               border
               border-outline-variant/15
               shadow-sm
               hover:shadow-xl
               hover:shadow-primary/5
               transition-all
               group
               relative
            "
         >

            <div class="flex justify-between items-start mb-4">

               <div class="space-y-1.5">

                  <div class="flex items-center gap-2">

                     <h4 class="font-bold text-on-surface group-hover:text-primary transition-colors">
                        ${project.name}
                     </h4>

                  </div>

                  <span class="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                     Active
                  </span>

               </div>

               <div class="flex items-center gap-1">

                  <button
                     class="btn-edit-project text-slate-500 hover:text-primary"
                     data-id="${project.id}"
                  >
                     <span class="material-symbols-outlined">
                        edit
                     </span>
                  </button>

                  <button
                     class="btn-delete-project text-red-500"
                     data-id="${project.id}"
                  >
                     <span class="material-symbols-outlined">
                        delete
                     </span>
                  </button>

               </div>

            </div>

            <p class="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mb-6">
               ${project.description || ''}
            </p>

            <div class="space-y-2 mb-6">

               <div class="flex justify-between text-[11px] font-bold">

                  <span class="text-on-surface-variant/70 uppercase">
                     Progress
                  </span>

                  <span class="text-primary">
                     ${progress}%
                  </span>

               </div>

               <div class="w-full bg-surface-container-low h-3 rounded-full overflow-hidden border border-outline-variant/10">

                  <div
                     class="bg-primary h-full rounded-full transition-all"
                     style="width: ${progress}%"
                  ></div>

               </div>

            </div>

            <div class="grid grid-cols-3 gap-1 py-3 border-y border-outline-variant/10 mb-6">

               <div class="text-center">

                  <span class="text-[11px] font-bold text-on-surface">
                     ${project.tasks_count || 0}
                  </span>

                  <p class="text-[9px] text-on-surface-variant uppercase">
                     Tasks
                  </p>

               </div>

               <div class="text-center border-x border-outline-variant/10">

                  <span class="text-[11px] font-bold text-on-surface">
                     ${project.members_count || 0}
                  </span>

                  <p class="text-[9px] text-on-surface-variant uppercase">
                     Members
                  </p>

               </div>

               <div class="text-center">

                  <span class="text-[11px] font-bold text-on-surface">
                     ${project.id}
                  </span>

                  <p class="text-[9px] text-on-surface-variant uppercase">
                     ID
                  </p>

               </div>

            </div>

            <button
               class="
                  btn-open-project
                  w-full
                  py-3
                  bg-primary
                  text-white
                  text-xs
                  font-bold
                  rounded-xl
                  shadow-md
                  hover:bg-primary-container
                  transition-all
               "
               data-id="${project.id}"
            >
               Open Board
            </button>

         </div>
      `;

   });

   bindProjectActions();

}


// =========================
// ACTIONS
// =========================

function bindProjectActions() {

   document
      .querySelectorAll(".btn-edit-project")
      .forEach(button => {

         button.addEventListener(
            "click",
            async function () {

               await openEditModal(
                  this.dataset.id
               );

            }
         );

      });


   document
      .querySelectorAll(".btn-delete-project")
      .forEach(button => {

         button.addEventListener(
            "click",
            async function () {

               const id =
                  this.dataset.id;

               if (
                  !confirm(
                     "Eliminar projeto?"
                  )
               ) {
                  return;
               }

               await deleteProject(id);

               await loadProjects();

            }
         );

      });


   document
      .querySelectorAll(".btn-open-project")
      .forEach(button => {

         button.addEventListener(
            "click",
            function () {

               const id =
                  this.dataset.id;

               window.location.href =
                  `sprint/?projectId=${id}`;

            }
         );

      });

}


// =========================
// MODAL
// =========================

function openCreateModal() {

   projectForm.reset();

   document.getElementById(
      "project_id"
   ).value = "";

   document.getElementById(
      "project_modal_title"
   ).textContent =
      "Novo Projeto";

   projectModal.classList.remove(
      "hidden"
   );

   projectModal.classList.add(
      "flex"
   );

}


async function openEditModal(id) {

   const project =
      await getProject(id);

   document.getElementById(
      "project_modal_title"
   ).textContent =
      "Editar Projeto";

   document.getElementById(
      "project_id"
   ).value =
      project.id;

   document.getElementById(
      "project_name"
   ).value =
      project.name || '';

   document.getElementById(
      "project_description"
   ).value =
      project.description || '';

   projectModal.classList.remove(
      "hidden"
   );

   projectModal.classList.add(
      "flex"
   );

}


function closeModal() {

   projectModal.classList.add(
      "hidden"
   );

   projectModal.classList.remove(
      "flex"
   );

}


// =========================
// SUBMIT
// =========================

async function handleSubmitProject(e) {

   e.preventDefault();

   try {

      const id =
         document.getElementById(
            "project_id"
         ).value;

      const payload = {

         name:
            document.getElementById(
               "project_name"
            ).value,

         description:
            document.getElementById(
               "project_description"
            ).value,

         created_by: 1

      };


      if (id) {

         await updateProject(
            id,
            payload
         );

      } else {

         await createProject(
            payload
         );

      }

      closeModal();

      await loadProjects();

   } catch (error) {

      console.error(error);

   }

}