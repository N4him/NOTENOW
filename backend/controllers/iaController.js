const Groq = require("groq-sdk");
const LlamaKey = process.env.LLAMAKEY

const groq = new Groq({ apiKey:  LlamaKey});

module.exports.getGroqChatCompletion = async (req, res) => {
  const nota = req.body.content;

  if (!nota) {
    return res.status(400).json({ error: "Nota requerida" });
  }

  try {
    const prompt = `Vas a actuar como un experto en organizar notas para el usuario, tienes un texto con la siguiente información: ${nota}. El texto contiene una lista de tareas, ideas o información general que el usuario necesita organizar. Tu tarea es clasificar cada ítem según su tipo, agrupar los elementos similares y reformular la nota para que sea más clara y organizada. Además, debes identificar el contexto de la nota (personal, educativo, laboral, financiero, de salud, o de otro tipo) y reestructurar la información de acuerdo con ese contexto.
•	Si el contexto es personal, agrupa la información en categorías como 'compras', 'tareas diarias', 'eventos importantes', 'metas personales' o 'hobbies'.
•	Si el contexto es educativo, organiza el contenido como si fuera un plan de estudios, incluyendo 'asignaturas', 'proyectos académicos', 'plazos de entrega' y 'material de estudio'.
•	Si el contexto es laboral, estructura la nota en secciones como 'proyectos', 'tareas pendientes', 'reuniones' y 'prioridades', considerando fechas límites y responsabilidades.
•	Si el contexto es financiero, organiza la información en categorías como 'ingresos', 'gastos', 'presupuesto', 'objetivos financieros' o 'inversiones'.
•	Si el contexto es de salud, agrupa los elementos en 'citas médicas', 'medicamentos', 'hábitos saludables', 'actividades físicas' o 'objetivos de bienestar'.
•	Si no estás seguro del contexto, organiza el texto de manera lógica con títulos apropiados, y mejora la redacción para hacerla más precisa y comprensible.
Asegúrate de que la nota esté organizada con títulos y subtítulos claros, utilizando una redacción fluida y ordenada, además solo dame como respuesta el contenido de la nota mejorada sin más texto añadido.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    console.log(chatCompletion.choices[0]?.message?.content);

    // Send the result back to the client
    res.json({
      content: chatCompletion.choices[0]?.message?.content || "No content available",
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};
