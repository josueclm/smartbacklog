// users.js

import {
   getUsers,
   getUserById,
   createUser,
   updateUser,
   deleteUser
} from "../services/userService.js";


// =========================
// ELEMENTS
// =========================

const usersTableBody =
   document.getElementById("users_table_body");

const memberDrawer =
   document.getElementById("member-drawer");

const userModal =
   document.getElementById("user_modal");

const userForm =
   document.getElementById("user_form");

const btnAddUser =
   document.getElementById("btn_add_user");

const btnCloseModal =
   document.getElementById("btn_close_modal");


// =========================
// INIT
// =========================

document.addEventListener(
   "DOMContentLoaded",
   async () => {

      await loadUsers();

      bindEvents();

   }
);


const filterRole =
   document.getElementById("filter_role");


// =========================
// EVENTS
// =========================

function bindEvents() {

   btnAddUser.addEventListener(
      "click",
      openCreateModal
   );

   btnCloseModal.addEventListener(
      "click",
      closeModal
   );

   userForm.addEventListener(
      "submit",
      handleSubmitUser
   );

   filterRole.addEventListener(
      "change",
      applyFilters
   );

}


// =========================
// APPLY FILTERS
// =========================

async function applyFilters() {

   try {

      let users =
         await getUsers();

      const role =
         filterRole.value;

      if (role) {

         users =
            users.filter(
               user =>
                  (user.role || '')
                     .toLowerCase()
                     === role.toLowerCase()
            );

      }

      renderUsers(users);

   } catch (error) {

      console.error(error);

   }

}

// =========================
// LOAD USERS
// =========================

async function loadUsers() {

   try {

      const users =
         await getUsers();

      renderUsers(users);

   } catch (error) {

      console.error(error);

   }

}


// =========================
// RENDER USERS
// =========================

//progress                      <div class="bg-primary h-full w-3/4"></div>


function renderUsers(users = []) {

   usersTableBody.innerHTML = "";

   users.forEach(user => {

      usersTableBody.innerHTML += `
         <tr class="hover:bg-surface-container-low/30 transition-colors group">

            <td class="px-6 py-4">

               <div class="flex items-center space-x-4">

                  <div class="relative flex-shrink-0">

                     <img
                        alt="${user.name}"
                        class="w-10 h-10 rounded-full object-cover"
                        src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random"
                     >

                     <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>

                  </div>

                  <div>

                     <p class="font-bold text-on-surface text-sm">
                        ${user.name}
                     </p>

                     <p class="text-xs text-on-surface-variant">
                        ${user.email}
                     </p>

                  </div>

               </div>

            </td>

            <td class="px-6 py-4">

               <span class="text-xs font-semibold px-2.5 py-1 bg-primary-fixed text-primary rounded-full">
                  ${user.role || 'Developer'}
               </span>

            </td>

            <td class="px-6 py-4 text-sm font-medium text-on-surface-variant">
               ${user.team || 'Team'}
            </td>

            <td class="px-6 py-4">

               <div class="w-32">

                  <div class="flex justify-between items-center mb-1">

                     <span class="text-[10px] font-bold text-primary">
                        ${user.progress || 0}%
                     </span>

                  </div>

                  <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">


                  </div>

               </div>

            </td>

            <td class="px-6 py-4 text-right">

               <div class="flex items-center justify-end space-x-2">

                  <button
                     class="btn-view-user text-xs font-bold text-primary hover:underline px-3 py-1.5 rounded-md hover:bg-primary-container/10"
                     data-id="${user.id}"
                  >
                     Ver detalhes
                  </button>

                  <button
                     class="btn-edit-user p-2 rounded-lg hover:bg-slate-100"
                     data-id="${user.id}"
                  >
                     <span class="material-symbols-outlined text-[20px]">
                        edit
                     </span>
                  </button>

                  <button
                     class="btn-delete-user p-2 rounded-lg hover:bg-red-50 text-red-500"
                     data-id="${user.id}"
                  >
                     <span class="material-symbols-outlined text-[20px]">
                        delete
                     </span>
                  </button>

               </div>

            </td>

         </tr>
      `;

   });

   bindUserActions();

}


// =========================
// USER ACTIONS
// =========================

function bindUserActions() {

   document
      .querySelectorAll(".btn-view-user")
      .forEach(button => {

         button.addEventListener(
            "click",
            async function () {

               const id =
                  this.dataset.id;

               await openDrawer(id);

            }
         );

      });


   document
      .querySelectorAll(".btn-edit-user")
      .forEach(button => {

         button.addEventListener(
            "click",
            async function () {

               const id =
                  this.dataset.id;

               await openEditModal(id);

            }
         );

      });


   document
      .querySelectorAll(".btn-delete-user")
      .forEach(button => {

         button.addEventListener(
            "click",
            async function () {

               const id =
                  this.dataset.id;

               if (!confirm("Eliminar utilizador?")) {
                  return;
               }

               await deleteUser(id);

               showToast(
                  "Utilizador eliminado"
               );

               await loadUsers();

            }
         );

      });

}


// =========================
// DRAWER
// =========================

async function openDrawer(id) {

   try {

      const user =
         await getUserById(id);

      document.getElementById(
         "drawer_user_name"
      ).textContent =
         user.name;

      document.getElementById(
         "drawer_user_role"
      ).textContent =
         user.role || "Developer";

      document.getElementById(
         "drawer_user_email"
      ).textContent =
         user.email;

      memberDrawer.classList.remove(
         "drawer-closed"
      );

      memberDrawer.classList.add(
         "drawer-open"
      );

   } catch (error) {

      console.error(error);

   }

}


// =========================
// MODAL
// =========================

function openCreateModal() {

   userForm.reset();

   document.getElementById(
      "user_id"
   ).value = "";

   document.getElementById(
      "modal_title"
   ).textContent =
      "Novo Utilizador";

   userModal.classList.remove(
      "hidden"
   );

   userModal.classList.add(
      "flex"
   );

}


async function openEditModal(id) {

   const user =
      await getUserById(id);

   document.getElementById(
      "modal_title"
   ).textContent =
      "Editar Utilizador";

   document.getElementById(
      "user_id"
   ).value =
      user.id;

   document.getElementById(
      "user_name"
   ).value =
      user.name || "";

   document.getElementById(
      "user_email"
   ).value =
      user.email || "";

   document.getElementById(
      "user_role"
   ).value =
      user.role || "Developer";

   userModal.classList.remove(
      "hidden"
   );

   userModal.classList.add(
      "flex"
   );

}


function closeModal() {

   userModal.classList.add(
      "hidden"
   );

   userModal.classList.remove(
      "flex"
   );

}


// =========================
// SUBMIT
// =========================

async function handleSubmitUser(e) {

   e.preventDefault();

   try {

      const id =
         document.getElementById("user_id").value;

      const payload = {

         name:
            document.getElementById("user_name").value,

         email:
            document.getElementById("user_email").value,

         password:
            document.getElementById("user_password").value,

         role:
            document.getElementById("user_role").value

      };


      if (id) {

         await updateUser(
            id,
            payload
         );

         showToast(
            "Utilizador actualizado"
         );

      } else {

         await createUser(
            payload
         );

         showToast(
            "Utilizador criado"
         );

      }

      closeModal();

      await loadUsers();

   } catch (error) {

      console.error(error);

      alert("Erro ao guardar utilizador");

   }

}


// =========================
// TOAST
// =========================

function showToast(message) {

   const toast =
      document.getElementById("save-toast");

   document.getElementById(
      "text_mess_sucess"
   ).textContent =
      message;

   toast.classList.remove(
      "opacity-0",
      "translate-y-10"
   );

   setTimeout(() => {

      toast.classList.add(
         "opacity-0",
         "translate-y-10"
      );

   }, 3000);

}