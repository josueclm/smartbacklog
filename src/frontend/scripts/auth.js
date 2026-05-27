// =========================
// AUTH GUARD
// =========================

export function getAuthUser() {

   const user =
      localStorage.getItem(
         "auth_user"
      );

   if (!user) {

      return null;

   }

   return JSON.parse(user);

}


// =========================
// CHECK AUTH
// =========================

export function requireAuth() {

   const user =
      getAuthUser();

   if (!user) {

      window.location.href =
         "../login";

   }

}


// =========================
// LOGOUT
// =========================

export function logout() {

   localStorage.removeItem(
      "auth_user"
   );

   window.location.href =
      "../login";

}