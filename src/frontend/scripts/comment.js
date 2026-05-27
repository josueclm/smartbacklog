import {

   getCommentsByTask,
   createComment,
   updateComment,
   deleteComment

} from "../services/commentService.js";


// =========================
// ELEMENTS
// =========================

const commentsContainer =
   document.getElementById(
      "lista_comentarios"
   );

const commentInput =
   document.getElementById(
      "text_comentario"
   );

const btnAddComment =
   document.getElementById(
      "bt_salvar_comentario"
   );


// =========================
// STATE
// =========================

let currentTaskId = null;


// =========================
// LOAD COMMENTS
// =========================

export async function loadComments(
   taskId
) {

   try {

      currentTaskId =
         taskId;

      const response =
         await getCommentsByTask(
            taskId
         );

      renderComments(
         response.data || []
      );

   } catch (error) {

      console.error(error);

   }

}


// =========================
// RENDER
// =========================

function renderComments(
   comments = []
) {

   commentsContainer.innerHTML = "";

   if (!comments.length) {

      commentsContainer.innerHTML = `
         <div class="text-center py-6 text-slate-400 text-sm">

            Nenhum comentário

         </div>
      `;

      return;

   }

   comments.forEach(comment => {

      commentsContainer.innerHTML += `
         <div
            class="
               comment-item
               bg-white
               border
               border-slate-200
               rounded-xl
               p-4
               mb-3
            "
            data-id="${comment.id}"
         >

            <!-- HEADER -->

            <div class="flex items-start justify-between mb-3">

               <div class="flex items-center gap-3">

                  <img
                     class="
                        w-9
                        h-9
                        rounded-full
                        border
                        border-slate-200
                     "
                     src="https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user_name || 'User')}&background=random"
                  >

                  <div>

                     <h5 class="text-sm font-bold text-slate-800">
                        ${comment.user_name || 'User'}
                     </h5>

                     <span class="text-[11px] text-slate-400">
                        ${formatDate(comment.created_at)}
                     </span>

                  </div>

               </div>

               <!-- ACTIONS -->

               <div class="flex items-center gap-2">

                  <!-- EDIT -->

                  <button
                     class="
                        btn-edit-comment
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
                     data-id="${comment.id}"
                  >

                     <span class="material-symbols-outlined text-[18px]">
                        edit
                     </span>

                  </button>

                  <!-- DELETE -->

                  <button
                     class="
                        btn-delete-comment
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
                     data-id="${comment.id}"
                  >

                     <span class="material-symbols-outlined text-[18px]">
                        delete
                     </span>

                  </button>

               </div>

            </div>

            <!-- CONTENT -->

            <div
               class="
                  comment-content
                  text-sm
                  text-slate-700
                  leading-relaxed
               "
            >
               ${comment.content}
            </div>

         </div>
      `;

   });

   bindCommentActions();

}


// =========================
// CREATE
// =========================

async function handleCreateComment() {

   try {

      const content =
         commentInput.value.trim();

      if (!content) return;

      const authUser =
         JSON.parse(

            localStorage.getItem(
               "auth_user"
            )

         );

      await createComment({

         task_id:
            currentTaskId,

         user_id:
            authUser.id,

         content

      });

      commentInput.value = "";

      await loadComments(
         currentTaskId
      );

   } catch (error) {

      console.error(error);

   }

}


// =========================
// EDIT
// =========================

function bindCommentActions() {

   // EDIT

   document
      .querySelectorAll(
         ".btn-edit-comment"
      )
      .forEach(button => {

         button.addEventListener(
            "click",
            handleEditComment
         );

      });


   // DELETE

   document
      .querySelectorAll(
         ".btn-delete-comment"
      )
      .forEach(button => {

         button.addEventListener(
            "click",
            handleDeleteComment
         );

      });

}


// =========================
// EDIT COMMENT
// =========================

async function handleEditComment(e) {

   const button =
      e.currentTarget;

   const commentItem =
      button.closest(
         ".comment-item"
      );

   const id =
      button.dataset.id;

   const contentElement =
      commentItem.querySelector(
         ".comment-content"
      );

   const currentText =
      contentElement.innerText;

   contentElement.innerHTML = `
      <textarea
         class="
            edit-comment-input
            w-full
            min-h-[90px]
            border
            border-primary
            rounded-xl
            p-3
            text-sm
            focus:outline-none
         "
      >${currentText}</textarea>
   `;

   const textarea =
      contentElement.querySelector(
         "textarea"
      );

   textarea.focus();

   textarea.addEventListener(
      "blur",
      async function () {

         const value =
            textarea.value.trim();

         await updateComment(

            id,

            {
               content: value
            }

         );

         await loadComments(
            currentTaskId
         );

      }
   );

}


// =========================
// DELETE COMMENT
// =========================

async function handleDeleteComment(e) {

   const id =
      e.currentTarget.dataset.id;

   const confirmDelete =
      confirm(
         "Eliminar comentário?"
      );

   if (!confirmDelete) return;

   try {

      await deleteComment(id);

      await loadComments(
         currentTaskId
      );

   } catch (error) {

      console.error(error);

   }

}


// =========================
// DATE
// =========================

function formatDate(date) {

   return new Date(date)
      .toLocaleString();

}


// =========================
// INIT
// =========================

document.addEventListener(
   "DOMContentLoaded",
   () => {

      if (btnAddComment) {

         btnAddComment.addEventListener(

            "click",

            handleCreateComment

         );

      }

   }
);

window.loadComments = loadComments;