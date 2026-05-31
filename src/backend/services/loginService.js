const db = require('../config/db');


class LoginService {

   // =========================
   // LOGIN
   // =========================

   login(email, password) {

      const user =
         db.prepare(`
            SELECT *
            FROM users
            WHERE email = ?
         `).get(email);

      if (!user) {

         throw new Error(
            "Utilizador não encontrado"
         );

      }

      // =========================
      // PASSWORD CHECK
      // =========================

      if (user.password !== password) {

         throw new Error(
            "Password inválida"
         );

      }

      return {

         id:
            user.id,

         name:
            user.name,

         email:
            user.email,

         role:
            user.role

      };

   }

}

module.exports =
   new LoginService();