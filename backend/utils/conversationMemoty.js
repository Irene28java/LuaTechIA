export async function buildConversationContext({
  supabase,
  userId,
  newMessage
}) {
  // 1️⃣ últimos mensajes
  const { data: recent } = await supabase
    .from("messages")
    .select("role, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(6);

  // 2️⃣ resumen largo
  const { data: summary } = await supabase
    .from("conversation_summaries")
    .select("summary")
    .eq("user_id", userId)
    .single();

  return `
RESUMEN PREVIO:
${summary?.summary || "Sin resumen previo"}

MENSAJES RECIENTES:
${recent?.reverse().map(m => `${m.role}: ${m.content}`).join("\n")}

MENSAJE ACTUAL:
${newMessage}
`;
}
