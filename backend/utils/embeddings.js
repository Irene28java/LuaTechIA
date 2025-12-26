export async function retrieveContext(supabase, userId, embedding) {
  // Llama a la función RPC de Supabase que devuelve los 5 embeddings más cercanos
  return supabase.rpc("match_embeddings", {
    query_embedding: embedding,
    match_threshold: 0.78,
    match_count: 5
  });
}
