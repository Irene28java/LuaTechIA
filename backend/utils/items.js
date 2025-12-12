// backend/utils/items.js
import { getFolderId } from "./projectsFolders.js";


/**
 * Crear item (tarea, quiz, examen)
 * @param {object} supabase - instancia de supabase
 * @param {string} userId - id del profesor
 * @param {object} data - { type, title, content, assignedTo, subject, templateFile }
 */
export async function createItem(supabase, userId, data) {
  try {
    const { type, title, content, assignedTo, subject, templateFile } = data;

    const folderName = type === "exam" ? "Exámenes" : "Tareas";
    const folderId = await getFolderId(userId, folderName, supabase);

    const { data: item, error } = await supabase
      .from("projects_items")
      .insert([{ 
        user_id: userId,
        type,
        title,
        content,
        assignedTo,
        subject,
        templateFile,
        folder_id: folderId
      }])
      .select()
      .single();

    if (error) throw error;

    console.log(`[ITEM CREATED] Profesor ${userId} creó ${type}: ${title}`);
    return item;
  } catch (err) {
    console.error(`[ERROR CREATE ITEM] Profesor ${userId}:`, err.message);
    throw new Error("No se pudo crear el item");
  }
}

/**
 * Entregar item
 * @param {object} supabase
 * @param {string} userId - id del estudiante
 * @param {object} item - objeto item original
 * @param {string} content - contenido enviado
 */
export async function submitItem(supabase, userId, item, content) {
  try {
    const folderName = item.type === "exam" ? "Exámenes" : "Tareas";
    const folderId = await getFolderId(userId, folderName, supabase);

    const { data: submission, error } = await supabase
      .from("projects_items")
      .insert([{
        user_id: userId,
        type: item.type + "_entregado",
        title: item.title,
        content,
        folder_id: folderId
      }])
      .select()
      .single();

    if (error) throw error;

    console.log(`[ITEM SUBMITTED] Estudiante ${userId} entregó ${item.type}: ${item.title}`);
    return submission;
  } catch (err) {
    console.error(`[ERROR SUBMIT ITEM] Estudiante ${userId}:`, err.message);
    throw new Error("No se pudo entregar el item");
  }
}

/**
 * Calificar item
 * @param {object} supabase
 * @param {string} teacherId
 * @param {string} studentId
 * @param {object} item
 * @param {number|string} grade
 */
export async function gradeItem(supabase, teacherId, studentId, item, grade) {
  try {
    const folderName = item.type === "exam" ? "Exámenes" : "Tareas";
    const folderId = await getFolderId(studentId, folderName, supabase);

    const { data: calificacion, error } = await supabase
      .from("projects_items")
      .insert([{
        user_id: studentId,
        type: "calificacion",
        title: `Calificación: ${item.title}`,
        content: `Profesor ${teacherId} - Nota: ${grade}`,
        folder_id: folderId
      }])
      .select()
      .single();

    if (error) throw error;

    console.log(`[ITEM GRADED] Profesor ${teacherId} calificó ${item.title} de ${studentId}: ${grade}`);
    return calificacion;
  } catch (err) {
    console.error(`[ERROR GRADE ITEM] Profesor ${teacherId} -> Estudiante ${studentId}:`, err.message);
    throw new Error("No se pudo calificar el item");
  }
}
