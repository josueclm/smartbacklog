const commentService =
   require("../services/commentService");


// =========================
// GET COMMENTS
// =========================

exports.getByTask =
   (req, res) => {

      try {

         const { taskId } =
            req.params;

         const comments =
            commentService.getByTask(
               taskId
            );

         res.json({

            success: true,
            data: comments

         });

      } catch (error) {

         console.error(error);

         res.status(500).json({

            success: false,
            error: error.message

         });

      }

   };


// =========================
// CREATE
// =========================

exports.create =
   (req, res) => {

      try {

         const comment =
            commentService.create(
               req.body
            );

         res.status(201).json({

            success: true,
            data: comment

         });

      } catch (error) {

         console.error(error);

         res.status(500).json({

            success: false,
            error: error.message

         });

      }

   };


// =========================
// UPDATE
// =========================

exports.update =
   (req, res) => {

      try {

         const { id } =
            req.params;

         const updated =
            commentService.update(

               id,
               req.body.content

            );

         res.json({

            success: true,
            data: updated

         });

      } catch (error) {

         console.error(error);

         res.status(500).json({

            success: false,
            error: error.message

         });

      }

   };


// =========================
// DELETE
// =========================

exports.delete =
   (req, res) => {

      try {

         const { id } =
            req.params;

         commentService.delete(id);

         res.json({

            success: true

         });

      } catch (error) {

         console.error(error);

         res.status(500).json({

            success: false,
            error: error.message

         });

      }

   };