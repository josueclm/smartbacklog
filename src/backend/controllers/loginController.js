const loginService =
   require("../services/loginService");


// =========================
// LOGIN
// =========================

exports.login = (req, res) => {

   try {

      const {

         email,
         password

      } = req.body;

      if (!email || !password) {

         return res.status(400).json({

            error:
               "Email e password são obrigatórios"

         });

      }

      const user =
         loginService.login(
            email,
            password
         );

      res.json({

         success: true,
         user

      });

   } catch (error) {

      console.error(error);

      res.status(401).json({

         success: false,
         error: error.message

      });

   }

};