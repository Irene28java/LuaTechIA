// backend/utils/projectsFolders.js
export async function getFolderId(userId, folderName, supabase) {
  // busca carpeta
  const { data: folders } = await supabase
    .from("projects_folders")
    .select("id")
    .eq("user_id", userId)
    .eq("name", folderName)
    .limit(1);

  if (folders && folders.length > 0) return folders[0].id;

  // si no existe, crearla
  const { data: newFolder } = await supabase
    .from("projects_folders")
    .insert([{ user_id: userId, name: folderName }])
    .select("id")
    .single();

  return newFolder.id;
}
