//backend/route/projects.js
import express from "express";
const router = express.Router();
// Obtener estructura completa
router.get("/", async (req, res) => {
  const userId = req.user.id;

  const { data: folders } = await req.supabase
    .from("projects_folders")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  const { data: items } = await req.supabase
    .from("projects_items")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  const structure = folders.map(folder => ({
    ...folder,
    items: items.filter(i => i.folder_id === folder.id)
  }));

  res.json(structure);
});

// Crear item automaticamente
router.post("/auto", async (req, res) => {
  const userId = req.user.id;
  const { folderName, title, type, content } = req.body;

  // Buscar carpeta
  let { data: folder } = await req.supabase
    .from("projects_folders")
    .select("*")
    .eq("user_id", userId)
    .eq("name", folderName)
    .single();

  if (!folder) {
    const inserted = await req.supabase
      .from("projects_folders")
      .insert([{ user_id: userId, name: folderName }])
      .select()
      .single();
    folder = inserted.data;
  }

  // Insertar item
  const { data: item } = await req.supabase
    .from("projects_items")
    .insert([
      {
        folder_id: folder.id,
        user_id: userId,
        type,
        title,
        content
      }
    ])
    .select()
    .single();

  res.json(item);
});

// Guardado automático
router.put("/save/:id", async (req, res) => {
  const userId = req.user.id;
  const { content } = req.body;
  const itemId = req.params.id;

  const { data, error } = await req.supabase
    .from("projects_items")
    .update({
      content,
      updated_at: new Date()
    })
    .eq("id", itemId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) return res.status(400).json({ error });
  res.json(data);
});

export default router;
