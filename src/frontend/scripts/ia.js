import {

   generateUserStory,
   generateAcceptanceCriteria,
   generatePriority,
   generateTaskAnalysis

} from "../services/iaService.js";


// =========================
// ELEMENTS
// =========================

const titleInput =
   document.getElementById(
      "title_task"
   );

const descriptionInput =
   document.getElementById(
      "description_task"
   );

const userStoryInput =
   document.getElementById(
      "user_story_task"
   );

const prioritySelect =
   document.getElementById(
      "prioridade_task"
   );

const criteriaContainer =
   document.getElementById(
      "lista_criterio_aceitacao"
   );

const storyPointsInput =
   document.getElementById(
      "story_points_task"
   );

// =========================
// BUTTONS
// =========================

const btnUserStory =
   document.getElementById(
      "sug_user_story_ia"
   );

const btnCriteria =
   document.getElementById(
      "sug_criterio_ia"
   );

const btnPriority =
   document.getElementById(
      "analise_prioridade_ia"
   );

const aiAnalysisContainer  =
   document.getElementById(
      "ia_task_analysis"
   );

// =========================
// INIT
// =========================

document.addEventListener(
   "DOMContentLoaded",
   () => {

      bindEvents();

   }
);


// =========================
// EVENTS
// =========================

function bindEvents() {

   // USER STORY

   if (btnUserStory) {

      btnUserStory.addEventListener(
         "click",
         handleGenerateUserStory
      );

   }

   // CRITERIA

   if (btnCriteria) {

      btnCriteria.addEventListener(
         "click",
         handleGenerateCriteria
      );

   }

   // PRIORITY

   if (btnPriority) {

      btnPriority.addEventListener(
         "click",
         handleGenerateTaskAnalysis
      );

   }

}


// =========================
// USER STORY
// =========================

async function handleGenerateUserStory() {

   try {

      setLoading(
         btnUserStory,
         true
      );

      const response =
         await generateUserStory({

            title:
               titleInput.value,

            description:
               descriptionInput.value

         });

      userStoryInput.value =
         response.result;

   } catch (error) {

      console.error(error);

      alert(
         "Erro ao gerar User Story"
      );

   } finally {

      setLoading(
         btnUserStory,
         false
      );

   }

}


// =========================
// CRITERIA
// =========================

async function handleGenerateCriteria() {

   try {

      setLoading(
         btnCriteria,
         true
      );

      const response =
         await generateAcceptanceCriteria({

            title:
               titleInput.value,

            description:
               descriptionInput.value,

            userStory:
               userStoryInput.value

         });

      renderCriteria(
         response.result
      );

   } catch (error) {

      console.error(error);

      alert(
         "Erro ao gerar critérios"
      );

   } finally {

      setLoading(
         btnCriteria,
         false
      );

   }

}





// =========================
// PRIORITY
// =========================

async function handleGeneratePriority() {

   try {

      setLoading(
         btnPriority,
         true
      );

      const response =
         await generatePriority({

            title:
               titleInput.value,

            description:
               descriptionInput.value

         });

      prioritySelect.value =
         response.result;

   } catch (error) {

      console.error(error);

      alert(
         "Erro ao analisar prioridade"
      );

   } finally {

      setLoading(
         btnPriority,
         false
      );

   }

}



// =========================
// TASK ANALYSIS
// =========================

async function handleGenerateTaskAnalysis() {

   try {

      setLoading(
         btnPriority,
         true
      );

      const response =
         await generateTaskAnalysis({

            title:
               titleInput.value,

            description:
               descriptionInput.value

         });

      const analysis =
         response.result;

      // PRIORITY

      prioritySelect.value =
         analysis.priority;

      // STORY POINTS

      storyPointsInput.value =
         analysis.story_points;

      // BADGES

      renderTaskAnalysis(
         analysis
      );

   } catch (error) {

      console.error(error);

      alert(
         "Erro ao analisar tarefa"
      );

   } finally {

      setLoading(
         btnPriority,
         false
      );

   }

}


// =========================
// RENDER ANALYSIS
// =========================

function renderTaskAnalysis(
   analysis
) {

   aiAnalysisContainer.innerHTML = `
      <div class="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-semibold flex items-center gap-1.5">

         <span class="text-[8px] uppercase text-blue-400 font-bold">
            Complexidade
         </span>

         ${translateLevel(
            analysis.complexity
         )}

      </div>

      <div class="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[10px] font-semibold flex items-center gap-1.5">

         <span class="text-[8px] uppercase text-amber-400 font-bold">
            Risco
         </span>

         ${translateLevel(
            analysis.risk
         )}

      </div>

      <div class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-semibold flex items-center gap-1.5">

         <span class="text-[8px] uppercase text-emerald-400 font-bold">
            Prioridade
         </span>

         ${translateLevel(
            analysis.priority
         )}

      </div>
   `;

}


function translateLevel(level) {

   if (level === "HIGH") {

      return "Alta";

   }

   if (level === "LOW") {

      return "Baixa";

   }

   return "Média";

}



// =========================
// RENDER CRITERIA
// =========================

function renderCriteria(text) {

   criteriaContainer.innerHTML = "";

   // =========================
   // SPLIT
   // =========================

   const lines =
      text
         .split("\n")
         .filter(
            item => item.trim()
         );

   lines.forEach((line, index) => {

      const cleanText =
         line
            .replace(/^[-•\d.]\s*/, "")
            .trim();

      if (!cleanText) return;

      criteriaContainer.innerHTML += `
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
                  ${cleanText}
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




function bindCriteriaActions() {

   // =========================
   // EDIT
   // =========================

   document
      .querySelectorAll(
         ".btn-edit-criteria"
      )
      .forEach(button => {

         button.addEventListener(
            "click",
            handleEditCriteria
         );

      });


   // =========================
   // REMOVE
   // =========================

   document
      .querySelectorAll(
         ".btn-remove-criteria"
      )
      .forEach(button => {

         button.addEventListener(
            "click",
            handleRemoveCriteria
         );

      });

}



function handleEditCriteria(e) {

   e.preventDefault();

   e.stopPropagation();

   const item =
      e.currentTarget.closest(
         ".criteria-item"
      );

   const textElement =
      item.querySelector(
         ".criteria-text"
      );

   const currentText =
      textElement.textContent.trim();

   // =========================
   // INPUT
   // =========================

   textElement.innerHTML = `
      <input
         type="text"
         value="${currentText}"
         class="
            criteria-edit-input
            w-full
            px-3
            py-2
            border
            border-primary
            rounded-lg
            text-sm
            focus:outline-none
         "
      >
   `;

   const input =
      textElement.querySelector(
         "input"
      );

   input.focus();

   input.addEventListener(
      "blur",
      saveCriteriaEdit
   );

   input.addEventListener(
      "keydown",
      function (event) {

         if (event.key === "Enter") {

            saveCriteriaEdit.call(
               input
            );

         }

      }
   );

}


function saveCriteriaEdit() {

   const input =
      this;

   const value =
      input.value.trim();

   const container =
      input.closest(
         ".criteria-text"
      );

   container.innerHTML = `
      ${value || "Critério vazio"}
   `;

}


function handleRemoveCriteria(e) {

   e.preventDefault();

   e.stopPropagation();

   const item =
      e.currentTarget.closest(
         ".criteria-item"
      );

   if (!item) return;

   item.remove();

}


// =========================
// LOADING
// =========================

function setLoading(button, state) {

   if (!button) return;

   if (state) {

      button.disabled = true;

      button.classList.add(
         "opacity-50"
      );

   } else {

      button.disabled = false;

      button.classList.remove(
         "opacity-50"
      );

   }

}

window.bindCriteriaActions = bindCriteriaActions;