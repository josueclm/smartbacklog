const iaService =
   require("../services/iaService");


// =========================
// USER STORY
// =========================

exports.generateUserStory =
   async (req, res) => {

      try {

         const {

            title,
            description

         } = req.body;

         const result =
            await iaService.generateUserStory(

               title,
               description

            );

         res.json({

            success: true,
            result

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
// ACCEPTANCE CRITERIA
// =========================

exports.generateAcceptanceCriteria =
   async (req, res) => {

      try {

         const {

            title,
            description,
            userStory

         } = req.body;

         const result =
            await iaService.generateAcceptanceCriteria(

               title,
               description,
               userStory

            );

         res.json({

            success: true,
            result

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
// PRIORITY
// =========================

exports.generatePriority =
   async (req, res) => {

      try {

         const {

            title,
            description

         } = req.body;

         const result =
            await iaService.generatePriority(

               title,
               description

            );

         res.json({

            success: true,
            result

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
// TASK ANALYSIS
// =========================

exports.generateTaskAnalysis =
   async (req, res) => {

      try {

         const {

            title,
            description

         } = req.body;

         const result =
            await iaService.generateTaskAnalysis(

               title,
               description

            );

         res.json({

            success: true,
            result

         });

      } catch (error) {

         console.error(error);

         res.status(500).json({

            success: false,
            error: error.message

         });

      }

    };