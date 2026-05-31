const OpenAI =
   require("openai");


// =========================
// OPENAI
// =========================

if (!process.env.OPENAI_API_KEY) {

   throw new Error(
      "OPENAI_API_KEY não definida"
   );

}


const client =
   new OpenAI({

      apiKey:
         process.env.OPENAI_API_KEY

   });



class IAService {

   // =========================
   // USER STORY
   // =========================

   async generateUserStory(
      title,
      description
   ) {

      const prompt = `
      Gere uma User Story Scrum profissional.

      Título:
      ${title}

      Descrição:
      ${description}

      Responde apenas com a User Story.
      `;

      const response =
         await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [

               {
                  role: "system",
                  content:
                     "És um Product Owner especialista em Scrum."
               },

               {
                  role: "user",
                  content: prompt
               }

            ],

            temperature: 0.7

         });

      return response
         .choices[0]
         .message
         .content;

   }


   // =========================
   // ACCEPTANCE CRITERIA
   // =========================

   async generateAcceptanceCriteria(
      title,
      description,
      userStory
   ) {

      const prompt = `
      Gere critérios de aceitação Scrum.

      Título:
      ${title}

      Descrição:
      ${description}

      User Story:
      ${userStory}

      Gere critérios claros em formato lista.
      Só responda com os critérios, sem explicações.
      `;

      const response =
         await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [

               {
                  role: "system",
                  content:
                     "És um QA e Product Owner especialista em Scrum."
               },

               {
                  role: "user",
                  content: prompt
               }

            ],

            temperature: 0.5

         });

      return response
         .choices[0]
         .message
         .content;

   }


   // =========================
   // PRIORITY
   // =========================

   async generatePriority(
      title,
      description
   ) {

      const prompt = `
      Analisa esta tarefa e sugere prioridade.

      Título:
      ${title}

      Descrição:
      ${description}

      Responde apenas com:
      HIGH
      MEDIUM
      ou
      LOW
      `;

      const response =
         await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [

               {
                  role: "system",
                  content:
                     "És um especialista Agile."
               },

               {
                  role: "user",
                  content: prompt
               }

            ],

            temperature: 0.2

         });

      return response
         .choices[0]
         .message
         .content
         .trim()
         .toUpperCase();

   }




    // =========================
    // TASK ANALYSIS
    // =========================

    async generateTaskAnalysis(
        title,
        description
        ) {

        const prompt = `
        Analisa esta tarefa Agile/Scrum.

        Título:
        ${title}

        Descrição:
        ${description}

        Devolve APENAS um JSON válido neste formato:

        {
            "priority": "HIGH",
            "complexity": "MEDIUM",
            "risk": "LOW",
            "story_points": 5
        }

        Regras:
        - priority: HIGH, MEDIUM ou LOW
        - complexity: HIGH, MEDIUM ou LOW
        - risk: HIGH, MEDIUM ou LOW
        - story_points: número Fibonacci Scrum (1,2,3,5,8,13)

        Apenas JSON válido.
        Sem markdown.
        Sem explicações.
        Sem texto adicional.
        `;

        const response =
            await client.chat.completions.create({

                model: "gpt-4.1-mini",

                response_format: {
                    type: "json_object"
                },

                messages: [

                    {
                    role: "system",
                    content:
                        `
                        És um especialista Scrum e Agile.

                        Responde SEMPRE apenas com JSON válido.
                        Nunca uses markdown.
                        Nunca uses \`\`\`.
                        `
                    },

                    {
                    role: "user",
                    content: prompt
                    }

                ],

                temperature: 0.3

            });


        // =========================
        // RAW CONTENT
        // =========================

        const content =
            response
                .choices[0]
                .message
                .content
                .trim();


        // =========================
        // CLEAN JSON
        // =========================

        const cleanJson =
            content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();


        // =========================
        // PARSE
        // =========================

        try {

            return JSON.parse(
                cleanJson
            );

        } catch (error) {

            console.error(
                "Erro parse JSON IA:",
                cleanJson
            );

            throw new Error(
                "Resposta inválida da IA"
            );

        }

        }
}

module.exports =
   new IAService();