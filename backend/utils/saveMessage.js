// backend/utils/saveMessage.js
export async function saveMessage(supabase, userId, folderName, title, content, type = "chat") {
  try {
    // Buscar carpeta
    let { data: folders, error: folderError } = await supabase
      .from("projects_folders")
      .select("id")
      .eq("user_id", userId)
      .eq("name", folderName)
      .limit(1);

    if (folderError) throw folderError;

    let folderId;
    if (folders && folders.length > 0) {
      folderId = folders[0].id;
    } else {
      // Crear carpeta si no existe
      let { data: newFolder, error: createError } = await supabase
        .from("projects_folders")
        .insert([{ user_id: userId, name: folderName }])
        .select("id")
        .single();
      if (createError) throw createError;
      folderId = newFolder.id;
    }

    // Guardar mensaje
    const { data, error } = await supabase
      .from("projects_messages")
      .insert([{
        user_id: userId,
        folder_id: folderId,
        title,
        type,
        content,
        created_at: new Date().toISOString()
      }]);

    if (error) throw error;

    return data[0];
  } catch (err) {
    console.error("Error guardando mensaje:", err);
    return null;
  }
}
