import {

   logout,
   requireAuth,
   getAuthUser

} from "../scripts/auth.js";


// =========================
// INIT
// =========================

// document.addEventListener(
//    "DOMContentLoaded",
//    () => {
//       alert("Sidebar carregada com sucesso!");

//       requireAuth();

//       bindSidebarLogout();

//       loadSidebarUser();
//       alert("Sidebar carregada com sucesso!");

//    }
// );


function setActiveSidebar() {

   const currentPath =
      window.location.pathname;

   const sidebarItems =
      document.querySelectorAll(
         ".sidebar-item"
      );

   sidebarItems.forEach(item => {

      item.classList.remove(
         "active"
      );

      const href =
         item.getAttribute("href");

      if (!href) return;

      if (

         currentPath.startsWith(href)

         &&

         href !== "#"

      ) {

         item.classList.add(
            "active"
         );

      }

   });

}


// =========================
// LOGOUT
// =========================

function bindSidebarLogout() {

   const logoutButton =
      document.querySelector(
         ".sidebar-item.text-red-600"
      );

   if (!logoutButton) {

      console.warn(
         "Botão logout não encontrado"
      );

      return;

   }

   logoutButton.addEventListener(
      "click",
      function (e) {

         e.preventDefault();

         logout();

      }
   );

}


// =========================
// USER
// =========================

function loadSidebarUser() {

   const user =
      getAuthUser();

   if (!user) return;

   // =========================
   // OPTIONAL USER NAME
   // =========================

   const userName =
      document.getElementById(
         "sidebar_user_name"
      );

   if (userName) {

      userName.textContent =
         user.name;

   }

}


async function loadLayout() {
  // HEADER
  const header = await fetch("../layout/header.html");
  const headerHtml = await header.text();

  document.getElementById("header-container").innerHTML = headerHtml;


  // SIDEBAR
  const sidebar = await fetch("../layout/sidebar.html");
  const sidebarHtml = await sidebar.text();

  document.getElementById("sidebar-container").innerHTML = sidebarHtml;

  window.dispatchEvent(
   new Event("layout-loaded")
  );


  requireAuth();

  bindSidebarLogout();

  loadSidebarUser();

  setActiveSidebar();
  // alert("Sidebar carregada com sucesso!");

}


// =========================
// SIDEBAR TOGGLE
// =========================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');

  if (!sidebar) return;

  sidebar.classList.toggle('mobile-hidden');
}


window.toggleSidebar = toggleSidebar;

loadLayout();