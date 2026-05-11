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